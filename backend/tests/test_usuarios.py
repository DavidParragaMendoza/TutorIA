"""Pruebas de integración de administración de usuarios y RBAC (TAREA 2.6)."""
from sqlmodel import Session, select

from app.modelos.rol import Rol
from app.modelos.usuario import Usuario
from app.modelos.usuarioRol import UsuarioRol
from app.seguridad.cifrado import verificarContrasena

rutaUsuarios = "/api/v1/users"
mensajeDuplicado = "El correo institucional o número de cédula ya se encuentra registrado"

datosNuevoUsuario = {
    "cedula": "0912345678",
    "nombresCompletos": "María Augusta López Vera",
    "correoInstitucional": "mlopez@universidad.edu.ec",
    "contrasena": "Tempo2026!",
    "rolId": 2,
}


def obtenerCabecera(cliente, correo, clave):
    respuesta = cliente.post(
        "/api/v1/auth/login", json={"identificador": correo, "contrasena": clave}
    )
    return {"Authorization": f"Bearer {respuesta.json()['tokenAcceso']}"}


def cabeceraAdmin(cliente):
    return obtenerCabecera(cliente, "admin@tutoria.edu.ec", "Admin123*")


def test_adminCreaUsuarioConRol201(cliente):
    respuesta = cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 201
    cuerpo = respuesta.json()
    assert cuerpo["id"]
    assert cuerpo["cedula"] == "0912345678"
    assert cuerpo["nombresCompletos"] == "María Augusta López Vera"
    assert cuerpo["rolPrincipal"] == "DOCENTE"
    assert cuerpo["estado"] == "ACTIVO"
    assert "passwordHash" not in respuesta.text
    assert "Tempo2026!" not in respuesta.text


def test_usuarioCreadoGuardaHashBcryptYRelacionConRol(cliente, motorPrueba):
    cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabeceraAdmin(cliente))
    with Session(motorPrueba) as sesion:
        usuario = sesion.exec(
            select(Usuario).where(Usuario.correoInstitucional == "mlopez@universidad.edu.ec")
        ).one()
        relaciones = sesion.exec(
            select(UsuarioRol).where(UsuarioRol.usuarioId == usuario.id)
        ).all()
        rolDocente = sesion.exec(select(Rol).where(Rol.nombre == "DOCENTE")).one()
        admin = sesion.exec(
            select(Usuario).where(Usuario.correoInstitucional == "admin@tutoria.edu.ec")
        ).one()
    assert usuario.passwordHash != "Tempo2026!"
    assert verificarContrasena("Tempo2026!", usuario.passwordHash) is True
    assert [relacion.rolId for relacion in relaciones] == [rolDocente.id]
    assert usuario.creadoPor == admin.id


def test_usuarioCreadoPuedeIniciarSesion(cliente):
    cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabeceraAdmin(cliente))
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"identificador": "mlopez@universidad.edu.ec", "contrasena": "Tempo2026!"},
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["usuario"]["rolPrincipal"] == "DOCENTE"


