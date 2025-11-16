from abc import ABC, abstractmethod
from sqlalchemy import insert, select, delete
from sqlalchemy.ext.asyncio import AsyncSession


class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self, item: dict) -> any:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self, filter_by: dict | None, custom_filter=None) -> list[any]:
        raise NotImplementedError


class SQLAlchemyRepository(AbstractRepository):
    model = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_one(self, item: dict):
        stmt = insert(self.model).values(**item).returning(self.model)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def find_all(self, filter_by: dict | None = None, custom_filter=None) -> list[any]:
        stmt = select(self.model)

        if filter_by:
            stmt = stmt.filter_by(**filter_by)
        if custom_filter is not None:
            stmt = stmt.filter(custom_filter)

        res = await self.session.execute(stmt)
        return [row[0].to_read_model() for row in res.all()]

    async def find_one_raw(self, **filter_by):
        stmt = select(self.model).filter_by(**filter_by)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def find_session_by_hash(self, token_hash: bytes):
        from sqlalchemy.orm import selectinload

        stmt = select(self.model).options(selectinload(self.model.user)).where(self.model.refresh_token_hash == token_hash)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    # async def delete_by_hash(self, token_hash: bytes):
    #     stmt = delete(self.model).where(self.model.refresh_token_hash == token_hash)
    #     await self.session.execute(stmt)
