"""Servicio de administración de usuarios y asignación de roles."""
from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.esquemas.usuarioEsquemas import (
    RespuestaListaUsuariosEsquema,
    RespuestaUsuarioEsquema,
    UsuarioCreacionEsquema,
)
from app.modelos.rol import Rol
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol
from app.seguridad.cifrado import obtenerHashContrasena

mensajeDuplicado = "El correo institucional o número de cédula ya se encuentra registrado"


def crearUsuario(
    sesionBd: Session, datos: UsuarioCreacionEsquema, adminId: int | None = None
) -> RespuestaUsuarioEsquema:
    """Crea un nuevo usuario en la base de datos validando duplicados y asignando su rol."""
    # Validación de duplicidad por correo institucional
    usuarioExistentePorCorreo = sesionBd.exec(
        select(Usuario).where(Usuario.correoInstitucional == datos.correoInstitucional)
    ).first()
    if usuarioExistentePorCorreo is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=mensajeDuplicado,
        )

    # Validación de duplicidad por cédula
    usuarioExistentePorCedula = sesionBd.exec(
        select(Usuario).where(Usuario.cedula == datos.cedula)
    ).first()
    if usuarioExistentePorCedula is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=mensajeDuplicado,
        )

    # Validación de existencia del rol
    rol = sesionBd.get(Rol, datos.rolId)
    if rol is None:
        raise HTTPException(
            status_code=422,
            detail="El rol especificado no existe en el catálogo del sistema.",
        )

    passwordHash = obtenerHashContrasena(datos.contrasena)

    nuevoUsuario = Usuario(
        cedula=datos.cedula,
        nombresCompletos=datos.nombresCompletos,
        correoInstitucional=datos.correoInstitucional,
        passwordHash=passwordHash,
        estado="ACTIVO",
        creadoPor=adminId,
    )
    sesionBd.add(nuevoUsuario)
    sesionBd.flush()

    relacionRol = UsuarioRol(
        usuarioId=nuevoUsuario.id,
        rolId=rol.id,
        asignadoPor=adminId,
    )
    sesionBd.add(relacionRol)
    sesionBd.commit()
    sesionBd.refresh(nuevoUsuario)

    return RespuestaUsuarioEsquema(
        id=nuevoUsuario.id,
        cedula=nuevoUsuario.cedula,
        nombresCompletos=nuevoUsuario.nombresCompletos,
        correoInstitucional=nuevoUsuario.correoInstitucional,
        rolPrincipal=rol.nombre,
        estado=nuevoUsuario.estado,
    )


def listarUsuarios(
    sesionBd: Session,
    pagina: int = 1,
    tamano: int = 20,
    filtroRol: str | None = None,
) -> RespuestaListaUsuariosEsquema:
    """Retorna la lista paginada de usuarios con filtro opcional por rol."""
    consultaBase = (
        select(Usuario, Rol.nombre)
        .join(UsuarioRol, UsuarioRol.usuarioId == Usuario.id)
        .join(Rol, Rol.id == UsuarioRol.rolId)
    )

    if filtroRol:
        consultaBase = consultaBase.where(Rol.nombre == filtroRol)

    # Conteo total
    todosLosResultados = sesionBd.exec(consultaBase).all()
    total = len(todosLosResultados)

    # Paginación
    offset = max(0, (pagina - 1) * tamano)
    consultaPaginada = consultaBase.offset(offset).limit(tamano)
    filas = sesionBd.exec(consultaPaginada).all()

    usuariosEsquema = [
        RespuestaUsuarioEsquema(
            id=usuario.id,
            cedula=usuario.cedula,
            nombresCompletos=usuario.nombresCompletos,
            correoInstitucional=usuario.correoInstitucional,
            rolPrincipal=nombreRol,
            estado=usuario.estado,
        )
        for usuario, nombreRol in filas
    ]

    return RespuestaListaUsuariosEsquema(
        total=total,
        pagina=pagina,
        tamano=tamano,
        usuarios=usuariosEsquema,
    )
