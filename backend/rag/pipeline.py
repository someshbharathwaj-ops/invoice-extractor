from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter
from typing import Any

from backend.core.telemetry import traced_span
from backend.rag.context_builder import ContextBuilder
from backend.rag.embedding import EmbeddingService
from backend.rag.extraction_engine import ExtractionEngine
from backend.rag.ingestion import DocumentIngestionService
from backend.rag.prompt_builder import PromptBuilder
from backend.rag.validator import PostProcessingValidator
from backend.rag.vector_search import VectorSearchService


@dataclass
class PipelineResult:
    raw_output: str
    parsed_fields: dict[str, str]
    fields: list[Any]
    retrieved_chunks: list[Any]
    reasoning: list[Any]
    confidence: int
    latency_ms: dict[str, float]


class RAGPipeline:
    def __init__(self) -> None:
        self.ingestion = DocumentIngestionService()
        self.embedding = EmbeddingService()
        self.vector_search = VectorSearchService()
        self.context_builder = ContextBuilder()
        self.prompt_builder = PromptBuilder()
        self.extraction_engine = ExtractionEngine()
        self.validator = PostProcessingValidator()

    def run(self, invoice_id: str, file_path: str) -> PipelineResult:
        latency: dict[str, float] = {}

        def timed(name: str, func):
            started = perf_counter()
            value = func()
            latency[name] = round((perf_counter() - started) * 1000, 2)
            return value

        with traced_span("rag.pipeline"):
            document_text, pages = timed("ingest", lambda: self.ingestion.ingest(file_path))
            chunks = timed("chunk", lambda: self.context_builder.chunk(pages))
            embeddings = timed("embed", lambda: self.embedding.embed(chunks))
            ranked = timed("retrieve", lambda: self.vector_search.search("invoice totals vendor payment tax", chunks, embeddings))
            context_chunks = timed("context", lambda: self.context_builder.build_context(ranked, chunks))
            prompt = timed("prompt", lambda: self.prompt_builder.build("\n\n".join(chunk for chunk, _ in context_chunks)))
            raw_output = timed("extract", lambda: self.extraction_engine.extract(prompt, document_text))
            parsed, fields, retrieved_chunks, reasoning, confidence = timed(
                "validate", lambda: self.validator.validate(invoice_id, raw_output, context_chunks)
            )
            return PipelineResult(
                raw_output=raw_output,
                parsed_fields=parsed,
                fields=fields,
                retrieved_chunks=retrieved_chunks,
                reasoning=reasoning,
                confidence=confidence,
                latency_ms=latency,
            )


rag_pipeline = RAGPipeline()
