from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.schemas import UserRead
from src.core.security import verify_password, verify_refresh_token
from src.models.base import Base, intpk, created_at, updated_at, expires_at

if TYPE_CHECKING:
    from src.models.task import Solve


class User(Base):
    __tablename__ = "users"
    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(256), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    refresh_sessions: Mapped[list["RefreshSession"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    solves: Mapped[list["Solve"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    def check_password(self, password: str) -> bool:
        return verify_password(password, self.password_hash)

    def to_read_model(self) -> UserRead:
        return UserRead.model_validate(self)


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"
    id: Mapped[intpk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    refresh_token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    expires_at: Mapped[expires_at]
    created_at: Mapped[created_at]

    user: Mapped["User"] = relationship(back_populates="refresh_sessions")

    def check_token(self, token: str) -> bool:
        return verify_refresh_token(token, self.refresh_token_hash)
