from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field, SecretStr

from src.schemas.user import UserRead
from src.core.enums import Difficulty
from src.schemas.base import ORMModel


# =========================
# Category
# =========================


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase, ORMModel):
    id: int


class CategoryWithTasksCount(CategoryRead):
    tasks_count: int


# =========================
# TaskAttachment
# =========================


class TaskAttachmentRead(ORMModel):
    id: int
    task_id: int
    filename: str = Field(min_length=1, max_length=256)
    sha256: str = Field(pattern=r"^[0-9a-f]{64}$")
    created_at: datetime


# =========================
# Task
# =========================


class TaskBase(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=256)
    description: str
    author: str | None = None
    difficulty: Difficulty
    base_score: int = Field(ge=0)


class TaskCreate(TaskBase):
    flag: SecretStr = Field(min_length=1)


# Для списка задач по категории: /tasks/{category}
class TaskListItem(ORMModel):
    id: int
    name: str
    difficulty: Difficulty
    base_score: int
    category: CategoryRead


# Детальная задача: /tasks/{category}/{task_id}
class TaskRead(ORMModel, TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    category: CategoryRead
    attachments: list[TaskAttachmentRead] = []


# =========================
# Submission / проверка флага
# =========================


class SubmissionCreate(BaseModel):
    task_id: int
    flag: SecretStr = Field(min_length=1)


class SubmissionRead(ORMModel):
    id: int
    user_id: int
    task_id: int
    is_correct: bool
    created_at: datetime


# =========================
# Solve (решённые задачи)
# =========================


class SolveRead(ORMModel):
    user_id: int
    task_id: int
    solved_at: datetime
    points_awarded: int = Field(ge=0)


# Пример для таблицы лидерборда
class UserScoreEntry(BaseModel):
    user: UserRead
    total_points: int
    solves_count: int
