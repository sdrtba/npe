import jwt
import hmac
import secrets
import hashlib
from passlib.hash import bcrypt
from src.core.config import settings


# Password
def hash_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.verify(password, hashed_password)


# JWT
def create_access_token(payload: dict) -> str:
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# Refresh Token
def hash_refresh_token(refresh_token: str) -> str:
    return hashlib.sha256(refresh_token.encode("utf-8")).hexdigest()


def create_refresh_token() -> tuple[str, str]:
    token = secrets.token_urlsafe(32)
    token_hash = hash_refresh_token(token)

    return token, token_hash


def verify_refresh_token(token: str, hashed_token: str) -> bool:
    computed_hash = hash_refresh_token(token)
    return hmac.compare_digest(computed_hash, hashed_token)


# Flag
def hash_flag(flag: str) -> str:
    normalized_flag = flag.strip()
    return hashlib.sha256(normalized_flag.encode("utf-8")).hexdigest()


def verify_flag(flag: str, hashed_flag: str) -> bool:
    computed_hash_hex = hash_flag(flag)
    return hmac.compare_digest(computed_hash_hex, hashed_flag)
