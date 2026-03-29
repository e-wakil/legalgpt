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
from fastapi import Response


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

            # 3. GET LEGAL CONTEXT (RAG)
            # Before the AI starts talking, we find the relevant laws
            rag_data = await ai_service.get_rag_context(user_input)
            context = rag_data.get("context", "")
            citations = rag_data.get("citations", [])

            # 4. SEND CITATIONS TO FRONTEND IMMEDIATELY
            # This allows the UI to show the "Sources" box while the AI is still "thinking"
            await websocket.send_json({
                "type": "citations", 
                "citations": citations
            })

            # 5. SAVE USER MESSAGE TO DB
            user_msg = models.Message(conversation_id=conversation_id, role="user", content=user_input)
            db.add(user_msg)
            db.commit()

            # 6. FETCH HISTORY
            history_objs = db.query(models.Message).filter(
                models.Message.conversation_id == conversation_id
            ).order_by(models.Message.created_at.asc()).all()
            
            formatted_history = []
            for m in history_objs[:-1]:
                formatted_history.append({"role": m.role, "content": m.content})

            # 7. STREAM FROM AI WORKER (Pass the context here)
            full_ai_response = ""
            await websocket.send_json({"type": "start"})

            async for token in ai_service.get_model_stream(user_input, formatted_history, context):
                full_ai_response += token
                await websocket.send_json({"type": "content", "content": token})

            # 8. SAVE FINAL AI RESPONSE (Include citations in DB)
            ai_msg = models.Message(
                conversation_id=conversation_id, 
                role="assistant", 
                content=full_ai_response,
                citations=citations  # This saves the RAG sources in the database
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
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == request.conversation_id,
            models.Conversation.user_id == current_user.id
        ).first()

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found or unauthorized")
        
        active_conv = conversation
    else:
        # Create a new conversation
        active_conv = models.Conversation(
            user_id=current_user.id,
            title=request.message[:40] + ("..." if len(request.message) > 40 else "")
        )
        db.add(active_conv)
        db.commit()
        db.refresh(active_conv)

    # --- 2. SAVE USER MESSAGE ---
    user_msg = models.Message(
        conversation_id=active_conv.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # --- 3. CALL RAG SERVICE ---
    # Fetch relevant laws and citations before calling the AI
    rag_data = await ai_service.get_rag_context(request.message)
    context = rag_data.get("context", "")
    citations = rag_data.get("citations", [])

    # --- 4. FETCH HISTORY FOR AI CONTEXT ---
    history_objs = db.query(models.Message).filter(
        models.Message.conversation_id == active_conv.id
    ).order_by(models.Message.created_at.asc()).all()
    
    # Exclude the message we just saved to send it as the current 'query'
    formatted_history = []
    for m in history_objs[:-1]:
        formatted_history.append({"role": m.role, "content": m.content})

    # --- 5. CALL AI SERVICE (NON-STREAMING WRAPPER) ---
    try:
        full_ai_response = ""
        # Since get_model_stream is a generator, we collect all tokens here
        async for token in ai_service.get_model_stream(request.message, formatted_history, context):
            full_ai_response += token
        
        # --- 6. SAVE AI RESPONSE WITH CITATIONS ---
        ai_msg = models.Message(
            conversation_id=active_conv.id,
            role="assistant",
            content=full_ai_response,
            citations=citations # Save the RAG citations to the DB
        )
        db.add(ai_msg)
        db.commit()
        db.refresh(ai_msg)

    except Exception as e:
        db.rollback()
        print(f"LLM/RAG Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="The legal assistant encountered an error while processing your request."
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

@router.get("/{conversation_id}/messages", response_model=List[schemas.MessageResponse])
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


# --- CONVERSATION MANAGEMENT ---
@router.patch("/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
async def rename_conversation(
    conversation_id: UUID,
    payload: schemas.ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation.title = payload.title
    db.commit()
    db.refresh(conversation)
    return conversation


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete all messages associated (SQLAlchemy handles this if cascade is set, but we do
    # it manually or via relationship here)
    db.query(models.Message).filter(models.Message.conversation_id == conversation_id).delete()
    db.delete(conversation)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --- MESSAGE MANAGEMENT ---

@router.delete("/{conversation_id}/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_specific_message(
    conversation_id: UUID,
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Deletes a specific message within a specific conversation. Ensure the message belongs to
    the conversation and the conversation belongs to the user.
    """

    # 1. Look for the message and join with Conversation to check user ownership in one query
    message = db.query(models.Message).join(models.Conversation).filter(
        models.Message.id == message_id,
        models.Message.conversation_id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    # 2. If not found, it's either an invalid ID or the user is trying to delete someone else's message
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found in the specified conversation or unauthorized access."
        )
    
    # 3. Perform the deletion
    db.delete(message)
    db.commit()

    # 4. Return 204 No Content
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.patch("/{conversation_id}/messages/{message_id}", response_model=schemas.MessageResponse)
async def edit_specific_message(
    coversation_id: UUID,
    message_id: UUID,
    payload: schemas.MessageUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Edits the content of a user message.
    Strictly forbids editing assistant (AI) responses.
    """
    # Join with Conversation to verify ownership
    message = db.query(models.Message).join(models.Conversation).filter(
        models.Message.id == message_id,
        models.Message.conversation_id == coversation_id,
        models.Conversation.user_id == current_user.id
    ).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Security: User can only edit their own prompts, not the AI's legal advice
    if message.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only messages sent by the user can be edited."
        )
    
    message.content = payload.content
    db.commit()
    db.refresh(message)
    return  message
