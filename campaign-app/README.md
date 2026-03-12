# DMK Campaign Portal — தேர்தல் பிரச்சார தளம்

A full-stack campaign volunteer data collection and social media posting system.

---

## Tech Stack

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy + Alembic
- **Frontend**: React + TypeScript + Vite + React Router

---

## Quick Start

### 1. PostgreSQL Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE campaign_db;"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set your DB URL (edit database.py or use .env)
# Default: postgresql://postgres:password@localhost:5432/campaign_db

# Run Alembic migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/submit` | Submit volunteer form data |
| GET | `/posts` | Get all campaign posts |
| POST | `/upload-posts` | Upload posts via Excel file |
| GET | `/sample-excel` | Download sample Excel template |
| GET | `/volunteers` | Get all volunteer submissions |

---

## Excel Upload Format

The Excel file must have a column named **`content`**:

| content |
|---------|
| புதுமைப் பெண் திட்டம் மூலம் மாணவிகளுக்கு... #StalinWave2026 |
| பெண்களுக்கு இலவச பேருந்து பயணம்... #StalinWave2026 |

Upload via: `POST /upload-posts` (multipart form, field: `file`)

Or download a sample: `GET /sample-excel`

---

## Application Flow

```
User fills form → Data saved to PostgreSQL
→ Redirect to Posts Page
→ Posts loaded from database
→ User clicks "X-ல் பதிவிடு"
→ Twitter/X composer opens with post text ready
```

---

## Folder Structure

```
campaign-app/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # DB connection & session
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── routes.py         # API routes
│   ├── excel_service.py  # Excel upload logic
│   ├── requirements.txt
│   ├── alembic.ini
│   └── migrations/
│       ├── env.py
│       └── versions/
│           └── 001_create_tables.py
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── index.css
    │   ├── api.ts
    │   ├── pages/
    │   │   ├── FormPage.tsx
    │   │   └── PostsPage.tsx
    │   └── components/
    │       ├── Layout.tsx
    │       └── PostCard.tsx
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Environment Variables

**Backend** — edit `database.py` or set:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/campaign_db
```

**Frontend** — create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

---

## Reset Migrations (if needed)

```bash
cd backend
alembic downgrade base
alembic upgrade head
```
