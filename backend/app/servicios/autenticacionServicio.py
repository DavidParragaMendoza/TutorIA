"""Servicio de autenticación, control de intentos fallidos, sesiones y LOPDP."""
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.esquemas.autenticacionEsquemas import (
    PerfilUsuarioEsquema,
    RespuestaLoginEsquema,
    UsuarioLoginEsquema,
)
from app.modelos.rol import Rol
from app.modelos.sesionUsuario import SesionUsuario
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol
from app.seguridad.cifrado import verificarContrasena
from app.seguridad.jwt import crearTokenAcceso
from app.seguridad.lopdp import generarSeudonimoHash

rutaEnv = Path(__file__).resolve().parents[2] / ".env"
mensajeCredencialesInvalidas = "Credenciales inválidas"
tiempoExpiracionSegundos = 28800
tiempoExpiracionMinutos = 480


def obtenerSalLopdp() -> str:
    """Carga y retorna la sal secreta del servidor para la seudonimización LOPDP."""
    load_dotenv(dotenv_path=rutaEnv)
    sal = os.getenv("SAL_LOPDP_SECRET")
    if not sal:
        raise RuntimeError("La variable de entorno SAL_LOPDP_SECRET no está configurada")
    return sal


def obtenerRolPrincipalUsuario(sesionBd: Session, usuarioId: int) -> str:
    """Obtiene el nombre del rol asignado a un usuario."""
    consulta = (
        select(Rol.nombre)
        .join(UsuarioRol, UsuarioRol.rolId == Rol.id)
        .where(UsuarioRol.usuarioId == usuarioId)
    )
    rol = sesionBd.exec(consulta).first()
    return rol if rol else "ESTUDIANTE"


def autenticarUsuario(
    sesionBd: Session, credenciales: UsuarioLoginEsquema
) -> RespuestaLoginEsquema:
    """Valida credenciales, aplica bloqueo a 3 intentos fallidos y registra la sesión."""
    identificador = credenciales.identificador.strip()

    usuario = sesionBd.exec(
        select(Usuario).where(
            (Usuario.correoInstitucional == identificador) | (Usuario.cedula == identificador)
        )
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=mensajeCredencialesInvalidas,
        )

    if usuario.estado != "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=mensajeCredencialesInvalidas,
        )

    if not verificarContrasena(credenciales.contrasena, usuario.passwordHash):
        usuario.intentosFallidos += 1
        if usuario.intentosFallidos >= 3:
            usuario.estado = "BLOQUEADO"
        sesionBd.add(usuario)
        sesionBd.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=mensajeCredencialesInvalidas,
        )

    # Autenticación exitosa
    if usuario.intentosFallidos > 0:
        usuario.intentosFallidos = 0
        sesionBd.add(usuario)
        sesionBd.commit()

    rolPrincipal = obtenerRolPrincipalUsuario(sesionBd, usuario.id)
    sal = obtenerSalLopdp()
    pseudonimo = generarSeudonimoHash(usuario.id, sal)

    ahora = datetime.now(timezone.utc).replace(tzinfo=None)
    expiracion = ahora + timedelta(seconds=tiempoExpiracionSegundos)

    registroSesion = SesionUsuario(
        usuarioId=usuario.id,
        pseudonimoHash=pseudonimo,
        fechaInicio=ahora,
        fechaExpiracionToken=expiracion,
    )
    sesionBd.add(registroSesion)
    sesionBd.commit()

    token = crearTokenAcceso(
        datos={
            "sub": str(usuario.id),
            "rol": rolPrincipal,
            "pseudonimoHash": pseudonimo,
        },
        tiempoExpiracionMinutos=tiempoExpiracionMinutos,
    )

    perfil = PerfilUsuarioEsquema(
        id=usuario.id,
        nombresCompletos=usuario.nombresCompletos,
        correoInstitucional=usuario.correoInstitucional,
        rolPrincipal=rolPrincipal,
        pseudonimoHash=pseudonimo,
    )

    return RespuestaLoginEsquema(
        tokenAcceso=token,
        tipoToken="Bearer",
        expiraEnSegundos=tiempoExpiracionSegundos,
        usuario=perfil,
    )


def cerrarSesionUsuario(sesionBd: Session, usuarioId: int, pseudonimoHash: str) -> None:
    """Invalida la sesión activa expirando su fecha de vencimiento."""
    ahora = datetime.now(timezone.utc).replace(tzinfo=None)
    sesionesActivas = sesionBd.exec(
        select(SesionUsuario).where(
            SesionUsuario.usuarioId == usuarioId,
            SesionUsuario.pseudonimoHash == pseudonimoHash,
            SesionUsuario.fechaExpiracionToken > ahora,
        )
    ).all()

    for sesion in sesionesActivas:
        sesion.fechaExpiracionToken = ahora
        sesionBd.add(sesion)

    sesionBd.commit()
