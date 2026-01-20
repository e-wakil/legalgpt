from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin
from app.api.v1.api import api_router
from app.core.database import engine
from app.core.config import settings
from app.admin.setup import UserAdmin, MessageAdmin, ConversationAdmin
from app.admin.auth import authentication_backend

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the bundled v1 router
app.include_router(api_router, prefix="/api/v1")

# Setup Admin
admin = Admin(app, engine, authentication_backend=authentication_backend)
admin.add_view(UserAdmin)
admin.add_view(ConversationAdmin)
admin.add_view(MessageAdmin)