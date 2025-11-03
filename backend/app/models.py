from passlib.hash import bcrypt
from sqlalchemy import Column, Integer, String
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String)

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)
