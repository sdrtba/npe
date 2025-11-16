from fastapi import APIRouter

from src.core.config import settings
from src.core.dependencies import CurrentUser, TaskSrvDep, UserSrvDep
from src.schemas import TokenResponse

router = APIRouter()


@router.get(
    "/category",
    response_model=TokenResponse,
)
async def register_user(current_user: CurrentUser, task_service: TaskSrvDep, user_service: UserSrvDep):
    categories = await task_service.get_all_categories()
    return categories
