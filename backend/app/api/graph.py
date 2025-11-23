from fastapi import APIRouter
from app.schemas.base import GraphContext

router = APIRouter()

@router.get("/context/{concept_id}", response_model=GraphContext)
async def get_concept_context(concept_id: str):
    """
    Retrieves a concept and its immediate neighbors from Neo4j
    to populate the 'Curiosity' side panel.
    """
    # TODO: Cypher query MATCH (n {id: concept_id})-[r]-(m) RETURN n, m
    return GraphContext(
        central_concept=concept_id,
        related_nodes=[
            {"id": "1", "label": "Concept", "properties": {"name": "Vector DB"}},
            {"id": "2", "label": "Concept", "properties": {"name": "Embeddings"}}
        ]
    )