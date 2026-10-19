import os
from collections.abc import Generator
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlmodel import Session, create_engine

rutaEnv = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=rutaEnv)

hostBaseDatos = os.getenv("DB_HOST", "localhost")
puertoBaseDatos = os.getenv("DB_PORT", "3306")
usuarioBaseDatos = os.getenv("DB_USER", "root")
contrasenaBaseDatos = os.getenv("DB_PASSWORD", "")
nombreBaseDatos = os.getenv("DB_NAME", "tutoria_db")

urlConexion = (
    f"mysql+pymysql://{usuarioBaseDatos}:{quote_plus(contrasenaBaseDatos)}"
    f"@{hostBaseDatos}:{puertoBaseDatos}/{nombreBaseDatos}"
)

motorMysql = create_engine(urlConexion, echo=False, pool_pre_ping=True)


def obtenerSesion() -> Generator[Session, None, None]:
    with Session(motorMysql) as sesion:
        yield sesion
