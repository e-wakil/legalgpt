from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional, Dict
from datetime import datetime

# --- AUTH SCHEMAS ---
class TokenRequest(BaseModel):
    token: str

class UserProfile(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str]
    picture_url: Optional[str]

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserProfile

# --- CHAT SCHEMAS ---
class MessageBase(BaseModel):
    role: str
    content: str
    citations: Optional[List[Dict]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Represents a single message in the response
class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    citations: Optional[List[Dict]] = None
    created_at: datetime

    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models

# The final structure returned by the POST /chat/ endpoint
class ChatResponse(BaseModel):
    conversation_id: UUID
    message: MessageResponse

class ConversationBase(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None # If null, create new conversation


class UserDetail(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    picture_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True