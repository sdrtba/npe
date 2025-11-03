from sqlalchemy.orm import Session
from fastapi import Cookie, FastAPI, Depends, HTTPException, Response, Request
from starlette.middleware.cors import CORSMiddleware
from app.schemas import UserCreateS, UserS, TokenResponse
from app.services import (
    create_database,
    get_db,
    get_db_user,
    create_db_user,
    create_tokens,
)
from app.config import settings


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    create_database()


@app.post(
    "/api/auth/register",
    response_model=TokenResponse,
)
async def register_user(
    user: UserCreateS, db: Session = Depends(get_db), response: Response = None
):
    db_user = await get_db_user(email=user.email, db=db)
    if db_user:
        raise HTTPException(status_code=409, detail="User already exists")
    db_user = await create_db_user(user, db)

    tokens = await create_tokens(db_user)
    response.set_cookie(
        key="refreshToken",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.TOKEN_EXPIRATION_MINUTES * 86400,
    )
    return TokenResponse(accessToken=tokens["access_token"])


@app.post(
    "/api/auth/login",
    response_model=dict,
)
async def login(user: UserCreateS, response: Response):
    print(user.email, user.password)

    response.set_cookie(
        key="refreshToken",
        value="refresh_token",
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.TOKEN_EXPIRATION_MINUTES * 86400,
    )

    return {"accessToken": "accessToken"}


@app.post(
    "/api/auth/logout",
    response_model=dict,
)
async def logout():
    print("Logout")
    return {"accessToken": None}


@app.get(
    "/api/auth/me",
    response_model=UserS,
)
async def me(request: Request):
    print("me")
    cookie = request.cookies
    print("Cookie:", cookie)
    if not cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return UserS(id=1, email="qwe@qwe")


@app.post(
    "/api/auth/refresh-token",
    response_model=dict,
)
async def refresh_token():
    print("refresh-token")
    return {"accessToken": "refreshAccessToken"}


@app.get("/api/health")
async def get_health():
    return {"status": "ok"}
