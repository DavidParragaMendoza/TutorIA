"""Esquemas DTO Pydantic para el subsistema de autenticación."""
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UsuarioLoginEsquema(BaseModel):
    """Datos requeridos para el inicio de sesión."""

    model_config = ConfigDict(populate_by_name=True)

    identificador: str
    contrasena: str

    @field_validator("identificador")
    @classmethod
    def validarIdentificador(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("El identificador no puede estar vacío.")
        return limpio

    @field_validator("contrasena")
    @classmethod
    def validarContrasena(cls, valor: str) -> str:
        if not valor:
            raise ValueError("La contraseña no puede estar vacía.")
        return valor


class PerfilUsuarioEsquema(BaseModel):
    """Perfil público y claims básicos del usuario autenticado."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    nombresCompletos: str
    correoInstitucional: EmailStr
    rolPrincipal: str
    pseudonimoHash: str


class RespuestaLoginEsquema(BaseModel):
    """Respuesta exitosa de inicio de sesión con token JWT."""

    model_config = ConfigDict(populate_by_name=True)

    tokenAcceso: str
    tipoToken: str = "Bearer"
    expiraEnSegundos: int = 28800
    usuario: PerfilUsuarioEsquema
