# LegalGPT AI Worker ⚖️🤖

This is the **Inference Microservice** for LegalGPT. It acts as a bridge between the **Backend API** and the **Ollama LLM Engine**.

## 🏗 Role in the System
1. **Request Reception:** Receives a user query and conversation history from the Backend.
2. **Prompt Engineering:** Wraps the query in a specialized "Nepalese Legal Persona" system prompt.
3. **Inference Bridge:** Communicates with Ollama (running locally or on a remote server).
4. **Stream Delivery:** Streams the AI-generated tokens back to the Backend using HTTP Streaming, which are then pushed to the user via WebSockets.

## 🛠 Prerequisites
- **Python 3.10+**
- **Ollama Engine:** [Download here](https://ollama.com/)
- **Model:** `qwen2.5:1.5b` (or your preferred legal GGUF model)

## 📥 Installation & Setup

### 1. Prepare Environment
```bash
cd ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Ollama & Download Model
Ensure Ollama is running in the background, then pull the model:
```bash
ollama pull qwen2.5:1.5b
```

## 🏃 Running the Worker
Start the worker on port `8001` (to avoid conflict with the backend):
```bash
python3 ai_worker.py
```

- **API Endpoint:** `POST http://localhost:8001/ask`
- **Port:** `8001` (Configurable in `ai_worker.py`)

## ⚙️ Configuration
Inside `ai_worker.py`, you can configure:
- `OLLAMA_MODEL`: The name of the model downloaded via Ollama.
- `OLLAMA_HOST`: The URL where Ollama is running (default: `http://127.0.0.1:11434`).
- `num_ctx`: Context window size (Higher = better memory, but more CPU/RAM usage).

## 📄 API Schema (Input)
```json
{
  "query": "What is the punishment for theft?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Namaste! How can I help you today?"}
  ]
}
```
