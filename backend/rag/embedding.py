from __future__ import annotations

from collections import Counter

from backend.utils.cache import TTLCache


class EmbeddingService:
    def __init__(self) -> None:
        self.cache = TTLCache(ttl_seconds=1800)

    def embed(self, texts: list[str]) -> list[Counter[str]]:
        vectors: list[Counter[str]] = []
        for text in texts:
            cached = self.cache.get(text)
            if cached is not None:
                vectors.append(cached)  # type: ignore[arg-type]
                continue
            vector = Counter(token.lower() for token in text.split() if len(token) > 2)
            self.cache.set(text, vector)
            vectors.append(vector)
        return vectors
