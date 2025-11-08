import os
import secrets
import jwt
import datetime

from passlib.hash import bcrypt
from passlib.exc import InvalidTokenError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from src.config import settings
from src.models import User, RefreshSession
from src.schemas import UserCreate, UserRead, LoginRequest
from src.database import Base, SessionLocal, engine

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def create_database():
    return Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_db_user(email: str, db: Session):
    db_user = db.query(User).filter(User.email == email).first()
    return db_user


async def create_db_user(user: UserCreate, db: Session):
    exists = (
        db.query(User)
        .filter((User.username == user.username) | (User.email == user.email))
        .first()
    )
    if exists:
        raise HTTPException(status_code=409, detail="Username or email already exists")

    db_user = User(
        username=user.username,
        password_hash=bcrypt.hash(user.password.get_secret_value()),
        email=user.email,
        role=user.role,
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email already exists")
    return db_user
    return db_user


async def login_user(email: str, password: str, db: Session):
    db_user = await get_db_user(email=email, db=db)
    if not db_user:
        raise HTTPException(status_code=404, detail="User Not Found")

    if not db_user.verify_password(password):
        raise HTTPException(
            status_code=401, detail="Invalid Credentials(from services)"
        )

    return db_user


async def create_tokens(user: User, db: Session) -> dict:
    access_payload = {
        "id": user.id,
        "email": user.email,
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXP_MIN),
    }

    access_token = jwt.encode(
        access_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    refresh_token = secrets.token_hex(32)

    session = RefreshSession(
        user_id=user.id,
        token_hash=bcrypt.hash(refresh_token).encode("utf-8"),
        expires_at=datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.REFRESH_TOKEN_EXP_MIN),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {"access_token": access_token, "refresh_token": refresh_token}


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
