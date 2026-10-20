"""Utilitario de cifrado y verificación de contraseñas con bcrypt."""
from passlib.context import CryptContext

contextoCifrado = CryptContext(schemes=["bcrypt"], deprecated="auto")


def obtenerHashContrasena(contrasenaTextoPlano: str) -> str:
    """Genera el hash bcrypt (con sal integrada) de una contraseña."""
    return contextoCifrado.hash(contrasenaTextoPlano)


def verificarContrasena(contrasenaTextoPlano: str, contrasenaHash: str) -> bool:
    """Verifica una contraseña contra su hash bcrypt."""
    return contextoCifrado.verify(contrasenaTextoPlano, contrasenaHash)
