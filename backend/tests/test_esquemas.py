"""Pruebas de los esquemas DTO de autenticación y usuarios (TAREA-2.3)."""
import pytest
from pydantic import ValidationError

from app.esquemas.autenticacionEsquemas import (
    PerfilUsuarioEsquema,
    RespuestaLoginEsquema,
    UsuarioLoginEsquema,
)
from app.esquemas.usuarioEsquemas import (
    RespuestaListaUsuariosEsquema,
    RespuestaUsuarioEsquema,
    UsuarioCreacionEsquema,
)

datosCreacionValidos = {
    "cedula": "0912345678",
    "nombresCompletos": "María Augusta López Vera",
    "correoInstitucional": "mlopez@universidad.edu.ec",
    "contrasena": "Tempo2026!",
    "rolId": 2,
}


def test_loginAceptaIdentificadorYContrasena():
    esquema = UsuarioLoginEsquema(identificador="0987654321", contrasena="ClaveSegura123!")
    assert esquema.identificador == "0987654321"
    assert esquema.contrasena == "ClaveSegura123!"


def test_loginRechazaCamposVacios():
    with pytest.raises(ValidationError):
        UsuarioLoginEsquema(identificador="", contrasena="x")
    with pytest.raises(ValidationError):
        UsuarioLoginEsquema(identificador="a@b.ec", contrasena="")


def test_respuestaLoginSerializaEnCamelCase():
    perfil = PerfilUsuarioEsquema(
        id=12,
        nombresCompletos="Juan Carlos Pérez",
        correoInstitucional="estudiante@tutoria.edu.ec",
        rolPrincipal="ESTUDIANTE",
        pseudonimoHash="a" * 64,
    )
    respuesta = RespuestaLoginEsquema(
        tokenAcceso="token", expiraEnSegundos=28800, usuario=perfil
    )
    datos = respuesta.model_dump()
    assert set(datos) == {"tokenAcceso", "tipoToken", "expiraEnSegundos", "usuario"}
    assert datos["tipoToken"] == "Bearer"
    assert set(datos["usuario"]) == {
        "id",
        "nombresCompletos",
        "correoInstitucional",
        "rolPrincipal",
        "pseudonimoHash",
    }


def test_creacionUsuarioValidaAceptaDatosCorrectos():
    esquema = UsuarioCreacionEsquema(**datosCreacionValidos)
    assert esquema.cedula == "0912345678"
    assert esquema.rolId == 2


@pytest.mark.parametrize("cedula", ["123", "12345678901", "09123abc78", ""])
def test_creacionUsuarioRechazaCedulaInvalida(cedula):
    with pytest.raises(ValidationError):
        UsuarioCreacionEsquema(**{**datosCreacionValidos, "cedula": cedula})


@pytest.mark.parametrize("correo", ["sin-arroba", "a@b", "@dominio.ec", "a b@c.ec"])
def test_creacionUsuarioRechazaCorreoInvalido(correo):
    with pytest.raises(ValidationError):
        UsuarioCreacionEsquema(**{**datosCreacionValidos, "correoInstitucional": correo})


def test_creacionUsuarioRechazaContrasenaCorta():
    with pytest.raises(ValidationError):
        UsuarioCreacionEsquema(**{**datosCreacionValidos, "contrasena": "corta1"})


def test_creacionUsuarioRechazaNombreVacio():
    with pytest.raises(ValidationError):
        UsuarioCreacionEsquema(**{**datosCreacionValidos, "nombresCompletos": "  "})


def test_respuestaListaUsuariosEstructura():
    usuario = RespuestaUsuarioEsquema(
        id=1,
        cedula="1700000001",
        nombresCompletos="Administrador General TutorIA",
        correoInstitucional="admin@tutoria.edu.ec",
        rolPrincipal="ADMINISTRADOR",
        estado="ACTIVO",
    )
    lista = RespuestaListaUsuariosEsquema(total=1, pagina=1, tamano=20, usuarios=[usuario])
    assert set(lista.model_dump()) == {"total", "pagina", "tamano", "usuarios"}
