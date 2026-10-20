"""Seudonimización LOPDP: hash SHA-256 con sal del identificador de estudiante."""
import hashlib


def generarSeudonimoHash(usuarioId: int, salSecreta: str) -> str:
    """Calcula SHA256(str(usuarioId) + ":" + salSecreta) en hexadecimal (64 caracteres)."""
    cadenaBase = f"{usuarioId}:{salSecreta}"
    return hashlib.sha256(cadenaBase.encode("utf-8")).hexdigest()
