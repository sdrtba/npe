from fastapi import APIRouter, HTTPException, status

from src.schemas import CategoryWithTasksCount, TaskListItem
from src.core.dependencies import CategorySrvDep, TaskSrvDep

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
