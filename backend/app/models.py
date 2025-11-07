from __future__ import annotations
from datetime import datetime
from passlib.hash import bcrypt
from sqlalchemy import (
    Enum,
    String,
    ForeignKey,
    func,
    LargeBinary,
    DateTime,
    text,
    Index,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.enums import UserRole, Difficulty
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"), default=UserRole.user
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    solves: Mapped[list[Solve]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    refresh_sessions: Mapped[list[RefreshSession]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.password_hash)


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"
    __table_args__ = (
        CheckConstraint("expires_at > created_at", name="chk_expires_at_future"),
        Index(
            "ix_refresh_sessions_active",
            "user_id",
            postgresql_where=text("expires_at > now()"),
        ),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    token_hash: Mapped[bytes] = mapped_column(
        LargeBinary(64), unique=True, index=True, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), index=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped[User] = relationship(back_populates="refresh_sessions")


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    tasks: Mapped[list[Task]] = relationship(back_populates="category")


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (
        CheckConstraint("base_score >= 0", name="ck_task_base_score_nonneg"),
        Index("ix_tasks_category", "category_id"),
        Index("ix_tasks_difficulty", "difficulty"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    category: Mapped[Category] = relationship(back_populates="tasks")
    attachments: Mapped[list[TaskAttachment]] = relationship(
        back_populates="tasks", cascade="all, delete-orphan"
    )
    solves: Mapped[list[Solve]] = relationship(
        back_populates="tasks", cascade="all, delete-orphan"
    )


class TaskAttachment(Base):
    __tablename__ = "task_attachments"
    id: Mapped[int] = mapped_column(primary_key=True)
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    filename: Mapped[str] = mapped_column(String(256), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    task: Mapped[Task] = relationship(back_populates="attachments")


class Submission(Base):
    __tablename__ = "submissions"
    __table_args__ = (
        Index("ix_submissions_task_created", "task_id", "created_at"),
        Index("ix_submissions_user_created", "user_id", "created_at"),
        Index(
            "ix_submissions_correct",
            "task_id",
            postgresql_where=text("is_correct = true"),
        ),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    provided_flag_hmac: Mapped[str] = mapped_column(String(512), nullable=False)
    is_correct: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Solve(Base):
    __tablename__ = "solves"
    __table_args__ = (
        UniqueConstraint("user_id", "task_id", name="uq_user_task_once"),
        CheckConstraint("points_awarded >= 0", name="ck_points_awarded_nonneg"),
        Index("ix_solves_task_solved", "task_id", "solved_at"),
        Index("ix_solves_user_solved", "user_id", "solved_at"),
    )
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
