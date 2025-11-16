from src.models import User
from src.repository.repository import SQLAlchemyRepository


class UserRepository(SQLAlchemyRepository):
    model = User
