import datetime
import hashlib

from src.schemas import UserRead
from src.utils.uow import AbstractUnitOfWork


class TasksService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def get_task(self, task_id: int):
        async with self.uow:
            return await self.uow.tasks.find_one(id=task_id)

    async def get_tasks_by_category(self, category_id: int):
        async with self.uow:
            tasks = await self.uow.tasks.find_all(filter_by={"category_id": category_id})
            return tasks
