# LegalGPT Backend ⚖️🤖

A professional ChatGPT-style backend for legal consultation, built with FastAPI, PostgreSQL, and Google OAuth.

## 🚀 Features
- **FastAPI** for high-performance REST API.
- **PostgreSQL** running in Docker for reliable data storage.
- **Alembic** for smooth database migrations.
- **Google OAuth2** authentication.
- **Enterprise Structure** with clear separation of models, services, and endpoints.
- **SQLAdmin** dashboard for managing users and chat logs.

---

## 🛠️ Prerequisites
- **Ubuntu** (or any Linux/macOS)
- **Python 3.10+**
- **Docker & Docker-Compose**
- **Google Cloud Console account** (for OAuth Credentials)

---

## 📥 Installation & Setup

### 1. Clone and Prepare
```bash
git clone <your-repo-url>
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` root directory:
```env
PROJECT_NAME=LegalGPT
DATABASE_URL=postgresql://postgres_user:postgres_password@localhost:5432/legalgpt_db
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=generate-a-long-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=300
```

### 3. Start the Database (Docker)
Ensure Docker is running, then start the PostgreSQL container:
```bash
docker-compose up -d
```

### 4. Database Migrations (Alembic)
Apply the database schema to your PostgreSQL instance:
```bash
# Set PYTHONPATH so Alembic can find the 'app' module
export PYTHONPATH=$PYTHONPATH:. 

# Run migrations
alembic upgrade head
```

---

## 🏃 Running the Application

Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

- **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Admin Panel:** [http://localhost:8000/admin](http://localhost:8000/admin)
- **Base URL:** `http://localhost:8000/api/v1`

---

## 📂 Project Structure
```text
backend/
├── app/
│   ├── api/            # Routes & Dependencies
│   ├── core/           # Security, Config & DB Setup
│   ├── models/         # SQLAlchemy Tables
│   ├── schemas/        # Pydantic (Data Validation)
│   ├── services/       # AI & RAG Logic
│   ├── admin/          # SQLAdmin UI Configuration
│   └── main.py         # App Initialization
├── alembic/            # Database Migrations
├── .env                # Private Secrets
├── docker-compose.yml  # Infrastructure
└── requirements.txt    # Dependencies
```

---

## 🛠️ Useful Commands

### Create a new database migration
If you modify `models.py`, run:
```bash
export PYTHONPATH=$PYTHONPATH:.
alembic revision --autogenerate -m "description of change"
alembic upgrade head
```

### View Docker DB Logs
```bash
docker logs -f legalgpt-db
```