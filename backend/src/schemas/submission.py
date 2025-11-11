from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field, SecretStr
from src.schemas.base import ORMModel


class SubmissionCreate(BaseModel):
    flag: SecretStr = Field(min_length=1)


class SubmissionRead(ORMModel):
    id: int
    user_id: int
    task_id: int
    is_correct: bool
    created_at: datetime


class SolveRead(ORMModel):
    user_id: int
    task_id: int
    solved_at: datetime
    points_awarded: int = Field(ge=0)
