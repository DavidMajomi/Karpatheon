from fastapi import APIRouter
from app.api import ingestion, chat, graph, search, discovery, note

api_router = APIRouter()

api_router.include_router(ingestion.router, prefix="/ingestion", tags=["Ingestion"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(graph.router, prefix="/graph", tags=["Knowledge Graph"])
api_router.include_router(note.router, tags=["Notes"])
api_router.include_router(search.router, prefix="/search", tags=["Search & Discovery"])
api_router.include_router(discovery.router, prefix="/discovery", tags=["Discovery"])
