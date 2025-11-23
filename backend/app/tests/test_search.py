import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.mark.asyncio
@patch("app.api.search.SearchService")
async def test_search_endpoint(mock_search_service_class):
    """Test the /api/search/search endpoint."""
    # Mock SearchService instance
    mock_service = MagicMock()
    mock_service.refine_query = AsyncMock(return_value="optimized query about Docker")
    mock_service.initial_search = AsyncMock(return_value=[
        {
            "title": "Docker Documentation",
            "url": "https://docs.docker.com",
            "snippet": "Docker is a platform..."
        },
        {
            "title": "Docker Tutorial",
            "url": "https://docker-tutorial.com",
            "snippet": "Learn Docker basics..."
        }
    ])
    mock_search_service_class.return_value = mock_service
    
    response = client.post(
        "/api/search/search",
        json={"query": "What is Docker?"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "original_query" in data
    assert "refined_query" in data
    assert "results" in data
    assert len(data["results"]) == 2
    assert data["results"][0]["title"] == "Docker Documentation"


@pytest.mark.asyncio
@patch("app.api.search.SearchService")
@patch("app.api.search.ChatGoogleGenerativeAI")
async def test_discovery_endpoint(mock_llm_class, mock_search_service_class):
    """Test the /api/search/discovery endpoint."""
    # Mock SearchService
    mock_service = MagicMock()
    mock_service.discover = AsyncMock(return_value={
        "original_query": "What is Docker?",
        "refined_query": "Docker containerization platform",
        "search_results": [],
        "selected_urls": ["https://docs.docker.com"],
        "context_map": {
            "https://docs.docker.com": "Docker is a platform for developing..."
        },
        "aggregated_context": "Source: https://docs.docker.com\n\nDocker is a platform..."
    })
    mock_search_service_class.return_value = mock_service
    
    # Mock Gemini LLM
    mock_llm = MagicMock()
    mock_response = MagicMock()
    mock_response.content = "Docker is a containerization platform that allows developers to package applications..."
    mock_llm.invoke.return_value = mock_response
    mock_llm_class.return_value = mock_llm
    
    response = client.post(
        "/api/search/discovery",
        json={
            "query": "What is Docker?",
            "mode": "execution"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "sources" in data
    assert "suggested_actions" in data
    assert "Docker" in data["response"]
    assert len(data["sources"]) > 0


def test_search_endpoint_missing_query():
    """Test the /api/search/search endpoint with missing query."""
    response = client.post(
        "/api/search/search",
        json={}
    )
    assert response.status_code == 422  # Validation error


def test_discovery_endpoint_missing_query():
    """Test the /api/search/discovery endpoint with missing query."""
    response = client.post(
        "/api/search/discovery",
        json={"mode": "execution"}
    )
    assert response.status_code == 422  # Validation error
