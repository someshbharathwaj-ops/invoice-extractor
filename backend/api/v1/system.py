from fastapi import APIRouter, Depends

from backend.core.dependencies import get_system_service

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/status")
async def get_system_status(service=Depends(get_system_service)):
    return service.get_status()
