import datetime
import hashlib

from src.schemas import UserRead
from src.utils.uow import AbstractUnitOfWork


class CategoriesService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def get_all_categories(self):
        async with self.uow:
            return await self.uow.categories.find_all_with_tasks_count()
