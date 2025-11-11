from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field, SecretStr
from src.core.enums import Difficulty
from src.schemas.base import ORMModel


class TaskAttachmentBase(BaseModel):
    filename: str = Field(min_length=1, max_length=256)
    sha256: str = Field(pattern=r"^[0-9a-f]{64}$")


class TaskAttachmentRead(TaskAttachmentBase, ORMModel):
    id: int
    task_id: int
    created_at: datetime


class TaskBase(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=256)
    description: str
    author: str | None = None
    difficulty: Difficulty
    base_score: int = Field(ge=0)


class TaskCreate(TaskBase):
    flag: SecretStr = Field(min_length=1)


class TaskRead(TaskBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime
    attachments: list[TaskAttachmentRead] = []
