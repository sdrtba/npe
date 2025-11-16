from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.models import User
from src.repository import UnitOfWork
from src.services import UsersService, SessionsService, TasksService, CategoriesService
from src.utils.security import decode_access_token


security = HTTPBearer(auto_error=False)


def get_uow():
    return UnitOfWork()


def get_user_service(uow: UnitOfWork = Depends(get_uow)):
    return UsersService(uow)


def get_session_service(uow: UnitOfWork = Depends(get_uow)):
    return SessionsService(uow)


def get_tasks_service(uow: UnitOfWork = Depends(get_uow)):
    return TasksService(uow)


def get_categories_service(uow: UnitOfWork = Depends(get_uow)):
    return CategoriesService(uow)


UserSrvDep = Annotated[UsersService, Depends(get_user_service)]
SessionSrvDep = Annotated[SessionsService, Depends(get_session_service)]
TaskSrvDep = Annotated[TasksService, Depends(get_tasks_service)]
CategorySrvDep = Annotated[CategoriesService, Depends(get_categories_service)]


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    user_service: UsersService = Depends(get_user_service),
) -> User:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired token",
        )

    user = await user_service.get_user_by_id(payload.get("id"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
