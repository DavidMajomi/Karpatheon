import os

def get_embeddings():
    """
    Return an embedding object based on the EMBEDDING_PROVIDER env var.

    * ``google`` – Google Gemini embeddings (async)
    * any other value – local BGE embeddings (sync)
    """
    provider = os.getenv("EMBEDDING_PROVIDER", "local").lower()
    if provider == "google":
        # Gemini embeddings are async
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        return GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    else:
        # Local BGE embeddings (CPU-only)
        from sentence_transformers import SentenceTransformer
        return SentenceTransformer("BAAI/bge-base-en-v1.5")
