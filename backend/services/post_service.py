from sqlalchemy.orm import Session
from models.post import Post, Retweet, UploadedPost
from schemas.post import PostCreate, RetweetCreate
import pandas as pd
from io import BytesIO

def create_post(db: Session, post_data: PostCreate, admin_username: str) -> Post:
    post = Post(content=post_data.content, created_by=admin_username)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_all_posts(db: Session):
    return db.query(Post).order_by(Post.created_at.desc()).all()

def create_retweet(db: Session, retweet_data: RetweetCreate, admin_username: str) -> Retweet:
    retweet = Retweet(content=retweet_data.content, created_by=admin_username)
    db.add(retweet)
    db.commit()
    db.refresh(retweet)
    return retweet

def get_all_retweets(db: Session):
    return db.query(Retweet).order_by(Retweet.created_at.desc()).all()

def upload_excel_posts(db: Session, file_bytes: bytes, admin_username: str):
    df = pd.read_excel(BytesIO(file_bytes))
    if "content" not in df.columns:
        raise ValueError("Excel must have a 'content' column")
    count = 0
    for _, row in df.iterrows():
        content = str(row["content"]).strip()
        if content and content != "nan":
            post = UploadedPost(content=content, uploaded_by_admin=admin_username)
            db.add(post)
            count += 1
    db.commit()
    return count

def get_all_uploaded_posts(db: Session):
    return db.query(UploadedPost).order_by(UploadedPost.created_at.desc()).all()

def delete_post(db: Session, post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
    return post

def delete_retweet(db: Session, retweet_id: int):
    retweet = db.query(Retweet).filter(Retweet.id == retweet_id).first()
    if retweet:
        db.delete(retweet)
        db.commit()
    return retweet
