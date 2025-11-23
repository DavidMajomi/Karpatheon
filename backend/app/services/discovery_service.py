import os
import json
import hashlib
from typing import List, Dict, Any
from datetime import datetime
from exa_py import Exa
from app.db.clients import get_neo4j
from app.schemas.discovery import InterestPayload, IngestResponse, DiscoveryResponse, DiscoveryItem
import numpy as np


class DiscoveryService:
    """Service for intelligent content discovery using Exa and Neo4j."""
    
    def __init__(self):
        self.exa = Exa(api_key=os.getenv("EXA_API_KEY"))
        self.neo4j = get_neo4j()
        self.storage_path = "data/discoveries"
        self.crawled_urls_path = "data/crawled_urls.json"
        
        # Configure embedding provider
        self.embedding_provider = os.getenv("EMBEDDING_PROVIDER", "local").lower()
        
        if self.embedding_provider == "google":
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
            self.embedding_dimension = 768
            print("✅ Using Google Gemini embeddings")
        else:  # local/BGE
            from sentence_transformers import SentenceTransformer
            self.embeddings = SentenceTransformer('BAAI/bge-base-en-v1.5')
            self.embedding_dimension = 768
            print("✅ Using local BGE embeddings (BAAI/bge-base-en-v1.5)")
        
        # Ensure storage directories exist
        os.makedirs(self.storage_path, exist_ok=True)
        os.makedirs(os.path.dirname(self.crawled_urls_path), exist_ok=True)
        
        # Initialize crawled URLs file if it doesn't exist
        if not os.path.exists(self.crawled_urls_path):
            with open(self.crawled_urls_path, 'w') as f:
                json.dump({"urls": {}}, f)
    
    async def compute_embedding(self, text: str) -> List[float]:
        """Compute embedding for text using configured embedding provider.
        
        Supports both Google Gemini (async) and local BGE (sync) embeddings.
        Falls back to deterministic mock embeddings if quota is exceeded.
        """
        try:
            if self.embedding_provider == "google":
                # Google embeddings are async
                embedding = await self.embeddings.aembed_query(text)
                return embedding
            else:
                # Local embeddings are sync, convert to list
                embedding = self.embeddings.encode(text, convert_to_numpy=False)
                return embedding.tolist() if hasattr(embedding, 'tolist') else list(embedding)
        except Exception as e:
            error_msg = str(e).lower()
            # Only use fallback for quota/rate limit errors
            if 'quota' in error_msg or 'rate limit' in error_msg or '429' in error_msg:
                print(f"⚠️  API quota exceeded, using mock embeddings for: {text[:50]}...")
                # Generate deterministic mock embedding based on text hash
                import random
                text_hash = int(hashlib.md5(text.encode()).hexdigest(), 16)
                random.seed(text_hash)
                # Generate 768-dimensional mock embedding
                return [random.random() for _ in range(768)]
            else:
                # Re-raise other exceptions for proper error handling
                raise
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Compute cosine similarity between two vectors."""
        vec1_np = np.array(vec1)
        vec2_np = np.array(vec2)
        return float(np.dot(vec1_np, vec2_np) / (np.linalg.norm(vec1_np) * np.linalg.norm(vec2_np)))
    
    async def search_similar_content(self, seed_url: str, k: int) -> List[str]:
        """Use Exa to find similar content."""
        try:
            result = self.exa.find_similar(
                url=seed_url,
                num_results=k
            )
            return [r.url for r in result.results]
        except Exception as e:
            print(f"Error searching similar content: {e}")
            return []
    
    async def retrieve_content(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Retrieve full content from URLs using Exa."""
        if not urls:
            return []
        
        try:
            contents = self.exa.get_contents(urls)
            return [
                {
                    'url': c.url,
                    'title': c.title or "Untitled",
                    'content': c.text or "",
                    'snippet': (c.text or "")[:500]
                }
                for c in contents.results
                if c.text  # Only include results with content
            ]
        except Exception as e:
            print(f"Error retrieving content: {e}")
            return []
    
    async def compute_kb_similarity(self, embedding: List[float]) -> float:
        """Query Neo4j vector index for similarity to knowledge base."""
        try:
            query = """
            CALL db.index.vector.queryNodes('chunk_vector', 5, $embedding)
            YIELD node, score
            RETURN avg(score) as avg_similarity
            """
            result = self.neo4j.execute_query(query, embedding=embedding)
            if result and len(result[0]) > 0:
                return float(result[0][0]['avg_similarity'])
            return 0.0
        except Exception as e:
            print(f"Error computing KB similarity: {e}")
            # Return a default similarity if Neo4j query fails
            return 0.5
    
    def load_crawled_urls(self) -> Dict:
        """Load crawled URLs tracker."""
        try:
            with open(self.crawled_urls_path, 'r') as f:
                return json.load(f)
        except Exception:
            return {"urls": {}}
    
    def update_crawled_urls(self, urls: List[str]):
        """Update crawled URLs tracker."""
        crawled = self.load_crawled_urls()
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        for url in urls:
            if url in crawled['urls']:
                crawled['urls'][url]['last_crawled'] = timestamp
                crawled['urls'][url]['crawl_count'] += 1
            else:
                crawled['urls'][url] = {
                    'first_crawled': timestamp,
                    'last_crawled': timestamp,
                    'crawl_count': 1
                }
        
        with open(self.crawled_urls_path, 'w') as f:
            json.dump(crawled, f, indent=2)
    
    def filter_crawled_urls(self, urls: List[str]) -> List[str]:
        """Filter out already crawled URLs."""
        crawled = self.load_crawled_urls()
        return [url for url in urls if url not in crawled['urls']]
    
    async def store_discoveries(
        self, 
        user_id: str, 
        payload: InterestPayload, 
        discoveries: List[Dict], 
        interest_embedding: List[float]
    ) -> str:
        """Store discoveries in JSON file."""
        # Create user directory
        user_path = os.path.join(self.storage_path, user_id)
        os.makedirs(user_path, exist_ok=True)
        
        # Generate filename
        url_hash = hashlib.md5(payload.url.encode()).hexdigest()[:8]
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{url_hash}.json"
        filepath = os.path.join(user_path, filename)
        
        # Compute interest similarity to KB
        interest_kb_sim = await self.compute_kb_similarity(interest_embedding)
        
        # Prepare data
        data = {
            "interest": {
                "url": payload.url,
                "title": payload.title,
                "timestamp": payload.timestamp,
                "content": payload.content.dict(),
                "embedding": interest_embedding,
                "similarity_to_kb": interest_kb_sim
            },
            "discoveries": discoveries,
            "metadata": {
                "total_crawled": len(discoveries),
                "avg_similarity": sum(d['similarity_to_kb'] for d in discoveries) / len(discoveries) if discoveries else 0,
                "crawl_duration_ms": 0  # Can be tracked if needed
            }
        }
        
        # Write to file
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filepath
    
    async def load_discoveries(
        self, 
        user_id: str, 
        min_similarity: float, 
        limit: int
    ) -> DiscoveryResponse:
        """Load and filter discoveries from JSON storage."""
        user_path = os.path.join(self.storage_path, user_id)
        
        if not os.path.exists(user_path):
            return DiscoveryResponse(
                discoveries=[],
                total_available=0,
                filtered_count=0,
                min_similarity_used=min_similarity
            )
        
        all_discoveries = []
        
        # Load all JSON files
        for filename in os.listdir(user_path):
            if filename.endswith('.json'):
                filepath = os.path.join(user_path, filename)
                try:
                    with open(filepath, 'r') as f:
                        data = json.load(f)
                        for disc in data.get('discoveries', []):
                            disc['source_interest_url'] = data['interest']['url']
                            all_discoveries.append(disc)
                except Exception as e:
                    print(f"Error loading {filepath}: {e}")
                    continue
        
        # Filter by similarity
        filtered = [d for d in all_discoveries if d.get('similarity_to_kb', 0) >= min_similarity]
        
        # Sort and limit
        sorted_discoveries = sorted(filtered, key=lambda x: x.get('similarity_to_kb', 0), reverse=True)
        top_discoveries = sorted_discoveries[:limit]
        
        # Convert to DiscoveryItem models
        discovery_items = [
            DiscoveryItem(
                url=d['url'],
                title=d['title'],
                snippet=d['snippet'],
                similarity_to_kb=d['similarity_to_kb'],
                similarity_to_interest=d.get('similarity_to_interest', 0),
                source_interest_url=d['source_interest_url'],
                crawled_at=d.get('crawled_at', '')
            )
            for d in top_discoveries
        ]
        
        return DiscoveryResponse(
            discoveries=discovery_items,
            total_available=len(all_discoveries),
            filtered_count=len(filtered),
            min_similarity_used=min_similarity
        )
    
    async def ingest_interest(self, user_id: str, payload: InterestPayload) -> IngestResponse:
        """Main ingestion flow."""
        start_time = datetime.utcnow()
        
        # 1. Compute embedding for interest
        interest_embedding = await self.compute_embedding(payload.content.textContent)
        
        # 2. Search for k=20 similar with Exa
        candidates = await self.search_similar_content(payload.url, k=20)
        
        # 3. Filter already crawled URLs
        candidates = self.filter_crawled_urls(candidates)
        
        # 4. Retrieve full content
        full_content = await self.retrieve_content(candidates)
        
        # 5. Compute embeddings for all
        for item in full_content:
            item['embedding'] = await self.compute_embedding(item['content'])
        
        # 6. Query Neo4j for similarity to knowledge base
        for item in full_content:
            item['similarity_to_kb'] = await self.compute_kb_similarity(item['embedding'])
            item['similarity_to_interest'] = self.cosine_similarity(
                item['embedding'], 
                interest_embedding
            )
            item['crawled_at'] = datetime.utcnow().isoformat() + "Z"
        
        # 7. Rank by similarity to KB
        ranked = sorted(full_content, key=lambda x: x['similarity_to_kb'], reverse=True)
        
        # 8. Store in JSON
        storage_path = await self.store_discoveries(user_id, payload, ranked, interest_embedding)
        
        # 9. Update crawled URLs tracker
        self.update_crawled_urls([item['url'] for item in ranked])
        
        return IngestResponse(
            status="success",
            interest_url=payload.url,
            crawled_count=len(ranked),
            stored_path=storage_path,
            top_similarity_score=ranked[0]['similarity_to_kb'] if ranked else 0.0
        )
