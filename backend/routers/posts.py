from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.post import PostCreate, PostResponse, RetweetCreate, RetweetResponse, UploadedPostResponse
from services.post_service import (
    create_post, get_all_posts, create_retweet, get_all_retweets,
    upload_excel_posts, get_all_uploaded_posts, delete_post, delete_retweet
)
from core.auth import get_current_user, get_current_admin
from database.db import get_db
from models.user import User

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.get("/", response_model=List[PostResponse])
def list_posts(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_all_posts(db)

@router.post("/", response_model=PostResponse)
def add_post(post_data: PostCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return create_post(db, post_data, admin.username)

@router.delete("/{post_id}")
def remove_post(post_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    post = delete_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}

@router.get("/retweets", response_model=List[RetweetResponse])
def list_retweets(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_all_retweets(db)

@router.post("/retweets", response_model=RetweetResponse)
def add_retweet(retweet_data: RetweetCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return create_retweet(db, retweet_data, admin.username)

@router.delete("/retweets/{retweet_id}")
def remove_retweet(retweet_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    retweet = delete_retweet(db, retweet_id)
    if not retweet:
        raise HTTPException(status_code=404, detail="Retweet not found")
    return {"message": "Retweet deleted"}

@router.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files are allowed")
    file_bytes = await file.read()
    try:
        count = upload_excel_posts(db, file_bytes, admin.username)
        return {"message": f"Successfully uploaded {count} posts"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/uploaded", response_model=List[UploadedPostResponse])
def list_uploaded_posts(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_all_uploaded_posts(db)
