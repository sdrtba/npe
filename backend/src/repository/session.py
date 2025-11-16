from src.models import RefreshSession
from sqlalchemy import insert, select, delete
from src.repository.repository import SQLAlchemyRepository


class SessionRepository(SQLAlchemyRepository):
    model = RefreshSession

    async def delete_by_hash(self, token_hash: bytes):
        stmt = delete(self.model).where(self.model.refresh_token_hash == token_hash)
        await self.session.execute(stmt)
