from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models import Task
from src.utils.repository import SQLAlchemyRepository


class TaskRepository(SQLAlchemyRepository[Task]):
    model = Task

    async def get_full_task(self, task_id: int) -> Task | None:
        stmt = (
            select(Task)
            .options(
                selectinload(Task.category),
                selectinload(Task.attachments),
            )
            .where(Task.id == task_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def find_by_category_id(self, category_id: int) -> list[Task]:
        stmt = (
            select(Task)
            .options(
                selectinload(Task.category),
            )
            .where(Task.category_id == category_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()
