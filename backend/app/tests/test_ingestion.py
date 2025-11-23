import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import UploadFile
from io import BytesIO
from app.api.ingestion import IngestionService

# --- Helpers ---
def create_upload_file(content: str, filename: str = "test.md") -> UploadFile:
    """Utility to create a FastAPI UploadFile with given content."""
    file_like = BytesIO(content.encode("utf-8"))
    return UploadFile(filename=filename, file=file_like)

# --- Tests ---
@pytest.mark.asyncio
@patch("app.api.ingestion.get_supabase")
@patch("app.api.ingestion.get_neo4j")
@patch("app.api.ingestion.GoogleGenerativeAIEmbeddings")
@patch("app.api.ingestion.ChatGoogleGenerativeAI")
async def test_process_file_success(mock_chat, mock_embeddings, mock_neo4j, mock_supabase):
    # Mock Supabase
    mock_table = MagicMock()
    mock_table.insert.return_value.execute.return_value = None
    mock_table.update.return_value.eq.return_value.execute.return_value = None
    mock_supabase.return_value.table.return_value = mock_table

    # Mock Neo4j
    mock_session = MagicMock()
    mock_neo4j.return_value.session.return_value.__enter__.return_value = mock_session

    # Mock Embeddings
    mock_embeddings_instance = MagicMock()
    mock_embeddings_instance.aembed_documents = AsyncMock(return_value=[[0.1]*1536])
    mock_embeddings.return_value = mock_embeddings_instance

    # Mock Chat LLM
    mock_chat_instance = MagicMock()
    mock_chat_instance.invoke.return_value.content = "MERGE (c:Concept {name:'Test'})"
    mock_chat.return_value = mock_chat_instance

    service = IngestionService()

    file = create_upload_file("# Header1\nSome content")
    result = await service.process_file("user123", file)

    assert result["status"] == "indexed"
    assert result["chunk_count"] > 0
    assert result["graph_nodes_created"] > 0
    assert result["filename"] == "test.md"

    # Ensure Supabase insert was called
    mock_table.insert.assert_called()
    mock_table.update.assert_called()

    # Ensure Neo4j session ran commands
    # Ensure Neo4j session ran commands
    assert mock_session.run.called

@pytest.mark.asyncio
@patch("app.api.ingestion.get_supabase")
@patch("app.api.ingestion.GoogleGenerativeAIEmbeddings")
@patch("app.api.ingestion.ChatGoogleGenerativeAI")
async def test_process_file_invalid_utf8(mock_chat, mock_embeddings, mock_supabase):
    mock_table = MagicMock()
    mock_table.insert.return_value.execute.return_value = None
    mock_supabase.return_value.table.return_value = mock_table

    service = IngestionService()
    
    # Create a file with invalid UTF-8 bytes
    invalid_bytes = b"\x80\x81\x82"
    file = UploadFile(filename="bad.md", file=BytesIO(invalid_bytes))

    result = await service.process_file("user123", file)
    assert result["status"] == "failed"
    assert "Invalid UTF-8" in result["message"]

@pytest.mark.asyncio
@patch("app.api.ingestion.get_supabase")
@patch("app.api.ingestion.GoogleGenerativeAIEmbeddings")
@patch("app.api.ingestion.ChatGoogleGenerativeAI")
async def test_process_file_empty_text(mock_chat, mock_embeddings, mock_supabase):
    mock_table = MagicMock()
    mock_table.insert.return_value.execute.return_value = None
    mock_supabase.return_value.table.return_value = mock_table

    service = IngestionService()
    
    # File with empty content
    file = create_upload_file("")
    result = await service.process_file("user123", file)
    
    assert result["status"] == "failed"
    assert "No text found" in result["message"]
