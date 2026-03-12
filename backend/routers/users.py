from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.user import UserDetailCreate, UserDetailResponse
from services.user_service import create_user_detail, get_user_detail
from core.auth import get_current_user
from database.db import get_db
from models.user import User
from fastapi import HTTPException

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/details", response_model=UserDetailResponse)
def submit_details(
    detail_data: UserDetailCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_user_detail(db, current_user.id, detail_data)

@router.get("/details", response_model=UserDetailResponse)
def get_my_details(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    detail = get_user_detail(db, current_user.id)
    if not detail:
        raise HTTPException(status_code=404, detail="Details not found")
    return detail
