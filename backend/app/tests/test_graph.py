import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_concept_context():
    """Test the /api/graph/context/{concept_id} endpoint."""
    concept_id = "test-concept-123"
    response = client.get(f"/api/graph/context/{concept_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert "central_concept" in data
    assert data["central_concept"] == concept_id
    assert "related_nodes" in data
    assert isinstance(data["related_nodes"], list)

def test_get_concept_context_with_special_chars():
    """Test the /api/graph/context/{concept_id} endpoint with special characters."""
    concept_id = "docker-compose"
    response = client.get(f"/api/graph/context/{concept_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["central_concept"] == concept_id

def test_get_concept_context_returns_related_nodes():
    """Test that the endpoint returns related nodes with correct structure."""
    concept_id = "embeddings"
    response = client.get(f"/api/graph/context/{concept_id}")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify related_nodes structure
    if len(data["related_nodes"]) > 0:
        node = data["related_nodes"][0]
        assert "id" in node
        assert "label" in node
        assert "properties" in node
        assert isinstance(node["properties"], dict)
