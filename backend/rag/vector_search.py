from __future__ import annotations

from collections import Counter


class VectorSearchService:
    def score(self, query: Counter[str], candidate: Counter[str]) -> float:
        overlap = sum(min(query[token], candidate[token]) for token in query)
        norm = sum(candidate.values()) or 1
        return min(1.0, overlap / norm * 3)

    def search(self, query_text: str, chunks: list[str], embeddings: list[Counter[str]], limit: int = 4) -> list[tuple[int, float]]:
        query = Counter(token.lower() for token in query_text.split() if len(token) > 2)
        ranked = [(index, self.score(query, vector)) for index, vector in enumerate(embeddings)]
        ranked.sort(key=lambda item: item[1], reverse=True)
        return ranked[:limit]
