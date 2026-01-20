from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import schemas
from app.core.security import verify_google_token, create_access_token

router = APIRouter()

@router.post("/google", response_model=schemas.TokenResponse)
async def google_auth(data: schemas.TokenRequest, db: Session = Depends(get_db)):
    idinfo = verify_google_token(data.token)
    if not idinfo:
        raise HTTPException(status_code=400, detail="Invalid Google Token")
    
    user = db.query(models.User).filter(models.User.google_id == idinfo['sub']).first()

    if not user:
        user = models.User(
            google_id=idinfo['sub'],
            email=idinfo['email'],
            full_name=idinfo.get('name'),
            picture_url=idinfo.get('picture')
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": user.email, "id": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }