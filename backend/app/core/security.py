import os
from datetime import datetime, timedelta, timezone
from jose import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings

# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# JWT_SECRET = os.getenv("JWT_SECRET")
# ALGORITHM = os.getenv("ALGORITHM")
# ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES"))

def verify_google_token(token: str):
    try:
        return id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
    except Exception:
        return None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)