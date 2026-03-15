from __future__ import annotations

from pathlib import Path

from fastapi import UploadFile

from backend.config.settings import get_settings
from backend.core.exceptions import ValidationError
from backend.utils.ids import generate_id


class FileStorageService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def save_upload(self, file: UploadFile) -> tuple[str, Path, int]:
        self._validate_upload(file)
        payload = await file.read()
        if not payload:
            raise ValidationError("Uploaded file is empty", details={"filename": file.filename or "unknown"})
        max_size = self.settings.max_upload_size_mb * 1024 * 1024
        if len(payload) > max_size:
            raise ValidationError(f"File exceeds {self.settings.max_upload_size_mb} MB limit")
        invoice_id = generate_id("inv")
        path = self.settings.uploads_dir / f"{invoice_id}.pdf"
        path.write_bytes(payload)
        return invoice_id, path, len(payload)

    def _validate_upload(self, file: UploadFile) -> None:
        filename = (file.filename or "").strip()
        if not filename:
            raise ValidationError("Uploaded file must have a filename")
        is_pdf_name = Path(filename).suffix.lower() == ".pdf"
        is_pdf_type = file.content_type in {"application/pdf", "application/x-pdf"}
        if not (is_pdf_name or is_pdf_type):
            raise ValidationError(
                "Only PDF uploads are supported",
                details={"filename": filename, "content_type": file.content_type or "unknown"},
            )


file_storage_service = FileStorageService()
