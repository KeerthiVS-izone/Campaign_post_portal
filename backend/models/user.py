from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "campaign_tweet"}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum("user", "admin", name="user_role", schema="campaign_tweet"), default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    details = relationship("UserDetail", back_populates="user", uselist=False)
