from fastapi import APIRouter, Depends, Query

from backend.core.dependencies import get_processing_service

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/search")
async def inspect_retrieval(
    invoice_id: str = Query(...),
    query: str = Query(...),
    k: int = Query(default=4, ge=1, le=10),
    service=Depends(get_processing_service),
):
    return {"items": service.search_chunks(invoice_id=invoice_id, query=query, limit=k)}
