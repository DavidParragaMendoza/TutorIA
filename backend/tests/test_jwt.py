"""Pruebas unitarias del módulo de tokens JWT HS256 (TAREA-2.1)."""
import time
from datetime import datetime, timedelta, timezone

import pytest
from jose import JWTError, jwt as bibliotecaJwt

from app.seguridad.jwt import crearTokenAcceso, verificarTokenAcceso

claveDePrueba = "clave-de-prueba-con-al-menos-256-bits-0123456789abcdef"

datosUsuario = {
    "sub": "12",
    "rol": "ESTUDIANTE",
    "pseudonimoHash": "a" * 64,
}


@pytest.fixture(autouse=True)
def configurarClave(monkeypatch):
    monkeypatch.setenv("JWT_SECRET_KEY", claveDePrueba)


def testTokenUsaAlgoritmoHs256():
    token = crearTokenAcceso(datosUsuario)
    assert bibliotecaJwt.get_unverified_header(token)["alg"] == "HS256"


def testTokenContieneClaimsEsperados():
    payload = verificarTokenAcceso(crearTokenAcceso(datosUsuario))
    assert payload["sub"] == "12"
    assert payload["rol"] == "ESTUDIANTE"
    assert payload["pseudonimoHash"] == "a" * 64
    assert "exp" in payload


def testExpiracionPorDefectoEsOchoHoras():
    payload = verificarTokenAcceso(crearTokenAcceso(datosUsuario))
    esperado = datetime.now(timezone.utc) + timedelta(minutes=480)
    diferencia = abs(payload["exp"] - esperado.timestamp())
    assert diferencia < 5


def testExpiracionPersonalizada():
    payload = verificarTokenAcceso(crearTokenAcceso(datosUsuario, 10))
    esperado = datetime.now(timezone.utc) + timedelta(minutes=10)
    assert abs(payload["exp"] - esperado.timestamp()) < 5


def testNoModificaElDiccionarioDeEntrada():
    datos = dict(datosUsuario)
    crearTokenAcceso(datos)
    assert datos == datosUsuario


def testTokenExpiradoLanzaExcepcion():
    token = crearTokenAcceso(datosUsuario, -1)
    with pytest.raises(JWTError):
        verificarTokenAcceso(token)


def testFirmaInvalidaLanzaExcepcion():
    token = crearTokenAcceso(datosUsuario)
    alterado = token[:-3] + ("AAA" if not token.endswith("AAA") else "BBB")
    with pytest.raises(JWTError):
        verificarTokenAcceso(alterado)


def testTokenFirmadoConOtraClaveLanzaExcepcion():
    tokenAjeno = bibliotecaJwt.encode(
        {**datosUsuario, "exp": int(time.time()) + 600},
        "otra-clave-distinta-0123456789abcdef0123456789",
        algorithm="HS256",
    )
    with pytest.raises(JWTError):
        verificarTokenAcceso(tokenAjeno)


def testSinClaveSecretaConfiguradaLanzaError(monkeypatch):
    monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    monkeypatch.setattr("app.seguridad.jwt.cargarEntorno", lambda: None)
    with pytest.raises(RuntimeError):
        crearTokenAcceso(datosUsuario)
