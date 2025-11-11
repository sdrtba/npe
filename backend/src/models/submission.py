from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, intpk, created_at, solved_at

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.task import Task


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
    solved_at: Mapped[solved_at]
    points_awarded: Mapped[int]

    user: Mapped["User"] = relationship(back_populates="solves")
    task: Mapped["Task"] = relationship(back_populates="solves")
