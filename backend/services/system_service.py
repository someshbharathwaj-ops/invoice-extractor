from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime

from backend.config.settings import get_settings
from backend.core.metrics import metrics_registry
from backend.services.repository import invoice_repository


class SystemService:
    def get_status(self) -> dict[str, object]:
        settings = get_settings()
        invoices = invoice_repository.list()
        status_counts = Counter(invoice.record.status for invoice in invoices)
        return {
            "status": "ok",
            "service": settings.app_name,
            "environment": settings.environment,
            "timestamp": datetime.now(UTC).isoformat(),
            "storage": {
                "root": str(settings.storage_root),
                "uploads": str(settings.uploads_dir),
                "results": str(settings.results_dir),
            },
            "queue": {
                "backend": settings.queue_backend,
            },
            "invoices": {
                "total": len(invoices),
                "by_status": dict(status_counts),
            },
            "metrics": metrics_registry.snapshot(),
        }


system_service = SystemService()
