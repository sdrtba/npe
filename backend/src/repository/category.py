from sqlalchemy import func, select

from src.models import Category, Task
from src.utils.repository import SQLAlchemyRepository


class CategoryRepository(SQLAlchemyRepository[Category]):
    model = Category

    async def find_all_with_tasks_count(self):
        query = select(Category, func.count(Task.id).label("tasks_count")).outerjoin(Task, Task.category_id == Category.id).group_by(Category.id)
        result = await self.session.execute(query)
        return [{**category.__dict__, "tasks_count": count} for category, count in result.all()]
