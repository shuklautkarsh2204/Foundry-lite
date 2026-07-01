from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
import pandas as pd
import os
from database.session import SessionLocal
from models.datasrc import DataSource
from services.schema_detector import detect_schema
from services.analytics import build_profile, build_quality_report, build_ontology
from database.session import get_db
from schemas.transformation import FilterRequest, SelectColumnRequest, RenameColumnRequest, SortRequest, JoinRequest, AggregateRequest, RelationshipRequest
from models.lineage import DatasetLineage

router = APIRouter()

os.makedirs("uploads", exist_ok=True)


def _get_dataset_or_error(db: Session, source_id: int):
    dataset = db.query(DataSource).filter(DataSource.id == source_id).first()
    if not dataset:
        return None
    return dataset


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


@router.get("")
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

@router.get("/{source_id}/profile")
def get_source_profile(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    profile = build_profile(df)
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "profile": profile,
    }


@router.get("/{source_id}/quality-report")
def get_quality_report(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    report = build_quality_report(df)
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "quality_report": report,
    }


@router.post("/{source_id}/ontology/generate")
def generate_ontology(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    ontology = build_ontology(df, dataset.filename)
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "ontology": ontology,
    }


@router.get("/{source_id}/metrics")
def get_metrics(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    quality = build_quality_report(df)
    profile = build_profile(df)
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "row_count": len(df),
        "column_count": len(df.columns),
        "null_total": quality["missing_value_count"],
        "duplicate_rows": quality["duplicate_rows"],
        "profile": profile,
    }


@router.get("/{source_id}/graph")
def get_graph(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    nodes = [{"id": column, "label": column, "type": "column"} for column in df.columns]
    edges = []
    for idx in range(min(3, len(df.columns))):
        source_col = df.columns[idx]
        if idx + 1 < len(df.columns):
            target_col = df.columns[idx + 1]
            edges.append({"source": source_col, "target": target_col, "type": "sequence"})
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "nodes": nodes,
        "edges": edges,
    }


@router.get("/{source_id}/ai-context")
def get_ai_context(source_id: int):
    db = SessionLocal()
    dataset = _get_dataset_or_error(db, source_id)
    if not dataset:
        db.close()
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset.file_path)
    profile = build_profile(df)
    ontology = build_ontology(df, dataset.filename)
    db.close()
    return {
        "dataset_id": dataset.id,
        "filename": dataset.filename,
        "context": {
            "row_count": len(df),
            "columns": list(df.columns),
            "profile": profile,
            "ontology": ontology,
        },
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
    
    lineage = DatasetLineage(
        parent_dataset_id = dataset.id,
        child_dataset_id = new_source.id,
        operation = "filter"
    )
    db.add(lineage)
    db.commit()
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

    lineage = DatasetLineage(
        parent_dataset_id = dataset.id,
        child_dataset_id = new_source.id,
        operation = "select"
    )
    db.add(lineage)
    db.commit()

    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(selected_df)
    }

    db.close()

    return result

@router.post("/{source_id}/rename-column")
def rename_column(
    source_id: int,
    request: RenameColumnRequest
):
    db = SessionLocal()
    
    dataset = (
        db.query(DataSource)
        .filter(DataSource.id == source_id)
        .first()
    )
    
    if not dataset:
        db.close()
        return{
            "error":"Dataset not found"
        }
    
    df = pd.read_csv(dataset.file_path)
    
    if request.old_column not in df.columns:
        db.close()
        return {
            "error":f"Column '{request.old_column}' not found"
        }
    renamed_df = df.rename(
        columns = {
            request.old_column: request.new_column
        }
    )
    new_filename = dataset.filename.replace(".csv","_renamed.csv")
    new_filepath = f"uploads/{new_filename}"
    renamed_df.to_csv(new_filepath,index=False)    
    new_source = DataSource(
        filename=new_filename,
        row_count=len(renamed_df),
        columns=list(renamed_df.columns),
        schema=detect_schema(renamed_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)
    
    lineage = DatasetLineage(
        parent_dataset_id = dataset.id,
        child_dataset_id = new_source.id,
        operation = "rename"
    )
    db.add(lineage)
    db.commit()
    
    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(renamed_df)
    }

    db.close()

    return result

@router.post("/{source_id}/sort")
def sort_dataset(
    source_id:int,
    request: SortRequest
):
    db = SessionLocal()
    dataset = (
    db.query(DataSource)
    .filter(DataSource.id == source_id)
    .first()
)

    if not dataset:
        db.close()
        return{
            "error":"Dataset not found"
        }

    df = pd.read_csv(dataset.file_path)

    if request.column not in df.columns:
        db.close()
        return {
            "error":f"Column '{request.column}' not found"
        }
    
    sorted_df = df.sort_values(
        by= request.column,
        ascending = request.ascending
    )
    new_filename = dataset.filename.replace(".csv","_sorted.csv")
    new_filepath = f"uploads/{new_filename}"
    sorted_df.to_csv(new_filepath,index=False)    
    new_source = DataSource(
        filename=new_filename,
        row_count=len(sorted_df),
        columns=list(sorted_df.columns),
        schema=detect_schema(sorted_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)
    
    lineage = DatasetLineage(
        parent_dataset_id = dataset.id,
        child_dataset_id = new_source.id,
        operation = "rename"
    )
    db.add(lineage)
    db.commit()
    
    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(sorted_df)
    }

    db.close()

    return result

