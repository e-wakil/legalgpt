from fastapi import APIRouter, Depends
from app.models import models
from app.schemas import schemas
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=schemas.UserDetail)
async def get_my_details(current_user: models.User = Depends(get_current_user)):
    """
    Returns the profile of the currently logged-in user.
    """
    return current_user