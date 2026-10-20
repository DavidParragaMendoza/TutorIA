"""Pruebas unitarias de la seudonimización LOPDP con SHA-256 (TAREA-2.2)."""
import hashlib
import re

from app.seguridad.lopdp import generarSeudonimoHash

salDePrueba = "sal-secreta-de-prueba"


def testHashEsDeterminista():
    assert generarSeudonimoHash(12, salDePrueba) == generarSeudonimoHash(12, salDePrueba)


def testHashTieneSesentaYCuatroCaracteresHexadecimales():
    resultado = generarSeudonimoHash(12, salDePrueba)
    assert re.fullmatch(r"[0-9a-f]{64}", resultado)


def testCumpleLaFormulaSha256ConSal():
    esperado = hashlib.sha256(f"12:{salDePrueba}".encode("utf-8")).hexdigest()
    assert generarSeudonimoHash(12, salDePrueba) == esperado


def testNoExponeElIdentificadorOriginal():
    resultado = generarSeudonimoHash(12345678, salDePrueba)
    assert "12345678" not in resultado
    assert salDePrueba not in resultado


def testUsuariosDistintosGeneranSeudonimosDistintos():
    assert generarSeudonimoHash(1, salDePrueba) != generarSeudonimoHash(2, salDePrueba)


def testSalesDistintasGeneranSeudonimosDistintos():
    assert generarSeudonimoHash(1, "salA") != generarSeudonimoHash(1, "salB")
