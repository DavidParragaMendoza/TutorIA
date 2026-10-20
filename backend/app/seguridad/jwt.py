"""Generación y verificación de tokens JWT firmados con HS256."""
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from jose import jwt as bibliotecaJwt

algoritmoJwt = "HS256"
expiracionPredeterminadaMinutos = 480

rutaEnv = Path(__file__).resolve().parents[2] / ".env"


def cargarEntorno() -> None:
    """Carga las variables del archivo .env del backend."""
    load_dotenv(dotenv_path=rutaEnv)


def obtenerClaveSecreta() -> str:
    """Retorna la clave de firma JWT o falla si no está configurada."""
    cargarEntorno()
    claveSecreta = os.getenv("JWT_SECRET_KEY")
    if not claveSecreta:
        raise RuntimeError("La variable de entorno JWT_SECRET_KEY no está configurada")
    return claveSecreta


def crearTokenAcceso(datos: dict, tiempoExpiracionMinutos: int | None = None) -> str:
    """Crea un token JWT HS256 con los datos indicados y su expiración (`exp`)."""
    minutos = (
        expiracionPredeterminadaMinutos
        if tiempoExpiracionMinutos is None
        else tiempoExpiracionMinutos
    )
    payload = dict(datos)
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=minutos)
    return bibliotecaJwt.encode(payload, obtenerClaveSecreta(), algorithm=algoritmoJwt)


def verificarTokenAcceso(token: str) -> dict:
    """Valida firma y expiración del token; lanza `JWTError` si es inválido o expiró."""
    return bibliotecaJwt.decode(token, obtenerClaveSecreta(), algorithms=[algoritmoJwt])
