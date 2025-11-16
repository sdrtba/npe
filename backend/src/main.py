from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes import routers
from src.core.config import settings
from src.core.database import create_tables, drop_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # await drop_tables()
    await create_tables()
    yield


app = FastAPI(
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers)


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "ok"}
