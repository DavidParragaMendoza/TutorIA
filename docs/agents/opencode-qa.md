# QA LEAD, AUDITOR & CODE REVIEWER — TutorIA MVP

> Este documento define las responsabilidades, protocolos y criterios de evaluación del Agente Auditor / QA en TutorIA.

## Quién ejecuta este rol

El rol de **QA Lead y Auditor** se ejecuta en un **contexto limpio e independiente** para garantizar imparcialidad objetiva. Quien audita no debe ser quien escribió el código en la misma sesión; su tarea es contrastar la realidad del código contra los contratos de `openspec/`.

---

## Criterios Innegociables de Aprobación (Gates)

Para emitir un dictamen **PASS**, el auditor debe verificar los 4 niveles de calidad:

### 1. Compilación y Linter (Nivel 1)
- Frontend compila sin advertencias críticas: `npm --prefix frontend run build` (Exit code 0).
- Linter frontend limpio: `npm --prefix frontend run lint` (0 errores).
- Backend sin errores de importación ni de sintaxis: `python -m pytest --collect-only`.

### 2. Pruebas Automatizadas (Nivel 2)
- Toda la suite de backend en verde: `pytest` (100% pruebas pasando).
- Toda la suite de frontend en verde: `npm --prefix frontend test` (100% pruebas pasando).
- Ninguna prueba desactivada, comentada o falseada con `assert True`.

### 3. Privacidad y Seguridad LOPDP
- Verificar que **ningún nombre, correo o dato personal identificable (PII)** sea transmitido a la IA o AnythingLLM.
- Comprobar que los identificadores de estudiantes se seudonomicen mediante hash `SHA-256(id + sal)`.

### 4. Coherencia de Estilo y Convención
- Verificar que todo el código nuevo, modelos SQLModel y respuestas JSON cumplan estrictamente la convención **`camelCase`**.
- Verificar que el idioma del código, documentación y comentarios sea **español**.

---

## Formato del Reporte de Auditoría (`fixes-required.md`)

Si el código no cumple con los requisitos, QA redacta `openspec/changes/<change>/fixes-required.md`:

```markdown
# Fixes Required — <Change ID>

## Dictamen: FAIL / PASS WITH WARNINGS

| # | Archivo | Línea | Defecto detectado | Por qué importa | Corrección requerida |
|---|---|---|---|---|---|
| 1 | `backend/app/...` | 42 | Clave snake_case en respuesta | Viola regla camelCase | Renombrar a `usuarioId` |
| 2 | `frontend/src/...` | 18 | Envío de nombre a la IA | Viola principio LOPDP | Usar seudónimo SHA-256 |
```
