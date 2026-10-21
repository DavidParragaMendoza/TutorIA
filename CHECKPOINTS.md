# CHECKPOINTS — Evaluación del Estado del Proyecto (TutorIA)

> En sistemas multi-agente no se evalúa el camino, se evalúa el destino.
> Estos son los checkpoints objetivos que un revisor (humano o agente auditor) utiliza para certificar la salud de TutorIA.

---

## C1 — La Base del Proyecto está Completa y Compila

- [x] Existen `openspec/config.yaml`, `openspec/ROADMAP.md` y `openspec/specs/spec.md` debidamente actualizados.
- [x] Backend ejecuta `python -m pytest --collect-only` con código de salida 0.
- [x] Frontend compila limpiamente con `npm --prefix frontend run build` (código de salida 0).
- [x] Linter frontend pasa sin advertencias críticas con `npm --prefix frontend run lint`.

---

## C2 — El Estado SDD es Coherente

- [x] Un solo change activo a la vez en `openspec/changes/` (o ninguno si se está en fase de transición/planificación).
- [x] Toda feature terminada se archiva en `openspec/changes/archive/` con su debido registro.
- [x] La especificación canónica en `openspec/specs/spec.md` refleja fielmente las capacidades del sistema.

---

## C3 — El Código Respeta la Arquitectura y Convenciones

- [x] Se respeta la separación de 3 capas: `/frontend` en React, `/backend` en FastAPI y `/database` en MySQL (SQLModel) + AnythingLLM (Docker).
- [x] Todo el código nuevo (variables, funciones, métodos, clases y comentarios) está en **español**.
- [x] Se utiliza rigurosamente **`camelCase`** en Python, JavaScript y payloads JSON de la API.
- [x] No hay módulos 3D, Whisper ni trazado Hanzi (se respetan los límites estrictos del MVP).

---

## C4 — Privacidad y Seguridad LOPDP Cumplidas

- [x] Ningún identificador real (nombre, correo, cédula) de estudiantes se transmite hacia AnythingLLM.
- [x] El identificador de estudiante se seudonimiza irreversiblemente mediante `SHA-256(id + sal)`.
- [x] Los tokens JWT utilizan algoritmo HS256 con revocación en servidor vía `/api/v1/logout`.

---

## C5 — Verificación Real con Pruebas Automatizadas

- [x] Backend cuenta con pruebas automáticas ejecutables con `pytest` (132/132 pasando).
- [x] Frontend cuenta con pruebas automáticas ejecutables con `npm --prefix frontend test` (44/44 pasando).
- [x] No se aceptan pruebas desactivadas (`skip`) sin justificación expresa.

---

## C6 — Higiene del Repositorio

- [x] No existen archivos temporales, logs sueltos ni carpetas `.tmp` sin ignorar en `.gitignore`.
- [x] Las dependencias de `backend/requirements.txt` y `frontend/package.json` están alineadas y documentadas.
