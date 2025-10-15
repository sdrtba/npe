import jwt
import datetime

from passlib.hash import bcrypt
from passlib.exc import InvalidTokenError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from config import settings
from models import User, Contact, Group
from database import Base, SessionLocal, engine
from schemas import UserCreateS, UserS, ContactCreateS, GroupCreateS

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

    db_user.hashed_password = bcrypt.hash(new_password)
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


async def create_token(user: User):
    token_payload = {
        "user_id": user.id,
        "user_name": user.username,
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(minutes=settings.TOKEN_EXPIRATION_MINUTES),
    }

    token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return dict(status_code=201, access_token=token, token_type="Bearer")


async def _contact_selector(contact_id: int, user: UserS, db: Session):
    db_contact = (
        db.query(Contact)
        .filter_by(user_id=user.id)
        .filter(Contact.id == contact_id)
        .first()
    )

    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact Not Found")

    return db_contact


async def get_db_contact(contact_id: int, user: UserS, db: Session):
    db_contact = await _contact_selector(contact_id=contact_id, user=user, db=db)
    return db_contact


async def get_db_contacts(offset: int, limit: int, user: UserS, db: Session):
    db_contacts = (
        db.query(Contact).filter_by(user_id=user.id).offset(offset).limit(limit).all()
    )

    if db_contacts is None:
        raise HTTPException(status_code=404, detail="Contacts Not Found")

    return db_contacts


async def create_db_contact(user: UserS, contact: ContactCreateS, db: Session):
    db_contact = Contact(**contact.model_dump(), user_id=user.id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


async def update_db_contact(
    contact_id: int, user: UserS, contact: ContactCreateS, db: Session
):
    db_contact = await _contact_selector(contact_id=contact_id, user=user, db=db)

    db_contact.first_name = contact.first_name
    db_contact.middle_name = contact.middle_name
    db_contact.last_name = contact.last_name
    db_contact.email = contact.email
    db_contact.phone = contact.phone
    db_contact.group_name = contact.group_name

    db.commit()
    db.refresh(db_contact)
    return db_contact


async def delete_db_contact(contact_id: int, user: UserS, db: Session):
    db_contact = await _contact_selector(contact_id=contact_id, user=user, db=db)

    db.delete(db_contact)
    db.commit()

    return dict(status_code=201, details="Contact Deleted")


async def get_db_groups(user: UserS, db: Session):
    db_groups = db.query(Group).filter_by(user_id=user.id).all()

    if db_groups is None:
        raise HTTPException(status_code=404, detail="Groups Not Found")

    return db_groups


async def create_db_group(group: GroupCreateS, user: UserS, db: Session):
    db_group = (
        db.query(Group)
        .filter_by(user_id=user.id)
        .filter(Group.name == group.name)
        .first()
    )

    if db_group is not None:
        raise HTTPException(status_code=429, detail="Group Already Exists")

    db_group = Group(name=group.name, user_id=user.id)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


async def update_db_group(group_id: int, user: UserS, group: GroupCreateS, db: Session):
    db_group = (
        db.query(Group).filter_by(user_id=user.id).filter(Group.id == group_id).first()
    )

    if db_group is None:
        raise HTTPException(status_code=404, detail="Group Not Found")

    db.query(Contact).filter_by(user_id=user.id, group_name=db_group.name).update(
        {Contact.group_name: group.name}, synchronize_session=False
    )

    db_group.name = group.name

    db.commit()
    db.refresh(db_group)
    return db_group


async def delete_db_group(group_id: int, user: UserS, db: Session):
    db_group = (
        db.query(Group).filter_by(user_id=user.id).filter(Group.id == group_id).first()
    )

    if db_group is None:
        raise HTTPException(status_code=404, detail="Group Not Found")

    db.query(Contact).filter_by(user_id=user.id, group_name=db_group.name).update(
        {Contact.group_id: None, Contact.group_name: None}, synchronize_session=False
    )

    db.delete(db_group)
    db.commit()

    return dict(status_code=201, details="Group Deleted")
