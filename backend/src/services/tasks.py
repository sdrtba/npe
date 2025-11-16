import datetime
import hashlib

from src.schemas import UserRead
from src.repository.uow import AbstractUnitOfWork


class TasksService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def get_all_categories(self):
        async with self.uow:
            return await self.uow.tasks.get_all_categories()
