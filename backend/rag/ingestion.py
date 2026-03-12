from __future__ import annotations

from pathlib import Path

from backend.utils.parsing import clean_text


class DocumentIngestionService:
    def ingest(self, file_path: str) -> tuple[str, list[str]]:
        path = Path(file_path)
        try:
            from langchain_community.document_loaders import PyPDFLoader

            loader = PyPDFLoader(str(path))
            documents = loader.load()
            pages = [clean_text(doc.page_content) for doc in documents]
        except Exception:  # noqa: BLE001
            from pypdf import PdfReader

            reader = PdfReader(str(path))
            pages = [clean_text(page.extract_text() or "") for page in reader.pages]
        return "\n\n".join(pages), pages
