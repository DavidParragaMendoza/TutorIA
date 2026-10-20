"""Pruebas de integración de autenticación: login, bloqueo, logout y perfil (TAREAS 2.4 y 2.5)."""
import re
from datetime import datetime, timezone

import pytest
from jose import jwt as bibliotecaJwt
from sqlmodel import Session, select

from app.modelos.sesionUsuario import SesionUsuario
from app.modelos.usuario import Usuario
from app.seguridad.lopdp import generarSeudonimoHash

rutaLogin = "/api/v1/auth/login"
rutaLogout = "/api/v1/auth/logout"
rutaPerfil = "/api/v1/auth/me"
mensajeInvalido = "Credenciales inválidas"

credencialesSemilla = {
    "ESTUDIANTE": ("estudiante@tutoria.edu.ec", "Estudiante123*"),
    "DOCENTE": ("docente@tutoria.edu.ec", "Docente123*"),
    "ADMINISTRADOR": ("admin@tutoria.edu.ec", "Admin123*"),
}


def iniciarSesion(cliente, identificador, contrasena):
    return cliente.post(
        rutaLogin, json={"identificador": identificador, "contrasena": contrasena}
    )


def cabeceraBearer(token):
    return {"Authorization": f"Bearer {token}"}


def obtenerUsuarioBd(motorPrueba, correo):
    with Session(motorPrueba) as sesion:
        return sesion.exec(
            select(Usuario).where(Usuario.correoInstitucional == correo)
        ).one()


def ahoraUtc():
    return datetime.now(timezone.utc).replace(tzinfo=None)


@pytest.mark.parametrize("rol", ["ESTUDIANTE", "DOCENTE", "ADMINISTRADOR"])
def test_loginExitosoParaCadaRol(cliente, rol):
    correo, clave = credencialesSemilla[rol]
    respuesta = iniciarSesion(cliente, correo, clave)
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["tipoToken"] == "Bearer"
    assert cuerpo["expiraEnSegundos"] == 28800
    assert cuerpo["tokenAcceso"]
    assert cuerpo["usuario"]["rolPrincipal"] == rol
    assert cuerpo["usuario"]["correoInstitucional"] == correo


def test_loginPermiteIdentificarsePorCedula(cliente):
    respuesta = iniciarSesion(cliente, "1700000003", "Estudiante123*")
    assert respuesta.status_code == 200
    assert respuesta.json()["usuario"]["correoInstitucional"] == "estudiante@tutoria.edu.ec"


def test_loginNoExponeHashDeContrasena(cliente):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    texto = iniciarSesion(cliente, correo, clave).text
    assert "passwordHash" not in texto
    assert "$2b$" not in texto


def test_tokenContieneClaimsYSeudonimoLopdp(cliente, motorPrueba, claveJwt, salLopdp):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    cuerpo = iniciarSesion(cliente, correo, clave).json()
    usuarioBd = obtenerUsuarioBd(motorPrueba, correo)
    payload = bibliotecaJwt.decode(cuerpo["tokenAcceso"], claveJwt, algorithms=["HS256"])
    esperado = generarSeudonimoHash(usuarioBd.id, salLopdp)
    assert payload["sub"] == str(usuarioBd.id)
    assert payload["rol"] == "ESTUDIANTE"
    assert payload["pseudonimoHash"] == esperado
    assert cuerpo["usuario"]["pseudonimoHash"] == esperado
    assert re.fullmatch(r"[0-9a-f]{64}", esperado)


def test_loginRegistraSesionConSeudonimoYExpiracion(cliente, motorPrueba, salLopdp):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    iniciarSesion(cliente, correo, clave)
    usuarioBd = obtenerUsuarioBd(motorPrueba, correo)
    with Session(motorPrueba) as sesion:
        sesiones = sesion.exec(
            select(SesionUsuario).where(SesionUsuario.usuarioId == usuarioBd.id)
        ).all()
    assert len(sesiones) == 1
    assert sesiones[0].pseudonimoHash == generarSeudonimoHash(usuarioBd.id, salLopdp)
    assert sesiones[0].fechaExpiracionToken > ahoraUtc()


def test_sesionNoAlmacenaDatosPersonales(cliente, motorPrueba):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    iniciarSesion(cliente, correo, clave)
    with Session(motorPrueba) as sesion:
        registro = sesion.exec(select(SesionUsuario)).one()
    valores = str(registro.model_dump())
    for dato in ("estudiante@tutoria.edu.ec", "1700000003", "Juan Carlos"):
        assert dato not in valores


def test_credencialesIncorrectasRetornan401(cliente):
    respuesta = iniciarSesion(cliente, "estudiante@tutoria.edu.ec", "ClaveErronea1")
    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == mensajeInvalido


