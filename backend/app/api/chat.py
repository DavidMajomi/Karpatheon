from fastapi import APIRouter
from app.schemas.base import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/query", response_model=ChatResponse)
async def chat_query(payload: ChatRequest):
    """
    Main RAG Endpoint.
    1. Vector Search (Supabase)
    2. Graph Expansion (Neo4j)
    3. LLM Synthesis
    """
    # TODO: Implement RAG logic
    return ChatResponse(
        response=f"I received your query about '{payload.query}' in {payload.mode} mode.",
        sources=["doc-1", "node-graph-alpha"],
        suggested_actions=["Read more about Docker", "Create a new note"]
    )

@router.post("/synthesis")
async def daily_synthesis():
    """
    'Morning Brief' style synthesis of recent notes and graph additions.
    """
    return {"brief": "You have added 3 new concepts regarding Graph Databases today."}