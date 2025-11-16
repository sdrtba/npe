from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import SessionLocal
from src.repository import UserRepository, SessionRepository, TaskRepository, CategoryRepository, AttachmentRepository, SolveRepository


class AbstractUnitOfWork(ABC):
    users: UserRepository
    sessions: SessionRepository
    tasks: TaskRepository
    categories: CategoryRepository
    attachments: AttachmentRepository
    solves: SolveRepository

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
    def __init__(self, session_factory=SessionLocal):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session: AsyncSession = self.session_factory()

        self.users = UserRepository(self.session)
        self.sessions = SessionRepository(self.session)
        self.tasks = TaskRepository(self.session)
        self.categories = CategoryRepository(self.session)
        self.attachments = AttachmentRepository(self.session)
        self.solves = SolveRepository(self.session)

        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
