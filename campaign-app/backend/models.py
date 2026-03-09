"""
models.py
─────────
SQLAlchemy ORM models.

Both models use:
  __table_args__ = {"schema": DB_SCHEMA}

This means SQLAlchemy will generate SQL like:
  SELECT * FROM campaign_db.campaign_data
  SELECT * FROM campaign_db.campaign_posts

Combined with the engine's search_path=campaign_db, the schema
is resolved correctly whether the query uses the qualified name
or the short name.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base
from config import settings

DB_SCHEMA = settings.DB_SCHEMA   # "campaign_db"


class CampaignData(Base):
    __tablename__ = "campaign_data"
    __table_args__ = {"schema": DB_SCHEMA}

    id               = Column(Integer,      primary_key=True, index=True)
    name             = Column(String(255),  nullable=False)
    phone_number     = Column(String(20),   nullable=False)
    kalaga_maavatam  = Column(String(255),  nullable=False)
    thogudhi         = Column(String(255),  nullable=False)
    porupu           = Column(String(255),  nullable=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<CampaignData id={self.id} name={self.name!r}>"


class CampaignPost(Base):
    __tablename__ = "campaign_posts"
    __table_args__ = {"schema": DB_SCHEMA}

    id         = Column(Integer, primary_key=True, index=True)
    content    = Column(Text,    nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<CampaignPost id={self.id} content={self.content[:40]!r}>"
