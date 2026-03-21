from __future__ import annotations

import re


FIELD_PATTERNS = {
    "Invoice Number": r"Invoice Number:\s*(.+)",
    "Invoice Date": r"Invoice Date:\s*(.+)",
    "Due Date": r"Due Date:\s*(.+)",
    "Vendor Name": r"Vendor Name:\s*(.+)",
    "Subtotal": r"Subtotal:\s*(.+)",
    "Tax": r"Tax:\s*(.+)",
    "Total Amount": r"Total Amount:\s*(.+)",
    "Payment Terms": r"Payment Terms:\s*(.+)",
}


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"([A-Z])\s+([A-Z])", r"\1\2", text)
    return text.strip()


def parse_structured_output(text: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for field, pattern in FIELD_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        result[field] = match.group(1).strip() if match else "Not found"
    return result


def extract_currency_number(raw_value: str) -> float:
    cleaned = re.sub(r"[^0-9.]", "", raw_value or "")
    if not cleaned:
        return 0.0
    try:
        return float(cleaned)
    except ValueError:
        return 0.0