@router.post("/join")
def join_datasets(request: JoinRequest):
    
    db = SessionLocal()
    
    left_dataset = (
        db.query(DataSource).
        filter(DataSource.id == request.left_dataset_id).
        first()
    )

    right_dataset = (
        db.query(DataSource).
        filter(DataSource.id == request.right_dataset_id).
        first()
    )
    
    if not left_dataset or not right_dataset:
        db.close()
        return{
            "ERROR": "One or both datasets not found"
        }
        
    left_df = pd.read_csv(left_dataset.file_path)
    right_df = pd.read_csv(right_dataset.file_path)
    
    if request.join_column not in left_df.columns:
        db.close()
        return {
            "error":f"column '{request.join_column}' not found in left dataset"
        }
    if request.join_column not in right_df.columns:
        db.close()
        return {
            "error":f"column '{request.join_column}' not found in left dataset"
        }
  
    joined_df = pd.merge(
        left_df,
        right_df,
        on = request.join_column
    )
    
    new_filename = (
        f"join_{request.left_dataset_id}_{request.right_dataset_id}.csv"
    )
    
    new_filepath = f"uploads/{new_filename}"
    
    joined_df.to_csv(
        new_filepath,
        index = False
    )
    
    new_source = DataSource(
        filename=new_filename,
        row_count=len(joined_df),
        columns=list(joined_df.columns),
        schema=detect_schema(joined_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)
    
    lineage1 = DatasetLineage(
        parent_dataset_id = left_dataset.id,
        child_dataset_id = new_source.id,
        operation = "join"
    )
    lineage2 = DatasetLineage(
        parent_dataset_id = right_dataset.id,
        child_dataset_id = new_source.id,
        operation = "join"
    )
    db.add(lineage1)
    db.add(lineage2)
    db.commit()
    
    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(joined_df)
    }   
    db.close()
    return result

@router.post("/{source_id}/aggregate")
def aggregate_dataset(
    source_id: int,
    request: AggregateRequest
):
    db = SessionLocal()
    
    dataset = (
        db.query(DataSource).
        filter(DataSource.id == source_id).
        first()
    )
    
    if not dataset:
        db.close()
        return {
            "error": "Dataset not exist"
        }
    df = pd.read_csv(dataset.file_path)
    if request.group_by not in df.columns:
        db.close()
        return {"error": "Group column not found"} 
    if request.target_column not in df.columns:
        db.close()
        return {"error": "Target Column not found"}
    
    if request.operation == "sum":
        result_df = (
            df.groupby(request.group_by)[request.target_column].sum().reset_index()
        )   
    elif request.operation == "mean":
        result_df = (
            df.groupby(request.group_by)[request.target_column].mean().reset_index()
        )
    elif request.operation == "max":
        result_df = (
            df.groupby(request.group_by)[request.target_column].max().reset_index()
        )
    elif request.operation == "min":
         result_df = (
            df.groupby(request.group_by)[request.target_column].min().reset_index()
        )
    elif request.operation == "count":
        result_df = (
        df.groupby(request.group_by)[request.target_column]
        .count()
        .reset_index()
    )     
    else:
        db.close()
        return {
            "error": "Unsupported operation"
        }
    new_filename = (
        dataset.filename.replace(".csv", "_aggregated.csv")
    )
    
    new_filepath = f"uploads/{new_filename}"
    
    result_df.to_csv(
        new_filepath,
        index = False
    )
    
    new_source = DataSource(
        filename=new_filename,
        row_count=len(result_df),
        columns=list(result_df.columns),
        schema=detect_schema(result_df),
        file_path=new_filepath
    )

    db.add(new_source)
    db.commit()
    db.refresh(new_source)
    
    lineage = DatasetLineage(
        parent_dataset_id = dataset.id,
        child_dataset_id = new_source.id,
        operation = "aggregate"
    )
    db.add(lineage)
    db.commit()
    
    result = {
        "new_dataset_id": new_source.id,
        "filename": new_filename,
        "rows": len(result_df)
    }   
    db.close()
    return result  

@router.get("/{source_id}/lineage")
def get_lineage(source_id: int):
    
    db = SessionLocal()
    
    lineage_records = (
        db.query(DatasetLineage).
        filter(
            DatasetLineage.child_dataset_id == source_id
        ).all()
    )
    
    result = []
    
    for record in lineage_records:
        result.append({
            "parent_dataset_id": record.parent_dataset_id,
            "child_dataset_id": record.child_dataset_id,
            "operation": record.operation
        })       
     
    db.close()
    
    return {
        "dataset_id": source_id,
        "history": result
    } 

@router.post("/relationships/discover")
def relationship_discovery(request: RelationshipRequest):
    db = SessionLocal()
    dataset_1 = (
        db.query(DataSource).
        filter(DataSource.id == request.dataset1_id).
        first()
    )
    dataset_2 = (
        db.query(DataSource).
        filter(DataSource.id == request.dataset2_id).
        first()
    )
    if not dataset_1 or not dataset_2:
        db.close()
        return {
            "error": "either dataset 1 or dataset 2 not exists."
        }
    df1 = pd.read_csv(dataset_1.file_path)
    df2 = pd.read_csv(dataset_2.file_path)
    
    common_columns = (
        set(df1.columns) & set(df2.columns)
    )
    
    if not common_columns:
        db.close()
        return {
            "error": "No common columns found"
        }
    relationships = []
    
    for column in common_columns:
        values1 = set(df1[column].astype(str))    
        values2 = set(df2[column].astype(str))    
        intersection = values1 & values2 
        matching_pct = (len(intersection) / min(len(values1), len(values2)))*100
        relationships.append({
            "column": column,
            "matching_%": round(matching_pct, 2)
        })   
    relationships.sort(
        key = lambda x: x["matching_%"],
        reverse= True
    )
    
    db.close()   
    return {
        "dataset1": dataset_1.filename,
        "dataset2": dataset_2.filename,
        "relationships": relationships
    } 