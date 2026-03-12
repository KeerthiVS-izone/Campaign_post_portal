-- ═══════════════════════════════════════════════════════════════════
--  CAMPAIGN PORTAL — PostgreSQL Schema
--  Database : campaign_db   (connect to this)
--  Schema   : campaign_db   (namespace inside the database)
--  Tables   : campaign_db.campaign_data
--             campaign_db.campaign_posts
-- ═══════════════════════════════════════════════════════════════════

-- ── Step 1: Create the database (as superuser, run once) ──────────
-- CREATE DATABASE campaign_db
--     WITH ENCODING='UTF8'
--          LC_COLLATE='en_US.UTF-8'
--          LC_CTYPE='en_US.UTF-8'
--          TEMPLATE=template0;

-- ── Step 2: Connect to it ─────────────────────────────────────────
-- \c campaign_db

-- ── Step 3: Create the schema (namespace) ─────────────────────────
CREATE SCHEMA IF NOT EXISTS campaign_db;

-- Set search_path so unqualified table names resolve to this schema
SET search_path TO campaign_db;

-- ── Step 4: campaign_data ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campaign_db.campaign_data (
    id               SERIAL       PRIMARY KEY,
    name             VARCHAR(255) NOT NULL
                         CONSTRAINT chk_name_not_blank CHECK (TRIM(name) <> ''),
    phone_number     VARCHAR(20)  NOT NULL
                         CONSTRAINT chk_phone_digits   CHECK (phone_number ~ '^\d{10}$'),
    kalaga_maavatam  VARCHAR(255) NOT NULL,
    thogudhi         VARCHAR(255) NOT NULL,
    porupu           VARCHAR(255) NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_data_phone
    ON campaign_db.campaign_data (phone_number);

CREATE INDEX IF NOT EXISTS idx_campaign_data_created_at
    ON campaign_db.campaign_data (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_data_maavatam
    ON campaign_db.campaign_data (kalaga_maavatam);

-- ── Step 5: campaign_posts ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campaign_db.campaign_posts (
    id         SERIAL      PRIMARY KEY,
    content    TEXT        NOT NULL
                   CONSTRAINT chk_content_not_blank CHECK (TRIM(content) <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_posts_created_at
    ON campaign_db.campaign_posts (created_at DESC);

-- Full-text search (works with Tamil via 'simple' config)
CREATE INDEX IF NOT EXISTS idx_campaign_posts_fts
    ON campaign_db.campaign_posts USING GIN (to_tsvector('simple', content));

-- ── Step 6: Useful views ──────────────────────────────────────────

CREATE OR REPLACE VIEW campaign_db.volunteer_summary AS
SELECT
    kalaga_maavatam          AS district,
    COUNT(*)                 AS total_volunteers,
    MIN(created_at)          AS first_registration,
    MAX(created_at)          AS latest_registration
FROM campaign_db.campaign_data
GROUP BY kalaga_maavatam
ORDER BY total_volunteers DESC;

CREATE OR REPLACE VIEW campaign_db.posts_by_date AS
SELECT
    DATE(created_at) AS post_date,
    COUNT(*)         AS total_posts
FROM campaign_db.campaign_posts
GROUP BY DATE(created_at)
ORDER BY post_date DESC;

-- ── Step 7: Verify ────────────────────────────────────────────────
-- SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'campaign_db';
-- \d campaign_db.campaign_data
-- \d campaign_db.campaign_posts

-- ── Step 8: Optional seed data ───────────────────────────────────
-- INSERT INTO campaign_db.campaign_data
--     (name, phone_number, kalaga_maavatam, thogudhi, porupu)
-- VALUES
--     ('முருகன்',    '9876543210', 'சென்னை',        'அண்ணாநகர்',   'தன்னார்வலர்'),
--     ('செல்வி',     '9123456789', 'மதுரை',          'மதுரை மத்தி', 'கிளை செயலர்'),
--     ('கார்த்திக்', '9000000001', 'கோயம்புத்தூர்', 'சினேக நகர்',  'அணி தலைவர்');

-- INSERT INTO campaign_db.campaign_posts (content) VALUES
--     ('புதுமைப் பெண் திட்டம் மூலம் மாணவிகளுக்கு கல்வி தொடர ஊக்கம் வழங்கப்படுகிறது. #StalinWave2026'),
--     ('பெண்களுக்கு இலவச பேருந்து பயணம் சமூக முன்னேற்றத்திற்கு பெரிய உதவியாக உள்ளது. #StalinWave2026'),
--     ('தமிழ்நாட்டில் அரசு பள்ளி மாணவர்களுக்கு இலவச காலை உணவு திட்டம் செயல்படுகிறது. #StalinWave2026');
