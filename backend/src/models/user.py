from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import LargeBinary, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.security import verify_password
from src.schemas import UserRead
from src.models.base import Base, intpk, created_at, updated_at, expires_at

if TYPE_CHECKING:
    from src.models.submission import Solve


class User(Base):
    __tablename__ = "users"
    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    solves: Mapped[list["Solve"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    refresh_sessions: Mapped[list["RefreshSession"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def verify_password(self, password: str) -> bool:
        return verify_password(password, self.password_hash)

    def to_read_model(self) -> UserRead:
        # return UserRead.model_validate(self)
        return UserRead(
            id=self.id,
            username=self.username,
            email=self.email,
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

    user: Mapped["User"] = relationship(back_populates="refresh_sessions")