def test_correoDuplicadoRetorna409(cliente):
    datos = {**datosNuevoUsuario, "correoInstitucional": "admin@tutoria.edu.ec"}
    respuesta = cliente.post(rutaUsuarios, json=datos, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == mensajeDuplicado


def test_cedulaDuplicadaRetorna409(cliente):
    datos = {**datosNuevoUsuario, "cedula": "1700000001"}
    respuesta = cliente.post(rutaUsuarios, json=datos, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == mensajeDuplicado


def test_duplicadoNoCreaRegistroAdicional(cliente, motorPrueba):
    datos = {**datosNuevoUsuario, "cedula": "1700000001"}
    cliente.post(rutaUsuarios, json=datos, headers=cabeceraAdmin(cliente))
    with Session(motorPrueba) as sesion:
        assert len(sesion.exec(select(Usuario)).all()) == 3


def test_rolInexistenteRetorna422(cliente):
    datos = {**datosNuevoUsuario, "rolId": 999}
    respuesta = cliente.post(rutaUsuarios, json=datos, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 422


def test_cuerpoInvalidoRetorna422(cliente):
    datos = {**datosNuevoUsuario, "cedula": "123"}
    respuesta = cliente.post(rutaUsuarios, json=datos, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 422


def test_docenteNoPuedeCrearUsuarios403(cliente):
    cabecera = obtenerCabecera(cliente, "docente@tutoria.edu.ec", "Docente123*")
    respuesta = cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabecera)
    assert respuesta.status_code == 403


def test_estudianteNoPuedeCrearNiListarUsuarios403(cliente):
    cabecera = obtenerCabecera(cliente, "estudiante@tutoria.edu.ec", "Estudiante123*")
    assert cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabecera).status_code == 403
    assert cliente.get(rutaUsuarios, headers=cabecera).status_code == 403


def test_usuariosSinTokenRetorna401(cliente):
    assert cliente.post(rutaUsuarios, json=datosNuevoUsuario).status_code == 401
    assert cliente.get(rutaUsuarios).status_code == 401


def test_adminListaUsuariosConRolYEstado(cliente):
    respuesta = cliente.get(rutaUsuarios, headers=cabeceraAdmin(cliente))
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["total"] == 3
    assert cuerpo["pagina"] == 1
    assert cuerpo["tamano"] == 20
    roles = {usuario["rolPrincipal"] for usuario in cuerpo["usuarios"]}
    assert roles == {"ADMINISTRADOR", "DOCENTE", "ESTUDIANTE"}
    assert all(usuario["estado"] == "ACTIVO" for usuario in cuerpo["usuarios"])
    assert "passwordHash" not in respuesta.text


def test_listadoFiltraPorRol(cliente):
    respuesta = cliente.get(
        rutaUsuarios, params={"rol": "DOCENTE"}, headers=cabeceraAdmin(cliente)
    )
    cuerpo = respuesta.json()
    assert cuerpo["total"] == 1
    assert cuerpo["usuarios"][0]["correoInstitucional"] == "docente@tutoria.edu.ec"


def test_listadoPaginado(cliente):
    cabecera = cabeceraAdmin(cliente)
    primera = cliente.get(rutaUsuarios, params={"pagina": 1, "tamano": 2}, headers=cabecera).json()
    segunda = cliente.get(rutaUsuarios, params={"pagina": 2, "tamano": 2}, headers=cabecera).json()
    assert primera["total"] == 3
    assert len(primera["usuarios"]) == 2
    assert len(segunda["usuarios"]) == 1
    idsPrimera = {usuario["id"] for usuario in primera["usuarios"]}
    assert segunda["usuarios"][0]["id"] not in idsPrimera


mensajeAutobloqueo = "El Administrador no puede bloquear ni inhabilitar su propia cuenta en sesión"


def crearUsuarioDocente(cliente):
    respuesta = cliente.post(rutaUsuarios, json=datosNuevoUsuario, headers=cabeceraAdmin(cliente))
    return respuesta.json()["id"]


def establecerEstadoUsuario(motorPrueba, usuarioId, estado, intentosFallidos=0):
    with Session(motorPrueba) as sesion:
        usuario = sesion.get(Usuario, usuarioId)
        usuario.estado = estado
        usuario.intentosFallidos = intentosFallidos
        sesion.add(usuario)
        sesion.commit()


def obtenerDatosUsuario(motorPrueba, usuarioId):
    with Session(motorPrueba) as sesion:
        usuario = sesion.get(Usuario, usuarioId)
        return {
            "estado": usuario.estado,
            "intentosFallidos": usuario.intentosFallidos,
            "actualizadoPor": usuario.actualizadoPor,
            "fechaActualizacion": usuario.fechaActualizacion,
        }


def obtenerAdminId(motorPrueba):
    with Session(motorPrueba) as sesion:
        admin = sesion.exec(
            select(Usuario).where(Usuario.correoInstitucional == "admin@tutoria.edu.ec")
        ).one()
        return admin.id


def test_adminDesbloqueaUsuarioYReiniciaIntentos(cliente, motorPrueba):
    usuarioId = crearUsuarioDocente(cliente)
    establecerEstadoUsuario(motorPrueba, usuarioId, "BLOQUEADO", 3)
    adminId = obtenerAdminId(motorPrueba)

    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "ACTIVO"},
        headers=cabeceraAdmin(cliente),
    )

    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["id"] == usuarioId
    assert cuerpo["estado"] == "ACTIVO"
    assert cuerpo["rolPrincipal"] == "DOCENTE"
    assert "passwordHash" not in respuesta.text
    datos = obtenerDatosUsuario(motorPrueba, usuarioId)
    assert datos["estado"] == "ACTIVO"
    assert datos["intentosFallidos"] == 0
    assert datos["actualizadoPor"] == adminId
    assert datos["fechaActualizacion"] is not None


