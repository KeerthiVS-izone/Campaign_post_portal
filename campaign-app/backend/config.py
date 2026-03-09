"""
config.py
─────────
Loads all settings from the .env file using python-dotenv.
Import `settings` anywhere in the app to access typed configuration.
"""

from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


class Settings:
    # ── Database ──────────────────────────────────────────────────
    DB_HOST:     str = os.getenv("DB_HOST",     "localhost")
    DB_PORT:     str = os.getenv("DB_PORT",     "5432")
    DB_NAME:     str = os.getenv("DB_NAME",     "campaign_db")
    DB_USER:     str = os.getenv("DB_USER",     "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgre123")
    DB_SCHEMA:   str = os.getenv("DB_SCHEMA",   "campaign_db")   # ← NEW

    @property
    def DATABASE_URL(self) -> str:
        """
        Build the full PostgreSQL connection URL.
        Note: DB_NAME is the *database* to connect to.
              DB_SCHEMA is the *schema* (namespace) inside that database.
        They are often the same value but are separate concepts.
        """
        explicit = os.getenv("DATABASE_URL")
        if explicit:
            return explicit
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    # ── App ───────────────────────────────────────────────────────
    APP_ENV:    str  = os.getenv("APP_ENV",    "development")
    APP_HOST:   str  = os.getenv("APP_HOST",   "0.0.0.0")
    APP_PORT:   int  = int(os.getenv("APP_PORT", "8000"))
    APP_RELOAD: bool = os.getenv("APP_RELOAD", "true").lower() == "true"

    # ── CORS ──────────────────────────────────────────────────────
    @property
    def CORS_ORIGINS(self) -> list[str]:
        raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        return [o.strip() for o in raw.split(",") if o.strip()]

    # ── Debug helper ──────────────────────────────────────────────
    def show(self) -> None:
        print("=== App Settings ===")
        print(f"  ENV          : {self.APP_ENV}")
        print(f"  DB_HOST      : {self.DB_HOST}")
        print(f"  DB_PORT      : {self.DB_PORT}")
        print(f"  DB_NAME      : {self.DB_NAME}")
        print(f"  DB_SCHEMA    : {self.DB_SCHEMA}")
        print(f"  DB_USER      : {self.DB_USER}")
        print(f"  DB_PASSWORD  : {'*' * len(self.DB_PASSWORD)}")
        print(f"  DATABASE_URL : {self.DATABASE_URL}")
        print(f"  CORS_ORIGINS : {self.CORS_ORIGINS}")
        print("====================")


settings = Settings()
