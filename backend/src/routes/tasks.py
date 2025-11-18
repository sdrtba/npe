from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from src.schemas import TaskRead, CheckFlagResponse, CheckFlagRequest
from src.core.dependencies import TaskSrvDep, UoWDep, CurrentUser
from src.core.config import settings

router = APIRouter()


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, task_service: TaskSrvDep):
    task = await task_service.get_task(task_id=task_id)

    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    return task


@router.post("/{task_id}/submit", response_model=CheckFlagResponse)
async def check_flag(task_id: int, payload: CheckFlagRequest, task_service: TaskSrvDep, current_user: CurrentUser):
    is_correct, already_solved, points = await task_service.check_flag(
        task_id=task_id,
        flag=payload.flag,
        user=current_user,
    )

    if not is_correct:
        raise HTTPException(status.HTTP_400_BAD_REQUEST)

    if already_solved:
        return CheckFlagResponse(correct=True, awarded=points, already_solved=True)

    return CheckFlagResponse(correct=True, awarded=points, already_solved=False)


@router.get("/attachment/{attachment_id}")
async def download_attachment(attachment_id: int, uow: UoWDep):
    async with uow:
        attachment = await uow.attachments.find_one(id=attachment_id)
        if attachment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        storage_path = Path(attachment.storage_path)
        file_path = Path(settings.FILE_STORAGE_DIR) / storage_path

        if not file_path.is_file():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found on server",
            )

        return FileResponse(
            path=file_path,
            filename=attachment.filename,
            media_type="application/octet-stream",
        )
