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
        schema=schema
    )

    db.add(data_source)
    db.commit()
    db.refresh(data_source)

    return {
        "id": data_source.id,
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "schema": schema,
        "preview": df.head(5).to_dict(
            orient="records"
        )
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