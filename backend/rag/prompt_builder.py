from __future__ import annotations

from langchain_core.prompts import PromptTemplate


class PromptBuilder:
    def __init__(self) -> None:
        self.template = PromptTemplate.from_template(
            """
Extract the following invoice information.

Return ONLY this format:

Invoice Number:
Invoice Date:
Vendor Name:
Subtotal:
Tax:
Total Amount:
Payment Terms:

Invoice text:
{context}
"""
        )

    def build(self, context: str) -> str:
        return self.template.format(context=context)
