from __future__ import annotations

import asyncio
import json
import logging
from datetime import UTC, datetime

from backend.core.exceptions import NotFoundError
from backend.rag.pipeline import rag_pipeline
from backend.schemas.invoice import (
    InvoiceRecord,
    ProcessingStatus,
    RAGTrace,
    StartProcessingResponse,
)
from backend.services.event_stream import event_stream_broker
from backend.services.invoice_service import invoice_service
from backend.utils.ids import generate_id
from backend.utils.parsing import extract_currency_number
from backend.workers.queue import QueueJob, job_queue

logger = logging.getLogger(__name__)

STAGE_PROGRESS = {
    "ingest": 15,
    "chunk": 35,
    "retrieve": 60,
    "extract": 85,
    "verify": 100,
}


class ProcessingService:
    async def start_processing(self, invoice_id: str) -> StartProcessingResponse:
        invoice = invoice_service.get_invoice(invoice_id)
        job_id = generate_id("job")
        invoice.record.status = "queued"
        invoice_service.save_invoice(invoice)

        async def runner() -> None:
            await self._process_invoice(invoice_id, job_id)

        await job_queue.enqueue(QueueJob(job_id=job_id, invoice_id=invoice_id, status="queued"), runner)
        return StartProcessingResponse(
            invoice_id=invoice_id,
            job_id=job_id,
            status="queued",
            stage="ingest",
            stream_url=f"/api/v1/invoices/{invoice_id}/stream",
        )

    async def _process_invoice(self, invoice_id: str, job_id: str) -> None:
        invoice = invoice_service.get_invoice(invoice_id)
        try:
            await self._publish_status(invoice_id, job_id, "ingest", "processing", "Document queued for extraction.")
            await asyncio.sleep(0.05)

            result = await asyncio.to_thread(rag_pipeline.run, invoice_id, invoice.file_path)
            parsed = result.parsed_fields

            record = invoice.record.model_copy(
                update={
                    "vendorName": parsed["Vendor Name"],
                    "invoiceNumber": parsed["Invoice Number"],
                    "invoiceDate": parsed["Invoice Date"],
                    "dueDate": parsed["Due Date"],
                    "subtotal": extract_currency_number(parsed["Subtotal"]),
                    "tax": extract_currency_number(parsed["Tax"]),
                    "totalAmount": extract_currency_number(parsed["Total Amount"]),
                    "paymentTerms": parsed["Payment Terms"],
                    "gstNumber": invoice.record.gstNumber,
                    "status": "processed" if result.confidence >= 90 else "review",
                    "confidence": result.confidence,
                    "summary": f"Processed invoice for {parsed['Vendor Name']}.",
                    "extractedAt": datetime.now(UTC),
                    "fields": result.fields,
                    "retrievedChunks": result.retrieved_chunks,
                    "reasoning": result.reasoning,
                }
            )
            invoice.record = InvoiceRecord.model_validate(record)
            invoice.fields = result.fields
            invoice.retrieved_chunks = result.retrieved_chunks
            invoice.reasoning = result.reasoning
            invoice.diagnostics = {"latency_ms": result.latency_ms, "raw_output": result.raw_output}

            for stage in ["chunk", "retrieve", "extract", "verify"]:
                await self._publish_status(invoice_id, job_id, stage, "processing", f"{stage.title()} completed.")
                await asyncio.sleep(0.05)

            invoice.record.status = "processed" if invoice.record.confidence >= 90 else "review"
            invoice_service.save_invoice(invoice)
            await self._publish_status(invoice_id, job_id, "verify", invoice.record.status, "Invoice processing complete.")
        except Exception as error:
            logger.exception("invoice_processing_failed", extra={"invoice_id": invoice_id, "job_id": job_id})
            invoice.record.status = "failed"
            invoice.record.summary = "Processing failed. Review diagnostics and retry."
            invoice.diagnostics = {**invoice.diagnostics, "error": str(error)}
            invoice_service.save_invoice(invoice)
            await self._publish_status(invoice_id, job_id, "verify", "failed", "Invoice processing failed.")

    async def _publish_status(self, invoice_id: str, job_id: str, stage: str, status: str, message: str) -> None:
        payload = ProcessingStatus(
            invoice_id=invoice_id,
            job_id=job_id,
            stage=stage,  # type: ignore[arg-type]
            progress=STAGE_PROGRESS[stage],
            status=status,  # type: ignore[arg-type]
            message=message,
            updated_at=datetime.now(UTC),
        )
        invoice_service.save_processing_status(invoice_id, payload)
        await event_stream_broker.publish(
            invoice_id,
            {
                "event": "processing.update",
                "data": payload.model_dump(mode="json"),
            },
        )

    async def stream(self, invoice_id: str):
        try:
            invoice_service.get_invoice(invoice_id)
        except NotFoundError:
            raise
        async for event in event_stream_broker.subscribe(invoice_id):
            yield f"event: {event['event']}\ndata: {json.dumps(event['data'])}\n\n"

    def get_trace(self, invoice_id: str) -> RAGTrace:
        invoice = invoice_service.get_invoice(invoice_id)
        return RAGTrace(
            invoice_id=invoice_id,
            processing=invoice.processing_history,
            retrieved_chunks=invoice.retrieved_chunks,
            reasoning=invoice.reasoning,
            latency_ms=invoice.diagnostics.get("latency_ms", {}),
            diagnostics=invoice.diagnostics,
        )

    def search_chunks(self, invoice_id: str, query: str, limit: int) -> list[dict[str, object]]:
        invoice = invoice_service.get_invoice(invoice_id)
        chunks = invoice.retrieved_chunks[:limit]
        return [
            {
                "invoice_id": invoice_id,
                "query": query,
                "chunk_id": chunk.id,
                "title": chunk.title,
                "excerpt": chunk.excerpt,
                "score": chunk.score,
                "page": chunk.page,
            }
            for chunk in chunks
        ]


processing_service = ProcessingService()
