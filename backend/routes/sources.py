from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
import pandas as pd
import os
from database.session import SessionLocal
from models.datasrc import DataSource
from services.schema_detector import detect_schema
from database.session import get_db
from models.datasrc import DataSource

router = APIRouter()

os.makedirs("uploads", exist_ok=True)


@router.post("/upload")
async def upload_source(
    file: UploadFile,
    db: Session = Depends(get_db)
):

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as f:
        f.write(await file.read())

    df = pd.read_csv(filepath)

    schema = detect_schema(df)

    data_source = DataSource(
        filename=file.filename,
        row_count=len(df),
        columns=list(df.columns),
        schema=schema,
        file_path = filepath
    )

    db.add(data_source)
    db.commit()
    db.refresh(data_source)
    db.close()

    return {
        "id": data_source.id,
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "schema": schema,
        "preview": df.head(5).to_dict(
            orient="records"  
        ),
        "filepath": filepath
    }


@router.get("/sources")
def get_sources():

    db = SessionLocal()

    datasets = db.query(DataSource).all()

    result = []

    for dataset in datasets:
        result.append({
            "id": dataset.id,
            "filename": dataset.filename,
            "row_count": dataset.row_count,
            "uploaded_at": dataset.uploaded_at
        })

    db.close()

    return result

@router.get("/{source_id}")
def get_source(source_id: int):
    
    db = SessionLocal()
    
    dataset = (
        db.query(DataSource).filter(DataSource.id == source_id).first()
    )
    
    if not dataset:
        return {"error": "Dataset not found"}
    
    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "columns": dataset.columns,
        "row_count": dataset.row_count,
        "schema": dataset.schema,
        "uploaded_at": dataset.uploaded_at
    }

@router.get("/{source_id}/preview")
def preview_source(source_id: int):
    db = SessionLocal()
    
    dataset = (
        db.query(DataSource).filter(DataSource.id == source_id).first()
    )
    
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}
    
    df = pd.read_csv(dataset.file_path)
    
    preview = df.head(20).to_dict(orient = "records")
    db.close()
    
    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "preview": preview
    }