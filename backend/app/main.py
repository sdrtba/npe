import uvicorn
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from starlette.middleware.cors import CORSMiddleware
from schemas import (
    UserCreateS,
    UserS,
    ContactS,
    ContactCreateS,
    PasswordUpdateS,
    GroupS,
    GroupCreateS,
)
from services import (
    create_database,
    get_db,
    get_db_user,
    create_db_user,
    create_token,
    get_db_contacts,
    get_current_user,
    get_db_contact,
    create_db_contact,
    update_db_contact,
    delete_db_contact,
    auth_user,
    update_user_password,
    get_db_groups,
    create_db_group,
    delete_db_group,
    update_db_group,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://213.108.23.238",
        "https://213.108.23.238",
        "http://sdrtba.ru",
        "https://sdrtba.ru",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    create_database()


@app.post("/api/token")
async def generate_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    db_user = await auth_user(
        username=form_data.username, password=form_data.password, db=db
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await create_token(user=db_user)


@app.post("/api/users")
async def create_user(user: UserCreateS, db: Session = Depends(get_db)):
    db_user = await get_db_user(username=user.username, db=db)

    if db_user:
        raise HTTPException(status_code=409, detail="User already exists")

    db_user = await create_db_user(user, db)

    return await create_token(db_user)


@app.post("/api/change-password")
async def update_user(
    pass_update: PasswordUpdateS,
    db: Session = Depends(get_db),
    user: UserS = Depends(get_current_user),
):
    return await update_user_password(
        user=user,
        old_password=pass_update.old_password,
        new_password=pass_update.new_password,
        db=db,
    )


@app.get("/api/users/me", response_model=UserS)
async def get_user(user: UserS = Depends(get_current_user)):
    return user


@app.post("/api/contacts", response_model=ContactS)
async def create_contact(
    contact: ContactCreateS,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await create_db_contact(user=user, contact=contact, db=db)


@app.get("/api/contacts/{id}", response_model=ContactS)
async def get_contact(
    contact_id: int,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await get_db_contact(contact_id=contact_id, user=user, db=db)


@app.get("/api/contacts", response_model=list[ContactS])
async def get_contacts(
    offset: int = 0,
    limit: int = 100,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await get_db_contacts(offset=offset, limit=limit, user=user, db=db)


@app.put("/api/contacts/{id}", response_model=ContactS)
async def update_contact(
    contact_id: int,
    contact: ContactCreateS,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await update_db_contact(
        contact_id=contact_id, user=user, contact=contact, db=db
    )


@app.delete("/api/contacts/{id}")
async def delete_contact(
    contact_id: int,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await delete_db_contact(contact_id=contact_id, user=user, db=db)


@app.get("/api/groups", response_model=list[GroupS])
async def get_groups(
    user: UserS = Depends(get_current_user), db: Session = Depends(get_db)
):
    return await get_db_groups(user=user, db=db)


@app.post("/api/groups", response_model=GroupS)
async def create_group(
    group: GroupCreateS,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await create_db_group(group=group, user=user, db=db)


@app.put("/api/groups/{id}", response_model=GroupS)
async def update_contact(
    group_id: int,
    group: GroupCreateS,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await update_db_group(group_id=group_id, user=user, group=group, db=db)


@app.delete("/api/groups/{id}")
async def delete_group(
    group_id: int,
    user: UserS = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await delete_db_group(group_id=group_id, user=user, db=db)


@app.get("/api/health")
async def get_health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
