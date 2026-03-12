from __future__ import annotations

import re

from backend.config.settings import get_settings
from backend.utils.parsing import clean_text


class ExtractionEngine:
    def __init__(self) -> None:
        self._llm = None

    def _build_llm(self):
        if self._llm is not None:
            return self._llm
        settings = get_settings()
        from langchain_huggingface import HuggingFacePipeline
        from transformers import pipeline

        hf_pipeline = pipeline(
            "text2text-generation",
            model=settings.extraction_model_name,
            max_new_tokens=256,
        )
        self._llm = HuggingFacePipeline(pipeline=hf_pipeline)
        return self._llm

    def fallback_extract(self, text: str) -> str:
        def find(pattern: str) -> str:
            match = re.search(pattern, text, re.IGNORECASE)
            return match.group(1).strip() if match else "Not found"

        return (
            f"Invoice Number: {find(r'Invoice\\s*(?:No|Number|#|ID)[:\\s]*([A-Z0-9\\-]+)')}\n"
            f"Invoice Date: {find(r'Invoice\\s*Date[:\\s]*([A-Za-z0-9,\\-/ ]+)')}\n"
            f"Vendor Name: {find(r'(?:Billed\\s*By|Vendor|From)[:\\s]*([\\w\\s.&,-]+)')}\n"
            f"Subtotal: {find(r'Subtotal[:\\s]*[^0-9]*([\\d,]+(?:\\.\\d{{2}})?)')}\n"
            f"Tax: {find(r'(?:IGST|CGST|SGST|GST|Tax)[:\\s]*[^0-9]*([\\d,]+(?:\\.\\d{{2}})?)')}\n"
            f"Total Amount: {find(r'(?:Grand\\s*Total|Total Amount|Total)[:\\s]*[^0-9]*([\\d,]+(?:\\.\\d{{2}})?)')}\n"
            f"Payment Terms: {find(r'(?:Payment\\s*Terms|Due\\s*Date|Payment\\s*Due)[:\\s]*([A-Za-z0-9,\\-/ ]+)')}"
        )

    def extract(self, prompt: str, fallback_text: str) -> str:
        try:
            llm = self._build_llm()
            result = clean_text(llm.invoke(prompt))
            if result and "Invoice Number" in result:
                return result
        except Exception:  # noqa: BLE001
            pass
        return self.fallback_extract(fallback_text)
