from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, SecretStr

from src.schemas.base import ORMModel

# =========================
# Auth
# =========================


class TokenResponse(BaseModel):
    accessToken: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)


# =========================
# User
# =========================


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    email: EmailStr


class UserCreate(UserBase):
    password: SecretStr = Field(min_length=8)


class UserRead(UserBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=64)
    email: EmailStr | None = None
    password: SecretStr | None = None
