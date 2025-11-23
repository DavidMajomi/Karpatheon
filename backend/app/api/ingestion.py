import uuid
import os
from fastapi import APIRouter, UploadFile, Form
from typing import List, Dict, Any
from app.db.clients import get_supabase, get_neo4j

router = APIRouter()

# --- Changed Imports ---
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI # Use Gemini for Embeddings
from langchain_core.prompts import PromptTemplate

# --- Configuration ---
# Switching to Gemini Embeddings
EMBEDDING_MODEL = "models/embedding-001" 

HEADERS_TO_SPLIT_BY = [
    ("#", "Header1"),
    ("##", "Header2"),
    ("###", "Header3"),
]

class IngestionService:
    def __init__(self):
        self.supabase = get_supabase()
        self.neo4j_driver = get_neo4j()
        # Initialize Gemini Embeddings (Requires GOOGLE_API_KEY in .env)
        self.embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
        self.llm = ChatGoogleGenerativeAI(temperature=0, model="gemini-1.5-flash")

    async def process_file(self, user_id: str, file: UploadFile) -> Dict[str, Any]:
        """
        1. Upload Metadata to Supabase.
        2. Chunk Text.
        3. Embed & Write to Neo4j (Vector Index).
        4. Extract Knowledge Graph.
        """
        file_id = str(uuid.uuid4())

        # 1. Metadata -> Supabase
        self._save_file_metadata(user_id, file.filename, file_id)

        # 2. Text Extraction
        content = await file.read()
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            return {"status": "failed", "message": "Invalid UTF-8 encoding"}

        # 3. Chunking
        chunks = self._chunk_text(text, file_id)
        if not chunks:
            return {"status": "failed", "message": "No text found"}

        # 4. Process Chunks (Embed + Write to Neo4j)
        node_count = await self._ingest_chunks_to_neo4j(chunks, file_id)

        # 5. Extract Graph (Optional/Parallel step)
        graph_count = self._extract_knowledge_graph(chunks, file_id)

        self._update_file_status(file_id, "indexed")

        return {
            "status": "indexed",
            "file_id": file_id,
            "filename": file.filename,
            "chunk_count": len(chunks),
            "graph_nodes_created": graph_count
        }

    async def _ingest_chunks_to_neo4j(self, chunks: List[Dict[str, Any]], file_id: str) -> int:
        """
        Generates embeddings via Gemini and writes (File)-[:CONTAINS]->(Chunk) to Neo4j.
        """
        # Extract plain text for embedding
        texts = [c['content'] for c in chunks]
        
        # Generate Embeddings (API Call)
        try:
            vectors = await self.embeddings.aembed_documents(texts)
        except Exception as e:
            print(f"Embedding failed: {e}")
            raise RuntimeError(f"Gemini Embedding failed: {e}")

        # Write to Neo4j
        cypher = """
        UNWIND $batch AS item
        MERGE (f:File {id: item.file_id})
        MERGE (c:Chunk {id: item.chunk_id})
        SET c.content = item.content,
            c.chunk_index = item.index,
            c.embedding = item.embedding, 
            c.metadata = item.metadata
        MERGE (f)-[:CONTAINS]->(c)
        """

        batch_data = []
        for i, chunk in enumerate(chunks):
            batch_data.append({
                "file_id": file_id,
                "chunk_id": str(uuid.uuid4()),
                "index": i,
                "content": chunk['content'],
                "metadata": str(chunk['metadata']), # Store metadata as string or use apoc.convert.toJson
                "embedding": vectors[i] # List of floats
            })

        with self.neo4j_driver.session() as session:
            session.run(cypher, batch=batch_data)
        
        return len(chunks)

    def _extract_knowledge_graph(self, chunks: List[Dict[str, Any]], file_id: str) -> int:
        """
        Extracts entities and links them to the existing File node.
        """
        # (Same logic as before, simplified for brevity)
        # Using the simplified Prompt approach
        processed = 0
        prompt = PromptTemplate.from_template(
            """Extract technical concepts from: {text}. 
            Output Cypher MERGE statements to link nodes to File ID: {file_id}.
            Use label :Concept and relationship :MENTIONS.
            Ensure node keys are 'name'. 
            Example: MERGE (c:Concept {{name: 'Docker'}}) MERGE (f:File {{id: '...'}}) MERGE (f)-[:MENTIONS]->(c)
            Return ONLY Cypher."""
        )
        
        # For MVP, we process only the first 3 chunks to save tokens/time
        # In prod, you'd use a queue
        with self.neo4j_driver.session() as session:
            for chunk in chunks[:3]: 
                try:
                    fmt = prompt.format(text=chunk['content'][:2000], file_id=file_id)
                    cypher = self.llm.invoke(fmt).content
                    # Clean code block format if LLM adds it
                    cypher = cypher.replace("```cypher", "").replace("```", "")
                    session.run(cypher)
                    processed += 1
                except Exception as e:
                    print(f"Graph extraction error: {e}")
        return processed

    # --- Helpers ---
    def _chunk_text(self, text: str, file_id: str) -> List[Dict[str, Any]]:
        splitter = MarkdownHeaderTextSplitter(headers_to_split_on=HEADERS_TO_SPLIT_BY, strip_headers=True)
        docs = splitter.split_text(text)
        return [{"content": d.page_content, "metadata": d.metadata} for d in docs]

    def _save_file_metadata(self, user_id: str, filename: str, file_id: str):
        self.supabase.table('files').insert({
            "id": file_id, "user_id": user_id, "file_name": filename, 
            "file_path": file_id, "file_type": "md", "status": "processing"
        }).execute()

    def _update_file_status(self, file_id: str, status: str):
        self.supabase.table('files').update({"status": status}).eq('id', file_id).execute()

# --- Router Endpoint ---
@router.post("/upload")
async def upload_file(user_id: str = Form(...), file: UploadFile = Form(...)):
    """
    Upload and process a file for ingestion.
    """
    service = IngestionService()
    result = await service.process_file(user_id, file)
    return result