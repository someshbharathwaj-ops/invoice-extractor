from __future__ import annotations

import logging
from collections import defaultdict, deque
from time import perf_counter
from uuid import uuid4

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from backend.config.settings import get_settings
from backend.core.metrics import metrics_registry
from backend.core.request_context import request_id_context

logger = logging.getLogger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("x-request-id", uuid4().hex)
        request.state.request_id = request_id
        token = request_id_context.set(request_id)
        started = perf_counter()
        try:
            response = await call_next(request)
        finally:
            request_id_context.reset(token)
        duration = perf_counter() - started
        response.headers["x-request-id"] = request_id
        metrics_registry.observe("http.request", duration)
        logger.info(
            "request_completed",
            extra={
                "request_id": request_id,
                "extra_payload": {
                    "path": request.url.path,
                    "method": request.method,
                    "duration_ms": round(duration * 1000, 2),
                },
            },
        )
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        settings = get_settings()
        self.window_seconds = settings.rate_limit_window_seconds
        self.max_requests = settings.rate_limit_requests
        self.requests: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        now = perf_counter()
        client = request.client.host if request.client else "anonymous"
        bucket = self.requests[client]
        while bucket and now - bucket[0] > self.window_seconds:
            bucket.popleft()
        if len(bucket) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "code": "rate_limited",
                        "message": "Too many requests",
                        "request_id": getattr(request.state, "request_id", "-"),
                    }
                },
            )
        bucket.append(now)
        return await call_next(request)
