from fastapi import APIRouter, Cookie, HTTPException, Response

from src.core.config import settings
from src.core.dependencies import UserSrvDep, SessionSrvDep, CurrentUser
from src.schemas import UserCreate, TokenResponse, LoginRequest, UserRead

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register_user(
    user: UserCreate,
    response: Response,
    user_service: UserSrvDep,
    session_service: SessionSrvDep,
):
    await user_service.check_user_exists(user)
    db_user = await user_service.add_user(user)
    tokens = await session_service.create_tokens(db_user)
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
    login: LoginRequest,
    response: Response,
    user_service: UserSrvDep,
    session_service: SessionSrvDep,
):
    db_user = await user_service.login_user(login)
    tokens = await session_service.create_tokens(db_user)
    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXP_MIN,
    )
    return TokenResponse(accessToken=tokens["access_token"])


@router.post("/logout")
async def logout(
    response: Response,
    session_service: SessionSrvDep,
    refresh_token: str | None = Cookie(default=None, alias="refreshToken"),
):
    if refresh_token:
        await session_service.revoke_token(refresh_token)

    response.delete_cookie(
        key="refreshToken",
        httponly=True,
        secure=True,
        samesite="lax",
    )

    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
async def get_current_user_info(current_user: CurrentUser):
    return current_user.to_read_model()


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    response: Response,
    user_service: UserSrvDep,
    session_service: SessionSrvDep,
    refresh_token: str | None = Cookie(default=None, alias="refreshToken"),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found")

    user = await session_service.verify_refresh_token(refresh_token)
    if not user:
        raise HTTPException(
            status_code=403,
            detail="Invalid or expired refresh token",
        )

    await session_service.revoke_token(refresh_token)

    tokens = await session_service.create_tokens(user)

    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXP_MIN,
    )

    return TokenResponse(accessToken=tokens["access_token"])
