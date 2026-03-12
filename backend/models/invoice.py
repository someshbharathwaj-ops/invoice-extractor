from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime

from backend.schemas.invoice import ExplainabilityStep, InvoiceField, InvoiceRecord, ProcessingStatus, RetrievedChunk


@dataclass
class StoredInvoice:
    record: InvoiceRecord
    file_path: str
    content_type: str
    size_bytes: int
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    processing_history: list[ProcessingStatus] = field(default_factory=list)
    retrieved_chunks: list[RetrievedChunk] = field(default_factory=list)
    reasoning: list[ExplainabilityStep] = field(default_factory=list)
    fields: list[InvoiceField] = field(default_factory=list)
    diagnostics: dict[str, object] = field(default_factory=dict)
