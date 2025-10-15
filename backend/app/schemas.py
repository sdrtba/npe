from datetime import datetime
from typing import Optional

from pydantic import BaseModel, constr


class UserBaseS(BaseModel):
    username: str


class UserCreateS(UserBaseS):
    password: str

    class Config:
        from_attributes = True


class UserS(UserBaseS):
    id: int

    class Config:
        from_attributes = True


class PasswordUpdateS(BaseModel):
    old_password: str
    new_password: str


class ContactBaseS(BaseModel):
    first_name: constr(max_length=255)
    middle_name: constr(max_length=255)
    last_name: constr(max_length=255)
    email: constr(max_length=255)
    phone: constr(max_length=255)
    group_name: Optional[constr(max_length=255)] = None


class ContactCreateS(ContactBaseS):
    pass


class ContactS(ContactBaseS):
    id: int
    user_id: int
    date_created: datetime
    date_updated: datetime

    class Config:
        from_attributes = True


class GroupBaseS(BaseModel):
    name: str


class GroupCreateS(GroupBaseS):
    pass


class GroupS(GroupBaseS):
    id: int
    user_id: int

    class Config:
        from_attributes = True
