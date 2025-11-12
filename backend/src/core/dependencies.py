from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.core.security import decode_access_token
from src.models import User
from src.core.database import get_db
from src.repository import UsersRepository, SessionsRepository
from src.services import UsersService, SessionsService


security = HTTPBearer(auto_error=False)


def get_user_service():
    return UsersService(UsersRepository())


def get_session_service():
    return SessionsService(SessionsRepository())


UserSrvDep = Annotated[UsersService, Depends(get_user_service)]
SessionSrvDep = Annotated[SessionsService, Depends(get_session_service)]
SessionDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    user_service: UsersService = Depends(get_user_service),
) -> User:
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=403,
            detail="Invalid or expired token",
        )

    user = await user_service.get_user_by_id(payload.get("id"))
    if not user:
        raise HTTPException(
            status_code=403,
            detail="User not found",
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


# security = HTTPBearer()
# async def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(security),
#     db: Session = Depends(get_db),
# ):
#     try:
#         payload = jwt.decode(
#             credentials.credentials,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM],
#         )
#         user_id = payload.get("id")
#         if not user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid authentication credentials",
#             )

#         user = db.query(User).filter(User.id == user_id).first()
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="User not found",
#             )

#         return user
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token has expired",
#         )
#     except jwt.InvalidTokenError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#         )


# async def require_admin(user: User = Depends(get_current_user)) -> User:
#     if user.role != UserRole.admin:
#         raise HTTPException(
#             status_code=403,
#             detail="Admin access required",
#         )
#     return user
