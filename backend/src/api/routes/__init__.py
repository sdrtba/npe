from fastapi import APIRouter
from src.api.routes.auth import router as auth_router

router = APIRouter(prefix="/api")
router.include_router(auth_router, prefix="/auth")
