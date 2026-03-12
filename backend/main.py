from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from backend.api.v1.router import api_router
from backend.config.settings import get_settings
from backend.core.exceptions import AppError
from backend.core.logging import configure_logging
from backend.core.middleware import RateLimitMiddleware, RequestContextMiddleware

configure_logging()
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, debug=settings.debug)
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/")
    async def root():
        return {"service": settings.app_name, "version": "v1"}

    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, error: AppError):
        logger.error(
            "app_error",
            extra={
                "request_id": getattr(request.state, "request_id", "-"),
                "extra_payload": {"code": error.code, "details": error.details or {}},
            },
        )
        return JSONResponse(
            status_code=error.status_code,
            content={
                "error": {
                    "code": error.code,
                    "message": error.message,
                    "request_id": getattr(request.state, "request_id", "-"),
                    "details": error.details,
                }
            },
        )

    return app


app = create_app()
