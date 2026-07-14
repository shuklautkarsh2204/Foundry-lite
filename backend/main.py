from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.base import Base
from backend.database.connection import engine
from backend.routes.sources import router as source_router, relationship_discovery

app = FastAPI(title="GraphForge AI")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(source_router, prefix="/sources", tags=["Sources"])
app.post("/relationships/discover")(relationship_discovery)

@app.get("/")
def root():
    return {
        "project": "GraphForge AI",
        "status": "running"
    }