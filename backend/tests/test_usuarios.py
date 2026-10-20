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
