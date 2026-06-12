from fastapi import APIRouter, UploadFile
import pandas as pd
import os
from services.schema_detector import detect_schema

router = APIRouter()

sources = []


os.makedirs("uploads", exist_ok=True)

@router.post("/upload")
async def upload_source(file: UploadFile):
    
    filepath = f"uploads/{file.filename}"
    
    with open(filepath, "wb") as f:
        f.write(await file.read())
    
    df = pd.read_csv(filepath)
    
    schema = detect_schema(df)
    
    source = {
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns)
    }
    
    sources.append(source)
    
    return {
        **source,
        "preview":df.head(5).to_dict(
            orient="records"
        )
    }

@router.get("/sources")
def get_sources():
    return sources