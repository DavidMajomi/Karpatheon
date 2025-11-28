from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# --- Chat ---
class ChatRequest(BaseModel):
    query: str
    mode: str = "execution"  # execution, curiosity, learning
    context_filter: Optional[List[str]] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    suggested_actions: Optional[List[str]] = None

# --- Ingestion ---
class FileResponse(BaseModel):
    filename: str
    file_id: str
    status: str
    chunk_count: int
    graph_nodes_created: int = 0 # Added to track graph creation status

# --- Graph ---
class ConceptNode(BaseModel):
    id: str
    label: str
    properties: Dict[str, Any]

class GraphContext(BaseModel):
    central_concept: str
    related_nodes: List[ConceptNode]
    
# --- Search (Web Search via Exa) ---
class SearchRequest(BaseModel):
    query: str
    
class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str

class SearchResponse(BaseModel):
    original_query: str
    refined_query: str
    results: List[SearchResult]