from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# Discovery Schemas

class ContentData(BaseModel):
    """Content data from readability extraction"""
    title: str
    byline: Optional[str] = None
    excerpt: Optional[str] = None
    textContent: str
    contentLength: int
    siteName: Optional[str] = None
    publishedTime: Optional[str] = None


class InterestPayload(BaseModel):
    """User interest payload for discovery ingestion"""
    url: str
    title: str
    timestamp: str
    content: ContentData
    method: str = "readability"


class IngestResponse(BaseModel):
    """Response from interest ingestion"""
    status: str
    interest_url: str
    crawled_count: int
    stored_path: str
    top_similarity_score: float


class DiscoveryItem(BaseModel):
    """Individual discovery item"""
    url: str
    title: str
    snippet: str
    similarity_to_kb: float
    similarity_to_interest: float
    source_interest_url: str
    crawled_at: str


class DiscoveryResponse(BaseModel):
    """Response from discovery list endpoint"""
    discoveries: List[DiscoveryItem]
    total_available: int
    filtered_count: int
    min_similarity_used: float
