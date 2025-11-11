from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, SecretStr
from src.schemas.base import ORMModel


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    email: EmailStr


class UserCreate(UserBase):
    password: SecretStr = Field(min_length=8)


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=64)
    email: EmailStr | None = None


class UserRead(UserBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime
