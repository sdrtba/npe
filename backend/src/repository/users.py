from src.repository.repository import SQLAlchemyRepository
from src.models.models import User


class UsersRepository(SQLAlchemyRepository):
    model = User
