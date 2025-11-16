from fastapi import APIRouter

from src.routes.auth import router as auth_router
from src.routes.tasks import router as tasks_router

routers = APIRouter(prefix="/api")
routers.include_router(auth_router, prefix="/auth", tags=["auth"])
routers.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
