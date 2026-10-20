"""Pruebas unitarias de importación e instanciación de las 20 entidades SQLModel."""
import importlib
import sys
from pathlib import Path

import pytest
from sqlmodel import SQLModel

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

definicionModelos = [
    ("auditoriaRutaAprendizaje", "AuditoriaRutaAprendizaje", "auditoria_ruta_aprendizaje"),
    ("bloquePractica", "BloquePractica", "bloques_practica"),
    ("categoriaGlosario", "CategoriaGlosario", "categorias_glosario"),
    ("curso", "Curso", "cursos"),
    ("detalleIntervencionGlosario", "DetalleIntervencionGlosario", "detalle_intervencion_glosario"),
    ("estadoDominioEstudiante", "EstadoDominioEstudiante", "estado_dominio_estudiante"),
    ("eventoInteraccion", "EventoInteraccion", "eventos_interaccion"),
    ("glosarioHsk1", "GlosarioHsk1", "glosario_hsk1"),
    ("idioma", "Idioma", "idiomas"),
    ("institucionAliada", "InstitucionAliada", "instituciones_aliadas"),
    ("matricula", "Matricula", "matriculas"),
    ("modalidad", "Modalidad", "modalidades"),
    ("nivel", "Nivel", "niveles"),
    ("paralelo", "Paralelo", "paralelos"),
    ("periodoAcademico", "PeriodoAcademico", "periodos_academicos"),
    ("preguntaContingenciaHsk1", "PreguntaContingenciaHsk1", "preguntas_contingencia_hsk1"),
    ("rol", "Rol", "roles"),
    ("sesionUsuario", "SesionUsuario", "sesiones_usuario"),
    ("usuario", "Usuario", "usuarios"),
    ("usuarioRol", "UsuarioRol", "usuario_rol"),
]


def cargarClase(archivo: str, clase: str):
    modulo = importlib.import_module(f"app.modelos.{archivo}")
    return getattr(modulo, clase)


def test_existenVeinteModelos():
    assert len(definicionModelos) == 20


@pytest.mark.parametrize("archivo,clase,tabla", definicionModelos)
def test_importaEInstanciaModelo(archivo, clase, tabla):
    claseModelo = cargarClase(archivo, clase)
    assert issubclass(claseModelo, SQLModel)
    assert hasattr(claseModelo, "__table__")
    objeto = claseModelo()
    assert isinstance(objeto, claseModelo)


@pytest.mark.parametrize("archivo,clase,tabla", definicionModelos)
def test_modeloRegistradoEnMetadata(archivo, clase, tabla):
    claseModelo = cargarClase(archivo, clase)
    assert claseModelo.__table__.name in SQLModel.metadata.tables


def test_instanciaRolConCampos():
    claseRol = cargarClase("rol", "Rol")
    rol = claseRol(nombre="Estudiante", descripcion="Rol de estudiante")
    assert rol.nombre == "Estudiante"
    assert rol.id is None


def test_metadataContieneVeinteTablas():
    for archivo, clase, _ in definicionModelos:
        cargarClase(archivo, clase)
    assert len(SQLModel.metadata.tables) == 20
