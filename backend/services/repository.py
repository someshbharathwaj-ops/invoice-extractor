from __future__ import annotations

import json
from pathlib import Path

from backend.config.settings import get_settings
from backend.core.exceptions import NotFoundError
from backend.models.invoice import StoredInvoice
from backend.schemas.invoice import InvoiceRecord


class InvoiceRepository:
    def __init__(self) -> None:
        settings = get_settings()
        self._results_dir = settings.results_dir
        self._cache: dict[str, StoredInvoice] = {}

    def list(self) -> list[StoredInvoice]:
        for path in self._results_dir.glob("*.json"):
            if path.stem not in self._cache:
                self._cache[path.stem] = self._load(path)
        return list(self._cache.values())

    def get(self, invoice_id: str) -> StoredInvoice:
        if invoice_id in self._cache:
            return self._cache[invoice_id]
        path = self._results_dir / f"{invoice_id}.json"
        if not path.exists():
            raise NotFoundError(f"Invoice '{invoice_id}' not found")
        self._cache[invoice_id] = self._load(path)
        return self._cache[invoice_id]

    def save(self, invoice: StoredInvoice) -> StoredInvoice:
        self._cache[invoice.record.id] = invoice
        path = self._results_dir / f"{invoice.record.id}.json"
        payload = {
            "record": invoice.record.model_dump(mode="json"),
            "file_path": invoice.file_path,
            "content_type": invoice.content_type,
            "size_bytes": invoice.size_bytes,
            "created_at": invoice.created_at.isoformat(),
            "processing_history": [item.model_dump(mode="json") for item in invoice.processing_history],
            "retrieved_chunks": [item.model_dump(mode="json") for item in invoice.retrieved_chunks],
            "reasoning": [item.model_dump(mode="json") for item in invoice.reasoning],
            "fields": [item.model_dump(mode="json") for item in invoice.fields],
            "diagnostics": invoice.diagnostics,
        }
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        return invoice

    def delete(self, invoice_id: str) -> None:
        invoice = self.get(invoice_id)
        result_path = self._results_dir / f"{invoice_id}.json"
        file_path = Path(invoice.file_path)
        if result_path.exists():
            result_path.unlink()
        if file_path.exists():
            file_path.unlink()
        self._cache.pop(invoice_id, None)

    def _load(self, path: Path) -> StoredInvoice:
        data = json.loads(path.read_text(encoding="utf-8"))
        record = InvoiceRecord.model_validate(data["record"])
        invoice = StoredInvoice(
            record=record,
            file_path=data["file_path"],
            content_type=data["content_type"],
            size_bytes=data["size_bytes"],
        )
        return self._hydrate(invoice, data)

    def _hydrate(self, invoice: StoredInvoice, data: dict[str, object]) -> StoredInvoice:
        from datetime import datetime

        from backend.schemas.invoice import ExplainabilityStep, InvoiceField, ProcessingStatus, RetrievedChunk

        invoice.created_at = datetime.fromisoformat(data["created_at"])  # type: ignore[arg-type]
        invoice.processing_history = [ProcessingStatus.model_validate(item) for item in data["processing_history"]]  # type: ignore[index]
        invoice.retrieved_chunks = [RetrievedChunk.model_validate(item) for item in data["retrieved_chunks"]]  # type: ignore[index]
        invoice.reasoning = [ExplainabilityStep.model_validate(item) for item in data["reasoning"]]  # type: ignore[index]
        invoice.fields = [InvoiceField.model_validate(item) for item in data["fields"]]  # type: ignore[index]
        invoice.diagnostics = data.get("diagnostics", {})  # type: ignore[assignment]
        return invoice


invoice_repository = InvoiceRepository()
