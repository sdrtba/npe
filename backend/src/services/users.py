from fastapi import HTTPException
from psycopg import IntegrityError

from src.schemas import UserCreate, UserRead, LoginRequest
from src.utils.uow import AbstractUnitOfWork
from src.utils.security import hash_password, verify_password


class UsersService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def add_user(self, user: UserCreate):
        username = user.username.strip()
        email = user.email.strip().lower()

        password_hash = hash_password(user.password.get_secret_value())

        async with self.uow:
            try:
                entity = await self.uow.users.add_one(
                    {
                        "username": username,
                        "password_hash": password_hash,
                        "email": email,
                    }
                )
                await self.uow.commit()
            except IntegrityError as e:
                await self.uow.rollback()
                msg = str(e.orig).lower()
                if "username" in msg:
                    raise HTTPException(status_code=409, detail="Username already exists") from e
                if "email" in msg:
                    raise HTTPException(status_code=409, detail="Email already exists") from e
                raise

        return UserRead.model_validate(entity)

    async def check_user_exists(self, user: UserCreate):
        async with self.uow:
            if user.username:
                existing = await self.uow.users.find_all(filter_by={"username": user.username})
                if existing:
                    raise HTTPException(status_code=409, detail="Username already exists")

            if user.email:
                existing = await self.uow.users.find_all(filter_by={"email": user.email})
                if existing:
                    raise HTTPException(status_code=409, detail="Email already exists")

    async def get_user(self, user: UserRead):
        async with self.uow:
            return await self.uow.users.find_all(user.model_dump())

    async def login_user(self, login: LoginRequest):
        async with self.uow:
            user = await self.uow.users.find_one(email=login.email)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            if not verify_password(login.password.get_secret_value(), user.password_hash):
                raise HTTPException(status_code=403, detail="Invalid Credentials")

            return user

    async def get_user_by_id(self, user_id: int):
        async with self.uow:
            user = await self.uow.users.find_one(id=user_id)
            return user
