from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
import pandas as pd
import os
from database.session import SessionLocal
from models.datasrc import DataSource
from services.schema_detector import detect_schema
from database.session import get_db
from models.datasrc import DataSource
from schemas.transformation import FilterRequest, SelectColumnRequest

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

@router.post("/{source_id}/filter")
def filter_dataset(source_id:int, request: FilterRequest):
    db = SessionLocal()
    
    dataset = (db.query(DataSource).filter(DataSource.id == source_id).first())
    
    if not dataset:
        db.close()
        return{"error":"Dataset not found"}
    print("1")
    df = pd.read_csv(dataset.file_path)
    print("2")
    ##!!
    filtered_df = df[
        df[request.column].astype(str) == request.value
    ]

    print("3")
    new_filename = (
        dataset.filename.replace(
            ".csv","_filtered.csv"
        )
    )
    print("4")
    new_filepath = f"uploads/{new_filename}"
    
    filtered_df.to_csv(
    new_filepath,
    index=False
    )
    print("Filter endpoint hit") 
    print(new_filename) 
    print(len(filtered_df)) 
    # Register new dataset
    new_source = DataSource(
        filename=new_filename,
        row_count=len(filtered_df),
        columns=list(filtered_df.columns),
        schema=detect_schema(filtered_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)

    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(filtered_df)
    }

    db.close()

    return result

@router.post("/{source_id}/select-columns")
def select_columns(source_id:int, request: SelectColumnRequest):
    db = SessionLocal()
    
    dataset = (db.query(DataSource).filter(DataSource.id == source_id).first())
    
    if not dataset:
        db.close()
        return{"error":"Dataset not found"}
    
    df = pd.read_csv(dataset.file_path)
    
    selected_df = df[request.columns]

    new_filename = (
        dataset.filename.replace(
            ".csv","_selected.csv"
        )
    )
    
    new_filepath = f"uploads/{new_filename}"
    
    selected_df.to_csv(
    new_filepath,
    index=False
    )
    print("Filter endpoint hit") 
    print(new_filename) 
    print(len(selected_df)) 
    # Register new dataset
    new_source = DataSource(
        filename=new_filename,
        row_count=len(selected_df),
        columns=list(selected_df.columns),
        schema=detect_schema(selected_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)

    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(selected_df)
    }

    db.close()

    return result
