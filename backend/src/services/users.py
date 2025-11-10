from src.schemas.schemas import UserCreate, UserRead
from src.repository.repository import AbstractRepository
from src.core.security import hash_password


class UsersService:
    def __init__(self, repo: AbstractRepository):
        self.repo: AbstractRepository = repo

    async def add_user(self, user: UserCreate):
        return await self.repo.add_one(
            {
                "username": user.username,
                "password_hash": hash_password(user.password.get_secret_value()),
                "email": user.email,
                "role": user.role,
            }
        )

    async def check_user_exists(self, username: str = None, email: str = None):
        filters = {}
        if username:
            filters["username"] = username
        if email:
            filters["email"] = email

        if not filters:
            return []

        results = []
        if username:
            results.extend(await self.repo.find_all(filter_by={"username": username}))
        if email:
            results.extend(await self.repo.find_all(filter_by={"email": email}))
        return results

    async def get_user(self, user: UserRead):
        return await self.repo.find_all(user.model_dump())
