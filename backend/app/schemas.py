from __future__ import annotations
from typing import Annotated
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, SecretStr
from app.enums import UserRole, Difficulty


# ---- User ----
class UserBase(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=64)]
    email: EmailStr
    role: UserRole = UserRole.user


class UserCreate(UserBase):
    password: Annotated[SecretStr, Field(min_length=8)]


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=64)] | None = None
    email: EmailStr | None = None
    role: UserRole | None = None


class PasswordChange(BaseModel):
    old_password: Annotated[SecretStr, Field(min_length=8)]
    new_password: Annotated[SecretStr, Field(min_length=8)]


# ---- RefreshSession ----
class RefreshSessionRead(BaseModel):
    id: int
    user_id: int
    token: str
    created_at: datetime
    expires_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---- Category ----
class CategoryBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=64)]


class CategoryRead(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---- Task & Attachment ----
class TaskAttachmentBase(BaseModel):
    filename: Annotated[str, Field(min_length=1, max_length=256)]
    sha256: Annotated[str, Field(regex=r"^[0-9a-f]{64}$")]


class TaskAttachmentRead(TaskAttachmentBase):
    id: int
    task_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TaskBase(BaseModel):
    category_id: int
    name: Annotated[str, Field(min_length=1, max_length=256)]
    description: str
    author: str | None = None
    difficulty: Difficulty
    base_score: Annotated[int, Field(ge=0)]


class TaskCreate(TaskBase):
    flag: Annotated[SecretStr, Field(min_length=1)]


class TaskRead(TaskBase):
    id: int
    solved: bool
    created_at: datetime
    updated_at: datetime
    attachments: list[TaskAttachmentRead] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


# ---- Submission ----
class SubmissionCreate(BaseModel):
    flag: Annotated[SecretStr, Field(min_length=1)]


class SubmissionRead(BaseModel):
    id: int
    user_id: int
    task_id: int
    is_correct: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---- Solve ----
class SolveRead(BaseModel):
    user_id: int
    task_id: int
    solved_at: datetime
    points_awarded: Annotated[int, Field(ge=0)]
    model_config = ConfigDict(from_attributes=True)
