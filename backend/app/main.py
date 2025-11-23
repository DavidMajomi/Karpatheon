from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.router import api_router

load_dotenv()

app = FastAPI(
    title="Real MVP API",
    description="Hybrid RAG (Vector + Graph) Platform",
    version="0.1.0"
)

# CORS Configuration - Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the V1 router (includes notes router via router.py)
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "system": "online", "app": "Karpathy V1"}

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "online"}
