from fastapi import FastAPI
from routes.sources import router as source_router

app = FastAPI(
    title= "GraphForge AI"
)

app.include_router(
    source_router,
    prefix ="/sources",
    tags = ["Sources"]
)

@app.get("/")
def root():
    return {
        "project": "GraphForge AI",
        "status": "running"
    }