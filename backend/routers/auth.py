from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin, Token, UserResponse
from services.user_service import create_user, authenticate_user, get_user_detail
from core.security import create_access_token
from core.auth import get_current_user
from database.db import get_db
from models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user_data)

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.username, user_data.password)
    token = create_access_token({"sub": user.username, "role": user.role})
    has_details = get_user_detail(db, user.id) is not None
    return Token(access_token=token, token_type="bearer", role=user.role, has_details=has_details)

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
