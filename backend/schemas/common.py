from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ErrorResponse(APIModel):
    code: str
    message: str
    request_id: str
    details: dict | None = None


class Envelope(APIModel):
    success: bool = True
    request_id: str


T = TypeVar("T")


class DataEnvelope(Envelope, Generic[T]):
    data: T


class PaginatedResponse(APIModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int


class HealthStatus(APIModel):
    status: str
    service: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metrics: dict[str, object]
