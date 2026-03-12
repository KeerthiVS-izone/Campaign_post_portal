from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, check_connection, create_schema_if_missing
from config import settings
import models
from routes import router

app = FastAPI(
    title="Campaign Volunteer API",
    description="DMK Campaign Portal — தேர்தல் பிரச்சார தளம்",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup_event():
    settings.show()
    # 1. Create schema if it doesn't exist yet
    create_schema_if_missing()
    # 2. Create tables inside the schema
    Base.metadata.create_all(bind=engine)
    # 3. Verify connection
    ok = check_connection()
    print(f"[DB] PostgreSQL connection: {'✅ Connected' if ok else '❌ FAILED'}")


@app.get("/")
def root():
    return {
        "message": "Campaign Volunteer API is running",
        "schema": settings.DB_SCHEMA,
        "docs": "/docs",
        "env": settings.APP_ENV,
    }


@app.get("/health")
def health():
    db_ok = check_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": settings.DB_NAME,
        "schema": settings.DB_SCHEMA,
        "connection": "connected" if db_ok else "unreachable",
    }
