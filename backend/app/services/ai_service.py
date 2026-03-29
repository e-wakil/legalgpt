import httpx
from typing import List, Dict
from app.core.config import settings

class LegalAIService:
    def __init__(self):
        # Ensure this is set to ai backend running laptop's IP, e.g., "http://192.168.1.50:8000/ask"
        self.worker_url = settings.AI_INFERENCE_URL
        self.rag_url = settings.RAG_SERVICE_URL
    
    async def get_rag_context(self, query: str):
        """Calls the RAG worker to get relevant law snippets and citations."""
        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                # We send 'q' because your rag_worker expects 'q'
                response = await client.post(self.rag_url, json={"q": query})
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"RAG Connection Error: {str(e)}")
            
            # Return empty defaults if RAG fails
            return {"context": "", "citations": []}

    async def get_model_stream(self, query: str, history_msgs: List[Dict], context: str):
        """Sends the augmented prompt (Law + Question) to the AI Worker."""
        
        # We wrap the query with the retrieved law context
        # This tells the AI to stay grounded in the Nepalese Law provided
        augmented_prompt = (
            f"Use the following Nepalese Law context to answer the user's question accurately.\n"
            f"If the answer is not in the context, say you don't know.\n\n"
            f"--- LEGAL CONTEXT ---\n{context}\n\n"
            f"--- USER QUESTION ---\n{query}"
        )

        async with httpx.AsyncClient(timeout=120.0) as client:
            payload = {
                "query": augmented_prompt,
                "history": history_msgs 
            }
            try:
                async with client.stream("POST", self.worker_url, json=payload) as response:
                    async for chunk in response.aiter_text():
                        yield chunk
            except Exception as e:
                yield f"Connection Error to AI Worker: {str(e)}"

ai_service = LegalAIService()