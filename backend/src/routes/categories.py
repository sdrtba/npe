from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from src.schemas import CategoryWithTasksCount, TaskRead, TaskListItem, CheckFlagResponse, CheckFlagRequest
from src.core.dependencies import CategorySrvDep, TaskSrvDep, UoWDep, CurrentUser
from src.core.config import settings

router = APIRouter()


@router.get("", response_model=list[CategoryWithTasksCount])
async def get_categories(category_service: CategorySrvDep):
    return await category_service.get_all_categories()


@router.get("/{slug}", response_model=list[TaskListItem])
async def get_tasks_by_category(slug: str, task_service: TaskSrvDep):
    tasks = await task_service.get_tasks_by_category(category_name=slug)

    if not tasks:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    return tasks
