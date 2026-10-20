"""Enrutador central de la versión 1 de la API."""
from fastapi import APIRouter

from app.api.v1.endpoints import autenticacion, usuarios

apiRouter = APIRouter()

apiRouter.include_router(autenticacion.router, prefix="/auth", tags=["Autenticación"])
apiRouter.include_router(usuarios.router, prefix="/users", tags=["Usuarios"])
