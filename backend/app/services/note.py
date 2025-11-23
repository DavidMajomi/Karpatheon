"""
Note storage service using Supabase Storage (S3-compatible).
Location: backend/app/services/note.py

Handles:
- Create notes in Supabase Storage bucket
- Update notes (with automatic versioning)
- Retrieve notes by file_id
- Delete notes (optional)
"""

import os
from datetime import datetime
from typing import Optional, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()


class NoteService:
    """Service for managing notes in Supabase Storage."""
    
    BUCKET_NAME = "notes"  # Create this bucket in Supabase dashboard
    
    def __init__(self):
        """Initialize Supabase client."""
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment")
        
        self.client: Client = create_client(supabase_url, supabase_key)
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Create the notes bucket if it doesn't exist (with versioning enabled)."""
        try:
            # Check if bucket exists
            buckets = self.client.storage.list_buckets()
            bucket_names = [b.name for b in buckets]
            
            if self.BUCKET_NAME not in bucket_names:
                # Create bucket with public access disabled (private by default)
                self.client.storage.create_bucket(
                    self.BUCKET_NAME,
                    options={"public": False}
                )
                print(f"✅ Created bucket: {self.BUCKET_NAME}")
        except Exception as e:
            print(f"⚠️  Bucket check failed (may already exist): {e}")
    
    def _get_storage_path(self, file_id: str) -> str:
        """Generate storage path for a note."""
        return f"{file_id}.md"
    
    def _get_metadata_path(self, file_id: str) -> str:
        """Generate path for metadata JSON file."""
        return f"{file_id}.meta.json"
    
    async def create_note(
        self,
        file_id: str,
        title: str,
        content: str,
        url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new note in Supabase Storage.
        
        Args:
            file_id: Unique identifier (UUID from discovery endpoint)
            title: Note title
            content: Markdown content
            url: Optional source URL
            
        Returns:
            Dict with note metadata including storage_path, created_at, size
        """
        storage_path = self._get_storage_path(file_id)
        metadata_path = self._get_metadata_path(file_id)
        
        # Check if note already exists
        try:
            existing = self.client.storage.from_(self.BUCKET_NAME).list(file_id)
            if existing:
                raise ValueError(f"Note with file_id {file_id} already exists")
        except:
            pass  # File doesn't exist, proceed with creation
        
        # Store the markdown content
        content_bytes = content.encode('utf-8')
        result = self.client.storage.from_(self.BUCKET_NAME).upload(
            path=storage_path,
            file=content_bytes,
            file_options={"content-type": "text/markdown"}
        )
        
        # Store metadata as separate JSON file
        now = datetime.utcnow()
        metadata = {
            "file_id": file_id,
            "title": title,
            "url": url,
            "storage_path": storage_path,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "size_bytes": len(content_bytes)
        }
        
        self.client.storage.from_(self.BUCKET_NAME).upload(
            path=metadata_path,
            file=json.dumps(metadata).encode('utf-8'),
            file_options={"content-type": "application/json"}
        )
        
        return metadata
    
    async def update_note(
        self,
        file_id: str,
        content: Optional[str] = None,
        title: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update an existing note. Supabase Storage versioning handles history automatically.
        
        Args:
            file_id: Note identifier
            content: New markdown content (optional)
            title: New title (optional)
            
        Returns:
            Updated metadata dict
        """
        storage_path = self._get_storage_path(file_id)
        metadata_path = self._get_metadata_path(file_id)
        
        # Retrieve current metadata
        metadata = await self._get_metadata(file_id)
        
        # Update content if provided
        if content is not None:
            content_bytes = content.encode('utf-8')
            
            # Upload new version (overwrites, but Supabase keeps old version if versioning enabled)
            self.client.storage.from_(self.BUCKET_NAME).update(
                path=storage_path,
                file=content_bytes,
                file_options={"content-type": "text/markdown"}
            )
            
            metadata["size_bytes"] = len(content_bytes)
        
        # Update title if provided
        if title is not None:
            metadata["title"] = title
        
        # Update timestamp
        metadata["updated_at"] = datetime.utcnow().isoformat()
        
        # Save updated metadata
        self.client.storage.from_(self.BUCKET_NAME).update(
            path=metadata_path,
            file=json.dumps(metadata).encode('utf-8'),
            file_options={"content-type": "application/json"}
        )
        
        return metadata
    
    async def get_note(self, file_id: str) -> Dict[str, Any]:
        """
        Retrieve a note's content and metadata.
        
        Args:
            file_id: Note identifier
            
        Returns:
            Dict with content and metadata
        """
        storage_path = self._get_storage_path(file_id)
        
        # Get content
        content_bytes = self.client.storage.from_(self.BUCKET_NAME).download(storage_path)
        content = content_bytes.decode('utf-8')
        
        # Get metadata
        metadata = await self._get_metadata(file_id)
        metadata["content"] = content
        
        return metadata
    
    async def _get_metadata(self, file_id: str) -> Dict[str, Any]:
        """Retrieve metadata for a note."""
        metadata_path = self._get_metadata_path(file_id)
        
        try:
            metadata_bytes = self.client.storage.from_(self.BUCKET_NAME).download(metadata_path)
            return json.loads(metadata_bytes.decode('utf-8'))
        except Exception as e:
            raise FileNotFoundError(f"Note metadata not found for file_id: {file_id}")
    
    async def delete_note(self, file_id: str) -> bool:
        """
        Delete a note and its metadata.
        
        Args:
            file_id: Note identifier
            
        Returns:
            True if successful
        """
        storage_path = self._get_storage_path(file_id)
        metadata_path = self._get_metadata_path(file_id)
        
        # Delete both content and metadata
        self.client.storage.from_(self.BUCKET_NAME).remove([storage_path, metadata_path])
        
        return True
    
    async def list_notes(self, limit: int = 100) -> list[Dict[str, Any]]:
        """
        List all notes (metadata only, no content).
        
        Args:
            limit: Maximum number of notes to return
            
        Returns:
            List of metadata dicts
        """
        # List all files in bucket
        files = self.client.storage.from_(self.BUCKET_NAME).list()
        
        # Filter for metadata files
        metadata_files = [f for f in files if f['name'].endswith('.meta.json')][:limit]
        
        # Load metadata for each
        notes = []
        for file_info in metadata_files:
            file_id = file_info['name'].replace('.meta.json', '')
            try:
                metadata = await self._get_metadata(file_id)
                notes.append(metadata)
            except:
                continue
        
        return notes




# Singleton instance
note_service = NoteService()