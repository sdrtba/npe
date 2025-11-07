import datetime
import jwt

from passlib.hash import bcrypt
from passlib.exc import InvalidTokenError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.models import User
from app.database import Base, SessionLocal, engine
from app.schemas import UserCreateS, UserS

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def create_database():
    return Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_db_user(username: str, db: Session):
    db_user = db.query(User).filter(User.username == username).first()
    return db_user


async def create_db_user(user: UserCreateS, db: Session):
    db_user = User(username=user.username, hashed_password=bcrypt.hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        db_user = db.get(User, payload["user_id"])
        if db_user is None:
            raise HTTPException(status_code=404, detail="User Not Found")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token Expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    except:
        raise HTTPException(status_code=401, detail="Something went wrong")

    return db_user


async def update_user_password(
    user: UserS, old_password: str, new_password: str, db: Session
):
    db_user = await get_db_user(username=user.username, db=db)

    if not db_user:
        raise HTTPException(status_code=404, detail="User Not Found")

    if not db_user.verify_password(old_password):
        raise HTTPException(status_code=401, detail="Incorrect current password")

    db_user.password_hash = bcrypt.hash(new_password)
    db.commit()
    db.refresh(db_user)

    return db_user


async def auth_user(username: str, password: str, db: Session):
    db_user = await get_db_user(username=username, db=db)

    if not db_user:
        return False
    if not db_user.verify_password(password):
        return False

    return db_user


async def create_tokens(user: User) -> dict:
    # Payload для access_token (короткий срок жизни)
    access_payload = {
        "id": user.id,
        "email": user.email,
        "type": "access",
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.TOKEN_EXPIRATION_MINUTES),
    }

    # Payload для refresh_token (долгий срок жизни)
    refresh_payload = {
        "id": user.id,
        "email": user.email,
        "type": "refresh",
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(days=settings.REFRESH_TOKEN_EXPIRATION_DAYS),
    }

    # Кодируем токены
    access_token = jwt.encode(
        access_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    refresh_token = jwt.encode(
        refresh_payload, settings.REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return {"access_token": access_token, "refresh_token": refresh_token}
