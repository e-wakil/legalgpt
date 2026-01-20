from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, Date, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
import datetime

from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    google_id = Column(String, unique=True)
    picture_url = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    conversations = relationship("Conversation", back_populates="owner")

    def __str__(self):
        return f"{self.full_name} ({self.email})"

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    
    owner = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

    def __str__(self):
        return f"{self.title[:20]} ({self.created_at})"

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"))
    role = Column(String) # user / assistant
    content = Column(Text)
    citations = Column(JSONB) # Store references to document_chunks
    rating = Column(Integer, nullable=True) # 1 for helpful, -1 for not
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    conversation = relationship("Conversation", back_populates="messages")

    def __str__(self):
        return f"{self.role}: {self.content[:20]} ({self.created_at})"