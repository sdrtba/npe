from fastapi import APIRouter, HTTPException, status

from src.schemas import CategoryWithTasksCount, TaskRead, TaskListItem
from src.core.dependencies import CategorySrvDep, TaskSrvDep

router = APIRouter()


@router.get("/category", response_model=list[CategoryWithTasksCount])
async def get_categories(category_service: CategorySrvDep):
    return await category_service.get_all_categories()


@router.get("/category/{category_id}", response_model=list[TaskListItem])
async def get_tasks_by_category(category_id: int, task_service: TaskSrvDep):
    tasks = await task_service.get_tasks_by_category(category_id=category_id)

    if not tasks:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, task_service: TaskSrvDep):
    task = await task_service.get_task(task_id=task_id)

    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    return task
