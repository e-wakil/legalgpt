import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

class RAGService:
    def __init__(self):
        # Smaller, fast CPU embedding model
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # langchain-postgres works best with standard postgresql strings
        self.connection_string = settings.DATABASE_URL
        self.collection_name = "nepal_laws"

    def ingest_pdfs(self, folder_path: str):
        documents = []
        for file in os.listdir(folder_path):
            if file.endswith(".pdf"):
                loader = PyPDFLoader(os.path.join(folder_path, file))
                documents.extend(loader.load())

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
        docs = text_splitter.split_documents(documents)

        # Updated syntax for langchain-postgres
        PGVector.from_documents(
            documents=docs,
            embedding=self.embeddings,
            connection=self.connection_string,
            collection_name=self.collection_name,
            use_jsonb=True,
        )

    async def query_relevant_context(self, query: str):
        # Updated syntax for langchain-postgres
        store = PGVector(
            connection=self.connection_string,
            embeddings=self.embeddings,
            collection_name=self.collection_name,
            use_jsonb=True,
        )
        
        # Use a retriever for cleaner searching
        docs = store.similarity_search(query, k=3)
        return "\n".join([doc.page_content for doc in docs])

rag_service = RAGService()