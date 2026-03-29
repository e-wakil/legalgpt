# LegalGPT RAG Service ⚖️🔍

This microservice handles the **Retrieval-Augmented Generation (RAG)** pipeline. It indexes Nepalese Law PDFs and provides a high-accuracy search API for the main backend.

## 🏗 Why this structure?
Instead of a basic Vector Database (like ChromaDB), this service uses a **Hybrid Multi-Stage Retrieval** system:
1. **Semantic Search (FAISS):** Finds meaning (e.g., "punishment for theft").
2. **Keyword Search (BM25):** Finds exact terms (e.g., "Civil Code").
3. **RRF Fusion:** Combines both lists into one ranked list.
4. **Legal Boost:** Automatically prioritizes results if a section number (e.g., "Section 40") is mentioned in the query.
5. **Cross-Encoder Reranking:** A final AI model re-reads the top 15 results to find the most accurate 3.

## 📂 Directory Structure
```text
rag/
├── pdfs/               # Input: Place Nepalese Law PDFs here
├── data/               # Output: Generated index files (embeddings + meta)
├── ingest.py           # Logic: PDF -> Processing -> Embedding
├── rag_worker.py       # API: The retrieval microservice (Port 8002)
├── README.md
└── requirements.txt    # Dependencies
```

## 🛠 Prerequisites
- Python 3.10+
- A folder named `pdfs/` containing your legal documents.

## 📥 Installation
```bash
# Navigate to rag folder
cd rag
# Install dependencies
pip install -r requirements.txt
```

## 🏃 Running the RAG

### Step 1: Ingest PDFs
Run this command whenever you add new PDFs to the `pdfs/` folder. It will generate files in the `data/` folder.
```bash
python ingest.py
```

### Step 2: Start the RAG Service
Run the FastAPI server on port 8002.
```bash
python rag_worker.py
```

## 📄 API Usage
**Endpoint:** `POST http://localhost:8002/retrieve`
**Payload:**
```json
{
  "q": "What is the punishment for cybercrime in Nepal?"
}
```

## 🔄 Integration with Backend
The main backend calls this service to get "Context" and "Citations" before asking the LLM (Ollama) to generate a response. This ensures the AI doesn't hallucinate and provides real legal sources.