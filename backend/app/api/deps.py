from fastapi import Depends, HTTPException, status, WebSocket, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.core.config import settings

security = HTTPBearer()

# function for WebSocket Auth
async def get_current_user_ws(
    websocket: WebSocket,
    token: str = Query(None), # Looks for ?token=... in URL
    db:Session = Depends(get_db)
):
    if token is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise JWTError()
        
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None
        return user
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None


def get_current_user(
    res: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
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