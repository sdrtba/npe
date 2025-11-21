from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload, contains_eager

from src.models import Task, Solve
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

    async def find_by_category_name(self, category_name: str, user_id: int | None = None) -> list[Task]:
        stmt = (
            select(Task)
            .options(
                selectinload(Task.category),
            )
            .where(Task.category.has(name=category_name))
        )

        if user_id is not None:
            # Используем outerjoin для загрузки solves только для конкретного пользователя
            stmt = stmt.outerjoin(Solve, and_(Solve.task_id == Task.id, Solve.user_id == user_id)).options(contains_eager(Task.solves))

        res = await self.session.execute(stmt)
        return res.scalars().unique().all()
