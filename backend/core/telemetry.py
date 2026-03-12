from __future__ import annotations

from contextlib import contextmanager
from time import perf_counter

from backend.core.metrics import metrics_registry


@contextmanager
def traced_span(name: str):
    started = perf_counter()
    try:
        yield
    finally:
        metrics_registry.observe(f"span.{name}", perf_counter() - started)
