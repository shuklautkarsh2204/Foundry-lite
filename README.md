
# Foundry Lite (GraphForge AI)

## Overview
Foundry Lite is a lightweight data discovery and transformation backend built with FastAPI. It provides dataset ingestion, schema detection, profiling, data quality reporting, dataset transformations, lineage tracking, and relationship discovery between uploaded CSV datasets.

## Key Features
- Upload CSV datasets and store metadata in PostgreSQL
- Detect column schema and generate dataset profiles
- Produce data quality reports with missing values, duplicates, and empty string counts
- Generate a simple ontology based on dataset column names
- Preview dataset contents and metrics
- Perform dataset transformations: filter, select columns, rename columns, sort, join, and aggregate
- Track lineage for transformed datasets
- Discover relationships between datasets using common columns

## Architecture
- `backend/main.py` - FastAPI application entry point
- `backend/routes/sources.py` - API endpoints for dataset ingestion, discovery, profiling, transformations, and lineage
- `backend/models/datasrc.py` - SQLAlchemy model for uploaded datasets
- `backend/models/lineage.py` - SQLAlchemy model for dataset lineage tracking
- `backend/services/schema_detector.py` - Simple data type inference for CSV columns
- `backend/services/analytics.py` - Profile, quality report, and ontology builder utilities
- `backend/database/connection.py` - PostgreSQL connection configuration
- `backend/database/session.py` - SQLAlchemy session management
- `backend/create_tables.py` - Creates the database tables
- `backend/schemas/transformation.py` - Pydantic request models for transformations and relationship discovery

## Prerequisites
- Python 3.11+ (recommended)
- PostgreSQL 16 or compatible PostgreSQL service
- Docker and Docker Compose (optional, for local database setup)

## Installation
1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start PostgreSQL with Docker Compose:
   ```bash
   docker compose up -d
   ```
4. Create the database tables:
   ```bash
   cd backend
   python create_tables.py
   ```

## Configuration
The backend is currently configured to connect to PostgreSQL at:
- `postgresql://postgres:postgres@localhost:5432/graphforge`

If you need to change the connection, update `backend/database/connection.py`.

## Running the Application
From the repository root:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open the API docs at:
- `http://localhost:8000/docs`

## API Endpoints
### Dataset Management
- `POST /sources/upload` - Upload a CSV dataset
- `GET /sources` - List all uploaded datasets
- `GET /sources/{source_id}` - Get dataset metadata
- `GET /sources/{source_id}/preview` - Preview the first 20 rows

### Analytics
- `GET /sources/{source_id}/profile` - Get dataset profile
- `GET /sources/{source_id}/quality-report` - Get quality report
- `GET /sources/{source_id}/ontology/generate` - Generate ontology details
- `GET /sources/{source_id}/metrics` - Get dataset metrics
- `GET /sources/{source_id}/graph` - Generate a basic graph view for dataset columns
- `GET /sources/{source_id}/ai-context` - Generate AI-friendly dataset context

### Data Transformations
- `POST /sources/{source_id}/filter` - Filter rows by column value
- `POST /sources/{source_id}/select-columns` - Select a subset of columns
- `POST /sources/{source_id}/rename-column` - Rename a dataset column
- `POST /sources/{source_id}/sort` - Sort dataset rows by a column
- `POST /sources/join` - Join two datasets on a shared column
- `POST /sources/{source_id}/aggregate` - Aggregate dataset values by a grouping column

### Lineage and Relationships
- `GET /sources/{source_id}/lineage` - Get lineage history for a dataset
- `POST /sources/relationships/discover` - Discover common column relationships between two datasets

## Example Requests
Upload a dataset:
```bash
curl -X POST "http://localhost:8000/sources/upload" \
  -F "file=@backend/uploads/customers.csv"
```

Get dataset profile:
```bash
curl "http://localhost:8000/sources/1/profile"
```

Discover relationships:
```bash
curl -X POST "http://localhost:8000/sources/relationships/discover" \
  -H "Content-Type: application/json" \
  -d '{"dataset1_id": 1, "dataset2_id": 2}'
```

## Project Notes
- Uploaded data is stored in `backend/uploads`
- The project currently uses PostgreSQL for metadata storage
- The service is designed as a backend API and does not include a frontend UI

## Future Improvements
- Add authentication and authorization
- Support additional file formats (Excel, JSON, Parquet)
- Add asynchronous task processing for large datasets
- Expand lineage visualization and graph database support
- Add end-to-end tests and CI automation



