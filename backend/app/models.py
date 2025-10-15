from datetime import datetime
from passlib.hash import bcrypt
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import Base


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="groups")
    contacts = relationship("Contact", back_populates="group")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String)

    contacts = relationship("Contact", back_populates="user")
    groups = relationship("Group", back_populates="user", cascade="all, delete-orphan")

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), index=True)
    middle_name = Column(String(255), index=True)
    last_name = Column(String(255), index=True)
    email = Column(String(255), index=True)
    phone = Column(String(255), index=True)
    group_name = Column(String(255), index=True)
    date_created = Column(DateTime, default=datetime.now)
    date_updated = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="contacts")

    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    group = relationship("Group", back_populates="contacts")
