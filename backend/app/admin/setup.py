from sqladmin import ModelView
from app.models.models import User, Message, Conversation

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.full_name, User.email, User.google_id]
    column_searchable_list = [User.full_name, User.email]
    column_sortable_list = [User.id]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"

class ConversationAdmin(ModelView, model=Conversation):
    column_list = [Conversation.id, Conversation.user_id, Conversation.title, Conversation.created_at]
    name = "Chat Conversation"
    name_plural = "Chat Conversations"
    icon = "fa-solid fa-comment"

class MessageAdmin(ModelView, model=Message):
    column_list = [Message.id, Message.conversation_id, Message.role, Message.content, Message.created_at]
    column_searchable_list = [Message.role, Message.conversation_id]
    name = "Chat Message"
    name_plural = "Chat Messages"
    icon = "fa-solid fa-comment"