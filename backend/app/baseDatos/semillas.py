"""Seeding idempotente de roles y usuarios por defecto (TAREA-1.2)."""
from sqlmodel import Session, select

from app.modelos.rol import Rol
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol
from app.seguridad.cifrado import obtenerHashContrasena

rolesSemilla = [
    ("ESTUDIANTE", "Estudiante"),
    ("DOCENTE", "Docente"),
    ("ADMINISTRADOR", "Administrador del sistema"),
]

usuariosSemilla = [
    {
        "correoInstitucional": "admin@tutoria.edu.ec",
        "cedula": "1700000001",
        "nombresCompletos": "Administrador General TutorIA",
        "contrasena": "Admin123*",
        "rol": "ADMINISTRADOR",
    },
    {
        "correoInstitucional": "docente@tutoria.edu.ec",
        "cedula": "1700000002",
        "nombresCompletos": "Profesor Li Wei",
        "contrasena": "Docente123*",
        "rol": "DOCENTE",
    },
    {
        "correoInstitucional": "estudiante@tutoria.edu.ec",
        "cedula": "1700000003",
        "nombresCompletos": "Juan Carlos Pérez",
        "contrasena": "Estudiante123*",
        "rol": "ESTUDIANTE",
    },
]


def ejecutarSemillas(db: Session) -> None:
    """Inserta roles, usuarios y relaciones por defecto sin duplicar registros."""
    rolesPorNombre: dict[str, Rol] = {}
    for nombre, descripcion in rolesSemilla:
        rol = db.exec(select(Rol).where(Rol.nombre == nombre)).first()
        if rol is None:
            rol = Rol(nombre=nombre, descripcion=descripcion)
            db.add(rol)
            db.flush()
        rolesPorNombre[nombre] = rol

    for datos in usuariosSemilla:
        usuario = db.exec(
            select(Usuario).where(Usuario.correoInstitucional == datos["correoInstitucional"])
        ).first()
        if usuario is None:
            usuario = Usuario(
                nombresCompletos=datos["nombresCompletos"],
                cedula=datos["cedula"],
                correoInstitucional=datos["correoInstitucional"],
                passwordHash=obtenerHashContrasena(datos["contrasena"]),
            )
            db.add(usuario)
            db.flush()

        rol = rolesPorNombre[datos["rol"]]
        relacion = db.exec(
            select(UsuarioRol).where(
                UsuarioRol.usuarioId == usuario.id, UsuarioRol.rolId == rol.id
            )
        ).first()
        if relacion is None:
            db.add(UsuarioRol(usuarioId=usuario.id, rolId=rol.id))

    db.commit()


if __name__ == "__main__":
    from app.baseDatos.conexion import motorMysql

    with Session(motorMysql) as sesionManual:
        ejecutarSemillas(sesionManual)
