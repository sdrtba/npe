from fastapi import APIRouter

from src.routes.auth import router as auth_router
from src.routes.tasks import router as tasks_router
from src.routes.categories import router as category_router

routers = APIRouter(prefix="/api")
routers.include_router(auth_router, prefix="/auth", tags=["auth"])
routers.include_router(tasks_router, prefix="/categories/tasks", tags=["tasks"])
routers.include_router(category_router, prefix="/categories", tags=["categories"])
