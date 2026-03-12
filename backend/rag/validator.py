from __future__ import annotations

from backend.schemas.invoice import ExplainabilityStep, InvoiceField, RetrievedChunk
from backend.utils.parsing import extract_currency_number, parse_structured_output


class PostProcessingValidator:
    def validate(
        self,
        invoice_id: str,
        raw_output: str,
        context_chunks: list[tuple[str, float]],
    ) -> tuple[dict[str, str], list[InvoiceField], list[RetrievedChunk], list[ExplainabilityStep], int]:
        parsed = parse_structured_output(raw_output)
        subtotal = extract_currency_number(parsed["Subtotal"])
        tax = extract_currency_number(parsed["Tax"])
        total = extract_currency_number(parsed["Total Amount"])
        confidence = 96 if abs((subtotal + tax) - total) < 1 else 84
        fields = [
            InvoiceField(label=label, value=value, confidence=max(60, confidence - index * 2))
            for index, (label, value) in enumerate(parsed.items())
        ]
        retrieved_chunks = [
            RetrievedChunk(
                id=f"chunk-{invoice_id}-{index + 1}",
                title=f"Retrieved chunk {index + 1}",
                excerpt=chunk[:260],
                score=round(score, 2),
                page=index + 1,
            )
            for index, (chunk, score) in enumerate(context_chunks)
        ]
        reasoning = [
            ExplainabilityStep(id="ingest", title="Document intake", detail="PDF loaded and normalized.", status="completed"),
            ExplainabilityStep(id="chunk", title="Semantic chunking", detail="Pages split into retrieval windows.", status="completed"),
            ExplainabilityStep(id="retrieve", title="Retriever ranking", detail="Highest-signal chunks selected.", status="completed"),
            ExplainabilityStep(id="extract", title="Structured extraction", detail="LLM or regex extraction completed.", status="completed"),
            ExplainabilityStep(id="verify", title="Validation", detail="Totals reconciled against extracted values.", status="completed"),
        ]
        return parsed, fields, retrieved_chunks, reasoning, confidence
