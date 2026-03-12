from __future__ import annotations

from pathlib import Path
from tempfile import NamedTemporaryFile

from backend.rag.pipeline import rag_pipeline


def extract_from_uploaded_file(uploaded_file) -> str:
    with NamedTemporaryFile(delete=False, suffix=".pdf") as handle:
        handle.write(uploaded_file.getbuffer())
        temp_path = Path(handle.name)
    try:
        result = rag_pipeline.run(invoice_id="legacy-streamlit", file_path=str(temp_path))
        return result.raw_output
    finally:
        temp_path.unlink(missing_ok=True)
