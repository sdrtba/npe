from enum import Enum


class UserRole(str, Enum):
    user = "user"
    admin = "admin"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"
