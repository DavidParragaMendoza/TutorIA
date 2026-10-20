"""Pruebas de seeding idempotente de roles y usuarios por defecto (TAREA-1.2)."""
from sqlmodel import select

from app.baseDatos.semillas import ejecutarSemillas
from app.modelos.rol import Rol
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol
from app.seguridad.cifrado import verificarContrasena


def test_rolesTienenIdsEstablesSegunSpec(sesionPrueba):
    ejecutarSemillas(sesionPrueba)
    roles = {rol.nombre: rol.id for rol in sesionPrueba.exec(select(Rol)).all()}
    assert roles == {"ESTUDIANTE": 1, "DOCENTE": 2, "ADMINISTRADOR": 3}


usuariosEsperados = [
    ("admin@tutoria.edu.ec", "1700000001", "Admin123*", "ADMINISTRADOR"),
    ("docente@tutoria.edu.ec", "1700000002", "Docente123*", "DOCENTE"),
    ("estudiante@tutoria.edu.ec", "1700000003", "Estudiante123*", "ESTUDIANTE"),
]


def test_creaTresRoles(sesionPrueba):
    ejecutarSemillas(sesionPrueba)
    nombres = {rol.nombre for rol in sesionPrueba.exec(select(Rol)).all()}
    assert nombres == {"ADMINISTRADOR", "DOCENTE", "ESTUDIANTE"}


def test_creaTresUsuariosConContrasenaHasheada(sesionPrueba):
    ejecutarSemillas(sesionPrueba)
    usuarios = sesionPrueba.exec(select(Usuario)).all()
    assert len(usuarios) == 3
    for correo, cedula, clave, _ in usuariosEsperados:
        usuario = sesionPrueba.exec(
            select(Usuario).where(Usuario.correoInstitucional == correo)
        ).one()
        assert usuario.cedula == cedula
        assert usuario.passwordHash != clave
        assert verificarContrasena(clave, usuario.passwordHash) is True


def test_asociaCadaUsuarioConSuRol(sesionPrueba):
    ejecutarSemillas(sesionPrueba)
    for correo, _, _, nombreRol in usuariosEsperados:
        usuario = sesionPrueba.exec(
            select(Usuario).where(Usuario.correoInstitucional == correo)
        ).one()
        rol = sesionPrueba.exec(select(Rol).where(Rol.nombre == nombreRol)).one()
        relaciones = sesionPrueba.exec(
            select(UsuarioRol).where(UsuarioRol.usuarioId == usuario.id)
        ).all()
        assert [relacion.rolId for relacion in relaciones] == [rol.id]


def test_esIdempotente(sesionPrueba):
    ejecutarSemillas(sesionPrueba)
    ejecutarSemillas(sesionPrueba)
    assert len(sesionPrueba.exec(select(Rol)).all()) == 3
    assert len(sesionPrueba.exec(select(Usuario)).all()) == 3
    assert len(sesionPrueba.exec(select(UsuarioRol)).all()) == 3
