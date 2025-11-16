from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Enum, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.enums import Difficulty
from src.core.security import verify_flag
from src.models.base import Base, intpk, created_at, updated_at, solved_at

if TYPE_CHECKING:
    from src.models.user import User


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[intpk]
    name: Mapped[str] = mapped_column(index=True, unique=True, nullable=False)

    tasks: Mapped[list["Task"]] = relationship(back_populates="category")


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[intpk]
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="RESTRICT"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(256), index=True, unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(256), index=True, unique=True, nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str | None]
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty, name="task_difficulty"), nullable=False)
    base_score: Mapped[int]
    flag_hash: Mapped[str] = mapped_column(String(256), unique=True, index=True, nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    category: Mapped["Category"] = relationship(back_populates="tasks")
    attachments: Mapped[list["TaskAttachment"]] = relationship(back_populates="task", cascade="all, delete-orphan")
    solves: Mapped[list["Solve"]] = relationship(back_populates="task", cascade="all, delete-orphan")

    def check_flag(self, flag: str) -> bool:
        return verify_flag(flag, self.flag_hash)


class TaskAttachment(Base):
    __tablename__ = "task_attachments"
    id: Mapped[intpk]
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), index=True)
    filename: Mapped[str] = mapped_column(String(256), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[created_at]

    task: Mapped["Task"] = relationship(back_populates="attachments")


class Solve(Base):
    __tablename__ = "solves"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True)
    solved_at: Mapped[solved_at]
    points_awarded: Mapped[int]

    user: Mapped["User"] = relationship(back_populates="solves")
    task: Mapped["Task"] = relationship(back_populates="solves")
