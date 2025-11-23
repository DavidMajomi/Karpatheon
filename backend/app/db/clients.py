import os
from supabase import create_client, Client
from neo4j import GraphDatabase, Driver
from typing import Optional

# Singletons for connection management
_supabase: Optional[Client] = None
_neo4j_driver: Optional[Driver] = None

def get_supabase() -> Client:
    """Initializes and returns the singleton Supabase client."""
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            # Raise a value error if credentials are missing. This will fail the /health check gracefully.
            raise ValueError("Supabase credentials (URL/KEY) missing in environment.")
        _supabase = create_client(url, key)
    return _supabase

def get_neo4j() -> Driver:
    """Initializes and returns the singleton Neo4j driver."""
    global _neo4j_driver
    if _neo4j_driver is None:
        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        # Use a sensible, explicit default password in case .env is missed
        pwd = os.getenv("NEO4J_PASSWORD", "password123")
        
        try:
            _neo4j_driver = GraphDatabase.driver(uri, auth=(user, pwd))
            # Verification will happen in the /health endpoint.
        except Exception as e:
            print(f"ERROR: Failed to create Neo4j driver: {e}")
            raise RuntimeError("Could not initialize Neo4j connection driver.") from e
            
    return _neo4j_driver