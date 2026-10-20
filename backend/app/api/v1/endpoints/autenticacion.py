"""Endpoints REST de autenticación, control de sesión y perfil."""
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.baseDatos.conexion import obtenerSesion
from app.esquemas.autenticacionEsquemas import (
    PerfilUsuarioEsquema,
    RespuestaLoginEsquema,
    UsuarioLoginEsquema,
)
from app.modelos.usuario import Usuario
from app.seguridad.dependencias import obtenerPerfilActual, obtenerUsuarioActual
from app.servicios.autenticacionServicio import autenticarUsuario, cerrarSesionUsuario

router = APIRouter()


@router.post(
    "/login",
    response_model=RespuestaLoginEsquema,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión y emitir token JWT",
)
def iniciarSesion(
    credenciales: UsuarioLoginEsquema,
    sesionBd: Annotated[Session, Depends(obtenerSesion)],
) -> RespuestaLoginEsquema:
    """Valida credenciales, aplica bloqueo a 3 intentos fallidos y retorna el token JWT."""
    return autenticarUsuario(sesionBd, credenciales)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Cerrar sesión activa e invalidar token en el servidor",
)
def cerrarSesion(
    datosUsuario: Annotated[tuple[Usuario, str, str], Depends(obtenerUsuarioActual)],
    sesionBd: Annotated[Session, Depends(obtenerSesion)],
) -> dict[str, str]:
    """Invalida la sesión del usuario en la base de datos."""
    usuario, _, pseudonimoHash = datosUsuario
    cerrarSesionUsuario(sesionBd, usuario.id, pseudonimoHash)
    return {"mensaje": "Sesión finalizada exitosamente"}


@router.get(
    "/me",
    response_model=PerfilUsuarioEsquema,
    status_code=status.HTTP_200_OK,
    summary="Obtener perfil del usuario autenticado",
)
def obtenerMiPerfil(
    perfil: Annotated[PerfilUsuarioEsquema, Depends(obtenerPerfilActual)],
) -> PerfilUsuarioEsquema:
    """Retorna los datos del perfil y rol del usuario asociado al token activo."""
    return perfil
