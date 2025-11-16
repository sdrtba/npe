import datetime
import hashlib

from src.schemas import UserRead, TaskRead, TaskListItem
from src.utils.uow import AbstractUnitOfWork


class TasksService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def get_task(self, task_id: int) -> TaskRead | None:
        async with self.uow:
            task = await self.uow.tasks.get_full_task(task_id=task_id)

            if task is None:
                return None

            return TaskRead.model_validate(task, from_attributes=True)

    async def get_tasks_by_category(self, category_id: int) -> list[TaskListItem]:
        async with self.uow:
            tasks = await self.uow.tasks.find_by_category_id(category_id=category_id)

            return [TaskListItem.model_validate(t, from_attributes=True) for t in tasks]

        # async with self.uow:
        #     tasks = await self.uow.tasks.find_all(filter_by={"category_id": category_id})
        #     return tasks
