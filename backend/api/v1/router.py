from fastapi import APIRouter

from backend.api.v1 import invoices, rag, system

api_router = APIRouter()
api_router.include_router(invoices.router)
api_router.include_router(rag.router)
api_router.include_router(system.router)
