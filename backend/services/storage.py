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
        if file.content_type != "application/pdf":
            raise ValidationError("Only PDF uploads are supported")
        payload = await file.read()
        max_size = self.settings.max_upload_size_mb * 1024 * 1024
        if len(payload) > max_size:
            raise ValidationError(f"File exceeds {self.settings.max_upload_size_mb} MB limit")
        invoice_id = generate_id("inv")
        path = self.settings.uploads_dir / f"{invoice_id}.pdf"
        path.write_bytes(payload)
        return invoice_id, path, len(payload)


file_storage_service = FileStorageService()
