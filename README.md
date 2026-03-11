# Invoice Extractor

Invoice extraction workspace with a Python RAG pipeline and a separate production-style Next.js frontend.

## Repository layout

```text
invoiceparseRAG/
|-- frontend/              # Next.js SaaS frontend
|-- invoice_extractor.py   # Legacy Streamlit entrypoint kept untouched
|-- invoice_util.py        # Existing extraction logic kept untouched
|-- requirements.txt       # Python dependencies
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
- processing state visualization
- results dashboard with tables, JSON, analytics, filters, history, and compare flow
- explainability panel for retrieved chunks and reasoning trace

## Backend

Existing Python extraction files remain unchanged in this refactor.

## Status

The frontend is rebuilt as a standalone product surface. The current UI uses demo data and simulated processing until a dedicated API contract is added between the Next.js app and the Python extraction pipeline.
