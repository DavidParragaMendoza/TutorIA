"""Endpoints REST para administración de usuarios (Consola Admin / RBAC)."""
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.baseDatos.conexion import obtenerSesion
from app.esquemas.usuarioEsquemas import (
    RespuestaListaUsuariosEsquema,
    RespuestaUsuarioEsquema,
    UsuarioCreacionEsquema,
)
from app.modelos.usuario import Usuario
from app.seguridad.dependencias import requerirRoles
from app.servicios.usuarioServicio import crearUsuario, listarUsuarios

router = APIRouter()


@router.post(
    "",
    response_model=RespuestaUsuarioEsquema,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nuevo usuario en el sistema (Solo Administrador)",
)
def registrarUsuario(
    datos: UsuarioCreacionEsquema,
    datosAdmin: Annotated[tuple[Usuario, str, str], Depends(requerirRoles("ADMINISTRADOR"))],
    sesionBd: Annotated[Session, Depends(obtenerSesion)],
) -> RespuestaUsuarioEsquema:
    """Registra un nuevo usuario con credenciales cifradas y rol asignado."""
    admin, _, _ = datosAdmin
    return crearUsuario(sesionBd, datos, adminId=admin.id)


@router.get(
    "",
    response_model=RespuestaListaUsuariosEsquema,
    status_code=status.HTTP_200_OK,
    summary="Listar usuarios paginados con filtro opcional por rol (Solo Administrador)",
)
def consultarUsuarios(
    _: Annotated[tuple[Usuario, str, str], Depends(requerirRoles("ADMINISTRADOR"))],
    sesionBd: Annotated[Session, Depends(obtenerSesion)],
    pagina: int = Query(default=1, ge=1, description="Número de página"),
    tamano: int = Query(default=20, ge=1, le=100, description="Cantidad por página"),
    rol: str | None = Query(default=None, description="Filtro opcional por nombre de rol"),
) -> RespuestaListaUsuariosEsquema:
    """Retorna la lista de usuarios del sistema con paginación."""
    return listarUsuarios(sesionBd, pagina=pagina, tamano=tamano, filtroRol=rol)
