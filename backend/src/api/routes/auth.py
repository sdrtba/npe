from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Response, Cookie

from src.core.config import settings
from src.schemas.schemas import UserCreate, TokenResponse, LoginRequest
from src.core.database import get_db
from src.services.services import (
    create_db_user,
    create_tokens,
    login_user,
)


router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register_user(
    user: UserCreate, response: Response, db: Session = Depends(get_db)
):
    db_user = await create_db_user(user, db)

    tokens = await create_tokens(db_user, db)
    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXP_MIN,
    )
    return TokenResponse(accessToken=tokens["access_token"])


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(response: Response, login: LoginRequest, db: Session = Depends(get_db)):
    db_user = await login_user(login=login, db=db)

    tokens = await create_tokens(db_user, db)
    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXP_MIN,
    )
    return TokenResponse(accessToken=tokens["access_token"])


# logout using cookie in logout
@router.post(
    "/logout",
    response_model=TokenResponse,
)
async def logout(
    response: Response,
    db: Session = Depends(get_db),
    cookie: str | None = Cookie(default=None, alias="accessToken"),
):
    await logout(cookie=cookie, db=db)
    response.delete_cookie(key="refreshToken")
    return TokenResponse(accessToken=None)


# @router.get(
#     "/me",
#     response_model=UserRead,
# )
# async def me(request: Request):
#     print("me")
#     cookie = request.cookies
#     print("Cookie:", cookie)
#     if not cookie:
#         raise HTTPException(status_code=401, detail="Unauthorized")
#     return UserRead(id=1, email="qwe@qwe")


# @router.post(
#     "/refresh",
#     response_model=TokenResponse,
# )
# async def refresh_token(
#     response: Response, db: Session = Depends(get_db), request: Request = None
# ):
#     tokens = await create_tokens(db_user)
#     response.set_cookie(
#         key="refreshToken",
#         value=tokens["refresh_token"],
#         httponly=True,
#         secure=True,
#         samesite="lax",
#         max_age=settings.REFRESH_TOKEN_EXP_MIN,
#     )
#     return TokenResponse(accessToken=tokens["access_token"])
