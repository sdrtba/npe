import jwt
import hmac
import secrets
import hashlib
from passlib.hash import bcrypt
from src.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)


def create_access_token(payload: dict) -> str:
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def deocde_access_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def create_refresh_token() -> tuple[str, bytes]:
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).digest()
    return token, token_hash


def verify_refresh_token(token: str, stored_hash: bytes) -> bool:
    computed_hash = hashlib.sha256(token.encode()).digest()
    return hmac.compare_digest(computed_hash, stored_hash)


def hash_flag(flag: str) -> bytes:
    return hashlib.sha256(flag.encode()).digest()


def verify_flag(provided_flag: str, stored_hash: bytes) -> bool:
    computed_hash = hashlib.sha256(provided_flag.encode()).digest()
    return hmac.compare_digest(computed_hash, stored_hash)
