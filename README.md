<div align="center">

# 🚀 Foundry Lite
### AI-Powered Data Discovery • Relationship Intelligence • Knowledge Graphs

<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi"/>
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql"/>
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/>

### Transform scattered business data into connected intelligence.

*Inspired by modern enterprise data platforms while remaining lightweight, open-source, and developer friendly.*

---

</div>

# ✨ What is Foundry Lite?

**Foundry Lite** is an AI-powered data intelligence platform that enables organizations to upload datasets, automatically understand their structure, discover hidden relationships, build knowledge graphs, analyze data quality, track lineage, and interact with data using AI.

Instead of manually exploring spreadsheets and databases, users can simply upload their data and instantly gain insights through interactive visualizations and intelligent analysis.

---

# 🎯 Core Features

## 📂 Data Upload

- CSV Upload
- Dataset Management
- Source Catalog
- Metadata Extraction

---

## 📊 Data Profiling

Automatically generates

- Dataset Statistics
- Column Information
- Missing Values
- Data Types
- Value Distribution
- Numerical Summaries

---

## 🧹 Data Quality Engine

Analyze your data before using it.

✔ Missing Values

✔ Duplicate Records

✔ Invalid Values

✔ Null Percentage

✔ Completeness Score

✔ Consistency Metrics

---

## 🔍 Relationship Discovery

Automatically identifies relationships between uploaded datasets.

Supports discovery based on

- Common Columns
- Matching Values
- Primary Key Detection
- Foreign Key Detection
- Similar Schema Analysis

Visual relationship graphs help users understand how datasets connect.

---

## 🌐 Knowledge Graph Ready

Designed to progressively convert uploaded datasets into interconnected business knowledge.

Future graph capabilities include

- Entity Linking
- Ontology Generation
- Semantic Search
- Multi-hop Relationships

---

## 📈 Dataset Visualization

Explore datasets through an intuitive dashboard.

- Interactive Charts
- Statistical Cards
- Distribution Graphs
- Dataset Preview
- Table Explorer

---

## 🔄 Data Lineage

Track every transformation performed on a dataset.

View

- Source Dataset
- Operations Applied
- Transformation History
- Processing Flow

---

## 🤖 AI Assistant

Ask questions about uploaded datasets in natural language.

Examples

> Show customers with highest revenue

> Which products are underperforming?

> Find duplicate customer records

> Summarize this dataset

---

# 🏗 Architecture

```text
                 +----------------+
                 |    React UI    |
                 +-------+--------+
                         |
                         |
                 REST APIs
                         |
                 +-------v--------+
                 |    FastAPI     |
                 +-------+--------+
                         |
     --------------------------------------------
     |          |            |                  |
     |          |            |                  |
Data Engine  Profiling   Relationship     AI Context
               Engine      Discovery        Builder
     |          |            |                  |
     --------------------------------------------
                         |
                  PostgreSQL Database
                         |
                  Uploaded CSV Files
```

---

# 🖥 Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

## Frontend

- React
- Vite
- TailwindCSS
- React Router
- TanStack Query
- Cytoscape
- Recharts

## Database

- PostgreSQL

---

# 📁 Project Structure

```text
Foundry-Lite
│
├── backend
│   ├── database
│   ├── models
│   ├── routes
│   ├── services
│   ├── schemas
│   ├── utils
│   └── main.py
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   └── assets
│
├── uploads
├── docker-compose.yml
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone <repository-url>

cd Foundry-Lite
```

---

## Create Virtual Environment

```bash
python -m venv .venv
```

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

---

## Install Backend

```bash
pip install -r requirements.txt
```

---

## Install Frontend

```bash
npm install --prefix frontend
```

---

## Start PostgreSQL

```bash
docker compose up -d
```

---

## Create Tables

```bash
cd backend

python create_tables.py
```

---

# ▶ Run Application

Backend

```bash
python -m uvicorn backend.main:app --reload
```

Frontend

```bash
npm run dev --prefix frontend
```

---

# 🌍 Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

Swagger Docs

```
http://localhost:8000/docs
```

---

# 📡 API Highlights

| Method | Endpoint | Description |
|----------|----------|------------|
| POST | /sources/upload | Upload Dataset |
| GET | /sources | List Datasets |
| GET | /sources/{id} | Dataset Metadata |
| GET | /sources/{id}/preview | Preview Data |
| GET | /sources/{id}/profile | Dataset Profile |
| GET | /sources/{id}/quality-report | Quality Metrics |
| POST | /relationships/discover | Discover Relationships |
| GET | /sources/{id}/lineage | Dataset Lineage |

---

# 🚧 Roadmap

- ✅ CSV Upload
- ✅ Dataset Profiling
- ✅ Quality Reports
- ✅ Relationship Discovery
- ✅ Lineage Tracking
- ✅ AI Dataset Summary

### Upcoming

- Authentication
- Excel Support
- JSON Support
- Parquet Support
- Knowledge Graph Builder
- Ontology Engine
- Graph Database Integration
- Natural Language SQL
- Real-time Data Connectors
- Collaboration Workspace

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# ⭐ Why Foundry Lite?

Unlike traditional BI tools, Foundry Lite focuses on **understanding data**, not just visualizing it.

It combines:

- 📊 Data Profiling
- 🔍 Relationship Discovery
- 🌐 Knowledge Graph Concepts
- 🤖 AI Assistance
- 🔄 Data Lineage
- 📈 Business Intelligence

into one lightweight platform.

---

<div align="center">

# 🌟 If you like this project, consider giving it a Star!

Made with ❤️ using FastAPI + React

</div>
