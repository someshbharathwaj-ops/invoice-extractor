from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class AppError(Exception):
    code: str
    message: str
    status_code: int = 400
    details: dict[str, Any] | None = None

    def __str__(self) -> str:
        return self.message


class NotFoundError(AppError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(code="not_found", message=message, status_code=404, details=details)


class ValidationError(AppError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(code="validation_error", message=message, status_code=422, details=details)


class ProcessingError(AppError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(code="processing_error", message=message, status_code=500, details=details)


class RateLimitError(AppError):
    def __init__(self, message: str = "Rate limit exceeded") -> None:
        super().__init__(code="rate_limited", message=message, status_code=429)
