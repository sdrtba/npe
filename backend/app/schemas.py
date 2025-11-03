from pydantic import BaseModel


class UserBaseS(BaseModel):
    email: str


class UserCreateS(UserBaseS):
    password: str

    class Config:
        from_attributes = True


class UserS(UserBaseS):
    id: int

    class Config:
        from_attributes = True


class PasswordUpdateS(BaseModel):
    old_password: str
    new_password: str


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
