import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from ollama import AsyncClient
from prompts.legal_persona import SYSTEM_PROMPT

app = FastAPI(title="Nepal Law AI - Direct Chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_MODEL = "qwen2.5:1.5b"
OLLAMA_HOST = "http://127.0.0.1:11434"

# --- UPDATED SCHEMAS ---
class ChatMessage(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    query: str
    history: Optional[List[ChatMessage]] = [] # Added history support

async def stream_generator(query: str, history: List[ChatMessage]):
    client = AsyncClient(host=OLLAMA_HOST)
    
    # 1. Start with the System Prompt
    messages = [
        {
            "role": "system", 
            "content": SYSTEM_PROMPT
        }
    ]

    # 2. Append previous conversation history
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})

    # 3. Append the current user query
    messages.append({"role": "user", "content": query})

    try:
        async for chunk in await client.chat(
            model=OLLAMA_MODEL,
            messages=messages,
            stream=True,
            options={"temperature": 0.4, "num_ctx": 4096}
        ):
            content = chunk['message']['content']
            if content:
                yield content
                await asyncio.sleep(0.01)

    except Exception as e:
        yield f"\n[Error]: AI Worker failed to stream. {str(e)}"

@app.post("/ask")
async def ask_legal_bot(request: QueryRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Pass both query AND history to the generator
    return StreamingResponse(
        stream_generator(request.query, request.history), 
        media_type="text/plain"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001) # Listen on all interfaces