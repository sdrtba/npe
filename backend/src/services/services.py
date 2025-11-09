import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from src.core.config import settings
from src.models.models import User, RefreshSession
from src.schemas.schemas import UserCreate, LoginRequest
from src.core.security import (
    hash_password,
    create_access_token,
    create_refresh_token,
    deocde_access_token,
)


async def get_db_user(email: str, db: Session) -> User | None:
    db_user = db.query(User).filter(User.email == email).first()
    return db_user


async def create_db_user(user: UserCreate, db: Session) -> User:
    exists = (
        db.query(User)
        .filter((User.username == user.username) | (User.email == user.email))
        .first()
    )
    if exists:
        raise HTTPException(status_code=409, detail="Username or email already exists")

    db_user = User(
        username=user.username,
        password_hash=hash_password(user.password.get_secret_value()),
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


async def login_user(login: LoginRequest, db: Session) -> User:
    db_user = await get_db_user(email=login.email, db=db)
    if not db_user:
        raise HTTPException(status_code=404, detail="User Not Found")

    if not db_user.verify_password(login.password.get_secret_value()):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return db_user


async def create_tokens(user: User, db: Session) -> dict[str, str]:
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
    db.commit()
    db.refresh(session)

    return {"access_token": access_token, "refresh_token": refresh_token}


async def logout(cookie: str, db: Session) -> None:
    payload = deocde_access_token(cookie)
    session = db.query(RefreshSession).filter(User.email == payload["email"]).first()

    if session:
        db.delete(session)
        db.commit()


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
