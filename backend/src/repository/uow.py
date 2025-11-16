from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import SessionLocal
from src.repository.user import UserRepository
from src.repository.session import SessionRepository
from src.repository.task import TaskRepository


class AbstractUnitOfWork(ABC):
    users: UserRepository
    sessions: SessionRepository
    tasks: TaskRepository

    @abstractmethod
    def __init__(self):
        raise NotImplementedError

    @abstractmethod
    async def __aenter__(self):
        raise NotImplementedError

    @abstractmethod
    async def __aexit__(self, *args):
        raise NotImplementedError

    @abstractmethod
    async def commit(self):
        raise NotImplementedError

    @abstractmethod
    async def rollback(self):
        raise NotImplementedError


class UnitOfWork(AbstractUnitOfWork):
    def __init__(self):
        self.session_factory = SessionLocal

    async def __aenter__(self):
        self.session: AsyncSession = self.session_factory()

        self.users = UserRepository(self.session)
        self.sessions = SessionRepository(self.session)
        self.tasks = TaskRepository(self.session)

        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
