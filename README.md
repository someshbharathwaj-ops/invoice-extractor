# Invoice Extractor RAG

Invoice extraction workspace with a FastAPI backend, a Next.js frontend, and a modular retrieval-first parsing pipeline for PDF invoices.

## What is included

```text
invoiceparseRAG/
|-- backend/              # FastAPI app, services, schemas, queueing, RAG pipeline
|-- frontend/             # Next.js App Router dashboard
|-- tests/                # Backend smoke and regression tests
|-- invoice_extractor.py  # Legacy Streamlit entrypoint
|-- invoice_util.py       # Legacy adapter into the backend pipeline
|-- requirements.txt      # Python dependencies
```

## Highlights

- FastAPI API for upload, processing, trace inspection, search, and system health.
- Retrieval-first invoice pipeline with ingestion, chunking, embeddings, ranking, prompting, extraction, and validation stages.
- Next.js dashboard with upload simulation, analytics, traceability views, and live backend status visibility.
- Compatibility layer for the older Streamlit flow through `invoice_util.create_docs()`.
- Lightweight backend test suite covering upload validation, processing failure handling, parser regressions, and system summaries.

## Quick start

### Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The backend starts on `http://127.0.0.1:8000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://127.0.0.1:3000`.

## Environment

The frontend reads:

- `NEXT_PUBLIC_BACKEND_URL`

Example:

```bash
set NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

If this variable is not set, the frontend assumes `http://127.0.0.1:8000`.

Backend settings are loaded from `.env` with the `INVOICE_` prefix through `backend/config/settings.py`.

## API surface

- `POST /api/v1/invoices/upload`
- `POST /api/v1/invoices/{invoice_id}/process`
- `GET /api/v1/invoices/{invoice_id}/stream`
- `GET /api/v1/invoices/{invoice_id}`
- `GET /api/v1/invoices`
- `DELETE /api/v1/invoices/{invoice_id}`
- `GET /api/v1/invoices/{invoice_id}/trace`
- `GET /api/v1/rag/search`
- `GET /api/v1/system/status`

## Frontend behavior

- Upload validation now matches backend rules for PDF-only files up to 20 MB each.
- The home page includes a live backend status panel.
- `GET /api/health` on the frontend now includes backend reachability details for deployment checks.
- The standalone typecheck config keeps `npm run typecheck` working even before `.next` build artifacts exist.

## Validation

Run these from the project root unless noted:

```bash
python -m unittest discover -s tests -v
```

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

## Notes on extraction

- The parser now distinguishes `Due Date` from `Payment Terms`.
- Upload storage creates missing target directories automatically.
- The current frontend still uses demo invoice records for the dashboard tables while exposing live backend health information.

## Legacy Streamlit path

The original Streamlit entrypoint is still available:

```bash
streamlit run invoice_extractor.py
```

It routes extraction through the refactored backend adapter path.