def test_adminBloqueaUsuario(cliente, motorPrueba):
    usuarioId = crearUsuarioDocente(cliente)
    adminId = obtenerAdminId(motorPrueba)

    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "BLOQUEADO"},
        headers=cabeceraAdmin(cliente),
    )

    assert respuesta.status_code == 200
    assert respuesta.json()["estado"] == "BLOQUEADO"
    datos = obtenerDatosUsuario(motorPrueba, usuarioId)
    assert datos["estado"] == "BLOQUEADO"
    assert datos["intentosFallidos"] == 0
    assert datos["actualizadoPor"] == adminId
    assert datos["fechaActualizacion"] is not None


def test_adminInactivaYActivaUsuario(cliente, motorPrueba):
    usuarioId = crearUsuarioDocente(cliente)
    establecerEstadoUsuario(motorPrueba, usuarioId, "BLOQUEADO", 2)
    cabecera = cabeceraAdmin(cliente)

    respuestaInactivo = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "INACTIVO"},
        headers=cabecera,
    )
    assert respuestaInactivo.status_code == 200
    assert respuestaInactivo.json()["estado"] == "INACTIVO"
    assert obtenerDatosUsuario(motorPrueba, usuarioId)["intentosFallidos"] == 2

    respuestaActivo = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "ACTIVO"},
        headers=cabecera,
    )
    assert respuestaActivo.status_code == 200
    datos = obtenerDatosUsuario(motorPrueba, usuarioId)
    assert datos["estado"] == "ACTIVO"
    assert datos["intentosFallidos"] == 0


def test_adminNoPuedeBloquearse409(cliente, motorPrueba):
    adminId = obtenerAdminId(motorPrueba)
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{adminId}/estado",
        json={"estado": "BLOQUEADO"},
        headers=cabeceraAdmin(cliente),
    )

    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == mensajeAutobloqueo
    assert obtenerDatosUsuario(motorPrueba, adminId)["estado"] == "ACTIVO"


def test_adminNoPuedeAutoinactivarse409(cliente, motorPrueba):
    adminId = obtenerAdminId(motorPrueba)
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{adminId}/estado",
        json={"estado": "INACTIVO"},
        headers=cabeceraAdmin(cliente),
    )

    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == mensajeAutobloqueo
    assert obtenerDatosUsuario(motorPrueba, adminId)["estado"] == "ACTIVO"


def test_cambioEstadoUsuarioInexistente404(cliente):
    respuesta = cliente.patch(
        f"{rutaUsuarios}/9999/estado",
        json={"estado": "ACTIVO"},
        headers=cabeceraAdmin(cliente),
    )
    assert respuesta.status_code == 404


def test_cambioEstadoInvalido422(cliente):
    usuarioId = crearUsuarioDocente(cliente)
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "SUSPENDIDO"},
        headers=cabeceraAdmin(cliente),
    )
    assert respuesta.status_code == 422


def test_docenteNoPuedeCambiarEstado403(cliente):
    usuarioId = crearUsuarioDocente(cliente)
    cabecera = obtenerCabecera(cliente, "docente@tutoria.edu.ec", "Docente123*")
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "ACTIVO"},
        headers=cabecera,
    )
    assert respuesta.status_code == 403


def test_estudianteNoPuedeCambiarEstado403(cliente):
    usuarioId = crearUsuarioDocente(cliente)
    cabecera = obtenerCabecera(cliente, "estudiante@tutoria.edu.ec", "Estudiante123*")
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "ACTIVO"},
        headers=cabecera,
    )
    assert respuesta.status_code == 403


def test_cambioEstadoSinToken401(cliente):
    usuarioId = crearUsuarioDocente(cliente)
    respuesta = cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "ACTIVO"},
    )
    assert respuesta.status_code == 401


def test_listadoIncluyeUsuarioRecienCreado(cliente):
    usuarioCreado = cliente.post(
        rutaUsuarios, json=datosNuevoUsuario, headers=cabeceraAdmin(cliente)
    ).json()

    respuesta = cliente.get(rutaUsuarios, headers=cabeceraAdmin(cliente))

    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["total"] == 4
    assert any(usuario["id"] == usuarioCreado["id"] for usuario in cuerpo["usuarios"])


def test_listadoReflejaEstadoActualizado(cliente):
    usuarioId = crearUsuarioDocente(cliente)
    cabecera = cabeceraAdmin(cliente)
    cliente.patch(
        f"{rutaUsuarios}/{usuarioId}/estado",
        json={"estado": "BLOQUEADO"},
        headers=cabecera,
    )

    respuesta = cliente.get(rutaUsuarios, headers=cabecera)

    assert respuesta.status_code == 200
    usuario = next(
        usuario for usuario in respuesta.json()["usuarios"] if usuario["id"] == usuarioId
    )
    assert usuario["estado"] == "BLOQUEADO"
