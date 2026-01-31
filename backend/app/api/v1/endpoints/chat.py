from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.models import models
from app.schemas import schemas
from app.core.database import get_db
from app.api.deps import get_current_user, get_current_user_ws
import json
from app.services.ai_service import ai_service


router = APIRouter()

@router.websocket("/ws/{conversation_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_ws)
):
    if not current_user: return

    # 1. Security Check
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()

    try:
        while True:
            # 2. Receive User Input
            data = await websocket.receive_text()
            user_input = json.loads(data).get("message")
            if not user_input: continue

            # Update conversation title if it's a new chat
            if conversation.title == "New Chat" or len(conversation.title) < 5:
                conversation.title = user_input[:40] + ("..." if len(user_input) > 40 else "")
                db.add(conversation)

            # 3. Save User Message to DB
            user_msg = models.Message(conversation_id=conversation_id, role="user", content=user_input)
            db.add(user_msg)
            db.commit()

            # 4. Fetch History from DB
            # Fetching all messages for this session
            history_objs = db.query(models.Message).filter(
                models.Message.conversation_id == conversation_id
            ).order_by(models.Message.created_at.asc()).all()
            
            # Format history (Exclude the last message we just added to keep it as current 'query')
            formatted_history = []
            for m in history_objs[:-1]:
                formatted_history.append({
                    "role": "assistant" if m.role == "assistant" else "user",
                    "content": m.content
                })

            # 5. Stream from AI Worker
            full_ai_response = ""
            await websocket.send_json({"type": "start"})

            async for token in ai_service.get_model_stream(user_input, formatted_history):
                full_ai_response += token
                await websocket.send_json({"type": "content", "content": token})

            # 6. Save Final AI Response to DB
            ai_msg = models.Message(
                conversation_id=conversation_id, 
                role="assistant", 
                content=full_ai_response
            )
            db.add(ai_msg)
            db.commit()

            await websocket.send_json({"type": "end"})

    except WebSocketDisconnect:
        print(f"Chat disconnected: {conversation_id}")
    except Exception as e:
        print(f"WS Error: {str(e)}")
        await websocket.send_json({"type": "error", "content": "An internal error occurred."})


@router.post("/", response_model=schemas.ChatResponse)
async def chat_with_llm(
    request: schemas.ChatRequest, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # --- 1. VALIDATE OR CREATE CONVERSATION ---
    if request.conversation_id:
        # Check if conversation exists
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == request.conversation_id
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Conversation not found"
            )

        # SECURITY: Check ownership
        if conversation.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to access this conversation"
            )
        
        active_conv = conversation
        # If the conversation title is the default, update it with the first message
        if active_conv.title == "New Chat":
            active_conv.title = request.message[:40] + "..." if len(request.message) > 40 else request.message
            db.add(active_conv)
    else:
        # Create a new conversation if no ID provided
        active_conv = models.Conversation(
            user_id=current_user.id,
            title=request.message[:50] + "..." if len(request.message) > 50 else request.message
        )
        db.add(active_conv)
        db.commit()
        db.refresh(active_conv)

    # --- 2. SAVE USER MESSAGE ---
    user_msg = models.Message(
        conversation_id=active_conv.id,
        role="user",
        content=request.message,
        citations=[] # Default empty list for JSONB
    )
    db.add(user_msg)

    # --- 3. AI LOGIC (WITH ERROR HANDLING) ---
    try:
        # This is where your OpenAI / LangChain call goes
        # Example: ai_content = await call_legal_llm(request.message)
        ai_content = f"Legal analysis for {current_user.full_name}: Based on your query, here is the legal perspective..."
        
        # Simulated citations
        sources = [{"source": "Constitution Art. 1", "link": "https://legal.gov"}]

        ai_msg = models.Message(
            conversation_id=active_conv.id,
            role="assistant",
            content=ai_content,
            citations=sources
        )
        db.add(ai_msg)
        db.commit() # Save both user and assistant messages
        db.refresh(ai_msg)

    except Exception as e:
        db.rollback() # If AI fails, don't save the half-finished conversation
        print(f"LLM Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The AI assistant is currently unavailable. Please try again."
        )

    return {
        "conversation_id": active_conv.id,
        "message": ai_msg
    }

@router.post("/conversations", response_model=schemas.ConversationResponse)
async def create_conversation(
    payload: schemas.ConversationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Explicitly creates a new conversation for the current user.
    """
    new_conv = models.Conversation(
        user_id=current_user.id,
        title=payload.title
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv

@router.get("/conversations", response_model=List[schemas.ConversationBase])
async def list_conversations(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # Only return conversations belonging to this user, sorted by newest
    return db.query(models.Conversation).filter(
        models.Conversation.user_id == current_user.id
    ).order_by(models.Conversation.created_at.desc()).all()

@router.get("/{conversation_id}/messages", response_model=List[schemas.MessageBase])
async def get_messages(
    conversation_id: UUID, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # Security check: Does this conversation exist AND belong to the user?
    conv = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found or unauthorized")

    return conv.messages