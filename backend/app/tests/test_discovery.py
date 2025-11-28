import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from app.main import app
from app.schemas.discovery import InterestPayload, ContentData

client = TestClient(app)


@pytest.fixture
def mock_discovery_service():
    """Mock DiscoveryService for testing."""
    with patch('app.api.discovery.DiscoveryService') as mock:
        yield mock


@pytest.fixture
def sample_interest_payload():
    """Sample interest payload for testing."""
    return {
        "url": "https://example.com/article",
        "title": "Test Article",
        "timestamp": "2025-11-23T10:00:00Z",
        "content": {
            "title": "Test Article",
            "textContent": "This is a test article about neural networks and machine learning.",
            "contentLength": 100,
            "byline": "Test Author",
            "excerpt": "A test article",
            "siteName": "Example.com",
            "publishedTime": "2025-11-23T09:00:00Z"
        },
        "method": "readability"
    }


@pytest.fixture
def sample_ingest_response():
    """Sample ingest response."""
    return {
        "status": "success",
        "interest_url": "https://example.com/article",
        "crawled_count": 15,
        "stored_path": "data/discoveries/test_user/20251123_abc123.json",
        "top_similarity_score": 0.92
    }


@pytest.fixture
def sample_discovery_response():
    """Sample discovery response."""
    return {
        "discoveries": [
            {
                "url": "https://example.com/related1",
                "title": "Related Article 1",
                "snippet": "This is a related article...",
                "similarity_to_kb": 0.92,
                "similarity_to_interest": 0.85,
                "source_interest_url": "https://example.com/article",
                "crawled_at": "2025-11-23T10:05:00Z"
            },
            {
                "url": "https://example.com/related2",
                "title": "Related Article 2",
                "snippet": "Another related article...",
                "similarity_to_kb": 0.88,
                "similarity_to_interest": 0.80,
                "source_interest_url": "https://example.com/article",
                "crawled_at": "2025-11-23T10:05:00Z"
            }
        ],
        "total_available": 20,
        "filtered_count": 15,
        "min_similarity_used": 0.7
    }


class TestDiscoveryIngest:
    """Tests for POST /api/discovery/ingest endpoint."""
    
    def test_ingest_success(self, mock_discovery_service, sample_interest_payload, sample_ingest_response):
        """Test successful interest ingestion."""
        # Setup mock
        mock_service_instance = mock_discovery_service.return_value
        mock_service_instance.ingest_interest = AsyncMock(return_value=sample_ingest_response)
        
        # Make request
        response = client.post(
            "/api/discovery/ingest?user_id=test_user",
            json=sample_interest_payload
        )
        
        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["interest_url"] == "https://example.com/article"
        assert data["crawled_count"] == 15
        assert data["top_similarity_score"] == 0.92
        assert "stored_path" in data
        
        # Verify service was called
        mock_service_instance.ingest_interest.assert_called_once()
    
    def test_ingest_missing_user_id(self, sample_interest_payload):
        """Test ingestion without user_id."""
        response = client.post(
            "/api/discovery/ingest",
            json=sample_interest_payload
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_ingest_invalid_payload(self):
        """Test ingestion with invalid payload."""
        invalid_payload = {
            "url": "not-a-valid-url",
            "title": "Test"
            # Missing required fields
        }
        
        response = client.post(
            "/api/discovery/ingest?user_id=test_user",
            json=invalid_payload
        )
        
        assert response.status_code == 422
    
    def test_ingest_service_error(self, mock_discovery_service, sample_interest_payload):
        """Test handling of service errors during ingestion."""
        # Setup mock to raise error
        mock_service_instance = mock_discovery_service.return_value
        mock_service_instance.ingest_interest = AsyncMock(
            side_effect=Exception("Exa API error")
        )
        
        # Make request - should propagate the exception
        with pytest.raises(Exception, match="Exa API error"):
            response = client.post(
                "/api/discovery/ingest?user_id=test_user",
                json=sample_interest_payload
            )


class TestDiscoveryList:
    """Tests for GET /api/discovery/list endpoint."""
    
    def test_list_success(self, mock_discovery_service, sample_discovery_response):
        """Test successful discovery listing."""
        # Setup mock
        mock_service_instance = mock_discovery_service.return_value
        mock_service_instance.load_discoveries = AsyncMock(return_value=sample_discovery_response)
        
        # Make request
        response = client.get("/api/discovery/list?user_id=test_user")
        
        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert len(data["discoveries"]) == 2
        assert data["total_available"] == 20
        assert data["filtered_count"] == 15
        assert data["min_similarity_used"] == 0.7
        
        # Verify first discovery
        first = data["discoveries"][0]
        assert first["url"] == "https://example.com/related1"
        assert first["similarity_to_kb"] == 0.92
        assert first["similarity_to_interest"] == 0.85
    
    def test_list_with_custom_params(self, mock_discovery_service, sample_discovery_response):
        """Test listing with custom min_similarity and limit."""
        mock_service_instance = mock_discovery_service.return_value
        mock_service_instance.load_discoveries = AsyncMock(return_value=sample_discovery_response)
        
        response = client.get(
            "/api/discovery/list?user_id=test_user&min_similarity=0.85&limit=10"
        )
        
        assert response.status_code == 200
        
        # Verify service was called with correct params
        mock_service_instance.load_discoveries.assert_called_once_with(
            "test_user", 0.85, 10
        )
    
    def test_list_missing_user_id(self):
        """Test listing without user_id."""
        response = client.get("/api/discovery/list")
        
        assert response.status_code == 422
    
    def test_list_empty_results(self, mock_discovery_service):
        """Test listing when no discoveries exist."""
        empty_response = {
            "discoveries": [],
            "total_available": 0,
            "filtered_count": 0,
            "min_similarity_used": 0.7
        }
        
        mock_service_instance = mock_discovery_service.return_value
        mock_service_instance.load_discoveries = AsyncMock(return_value=empty_response)
        
        response = client.get("/api/discovery/list?user_id=new_user")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["discoveries"]) == 0
        assert data["total_available"] == 0
    
    def test_list_invalid_similarity(self):
        """Test listing with invalid similarity value."""
        response = client.get(
            "/api/discovery/list?user_id=test_user&min_similarity=1.5"
        )
        
        # Should still work but might be clamped or validated
        # Depending on implementation, adjust assertion
        assert response.status_code in [200, 422]
