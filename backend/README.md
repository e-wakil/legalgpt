# LegalGPT Backend ⚖️🤖

A professional ChatGPT-style backend for legal consultation for nepali law, built with FastAPI, PostgreSQL (pgvector), and Google OAuth.

## 🚀 Features
- **FastAPI** for high-performance REST API.
- **PostgreSQL with pgvector** for reliable data and high-speed vector storage.
- **RAG (Retrieval-Augmented Generation)** to provide context-aware legal advice based on local PDFs.
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
AI_INFERENCE_URL=http://127.0.0.1:8001/ask
```

### 3. Start the Vector Database (Docker)
Ensure Docker is running. The project uses the `ankane/pgvector` image to support RAG:
```bash
docker-compose up -d
```

### 4. Database Migrations (Alembic)
Apply the database schema (Users, Conversations, Messages):
```bash
export PYTHONPATH=$PYTHONPATH:. 
alembic upgrade head
```

### 5. RAG Setup: Ingesting Legal Documents
To provide the AI with specific legal knowledge, you must ingest your PDF documents into the vector database.

1.  **Place your PDFs:** Copy all legal documents (e.g., Nepalese Acts) into the `backend/data/laws/` directory.
2.  **Run Ingestion:** Execute the script to split, embed, and store the documents:
```bash
export PYTHONPATH=$PYTHONPATH:. 
python3 scripts/ingest_docs.py
```

---

## 🏃 Running the Application

1. **Start the AI Worker:** Ensure your AI Worker (on port 8001) is running.
2. **Start the Backend:**
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
│   ├── services/       # AI & RAG Logic (rag_service.py)
│   ├── admin/          # SQLAdmin UI Configuration
│   └── main.py         # App Initialization
├── scripts/            # Admin scripts (ingest_docs.py)
├── data/
│   └── laws/           # Source PDFs for RAG
├── alembic/            # Database Migrations
├── .env                # Private Secrets
├── docker-compose.yml  # Infrastructure (pgvector)
└── requirements.txt    # Dependencies
```

---

## 🛠️ Useful Commands

### Update RAG Knowledge Base
Whenever you add new PDFs to `data/laws/`, re-run:
```bash
python3 scripts/ingest_docs.py
```

### Create a new database migration
If you modify `models.py`, run:
```bash
export PYTHONPATH=$PYTHONPATH:.
alembic revision --autogenerate -m "description of change"
alembic upgrade head
```

### View Docker DB Logs
```bash
docker logs -f legalgpt_postgres
```