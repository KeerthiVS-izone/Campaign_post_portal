from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, text
from alembic import context
import sys, os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from config import settings
from database import Base
import models  # noqa: F401 — registers all models with Base.metadata

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Tell Alembic which schema to inspect/diff
        include_schemas=True,
        version_table_schema=settings.DB_SCHEMA,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args={"options": f"-csearch_path={settings.DB_SCHEMA}"},
    )
    with connectable.connect() as connection:
        # Ensure the schema exists before migrating
        connection.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{settings.DB_SCHEMA}"'))
        connection.commit()

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
            version_table_schema=settings.DB_SCHEMA,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
