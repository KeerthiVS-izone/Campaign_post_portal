from sqlalchemy.orm import Session
from models.user import User
from models.user_detail import UserDetail
from schemas.user import UserCreate, UserDetailCreate
from core.security import get_password_hash, verify_password
from fastapi import HTTPException, status

def create_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    user = User(
        username=user_data.username,
        password_hash=get_password_hash(user_data.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, username: str, password: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return user

def create_user_detail(db: Session, user_id: int, detail_data: UserDetailCreate) -> UserDetail:
    existing = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Details already submitted")
    detail = UserDetail(user_id=user_id, **detail_data.model_dump())
    db.add(detail)
    db.commit()
    db.refresh(detail)
    return detail

def get_user_detail(db: Session, user_id: int):
    return db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