def test_usuarioInexistenteRetorna401ConMismoMensaje(cliente):
    respuesta = iniciarSesion(cliente, "nadie@tutoria.edu.ec", "Cualquiera123")
    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == mensajeInvalido


def test_fallosIncrementanIntentosFallidos(cliente, motorPrueba):
    correo = "docente@tutoria.edu.ec"
    iniciarSesion(cliente, correo, "mala")
    iniciarSesion(cliente, correo, "mala")
    usuarioBd = obtenerUsuarioBd(motorPrueba, correo)
    assert usuarioBd.intentosFallidos == 2
    assert usuarioBd.estado == "ACTIVO"


def test_tercerIntentoFallidoBloqueaLaCuenta(cliente, motorPrueba):
    correo = "docente@tutoria.edu.ec"
    for _ in range(3):
        assert iniciarSesion(cliente, correo, "mala").status_code == 401
    usuarioBd = obtenerUsuarioBd(motorPrueba, correo)
    assert usuarioBd.intentosFallidos == 3
    assert usuarioBd.estado == "BLOQUEADO"


def test_cuentaBloqueadaRechazaClaveCorrectaConMismoMensaje(cliente):
    correo, clave = credencialesSemilla["DOCENTE"]
    for _ in range(3):
        iniciarSesion(cliente, correo, "mala")
    respuesta = iniciarSesion(cliente, correo, clave)
    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == mensajeInvalido


def test_cuentaBloqueadaNoSigueIncrementandoIntentos(cliente, motorPrueba):
    correo = "docente@tutoria.edu.ec"
    for _ in range(5):
        iniciarSesion(cliente, correo, "mala")
    assert obtenerUsuarioBd(motorPrueba, correo).intentosFallidos == 3


def test_loginExitosoReiniciaContadorDeIntentos(cliente, motorPrueba):
    correo, clave = credencialesSemilla["DOCENTE"]
    iniciarSesion(cliente, correo, "mala")
    iniciarSesion(cliente, correo, "mala")
    assert iniciarSesion(cliente, correo, clave).status_code == 200
    assert obtenerUsuarioBd(motorPrueba, correo).intentosFallidos == 0
    iniciarSesion(cliente, correo, "mala")
    iniciarSesion(cliente, correo, "mala")
    assert obtenerUsuarioBd(motorPrueba, correo).estado == "ACTIVO"


def test_cuentaInactivaRetorna401(cliente, motorPrueba):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    with Session(motorPrueba) as sesion:
        usuario = sesion.exec(
            select(Usuario).where(Usuario.correoInstitucional == correo)
        ).one()
        usuario.estado = "INACTIVO"
        sesion.add(usuario)
        sesion.commit()
    respuesta = iniciarSesion(cliente, correo, clave)
    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == mensajeInvalido


def test_perfilConTokenValido(cliente):
    correo, clave = credencialesSemilla["DOCENTE"]
    token = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    respuesta = cliente.get(rutaPerfil, headers=cabeceraBearer(token))
    assert respuesta.status_code == 200
    assert respuesta.json()["rolPrincipal"] == "DOCENTE"
    assert respuesta.json()["correoInstitucional"] == correo


def test_perfilSinTokenRetorna401(cliente):
    assert cliente.get(rutaPerfil).status_code == 401


def test_perfilConTokenAlteradoRetorna401(cliente):
    correo, clave = credencialesSemilla["DOCENTE"]
    token = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    respuesta = cliente.get(rutaPerfil, headers=cabeceraBearer(token + "x"))
    assert respuesta.status_code == 401


def test_logoutExpiraLaSesionEnServidor(cliente, motorPrueba):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    token = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    respuesta = cliente.post(rutaLogout, headers=cabeceraBearer(token))
    assert respuesta.status_code == 200
    assert respuesta.json() == {"mensaje": "Sesión finalizada exitosamente"}
    with Session(motorPrueba) as sesion:
        registro = sesion.exec(select(SesionUsuario)).one()
    assert registro.fechaExpiracionToken <= ahoraUtc()


def test_tokenDespuesDeLogoutRetorna401(cliente):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    token = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    cliente.post(rutaLogout, headers=cabeceraBearer(token))
    assert cliente.get(rutaPerfil, headers=cabeceraBearer(token)).status_code == 401
    assert cliente.post(rutaLogout, headers=cabeceraBearer(token)).status_code == 401


def test_logoutSinTokenRetorna401(cliente):
    assert cliente.post(rutaLogout).status_code == 401


def test_sePuedeIniciarSesionNuevamenteTrasLogout(cliente):
    correo, clave = credencialesSemilla["ESTUDIANTE"]
    token = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    cliente.post(rutaLogout, headers=cabeceraBearer(token))
    nuevoToken = iniciarSesion(cliente, correo, clave).json()["tokenAcceso"]
    assert cliente.get(rutaPerfil, headers=cabeceraBearer(nuevoToken)).status_code == 200
