from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from fastapi import UploadFile

from backend.models.invoice import StoredInvoice
from backend.schemas.invoice import InvoiceListItem, InvoiceRecord, ProcessingStatus, UploadJob
from backend.services.repository import invoice_repository
from backend.services.storage import file_storage_service
from backend.utils.ids import generate_id


class InvoiceService:
    async def upload_files(self, files: list[UploadFile]) -> list[UploadJob]:
        uploads: list[UploadJob] = []
        for file in files:
            invoice_id, path, size_bytes = await file_storage_service.save_upload(file)
            record = InvoiceRecord(
                id=invoice_id,
                fileName=file.filename or Path(path).name,
                status="uploaded",
                summary="Upload completed. Ready to start extraction.",
            )
            stored = StoredInvoice(
                record=record,
                file_path=str(path),
                content_type=file.content_type or "application/pdf",
                size_bytes=size_bytes,
            )
            invoice_repository.save(stored)
            uploads.append(
                UploadJob(
                    invoice_id=invoice_id,
                    job_id=generate_id("job"),
                    filename=record.fileName,
                    content_type=stored.content_type,
                    size_bytes=size_bytes,
                    status="uploaded",
                    created_at=datetime.now(UTC),
                )
            )
        return uploads

    def list_invoices(self, search: str = "", status: str | None = None) -> list[InvoiceListItem]:
        records = []
        query = search.strip().lower()
        for stored in invoice_repository.list():
            record = stored.record
            if status and status != "all" and record.status != status:
                continue
            if query and not any(query in value.lower() for value in [record.fileName, record.vendorName, record.invoiceNumber, record.gstNumber]):
                continue
            records.append(
                InvoiceListItem(
                    id=record.id,
                    fileName=record.fileName,
                    vendorName=record.vendorName,
                    invoiceNumber=record.invoiceNumber,
                    invoiceDate=record.invoiceDate,
                    totalAmount=record.totalAmount,
                    gstNumber=record.gstNumber,
                    confidence=record.confidence,
                    status=record.status,
                    extractedAt=record.extractedAt,
                )
            )
        return sorted(records, key=lambda item: item.extractedAt or datetime.min, reverse=True)

    def get_invoice(self, invoice_id: str) -> StoredInvoice:
        return invoice_repository.get(invoice_id)

    def save_processing_status(self, invoice_id: str, status: ProcessingStatus) -> StoredInvoice:
        invoice = invoice_repository.get(invoice_id)
        invoice.processing_history.append(status)
        invoice.record.status = status.status
        invoice_repository.save(invoice)
        return invoice

    def save_invoice(self, invoice: StoredInvoice) -> StoredInvoice:
        return invoice_repository.save(invoice)

    def delete_invoice(self, invoice_id: str) -> None:
        invoice_repository.delete(invoice_id)


invoice_service = InvoiceService()
