"""Fixtures compartidas: base SQLite en memoria y cliente HTTP de prueba."""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import DefaultClause, MetaData, text
from sqlalchemy.dialects.mysql import BIGINT, CHAR
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, create_engine

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.modelos.rol import Rol  # noqa: E402
from app.modelos.sesionUsuario import SesionUsuario  # noqa: E402
from app.modelos.usuario import Usuario  # noqa: E402
from app.modelos.usuarioRol import UsuarioRol  # noqa: E402

claveJwtPrueba = "clave-jwt-de-prueba-con-mas-de-256-bits-0123456789abcdef"
salLopdpPrueba = "sal-lopdp-de-prueba"


@compiles(BIGINT, "sqlite")
def compilarBigintSqlite(tipo, compilador, **kw):
    """Permite autoincremento de claves BIGINT al probar sobre SQLite en memoria."""
    return "INTEGER"


@compiles(CHAR, "sqlite")
def compilarCharSqlite(tipo, compilador, **kw):
    """SQLite no admite CHARACTER SET ni COLLATE de MySQL en columnas CHAR."""
    return f"CHAR({tipo.length})"


def crearMetadataSqlite() -> MetaData:
    """Copia el DDL de las tablas y simplifica los defaults exclusivos de MySQL."""
    metadataSqlite = MetaData()
    for tabla in (
        Rol.__table__,
        Usuario.__table__,
        UsuarioRol.__table__,
        SesionUsuario.__table__,
    ):
        copia = tabla.to_metadata(metadataSqlite)
        for columna in copia.columns:
            if columna.server_default is not None and "CURRENT_TIMESTAMP" in str(
                columna.server_default.arg
            ):
                columna.server_default = DefaultClause(text("CURRENT_TIMESTAMP"))
    return metadataSqlite


@pytest.fixture
def motorPrueba():
    motor = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    crearMetadataSqlite().create_all(motor)
    return motor


@pytest.fixture
def sesionPrueba(motorPrueba):
    with Session(motorPrueba) as sesion:
        yield sesion


@pytest.fixture(autouse=True)
def configurarSecretos(monkeypatch):
    monkeypatch.setenv("JWT_SECRET_KEY", claveJwtPrueba)
    monkeypatch.setenv("SAL_LOPDP_SECRET", salLopdpPrueba)


@pytest.fixture
def claveJwt():
    return claveJwtPrueba


@pytest.fixture
def salLopdp():
    return salLopdpPrueba


@pytest.fixture
def cliente(motorPrueba):
    """Cliente HTTP sobre la app real con SQLite sembrada (sin ejecutar el lifespan)."""
    from app.baseDatos.conexion import obtenerSesion
    from app.baseDatos.semillas import ejecutarSemillas
    from app.main import aplicacion

    def sesionSustituta():
        with Session(motorPrueba) as sesion:
            yield sesion

    with Session(motorPrueba) as sesionSemilla:
        ejecutarSemillas(sesionSemilla)

    aplicacion.dependency_overrides[obtenerSesion] = sesionSustituta
    yield TestClient(aplicacion)
    aplicacion.dependency_overrides.clear()

