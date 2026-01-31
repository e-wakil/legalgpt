from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalGPT"
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    AI_INFERENCE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()