from __future__ import annotations
from pydantic import BaseModel, Field
from src.schemas.base import ORMModel


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=64)


class CategoryRead(CategoryBase, ORMModel):
    id: int
