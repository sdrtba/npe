import datetime
import hashlib

from src.core.config import settings
from src.schemas import UserRead
from src.repository.repository import AbstractRepository
from src.core.security import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)


class SessionsService:
    def __init__(self, repo: AbstractRepository):
        self.repo: AbstractRepository = repo

    async def create_tokens(self, user: UserRead):
        payload = {
            "id": user.id,
            "email": user.email,
            "exp": datetime.datetime.now(datetime.UTC)
            + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXP_MIN),
        }

        access_token = create_access_token(payload)
        refresh_token, refresh_token_hash = create_refresh_token()

        await self.repo.add_one(
            {
                "user_id": user.id,
                "token_hash": refresh_token_hash,
                "expires_at": datetime.datetime.now(datetime.UTC)
                + datetime.timedelta(minutes=settings.REFRESH_TOKEN_EXP_MIN),
            }
        )

        return {"access_token": access_token, "refresh_token": refresh_token}

    async def verify_refresh_token(self, refresh_token: str) -> UserRead | None:
        try:
            token_bytes = bytes.fromhex(refresh_token)
            token_hash = hashlib.sha256(token_bytes).digest()

            session = await self.repo.find_session_by_hash(token_hash)

            if not session:
                return None

            if session.expires_at < datetime.datetime.now(datetime.UTC):
                await self.repo.delete_by_hash(token_hash)
                return None

            return UserRead.model_validate(session.user)

        except (ValueError, AttributeError):
            return None

    # async def revoke_token(self, refresh_token: str):
    #     await self.repo.delete_by_hash(hash_refresh_token(refresh_token))

    async def revoke_token(self, refresh_token: str):
        """Удаляет refresh token из БД"""
        if not refresh_token:
            return

        try:
            token_bytes = bytes.fromhex(refresh_token)
            token_hash = hashlib.sha256(token_bytes).digest()
            await self.repo.delete_by_hash(token_hash)
        except ValueError:
            pass
