
# Foundry Lite

Foundry Lite is a lightweight data discovery and analytics platform with a FastAPI backend and a React-based frontend. It lets you upload CSV datasets, inspect profiles and quality metrics, trace lineage, discover relationships, and explore data with AI-assisted workflows through a modern web UI.

## What’s included
- A polished landing page and dashboard for quick navigation
- Dataset upload and source management
- Dataset detail views for preview, schema, statistics, quality, transformations, lineage, relationships, ontology, and AI summaries
- Relationship discovery between datasets
- An AI-oriented experience for asking questions about uploaded data

## Tech stack
- Backend: FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- Frontend: React, Vite, Tailwind CSS, React Router, TanStack Query, Recharts, Cytoscape

## Project structure
- backend/ - API server, database models, routes, services, and schema logic
- frontend/ - Vite + React application with pages for dashboard, uploads, datasets, relationships, and AI workflows
- docker-compose.yml - PostgreSQL service for local development

## Prerequisites
- Python 3.11+
- Node.js 18+
- Docker and Docker Compose (for the local PostgreSQL service)

## Setup
1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```
4. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
5. Create the database tables:
   ```bash
   cd backend
   python create_tables.py
   ```

## Configuration
The backend connects to PostgreSQL using:
- postgresql://postgres:postgres@localhost:5432/graphforge

If needed, update the connection settings in backend/database/connection.py.

## Running locally
Start the backend from the repository root:
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Start the frontend in a second terminal:
```bash
npm run dev --prefix frontend
```

Open the app at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Useful scripts
From the repository root:
```bash
npm run dev              # starts the frontend via Vite
npm run dev:backend      # starts the FastAPI backend
npm run build            # builds the frontend for production
npm run install:all      # installs frontend dependencies
```

## API highlights
- POST /sources/upload - Upload a CSV dataset
- GET /sources - List uploaded datasets
- GET /sources/{source_id} - Retrieve dataset metadata
- GET /sources/{source_id}/preview - Preview rows
- GET /sources/{source_id}/profile - View dataset profile
- GET /sources/{source_id}/quality-report - View data quality statistics
- POST /sources/{source_id}/filter - Filter rows
- POST /sources/{source_id}/select-columns - Select a subset of columns
- POST /sources/{source_id}/aggregate - Aggregate values
- GET /sources/{source_id}/lineage - Retrieve lineage history
- POST /relationships/discover - Discover relationships between datasets

## Notes
- Uploaded files are stored in the uploads directory for local development.
- The frontend communicates with the backend through the Vite proxy configured in frontend/vite.config.js.

## Roadmap
- Add authentication and authorization
- Support more file formats such as Excel, JSON, and Parquet
- Improve AI-driven analysis and visualization
- Expand lineage and graph experiences
- Add automated tests and CI coverage



