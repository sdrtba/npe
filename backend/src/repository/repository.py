from abc import ABC, abstractmethod
from sqlalchemy import insert, select, delete

from src.core.database import get_db_session


class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self, item: dict) -> any:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self, filter_by: dict | None, custom_filter=None) -> list[any]:
        raise NotImplementedError


class SQLAlchemyRepository(AbstractRepository):
    model = None

    async def add_one(self, item: dict) -> int:
        try:
            db = await get_db_session()
            stmt = insert(self.model).values(**item).returning(self.model)
            res = await db.execute(stmt)
            await db.commit()
            return res.scalars().first()
        finally:
            await db.close()

    async def find_all(
        self, filter_by: dict | None = None, custom_filter=None
    ) -> list[any]:
        try:
            db = await get_db_session()
            stmt = select(self.model)

            if filter_by:
                stmt = stmt.filter_by(**filter_by)
            if custom_filter is not None:
                stmt = stmt.filter(custom_filter)

            res = await db.execute(stmt)
            res = [row[0].to_read_model() for row in res.all()]
            return res
        finally:
            await db.close()

    async def find_one_raw(self, **filter_by):
        try:
            db = await get_db_session()
            stmt = select(self.model).filter_by(**filter_by)
            res = await db.execute(stmt)
            return res.scalars().first()
        finally:
            await db.close()

    async def find_session_by_hash(self, token_hash: bytes):
        try:
            db = await get_db_session()
            from sqlalchemy.orm import selectinload

            stmt = (
                select(self.model)
                .options(selectinload(self.model.user))
                .where(self.model.token_hash == token_hash)
            )
            res = await db.execute(stmt)
            return res.scalars().first()
        finally:
            await db.close()

    async def delete_by_hash(self, token_hash: bytes):
        try:
            db = await get_db_session()
            stmt = delete(self.model).where(self.model.token_hash == token_hash)
            await db.execute(stmt)
            await db.commit()
        finally:
            await db.close()
