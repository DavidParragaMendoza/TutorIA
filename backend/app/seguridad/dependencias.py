"""Dependencias de seguridad y middleware RBAC para FastAPI."""
from datetime import datetime, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlmodel import Session, select

from app.baseDatos.conexion import obtenerSesion
from app.esquemas.autenticacionEsquemas import PerfilUsuarioEsquema
from app.modelos.sesionUsuario import SesionUsuario
from app.modelos.usuario import Usuario
from app.seguridad.jwt import verificarTokenAcceso
from app.servicios.autenticacionServicio import obtenerRolPrincipalUsuario

esquemaSeguridad = HTTPBearer(auto_error=False)


def obtenerUsuarioActual(
    credenciales: Annotated[HTTPAuthorizationCredentials | None, Depends(esquemaSeguridad)],
    sesionBd: Annotated[Session, Depends(obtenerSesion)],
) -> tuple[Usuario, str, str]:
    """Valida el token Bearer, el estado del usuario y la vigencia de la sesión en base de datos.

    Retorna la tupla (usuario, rolPrincipal, pseudonimoHash).
    """
    if credenciales is None or not credenciales.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Encabezado de autorización ausente o inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credenciales.credentials

    try:
        payload = verificarTokenAcceso(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acceso inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    identificador = payload.get("sub")
    pseudonimoHash = payload.get("pseudonimoHash")

    if not identificador or not pseudonimoHash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Estructura de token inválida.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        usuarioId = int(identificador)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identificador de usuario inválido en token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    usuario = sesionBd.get(Usuario, usuarioId)
    if usuario is None or usuario.estado != "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo o no encontrado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    ahora = datetime.now(timezone.utc).replace(tzinfo=None)
    sesionActiva = sesionBd.exec(
        select(SesionUsuario).where(
            SesionUsuario.usuarioId == usuarioId,
            SesionUsuario.pseudonimoHash == pseudonimoHash,
            SesionUsuario.fechaExpiracionToken > ahora,
        )
    ).first()

    if sesionActiva is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La sesión ha expirado o ha sido cerrada.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    rolPrincipal = obtenerRolPrincipalUsuario(sesionBd, usuario.id)
    return usuario, rolPrincipal, pseudonimoHash


def obtenerPerfilActual(
    datosUsuario: Annotated[tuple[Usuario, str, str], Depends(obtenerUsuarioActual)],
) -> PerfilUsuarioEsquema:
    """Extrae el perfil del usuario autenticado."""
    usuario, rolPrincipal, pseudonimoHash = datosUsuario
    return PerfilUsuarioEsquema(
        id=usuario.id,
        nombresCompletos=usuario.nombresCompletos,
        correoInstitucional=usuario.correoInstitucional,
        rolPrincipal=rolPrincipal,
        pseudonimoHash=pseudonimoHash,
    )


def requerirRoles(*rolesPermitidos: str):
    """Genera una dependencia que valida si el rol del usuario está dentro de los permitidos."""

    def validador(
        datosUsuario: Annotated[tuple[Usuario, str, str], Depends(obtenerUsuarioActual)],
    ) -> tuple[Usuario, str, str]:
        _, rolPrincipal, _ = datosUsuario
        if rolPrincipal not in rolesPermitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: rol no autorizado para esta operación.",
            )
        return datosUsuario

    return validador
