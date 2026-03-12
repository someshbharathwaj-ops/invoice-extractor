from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta


@dataclass
class CacheEntry:
    value: object
    expires_at: datetime


class TTLCache:
    def __init__(self, ttl_seconds: int = 300) -> None:
        self.ttl_seconds = ttl_seconds
        self._store: dict[str, CacheEntry] = {}

    def get(self, key: str) -> object | None:
        entry = self._store.get(key)
        if not entry:
            return None
        if entry.expires_at < datetime.now(UTC):
            self._store.pop(key, None)
            return None
        return entry.value

    def set(self, key: str, value: object) -> None:
        self._store[key] = CacheEntry(value=value, expires_at=datetime.now(UTC) + timedelta(seconds=self.ttl_seconds))
