# Frontend Backend Contract Map

## Primary User Journeys

### 1. Upload invoices

- Frontend source: `frontend/components/upload/upload-zone.tsx`
- Backend contract:
  - `POST /api/v1/invoices/upload`
  - Accept multipart PDF uploads
  - Return upload job records with invoice ids, file metadata, and initial processing state

### 2. Start extraction pipeline

- Frontend source: `frontend/store/use-invoice-store.ts`
- Backend contract:
  - `POST /api/v1/invoices/{invoice_id}/process`
  - Trigger async processing
  - Return job id, stage, queue status, and stream channel

### 3. Track live processing state

- Frontend source: `frontend/components/upload/processing-panel.tsx`
- Backend contract:
  - `GET /api/v1/invoices/{invoice_id}/stream`
  - Server-sent event stream with stage updates:
    - `ingest`
    - `chunk`
    - `retrieve`
    - `extract`
    - `verify`

### 4. View invoice list and search/filter

- Frontend source: `frontend/components/dashboard/results-table.tsx`
- Backend contract:
  - `GET /api/v1/invoices?search=&status=&limit=&offset=`
  - Return paginated invoice summaries compatible with:
    - vendor
    - invoice number
    - invoice date
    - total
    - confidence
    - status

### 5. View invoice detail and export-ready JSON

- Frontend source: `frontend/components/dashboard/json-viewer.tsx`
- Backend contract:
  - `GET /api/v1/invoices/{invoice_id}`
  - Return canonical structured invoice payload

### 6. View explainability trace

- Frontend source: `frontend/components/dashboard/explainability-panel.tsx`
- Backend contract:
  - `GET /api/v1/invoices/{invoice_id}/trace`
  - Return retrieved chunks, reasoning steps, stage timings, and validation notes

### 7. Inspect retrieval debug

- Frontend source: explainability and search controls
- Backend contract:
  - `GET /api/v1/rag/search?query=&invoice_id=&k=`
  - Return retrieval results with score and chunk metadata

### 8. View system health

- Frontend source: app health and diagnostics expectations
- Backend contract:
  - `GET /api/v1/system/status`
  - Return readiness, queue health, storage health, and metrics summary

### 9. Delete invoice

- Frontend source: future history management
- Backend contract:
  - `DELETE /api/v1/invoices/{invoice_id}`
  - Remove file, result, and trace

## Frontend Data Contracts

### Invoice record

- `id`
- `fileName`
- `vendorName`
- `invoiceNumber`
- `invoiceDate`
- `dueDate`
- `subtotal`
- `tax`
- `totalAmount`
- `currency`
- `paymentTerms`
- `gstNumber`
- `status`
- `confidence`
- `summary`
- `extractedAt`
- `fields[]`
- `retrievedChunks[]`
- `reasoning[]`

### Stream events

- `event`: stage update, job status, result ready, error
- `data`:
  - `invoice_id`
  - `job_id`
  - `stage`
  - `progress`
  - `status`
  - `message`
  - `timestamp`
