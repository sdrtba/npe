from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from typing import TypeVar, Generic


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int
