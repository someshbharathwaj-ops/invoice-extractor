from __future__ import annotations

from io import BytesIO
from pathlib import Path
from unittest import IsolatedAsyncioTestCase, TestCase
from unittest.mock import patch

from starlette.datastructures import Headers, UploadFile

from backend.models.invoice import StoredInvoice
from backend.schemas.invoice import InvoiceRecord
from backend.services.processing_service import processing_service
from backend.services.repository import invoice_repository
from backend.services.storage import file_storage_service
from backend.services.system_service import system_service
from backend.utils.parsing import parse_structured_output


def build_upload(filename: str, content_type: str, payload: bytes) -> UploadFile:
    return UploadFile(file=BytesIO(payload), filename=filename, headers=Headers({"content-type": content_type}))


class UploadValidationTests(IsolatedAsyncioTestCase):
    async def test_upload_rejects_empty_file(self) -> None:
        upload = build_upload("empty.pdf", "application/pdf", b"")

        with self.assertRaisesRegex(Exception, "Uploaded file is empty"):
            await file_storage_service.save_upload(upload)

    async def test_upload_accepts_pdf_extension_when_content_type_is_generic(self) -> None:
        upload = build_upload("invoice.pdf", "application/octet-stream", b"%PDF-1.4 test")
        temp_dir = Path("tests/.tmp_uploads")
        temp_dir.mkdir(parents=True, exist_ok=True)
        original_dir = file_storage_service.settings.uploads_dir
        file_storage_service.settings.uploads_dir = temp_dir
        try:
            _, saved_path, size_bytes = await file_storage_service.save_upload(upload)
        finally:
            saved_path.unlink(missing_ok=True)
            file_storage_service.settings.uploads_dir = original_dir
            temp_dir.rmdir()

        self.assertEqual(size_bytes, len(b"%PDF-1.4 test"))
        self.assertFalse(saved_path.exists())


class ProcessingServiceTests(IsolatedAsyncioTestCase):
    async def test_failed_processing_marks_invoice_failed(self) -> None:
        invoice = StoredInvoice(
            record=InvoiceRecord(id="inv-test-failure", fileName="failure.pdf"),
            file_path="missing.pdf",
            content_type="application/pdf",
            size_bytes=12,
        )
        original_cache = dict(invoice_repository._cache)
        invoice_repository._cache[invoice.record.id] = invoice
        try:
            with patch("backend.services.processing_service.rag_pipeline.run", side_effect=RuntimeError("boom")):
                await processing_service._process_invoice(invoice.record.id, "job-test-failure")
        finally:
            invoice_repository._cache = original_cache
            result_path = Path(invoice_repository._results_dir) / f"{invoice.record.id}.json"
            result_path.unlink(missing_ok=True)

        failed_invoice = invoice
        self.assertEqual(failed_invoice.record.status, "failed")
        self.assertIn("boom", str(failed_invoice.diagnostics.get("error")))
        self.assertEqual(failed_invoice.processing_history[-1].status, "failed")


class SystemServiceTests(TestCase):
    def test_status_includes_invoice_counts(self) -> None:
        original_cache = dict(invoice_repository._cache)
        invoice_repository._cache = {
            "inv-a": StoredInvoice(record=InvoiceRecord(id="inv-a", fileName="a.pdf", status="processed"), file_path="a.pdf", content_type="application/pdf", size_bytes=1),
            "inv-b": StoredInvoice(record=InvoiceRecord(id="inv-b", fileName="b.pdf", status="review"), file_path="b.pdf", content_type="application/pdf", size_bytes=1),
        }
        try:
            status = system_service.get_status()
        finally:
            invoice_repository._cache = original_cache

        self.assertEqual(status["invoices"]["total"], 2)
        self.assertEqual(status["invoices"]["by_status"]["processed"], 1)
        self.assertEqual(status["invoices"]["by_status"]["review"], 1)


class ParsingUtilsTests(TestCase):
    def test_parse_structured_output_includes_due_date(self) -> None:
        payload = """Invoice Number: INV-101
Invoice Date: 2026-03-10
Due Date: 2026-03-25
Vendor Name: ACME Corp
Subtotal: 100.00
Tax: 18.00
Total Amount: 118.00
Payment Terms: Net 15"""

        parsed = parse_structured_output(payload)

        self.assertEqual(parsed["Due Date"], "2026-03-25")
        self.assertEqual(parsed["Payment Terms"], "Net 15")
