import os
import numpy as np
import json
import faiss
import re
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- Paths ---
DATA_FOLDER = "./data"
METADATA_PATH = os.path.join(DATA_FOLDER, "final_legal_laws_metadata.json")
EMBEDDINGS_PATH = os.path.join(DATA_FOLDER, "final_legal_embeddings.npy")

app = FastAPI(title="LegalGPT-Nepal RAG Worker")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- 1. Load Assets ---
print("🚀 Initializing Legal RAG Engine...")
if not os.path.exists(METADATA_PATH):
    raise FileNotFoundError("Missing legal_metadata.json in data folder!")

meta = json.load(open(METADATA_PATH, encoding="utf-8"))
emb = np.load(EMBEDDINGS_PATH).astype("float32")

# --- 2. Initialize Search Engines ---
# FAISS (Dense Search)
norms = np.linalg.norm(emb, axis=1, keepdims=True)
emb_norm = emb / (norms + 1e-10)
idx = faiss.IndexFlatIP(emb_norm.shape[1])
idx.add(emb_norm)

# --- 2. Initialize Search Engines ---
# Filter out any malformed records that don't have the required keys
meta = [m for m in meta if isinstance(m, dict) and 'law' in m and 'text' in m]

# BM25 (Keyword Search) - Safely access keys using .get()
# We index Law + Section Title + Chapter + Text for better keyword matching
corpus_tokens = [
    f"{m.get('law', '')} {m.get('chapter_title','') or ''} {m.get('section_title', '')} {m.get('text', '')}".lower().split() 
    for m in meta
]
bm25 = BM25Okapi(corpus_tokens)



# Models
bi_enc = SentenceTransformer("all-mpnet-base-v2")
cross_enc = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2")

# --- 3. Retrieval Logic ---

def rrf(ranked_lists, k=60):
    """Reciprocal Rank Fusion to combine multiple search results."""
    scores = {}
    for ranked in ranked_lists:
        for rank, doc_id in enumerate(ranked, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

class QueryRequest(BaseModel):
    q: str

@app.post("/retrieve")
async def retrieve(body: QueryRequest):
    query = body.q
    
    # STAGE 1: Dense Semantic Search (MPNet)
    q_vec = bi_enc.encode([query], normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    _, dense_ids = idx.search(q_vec, 40)
    dense_ranked = [int(i) for i in dense_ids[0] if i < len(meta)]

    # STAGE 2: Sparse Keyword Search (BM25)
    bm25_scores = bm25.get_scores(query.lower().split())
    bm25_ranked = list(np.argsort(-bm25_scores)[:40])

    # STAGE 3: Hybrid Fusion
    fused_ids = rrf([dense_ranked, bm25_ranked])

    # STAGE 4: Legal Section Boost
    # If user mentions a number like "Section 1", boost items where section == 1
    query_nums = re.findall(r'\d+', query)
    boosted, rest = [], []
    for doc_id in fused_ids:
        if query_nums and any(str(meta[doc_id].get('section')) == n for n in query_nums):
            boosted.append(doc_id)
        else:
            rest.append(doc_id)
    
    candidate_ids = (boosted + rest)[:15] # Top 15 candidates for reranking
    candidates = [meta[i] for i in candidate_ids]

    # STAGE 5: Cross-Encoder Reranking (Highest Accuracy)
    # Construct input pairs for the reranker
    pairs = [
        [query, f"{c['law']} {c['section_title']} {c.get('chapter_title','') or ''} {c['text']}"] 
        for c in candidates
    ]
    rerank_scores = cross_enc.predict(pairs)
    ranked_results = sorted(zip(rerank_scores, candidates), key=lambda x: x[0], reverse=True)
    
    # Select Top 3 most relevant legal clauses
    top_results = ranked_results[:3]

    # --- 4. Format Output for LLM Context & Frontend Citations ---
    
    context_parts = []
    citations = []

    for score, clause in top_results:
        # Build Context for AI
        law_info = f"LAW: {clause['law']}"
        hier_info = f"CHAPTER: {clause.get('chapter','N/A')} ({clause.get('chapter_title','N/A')})"
        sec_info = f"SECTION: {clause['section']} - {clause['section_title']}"
        sub_info = f"SUBSECTION: {clause.get('subsection')}" if clause.get('subsection') else ""
        
        full_context_block = f"[{law_info}]\n{hier_info}\n{sec_info}\n{sub_info}\nTEXT: {clause['text']}"
        context_parts.append(full_context_block)

        # Build Citation for Frontend
        citations.append({
            "law": clause['law'],
            "chapter": clause.get('chapter'),
            "chapter_title": clause.get('chapter_title'),
            "section": clause['section'],
            "section_title": clause['section_title'],
            "subsection": clause.get('subsection'),
            "source": clause.get('source', 'Nepalese Legal Document')
        })

    return {
        "context": "\n\n---\n\n".join(context_parts),
        "citations": citations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)