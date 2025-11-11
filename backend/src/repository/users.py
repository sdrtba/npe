from src.models import User
from src.repository.repository import SQLAlchemyRepository


class UsersRepository(SQLAlchemyRepository):
    model = User
