from src.models import Solve
from src.utils.repository import SQLAlchemyRepository


class SolveRepository(SQLAlchemyRepository[Solve]):
    model = Solve
