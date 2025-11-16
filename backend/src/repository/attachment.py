from src.models import TaskAttachment
from src.utils.repository import SQLAlchemyRepository


class AttachmentRepository(SQLAlchemyRepository[TaskAttachment]):
    model = TaskAttachment
