from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from backend.schemas.common import APIModel


PipelineStage = Literal["ingest", "chunk", "retrieve", "extract", "verify"]
InvoiceStatus = Literal["uploaded", "queued", "processing", "processed", "review", "flagged", "failed"]


class InvoiceField(APIModel):
    label: str
    value: str
    confidence: int = Field(ge=0, le=100)


class RetrievedChunk(APIModel):
    id: str
    title: str
    excerpt: str
    score: float = Field(ge=0.0, le=1.0)
    page: int = Field(ge=1)


class ExplainabilityStep(APIModel):
    id: PipelineStage
    title: str
    detail: str
    status: Literal["completed", "active", "queued"]


class ProcessingStatus(APIModel):
    invoice_id: str
    job_id: str
    stage: PipelineStage
    progress: int = Field(ge=0, le=100)
    status: InvoiceStatus
    message: str
    updated_at: datetime


class UploadJob(APIModel):
    invoice_id: str
    job_id: str
    filename: str
    content_type: str
    size_bytes: int
    status: InvoiceStatus
    created_at: datetime


class ExtractionResult(APIModel):
    invoice_id: str
    summary: str
    confidence: int = Field(ge=0, le=100)
    fields: list[InvoiceField]


class RAGTrace(APIModel):
    invoice_id: str
    processing: list[ProcessingStatus]
    retrieved_chunks: list[RetrievedChunk]
    reasoning: list[ExplainabilityStep]
    latency_ms: dict[str, float]
    diagnostics: dict[str, object]


class InvoiceRecord(APIModel):
    id: str
    fileName: str
    vendorName: str = "Not found"
    invoiceNumber: str = "Not found"
    invoiceDate: str = "Not found"
    dueDate: str = "Not found"
    subtotal: float = 0.0
    tax: float = 0.0
    totalAmount: float = 0.0
    currency: str = "INR"
    paymentTerms: str = "Not found"
    gstNumber: str = "Not found"
    status: InvoiceStatus = "uploaded"
    confidence: int = Field(default=0, ge=0, le=100)
    summary: str = "Awaiting processing."
    extractedAt: datetime | None = None
    fields: list[InvoiceField] = Field(default_factory=list)
    retrievedChunks: list[RetrievedChunk] = Field(default_factory=list)
    reasoning: list[ExplainabilityStep] = Field(default_factory=list)


class InvoiceListItem(APIModel):
    id: str
    fileName: str
    vendorName: str
    invoiceNumber: str
    invoiceDate: str
    totalAmount: float
    gstNumber: str
    confidence: int
    status: InvoiceStatus
    extractedAt: datetime | None = None


class InvoiceUploadResponse(APIModel):
    uploads: list[UploadJob]


class StartProcessingResponse(APIModel):
    invoice_id: str
    job_id: str
    status: InvoiceStatus
    stage: PipelineStage
    stream_url: str
