import httpx
from typing import List, Dict

class LegalAIService:
    def __init__(self):
        # Ensure this is set to ai backend running laptop's IP, e.g., "http://192.168.1.50:8000/ask"
        from app.core.config import settings
        self.worker_url = settings.AI_INFERENCE_URL 

    async def get_model_stream(self, query: str, history_msgs: List[Dict[str, str]]):
        # We increase the timeout because starting an Ollama stream can take a few seconds
        async with httpx.AsyncClient(timeout=120.0) as client:
            payload = {
                "query": query,
                "history": history_msgs 
            }
            try:
                async with client.stream("POST", self.worker_url, json=payload) as response:
                    if response.status_code != 200:
                        yield f"Error: AI Worker returned {response.status_code}"
                        return
                    async for chunk in response.aiter_text():
                        yield chunk
            except Exception as e:
                yield f"Connection Error to AI Worker: {str(e)}"

ai_service = LegalAIService()