import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_query_execution_mode():
    """Test the /api/chat/query endpoint with execution mode."""
    response = client.post(
        "/api/chat/query",
        json={
            "query": "What is Docker?",
            "mode": "execution"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "sources" in data
    assert isinstance(data["sources"], list)
    assert "Docker" in data["response"]

def test_chat_query_curiosity_mode():
    """Test the /api/chat/query endpoint with curiosity mode."""
    response = client.post(
        "/api/chat/query",
        json={
            "query": "Tell me about graph databases",
            "mode": "curiosity"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "sources" in data

def test_chat_query_with_context_filter():
    """Test the /api/chat/query endpoint with context filter."""
    response = client.post(
        "/api/chat/query",
        json={
            "query": "Explain embeddings",
            "mode": "learning",
            "context_filter": ["doc-1", "doc-2"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data

def test_chat_query_missing_query():
    """Test the /api/chat/query endpoint with missing query field."""
    response = client.post(
        "/api/chat/query",
        json={"mode": "execution"}
    )
    assert response.status_code == 422  # Validation error

def test_daily_synthesis():
    """Test the /api/chat/synthesis endpoint."""
    response = client.post("/api/chat/synthesis")
    assert response.status_code == 200
    data = response.json()
    assert "brief" in data
    assert isinstance(data["brief"], str)
