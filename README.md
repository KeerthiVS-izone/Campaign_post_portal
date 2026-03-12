# Campaign Tweet App

A full-stack campaign content posting web application.

## Tech Stack
- **Backend**: FastAPI (Python) + PostgreSQL + SQLAlchemy + Alembic + JWT
- **Frontend**: React + TypeScript + Vite

---

## Project Structure

```
campaign_app/
├── backend/
│   ├── core/           # config, security, auth
│   ├── database/       # DB session setup
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── routers/        # API routes
│   ├── alembic/        # DB migrations
│   ├── main.py
│   ├── create_admin.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/      # React pages
        ├── components/ # Reusable components
        ├── context/    # Auth context
        ├── services/   # Axios API calls
        └── types/      # TypeScript types
```

---

## Setup Instructions

### 1. PostgreSQL Setup

```sql
CREATE DATABASE campaign_db;
-- Schema 'campaign_tweet' is created automatically on first run
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a strong SECRET_KEY

# Run the backend (tables are auto-created on first run)
uvicorn main:app --reload --port 8000
```

### 3. Create Admin User

```bash
cd backend
python create_admin.py
# Enter username and password when prompted
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## .env Configuration

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/campaign_db
SECRET_KEY=your-very-long-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/users/details | Submit user details | User |
| GET | /api/users/details | Get own details | User |
| GET | /api/posts/ | Get all posts | User |
| POST | /api/posts/ | Create post | Admin |
| DELETE | /api/posts/{id} | Delete post | Admin |
| GET | /api/posts/retweets | Get retweets | User |
| POST | /api/posts/retweets | Create retweet | Admin |
| DELETE | /api/posts/retweets/{id} | Delete retweet | Admin |
| POST | /api/posts/upload-excel | Upload Excel | Admin |
| GET | /api/posts/uploaded | Get uploaded posts | User |

---

## User Flow

1. **Register** → Create account
2. **Login** → Get JWT token
3. **Submit Details** → Fill name, phone, district, constituency, responsibility
4. **Posts Page** → View campaign posts, click "Post on X" to tweet

## Admin Flow

1. **Login** with admin credentials
2. **Dashboard** → Add posts, add retweets, upload Excel

## Excel Upload Format

Your Excel file must have a column named `content`:

| content |
|---------|
| புதுமைப் பெண் திட்டம் #StalinWave2026 |
| மாணவர்களுக்கு இலவச காலை உணவு #StalinWave2026 |

---

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
