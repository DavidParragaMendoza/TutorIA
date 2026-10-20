"""Esquemas DTO Pydantic para administración de usuarios."""
import re

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UsuarioCreacionEsquema(BaseModel):
    """Datos necesarios para la creación de un nuevo usuario por el Administrador."""

    model_config = ConfigDict(populate_by_name=True)

    cedula: str
    nombresCompletos: str
    correoInstitucional: EmailStr
    contrasena: str
    rolId: int

    @field_validator("cedula")
    @classmethod
    def validarCedula(cls, valor: str) -> str:
        limpio = valor.strip()
        if not re.fullmatch(r"^\d{10}$", limpio):
            raise ValueError("La cédula debe contener exactamente 10 dígitos numéricos.")
        return limpio

    @field_validator("nombresCompletos")
    @classmethod
    def validarNombres(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("El nombre completo no puede estar vacío.")
        return limpio

    @field_validator("contrasena")
    @classmethod
    def validarContrasena(cls, valor: str) -> str:
        if len(valor) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres.")
        return valor


class RespuestaUsuarioEsquema(BaseModel):
    """Información pública del usuario retornado tras creación o consulta."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    cedula: str
    nombresCompletos: str
    correoInstitucional: str
    rolPrincipal: str
    estado: str


class RespuestaListaUsuariosEsquema(BaseModel):
    """Respuesta paginada para la consulta de usuarios."""

    model_config = ConfigDict(populate_by_name=True)

    total: int
    pagina: int
    tamano: int
    usuarios: list[RespuestaUsuarioEsquema]
