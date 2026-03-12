from __future__ import annotations

from backend.config.settings import get_settings


class ContextBuilder:
    def chunk(self, pages: list[str]) -> list[str]:
        settings = get_settings()
        chunks: list[str] = []
        for page in pages:
            if len(page) <= settings.chunk_size:
                chunks.append(page)
                continue
            start = 0
            while start < len(page):
                end = min(start + settings.chunk_size, len(page))
                chunks.append(page[start:end])
                if end == len(page):
                    break
                start = max(0, end - settings.chunk_overlap)
        return chunks

    def build_context(self, ranked_chunks: list[tuple[int, float]], chunks: list[str]) -> list[tuple[str, float]]:
        settings = get_settings()
        context: list[tuple[str, float]] = []
        budget = settings.max_prompt_characters
        for index, score in ranked_chunks:
            chunk = chunks[index]
            if budget <= 0:
                break
            budget -= len(chunk)
            context.append((chunk, score))
            if len(context) >= settings.max_context_chunks:
                break
        return context
