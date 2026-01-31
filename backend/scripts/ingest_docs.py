import os
import sys
from pathlib import Path

# Add the parent directory to sys.path so we can import 'app'
# This allows the script to find your config and services
sys.path.append(str(Path(__file__).parent.parent))

from app.services.rag_service import rag_service
from app.core.config import settings

def run_ingestion():
    # Define the path to your law PDFs
    # We use absolute paths to avoid issues during deployment
    base_dir = Path(__file__).parent.parent
    data_folder = base_dir / "data" / "laws"

    if not data_folder.exists():
        print(f"❌ Error: Data folder not found at {data_folder}")
        return

    print(f"🚀 Starting ingestion from: {data_folder}")
    
    try:
        # Check if DB is reachable (optional)
        print(f"📡 Connecting to database...")
        
        # Run the ingestion
        rag_service.ingest_pdfs(str(data_folder))
        
        print("✅ Ingestion completed successfully!")
    except Exception as e:
        print(f"❌ Ingestion failed: {str(e)}")

if __name__ == "__main__":
    run_ingestion()