from __future__ import annotations
from typing import Annotated
from datetime import datetime
from sqlalchemy.orm import mapped_column
from sqlalchemy import DateTime, func

from src.core.database import Base

__all__ = ["Base", "intpk", "created_at", "updated_at", "expires_at", "solved_at"]

intpk = Annotated[int, mapped_column(primary_key=True)]

created_at = Annotated[
    datetime,
    mapped_column(DateTime(timezone=True), server_default=func.now()),
]

updated_at = Annotated[
    datetime,
    mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    ),
]

expires_at = Annotated[
    datetime, mapped_column(DateTime(timezone=True), index=True, nullable=False)
]

solved_at = Annotated[
    datetime, mapped_column(DateTime(timezone=True), index=True, nullable=False)
]
