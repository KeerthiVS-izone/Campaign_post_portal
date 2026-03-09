"""create tables inside campaign_db schema

Revision ID: 001_create_tables
Revises:
Create Date: 2025-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
import os, sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from config import settings

revision = '001_create_tables'
down_revision = None
branch_labels = None
depends_on = None

SCHEMA = settings.DB_SCHEMA   # "campaign_db"


def upgrade() -> None:
    # Ensure schema exists (idempotent)
    op.execute(f'CREATE SCHEMA IF NOT EXISTS "{SCHEMA}"')

    # ── campaign_data ────────────────────────────────────────────
    op.create_table(
        'campaign_data',
        sa.Column('id',              sa.Integer(),      nullable=False),
        sa.Column('name',            sa.String(255),    nullable=False),
        sa.Column('phone_number',    sa.String(20),     nullable=False),
        sa.Column('kalaga_maavatam', sa.String(255),    nullable=False),
        sa.Column('thogudhi',        sa.String(255),    nullable=False),
        sa.Column('porupu',          sa.String(255),    nullable=False),
        sa.Column('created_at',      sa.DateTime(timezone=True),
                  server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        schema=SCHEMA,
    )
    op.create_index('ix_campaign_data_id',         'campaign_data', ['id'],           schema=SCHEMA)
    op.create_index('ix_campaign_data_phone',      'campaign_data', ['phone_number'], schema=SCHEMA)
    op.create_index('ix_campaign_data_created_at', 'campaign_data', ['created_at'],   schema=SCHEMA)

    # ── campaign_posts ───────────────────────────────────────────
    op.create_table(
        'campaign_posts',
        sa.Column('id',         sa.Integer(), nullable=False),
        sa.Column('content',    sa.Text(),    nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        schema=SCHEMA,
    )
    op.create_index('ix_campaign_posts_id',         'campaign_posts', ['id'],         schema=SCHEMA)
    op.create_index('ix_campaign_posts_created_at', 'campaign_posts', ['created_at'], schema=SCHEMA)


def downgrade() -> None:
    op.drop_index('ix_campaign_posts_created_at', table_name='campaign_posts', schema=SCHEMA)
    op.drop_index('ix_campaign_posts_id',         table_name='campaign_posts', schema=SCHEMA)
    op.drop_table('campaign_posts', schema=SCHEMA)

    op.drop_index('ix_campaign_data_created_at', table_name='campaign_data', schema=SCHEMA)
    op.drop_index('ix_campaign_data_phone',      table_name='campaign_data', schema=SCHEMA)
    op.drop_index('ix_campaign_data_id',         table_name='campaign_data', schema=SCHEMA)
    op.drop_table('campaign_data', schema=SCHEMA)
