from __future__ import annotations
from typing import Annotated
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum, String, ForeignKey, LargeBinary, DateTime, func

from src.core.database import Base
from src.core.enums import UserRole, Difficulty
from src.core.security import verify_password, verify_flag
from src.schemas.schemas import UserRead, LoginRequest


intpk = Annotated[int, mapped_column(primary_key=True)]
created_at = Annotated[
    datetime,
    mapped_column(DateTime(timezone=True), server_default=func.now()),
]
updated_at = Annotated[
    datetime,
    mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    ),
]
expires_at = Annotated[
    datetime, mapped_column(DateTime(timezone=True), index=True, nullable=False)
]


class User(Base):
    __tablename__ = "users"
    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"), default=UserRole.user
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    solves: Mapped[list[Solve]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    refresh_sessions: Mapped[list[RefreshSession]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def verify_password(self, password: str) -> bool:
        return verify_password(password, self.password_hash)

    def to_read_model(self) -> UserRead:
        return UserRead(
            id=self.id,
            username=self.username,
            email=self.email,
            role=self.role.value,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"
    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    token_hash: Mapped[bytes] = mapped_column(
        LargeBinary(64), unique=True, index=True, nullable=False
    )
    expires_at: Mapped[expires_at]
    created_at: Mapped[created_at]

    user: Mapped[User] = relationship(back_populates="refresh_sessions")


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[intpk]
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    tasks: Mapped[list[Task]] = relationship(back_populates="category")


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[intpk]
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(256), index=True, unique=True, nullable=False
    )
    description: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str | None]
    solved: Mapped[bool] = mapped_column(nullable=False, default=False)
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty, name="task_difficulty"), nullable=False
    )
    base_score: Mapped[int]
    flag_hash: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    category: Mapped[Category] = relationship(back_populates="tasks")
    attachments: Mapped[list[TaskAttachment]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )
    solves: Mapped[list[Solve]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )

    def verify_flag(self, flag: str) -> bool:
        return verify_flag(flag, self.flag_hash)


class TaskAttachment(Base):
    __tablename__ = "task_attachments"
    id: Mapped[intpk]
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    filename: Mapped[str] = mapped_column(String(256), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[created_at]

    task: Mapped[Task] = relationship(back_populates="attachments")


class Submission(Base):
    __tablename__ = "submissions"
    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    provided_flag_hmac: Mapped[str] = mapped_column(String(512), nullable=False)
    is_correct: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[created_at]


class Solve(Base):
    __tablename__ = "solves"
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True
    )
    solved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    points_awarded: Mapped[int]

    user: Mapped[User] = relationship(back_populates="solves")
    task: Mapped[Task] = relationship(back_populates="solves")
