from abc import ABC, abstractmethod
from src.core.database import get_db, get_db_session
from sqlalchemy import insert, select


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
