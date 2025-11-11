from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field, SecretStr


class TokenResponse(BaseModel):
    accessToken: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=8)


class PasswordChange(BaseModel):
    old_password: SecretStr = Field(min_length=8)
    new_password: SecretStr = Field(min_length=8)
