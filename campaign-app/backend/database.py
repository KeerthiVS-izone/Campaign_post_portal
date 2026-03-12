"""
database.py
───────────
Creates the SQLAlchemy engine with `search_path=campaign_db` so every
query automatically targets the `campaign_db` schema inside PostgreSQL.

PostgreSQL concept:
  - DATABASE  = campaign_db  (the database you connect to)
  - SCHEMA    = campaign_db  (a namespace inside that database)
  - TABLES    = campaign_data, campaign_posts  (live inside the schema)

Full path:  campaign_db (database) → campaign_db (schema) → table
"""

from sqlalchemy import create_engine, text, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

DB_SCHEMA = settings.DB_SCHEMA   # "campaign_db" from .env

# ── Engine — set search_path so every connection uses our schema ──
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"options": f"-csearch_path={DB_SCHEMA}"},
    pool_pre_ping=True,    # test connection before using from pool
    pool_size=5,
    max_overflow=10,
    echo=(settings.APP_ENV == "development"),
)

# ── Session factory ───────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Base — all ORM models inherit from this ───────────────────────
Base = declarative_base()


# ── FastAPI dependency ────────────────────────────────────────────
def get_db():
    """Yield a DB session; always closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Health check ──────────────────────────────────────────────────
def check_connection() -> bool:
    """Return True if PostgreSQL is reachable and schema exists."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"[DB] Connection failed: {e}")
        return False


# ── Create schema if it doesn't exist yet ────────────────────────
def create_schema_if_missing() -> None:
    """Run CREATE SCHEMA IF NOT EXISTS before Alembic/table creation."""
    with engine.connect() as conn:
        conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{DB_SCHEMA}"'))
        conn.commit()
    print(f"[DB] Schema '{DB_SCHEMA}' is ready.")
