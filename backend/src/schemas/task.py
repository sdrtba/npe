from __future__ import annotations
from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


# =========================
# Category
# =========================


class CategoryRead(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class CategoryWithTasksCount(BaseModel):
    id: int
    tasks_count: int
    name: str
    model_config = ConfigDict(from_attributes=True)


# =========================
# TaskAttachment
# =========================


class TaskAttachmentRead(BaseModel):
    id: int
    task_id: int
    filename: str = Field(min_length=1, max_length=256)
    sha256: str = Field(pattern=r"^[0-9a-f]{64}$")
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# =========================
# Task
# =========================


# Для списка задач по категории: /tasks/{category}
class TaskListItem(BaseModel):
    id: int
    # category_id: int
    name: str = Field(min_length=1, max_length=256)
    slug: str = Field(min_length=1, max_length=256)
    difficulty: Difficulty
    base_score: int
    category: CategoryRead
    model_config = ConfigDict(from_attributes=True)


# Детальная задача: /tasks/{category}/{task_id}
class TaskRead(TaskListItem):
    description: str
    author: str | None = None
    created_at: datetime
    updated_at: datetime

    attachments: list[TaskAttachmentRead] = []
    model_config = ConfigDict(from_attributes=True)
