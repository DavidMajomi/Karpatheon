

```bash


# Core API & Config
uv add pydantic-settings

# Database Clients
# supabase: For User Auth, Files metadata, and Vectors
# neo4j: For the Knowledge Graph
uv add supabase neo4j

# AI & Ingestion Pipeline
# langchain: Orchestration
# langchain-openai: For Synthesis/Chat (GPT-4)
# sentence-transformers: For FREE local embeddings (as per your plan)
# langchain-text-splitters: For Markdown Header Splitting
# tiktoken: For accurate token counting during chunking
uv add langchain langchain-community langchain-openai \
       sentence-transformers langchain-text-splitters tiktoken

# Utilities
# python-multipart: Required for File Upload endpoints
uv add python-multipart
```



# Run infra
``` bash
# 1. Start the databases in the background
docker compose -f infrastructure/docker-compose.yml up -d

# 2. Start the backend locally (Bare Hardware)
# This connects to the Dockerized databases via localhost ports
cd backend
uv run uvicorn app.main:app --reload
```
