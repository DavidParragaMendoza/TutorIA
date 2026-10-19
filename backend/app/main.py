from fastapi import FastAPI
from sqlmodel import SQLModel

from app.baseDatos.conexion import motorMysql
from app.modelos.auditoriaRutaAprendizaje import AuditoriaRutaAprendizaje
from app.modelos.bloquePractica import BloquePractica
from app.modelos.categoriaGlosario import CategoriaGlosario
from app.modelos.curso import Curso
from app.modelos.detalleIntervencionGlosario import DetalleIntervencionGlosario
from app.modelos.estadoDominioEstudiante import EstadoDominioEstudiante
from app.modelos.eventoInteraccion import EventoInteraccion
from app.modelos.glosarioHsk1 import GlosarioHsk1
from app.modelos.idioma import Idioma
from app.modelos.institucionAliada import InstitucionAliada
from app.modelos.matricula import Matricula
from app.modelos.modalidad import Modalidad
from app.modelos.nivel import Nivel
from app.modelos.paralelo import Paralelo
from app.modelos.periodoAcademico import PeriodoAcademico
from app.modelos.preguntaContingenciaHsk1 import PreguntaContingenciaHsk1
from app.modelos.rol import Rol
from app.modelos.sesionUsuario import SesionUsuario
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol

aplicacion = FastAPI(title="TutorIA API")

modelosRegistrados = (
    Rol,
    Usuario,
    UsuarioRol,
    SesionUsuario,
    Idioma,
    Nivel,
    PeriodoAcademico,
    InstitucionAliada,
    Modalidad,
    Curso,
    Paralelo,
    Matricula,
    BloquePractica,
    EventoInteraccion,
    EstadoDominioEstudiante,
    AuditoriaRutaAprendizaje,
    DetalleIntervencionGlosario,
    CategoriaGlosario,
    GlosarioHsk1,
    PreguntaContingenciaHsk1,
)


@aplicacion.on_event("startup")
def iniciarBaseDatos() -> None:
    SQLModel.metadata.create_all(motorMysql)
