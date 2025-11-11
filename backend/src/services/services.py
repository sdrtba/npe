import datetime
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.models import User, RefreshSession
from src.schemas import UserCreate, LoginRequest
from src.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
)
from src.services.users import UsersService


async def get_db_user(email: str, db: AsyncSession) -> User | None:
    stmt = select(User).filter(User.email == email)
    result = await db.execute(stmt)
    db_user = result.scalars().first()
    return db_user


async def create_db_user(
    user: UserCreate, db: AsyncSession, user_service: UsersService
) -> User:
    user_db = await user_service.check_user_exists(user.username, user.email)

    # res = await UsersRepository().find_all(
    #     custom_filter=((User.username == user.username) | (User.email == user.email))
    # )

    # stmt = select(User).filter(
    #     (User.username == user.username) | (User.email == user.email)
    # )
    # result = await db.execute(stmt)
    # exists = result.scalars().first()
    if user_db:
        raise HTTPException(status_code=409, detail="Username or email already exists")

    # res = await UsersRepository().add_one(
    #     {
    #         "username": user.username,
    #         "password_hash": hash_password(user.password.get_secret_value()),
    #         "email": user.email,
    #         "role": user.role,
    #     }
    # )
    user_db = await user_service.add_user(user)
    return user_db

    # db_user = User(
    #     username=user.username,
    #     password_hash=hash_password(user.password.get_secret_value()),
    #     email=user.email,
    #     role=user.role,
    # )
    # db.add(db_user)
    # try:
    #     await db.commit()
    #     await db.refresh(db_user)
    # except IntegrityError:
    #     await db.rollback()
    #     raise HTTPException(status_code=409, detail="Username or email already exists")
    # return user_db


async def login_user(login: LoginRequest, db: AsyncSession) -> User:
    db_user = await get_db_user(email=login.email, db=db)
    if not db_user:
        raise HTTPException(status_code=404, detail="User Not Found")

    if not db_user.verify_password(login.password.get_secret_value()):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return db_user


async def create_tokens(user: User, db: AsyncSession) -> dict[str, str]:
    payload = {
        "id": user.id,
        "email": user.email,
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXP_MIN),
    }

    access_token = create_access_token(payload)
    refresh_token, refresh_token_hash = create_refresh_token()

    session = RefreshSession(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.REFRESH_TOKEN_EXP_MIN),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {"access_token": access_token, "refresh_token": refresh_token}


async def logout(cookie: str, db: AsyncSession) -> None:
    payload = decode_access_token(cookie)
    stmt = select(RefreshSession).filter(User.email == payload["email"])
    result = await db.execute(stmt)
    session = result.scalars().first()

    if session:
        db.delete(session)
        await db.commit()


# async def get_current_user(
#     db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
# ):
#     try:
#         payload = jwt.decode(
#             token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
#         )
#         db_user = db.get(User, payload["user_id"])
#         if db_user is None:
#             raise HTTPException(status_code=404, detail="User Not Found")
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token Expired")
#     except InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid Token")
#     except:
#         raise HTTPException(status_code=401, detail="Something went wrong")

#     return db_user


# async def update_user_password(
#     user: UserRead, old_password: str, new_password: str, db: Session
# ):
#     db_user = await get_db_user(username=user.username, db=db)

#     if not db_user:
#         raise HTTPException(status_code=404, detail="User Not Found")

#     if not db_user.verify_password(old_password):
#         raise HTTPException(status_code=401, detail="Incorrect current password")

#     db_user.password_hash = bcrypt.hash(new_password)
#     db.commit()
#     db.refresh(db_user)

#     return db_user
