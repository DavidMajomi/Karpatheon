#!/bin/bash

# 1. Create Infrastructure Hierarchy
mkdir -p infrastructure/neo4j/{data,plugins,conf,logs}
mkdir -p infrastructure/redis/data

# 2. Create the Docker Compose file in the new location
cat <<EOF > infrastructure/docker-compose.yml
services:
  # --- Knowledge Graph ---
  neo4j:
    image: neo4j:5.15.0
    container_name: mvp_neo4j
    ports:
      - "7474:7474" # HTTP Studio
      - "7687:7687" # Bolt Protocol
    environment:
      - NEO4J_AUTH=\${NEO4J_USER:-neo4j}/\${NEO4J_PASSWORD:-password123}
      - NEO4J_apoc_export_file_enabled=true
      - NEO4J_apoc_import_file_enabled=true
      - NEO4J_PLUGINS=["apoc"]
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*
    volumes:
      - ./neo4j/data:/data
      - ./neo4j/plugins:/plugins
      - ./neo4j/logs:/logs
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider localhost:7474 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # --- Queue & Caching ---
  redis:
    image: redis:alpine
    container_name: mvp_redis
    ports:
      - "6379:6379"
    volumes:
      - ./redis/data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # --- Backend API ---
  backend:
    build:
      context: ../backend  # <--- Looks up one level
      dockerfile: Dockerfile
    container_name: mvp_backend
    volumes:
      - ../backend:/app    # <--- Hot reloading mount
    ports:
      - "8000:8000"
    env_file:
      - ../.env            # <--- Uses root .env
    depends_on:
      neo4j:
        condition: service_healthy
      redis:
        condition: service_healthy
    # Command for development (Hot Reload)
    command: uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  # --- Frontend ---
  # (Uncomment when frontend is ready)
  # frontend:
  #   build:
  #     context: ../frontend
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - ../frontend/src:/app/src
EOF

echo "✅ Infrastructure configured in /infrastructure"