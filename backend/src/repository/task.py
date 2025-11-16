from src.models import Task
from src.repository.repository import SQLAlchemyRepository


class TaskRepository(SQLAlchemyRepository):
    model = Task
