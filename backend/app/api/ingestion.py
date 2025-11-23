from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.base import FileResponse
import uuid

router = APIRouter()

@router.post("/upload", response_model=FileResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts .md or .pdf files.
    Triggers: Text Extraction -> Chunking -> Embedding -> Graph Node Creation.
    """
    if file.content_type not in ["text/markdown", "application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # TODO: Call service.ingest_file(file)
    
    return FileResponse(
        filename=file.filename,
        file_id=str(uuid.uuid4()),
        status="processing",
        chunk_count=0 # Placeholder
    )

@router.get("/files")
async def list_files():
    """List all user uploaded files from Supabase."""
    return {"files": []}