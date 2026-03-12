from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from database.db import Base

class Post(Base):
    __tablename__ = "posts"
    __table_args__ = {"schema": "campaign_tweet"}

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Retweet(Base):
    __tablename__ = "retweets"
    __table_args__ = {"schema": "campaign_tweet"}

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class UploadedPost(Base):
    __tablename__ = "uploaded_posts"
    __table_args__ = {"schema": "campaign_tweet"}

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    uploaded_by_admin = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
