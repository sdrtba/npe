from src.models import RefreshSession
from src.repository.repository import SQLAlchemyRepository


class SessionsRepository(SQLAlchemyRepository):
    model = RefreshSession
