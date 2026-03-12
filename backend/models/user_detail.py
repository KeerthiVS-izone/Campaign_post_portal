from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class UserDetail(Base):
    __tablename__ = "user_details"
    __table_args__ = {"schema": "campaign_tweet"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("campaign_tweet.users.id"), nullable=False)
    name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    district = Column(String, nullable=False)
    constituency = Column(String, nullable=False)
    responsibility = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="details")
