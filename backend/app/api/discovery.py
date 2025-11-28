from fastapi import APIRouter, Query
from app.schemas.discovery import InterestPayload, IngestResponse, DiscoveryResponse
from app.services.discovery_service import DiscoveryService

router = APIRouter()


@router.post("/ingest", response_model=IngestResponse)
async def ingest_interest(user_id: str, payload: InterestPayload):
    """
    Ingest user interest and trigger immediate crawl.
    
    Process:
    1. Compute embedding for interest content
    2. Search Exa for k=20 similar URLs
    3. Retrieve full content
    4. Compute embeddings and similarity to Neo4j KB
    5. Rank and store in JSON
    
    Args:
        user_id: User identifier
        payload: Interest payload with URL, title, and content
    
    Returns:
        IngestResponse with crawl results and storage path
    """
    service = DiscoveryService()
    return await service.ingest_interest(user_id, payload)


@router.get("/list", response_model=DiscoveryResponse)
async def list_discoveries(
    user_id: str = Query(..., description="User identifier"),
    min_similarity: float = Query(0.7, description="Minimum similarity threshold"),
    limit: int = Query(20, description="Maximum number of results")
):
    """
    Get top discoveries filtered by similarity to knowledge base.
    
    Returns top N most relevant discoveries based on cosine similarity
    to the user's Neo4j knowledge base.
    
    Args:
        user_id: User identifier
        min_similarity: Minimum cosine similarity threshold (0-1)
        limit: Maximum number of results to return
    
    Returns:
        DiscoveryResponse with filtered and ranked discoveries
    """
    service = DiscoveryService()
    return await service.load_discoveries(user_id, min_similarity, limit)
