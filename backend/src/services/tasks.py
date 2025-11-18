import datetime
import hashlib

from src.schemas import UserRead, TaskRead, TaskListItem
from src.utils.uow import AbstractUnitOfWork


class TasksService:
    def __init__(self, uow: AbstractUnitOfWork):
        self.uow = uow

    async def get_task(self, task_id: int) -> TaskRead | None:
        async with self.uow:
            task = await self.uow.tasks.get_full_task(task_id=task_id)

            if task is None:
                return None

            return TaskRead.model_validate(task, from_attributes=True)

    async def get_tasks_by_category(self, category_name: str) -> list[TaskListItem]:
        async with self.uow:
            tasks = await self.uow.tasks.find_by_category_name(category_name=category_name)

            return [TaskListItem.model_validate(t, from_attributes=True) for t in tasks]

    async def check_flag(self, task_id: int, flag: str, user: UserRead) -> tuple[bool, bool, int | None]:
        """
        Возвращает кортеж:
        (is_correct, already_solved, points_awarded)
        """
        async with self.uow:
            task = await self.uow.tasks.get_full_task(task_id=task_id)
            if task is None:
                return False, False, None

            if not task.check_flag(flag=flag):
                return False, False, None

            existing_solve = await self.uow.solves.find_one(
                user_id=user.id,
                task_id=task_id,
            )
            if existing_solve:
                return True, True, existing_solve.points_awarded

            points = task.base_score
            await self.uow.solves.add_one(
                {
                    "user_id": user.id,
                    "task_id": task_id,
                    "points_awarded": points,
                    "solved_at": datetime.datetime.utcnow(),
                }
            )

            await self.uow.commit()

            return True, False, points
