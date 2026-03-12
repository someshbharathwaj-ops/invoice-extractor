from __future__ import annotations

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import StreamingResponse

from backend.core.dependencies import get_invoice_service, get_processing_service
from backend.schemas.common import PaginatedResponse
from backend.schemas.invoice import InvoiceListItem, InvoiceRecord, InvoiceUploadResponse, RAGTrace, StartProcessingResponse

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.post("/upload", response_model=InvoiceUploadResponse)
async def upload_invoices(
    files: list[UploadFile] = File(...),
    service=Depends(get_invoice_service),
):
    uploads = await service.upload_files(files)
    return InvoiceUploadResponse(uploads=uploads)


@router.post("/{invoice_id}/process", response_model=StartProcessingResponse)
async def process_invoice(invoice_id: str, service=Depends(get_processing_service)):
    return await service.start_processing(invoice_id)


@router.get("/{invoice_id}/stream")
async def stream_invoice(invoice_id: str, service=Depends(get_processing_service)):
    async def event_generator():
        async for chunk in service.stream(invoice_id):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/{invoice_id}", response_model=InvoiceRecord)
async def get_invoice(invoice_id: str, service=Depends(get_invoice_service)):
    return service.get_invoice(invoice_id).record


@router.get("", response_model=PaginatedResponse[InvoiceListItem])
async def list_invoices(
    search: str = Query(default=""),
    status: str = Query(default="all"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service=Depends(get_invoice_service),
):
    items = service.list_invoices(search=search, status=status)
    return PaginatedResponse(items=items[offset : offset + limit], total=len(items), limit=limit, offset=offset)


@router.delete("/{invoice_id}")
async def delete_invoice(invoice_id: str, service=Depends(get_invoice_service)):
    service.delete_invoice(invoice_id)
    return {"success": True, "invoice_id": invoice_id}


@router.get("/{invoice_id}/trace", response_model=RAGTrace)
async def get_trace(invoice_id: str, service=Depends(get_processing_service)):
    return service.get_trace(invoice_id)
