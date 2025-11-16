from abc import ABC, abstractmethod
from typing import Type, TypeVar, Generic
from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

ModelT = TypeVar("ModelT")


class AbstractRepository(ABC, Generic[ModelT]):
    @abstractmethod
    async def add_one(self, item: dict) -> ModelT:
        raise NotImplementedError

    @abstractmethod
    async def find_one(self, **filters: any) -> ModelT | None:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self, filter_by: dict | None = None, custom_filter: any = None) -> list[ModelT]:
        raise NotImplementedError

    @abstractmethod
    async def edit_one(self, id: int, data: dict) -> ModelT:
        raise NotImplementedError

    @abstractmethod
    async def delete_one(self, **filters: any) -> None:
        raise NotImplementedError


class SQLAlchemyRepository(AbstractRepository[ModelT], Generic[ModelT]):
    model: Type[ModelT] = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_one(self, data: dict) -> ModelT:
        stmt = insert(self.model).values(**data).returning(self.model)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def find_one(self, **filters: any) -> ModelT | None:
        stmt = select(self.model).filter_by(**filters)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def find_all(self, filter_by: dict | None = None, custom_filter: any = None) -> list[ModelT]:
        stmt = select(self.model)

        if filter_by:
            stmt = stmt.filter_by(**filter_by)
        if custom_filter is not None:
            stmt = stmt.filter(custom_filter)

        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def edit_one(self, id: int, data: dict) -> ModelT:
        stmt = update(self.model).values(**data).filter_by(id=id).returning(self.model)
        res = await self.session.execute(stmt)
        return res.scalar_one()

    async def delete_one(self, filters: dict) -> None:
        stmt = delete(self.model).filter_by(**filters)
        await self.session.execute(stmt)
