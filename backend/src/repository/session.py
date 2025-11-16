from sqlalchemy import select, delete

from src.models import RefreshSession
from src.utils.repository import SQLAlchemyRepository


class SessionRepository(SQLAlchemyRepository[RefreshSession]):
    model = RefreshSession

    async def delete_by_hash(self, token_hash: str) -> None:
        stmt = delete(self.model).where(self.model.refresh_token_hash == token_hash)
        await self.session.execute(stmt)

    async def find_session_by_hash(self, token_hash: str) -> RefreshSession | None:
        from sqlalchemy.orm import selectinload

        stmt = select(self.model).options(selectinload(self.model.user)).where(self.model.refresh_token_hash == token_hash)
        res = await self.session.execute(stmt)
        return res.scalars().first()
