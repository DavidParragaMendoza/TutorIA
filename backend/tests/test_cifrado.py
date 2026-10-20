"""Pruebas unitarias del módulo de cifrado de contraseñas (TAREA-1.1)."""
from app.seguridad.cifrado import obtenerHashContrasena, verificarContrasena


def testHashDistintoAlTextoPlano():
    contrasena = "Admin123*"
    assert obtenerHashContrasena(contrasena) != contrasena


def testHashTieneFormatoBcrypt():
    assert obtenerHashContrasena("Admin123*").startswith("$2")


def testHashesDistintosConSalDiferente():
    assert obtenerHashContrasena("Admin123*") != obtenerHashContrasena("Admin123*")


def testVerificarContrasenaCorrectaRetornaTrue():
    contrasena = "Docente123*"
    assert verificarContrasena(contrasena, obtenerHashContrasena(contrasena)) is True


def testVerificarContrasenaIncorrectaRetornaFalse():
    contrasenaHash = obtenerHashContrasena("Estudiante123*")
    assert verificarContrasena("ClaveIncorrecta", contrasenaHash) is False
