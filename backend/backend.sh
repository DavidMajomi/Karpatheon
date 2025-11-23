#!/bin/bash

# 1. Create directory structure
mkdir -p app/{core,api,services,db}
cd backend

# 2. Initialize uv and cleanup default
uv init

# 3. Install strictly necessary dependencies
# Core: FastAPI, Uvicorn
# DBs: Supabase, Neo4j
# AI/Data: Langchain (OpenAI), Python-Multipart (Uploads)
uv add fastapi uvicorn python-dotenv python-multipart \
       supabase neo4j \
       langchain-openai langchain-community

# 4. Generate minimal boilerplate files

# Dockerfile (optimized for uv)
cat <<EOF > Dockerfile
FROM python:3.11-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project
COPY . .
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Main Entrypoint
cat <<EOF > app/main.py
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Real MVP Backend")

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "online"}
EOF

# Env Template
cat <<EOF > .env.example
SUPABASE_URL=
SUPABASE_KEY=
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=
OPENAI_API_KEY=
EOF

echo "✅ Backend scaffolded. Run 'cd backend && uv run uvicorn app.main:app --reload' to start."