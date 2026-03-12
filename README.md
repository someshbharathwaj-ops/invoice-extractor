# Invoice Extractor

AI invoice extraction platform with a Next.js frontend and a production-style FastAPI backend built around a modular RAG pipeline.

## Architecture

```text
invoiceparseRAG/
|-- backend/              # FastAPI app, services, schemas, RAG pipeline, workers
|-- frontend/             # Next.js App Router frontend
|-- invoice_extractor.py  # Legacy Streamlit entrypoint
|-- invoice_util.py       # Legacy adapter into the new RAG pipeline
|-- requirements.txt      # Python dependencies
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend includes:

- landing screen with animated hero
- drag-and-drop invoice upload workspace
- AI processing state visualization
- results dashboard with structured fields, JSON, analytics, history, and compare flow
- explainability panel for retrieved chunks and reasoning trace

## Backend

### Run the API

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### API surface

- `POST /api/v1/invoices/upload`
- `POST /api/v1/invoices/{invoice_id}/process`
- `GET /api/v1/invoices/{invoice_id}/stream`
- `GET /api/v1/invoices/{invoice_id}`
- `GET /api/v1/invoices`
- `DELETE /api/v1/invoices/{invoice_id}`
- `GET /api/v1/invoices/{invoice_id}/trace`
- `GET /api/v1/rag/search`
- `GET /api/v1/system/status`

### Backend capabilities

- FastAPI service architecture under `backend/`
- modular RAG pipeline for ingestion, chunking, retrieval, prompting, extraction, and validation
- async processing orchestration with queue abstraction
- structured schemas and typed services
- request tracing, rate limiting, JSON logging, metrics, and OpenTelemetry hooks
- legacy `invoice_util.create_docs()` compatibility through a backend adapter

## Legacy Streamlit Path

The original Streamlit entrypoint still exists for compatibility:

```bash
streamlit run invoice_extractor.py
```

It now routes extraction through the refactored backend RAG pipeline adapter.

## Status

- Frontend and backend are now separated into explicit application layers.
- The frontend currently uses demo state and is ready to be wired to the FastAPI endpoints.
- The backend API, RAG services, and diagnostics surface are implemented in the repository.
