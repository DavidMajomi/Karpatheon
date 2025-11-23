from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.router import api_router
from app.api.notes import router as notes_router

load_dotenv()

app = FastAPI(
    title="Real MVP API",
    description="Hybrid RAG (Vector + Graph) Platform",
    version="0.1.0"
)

# Include the V1 router
app.include_router(api_router, prefix="/api")

app.include_router(notes_router)


@app.get("/")
def root():
    return {"status": "ok", "system": "online", "app": "Karpathy V1"}

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "online"}
