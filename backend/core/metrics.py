from __future__ import annotations

from collections import Counter, defaultdict
from threading import Lock


class MetricsRegistry:
    def __init__(self) -> None:
        self._counters: Counter[str] = Counter()
        self._timings: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def increment(self, name: str, value: int = 1) -> None:
        with self._lock:
            self._counters[name] += value

    def observe(self, name: str, value: float) -> None:
        with self._lock:
            self._timings[name].append(value)

    def snapshot(self) -> dict[str, object]:
        with self._lock:
            timings = {
                key: {
                    "count": len(values),
                    "avg_ms": round((sum(values) / len(values)) * 1000, 2) if values else 0.0,
                }
                for key, values in self._timings.items()
            }
            return {
                "counters": dict(self._counters),
                "timings": timings,
            }


metrics_registry = MetricsRegistry()
