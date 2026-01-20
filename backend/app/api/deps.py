from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.core.config import settings

security = HTTPBearer()

def get_current_user(res: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    cred_expection = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    try:
        payload = jwt.decode(res.credentials, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id = payload.get("id") # Store ID in JWT for faster lookup
        # email: str = payload.get("sub")
        if user_id is None:
            raise cred_expection
    except JWTError:
        raise cred_expection
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise cred_expection
    return user