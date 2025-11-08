from sqlalchemy.orm import Session
from fastapi import Cookie, APIRouter, Depends, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from src.schemas import UserCreate, UserRead, TokenResponse, LoginRequest
from src.services import (
    get_db,
    get_db_user,
    create_db_user,
    create_tokens,
    login_user,
    # get_current_user,
    # remove_session,
)
from src.config import settings


router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register_user(
    user: UserCreate, response: Response = None, db: Session = Depends(get_db)
):
    db_user = await create_db_user(user, db)

    tokens = await create_tokens(db_user, db=db)
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
async def login(
    response: Response,
    login: LoginRequest,
    db: Session = Depends(get_db),
):
    db_user = await login_user(
        email=login.email, password=login.password.get_secret_value(), db=db
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Credentials(from router)")

    tokens = await create_tokens(db_user, db=db)
    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXP_MIN,
    )
    return TokenResponse(accessToken=tokens["access_token"])


# @router.post(
#     "/logout",
#     response_model=TokenResponse,
# )
# async def logout(
#     response: Response,
#     db: Session = Depends(get_db),
#     user: UserRead = Depends(get_current_user),
# ):
#     await remove_session(user=user, db=db)
#     response.delete_cookie(key="refreshToken")
#     return TokenResponse(accessToken=None)


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
