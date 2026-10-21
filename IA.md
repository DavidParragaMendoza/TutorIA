# Instrucciones Operativas para el Agente IA — TutorIA MVP

> Este archivo define las reglas de actuación y directrices operativas locales para agentes de IA que intervienen en TutorIA.

---

## Rol y Comportamiento General

Actúas como Agente de Ingeniería en TutorIA. Tu objetivo primordial es asegurar la excelencia técnica, pedagógica y de seguridad del sistema, avanzando en la implementación mediante Spec-Driven Development (SDD) con estricto apego a las directrices de `docs/constitution.md` y `openspec/config.yaml`.

---

## Reglas Innegociables del Proyecto

1. **Límites Estrictos del MVP**:
   - 🚫 **Prohibido**: Añadir entornos 3D, evaluación de voz (Whisper) o trazado de caracteres Hanzi.
   - 🎯 **Foco**: Repaso guiado de vocabulario HSK1/A1 con chat cerrado de opción múltiple, panel docente y consola administrativa.

2. **Privacidad LOPDP por Diseño**:
   - 🔒 **Nunca** enviar nombres, correos o números de cédula al contenedor de AnythingLLM.
   - Aplica siempre el hash irreversible `SHA-256(estudianteId + sal)` antes de cualquier interacción con la IA.

3. **Convención de Estilo y Nombres (camelCase)**:
   - 🐪 Todo el código (variables, funciones, métodos, clases y comentarios) debe estar en **español** y en **`camelCase`**.
   - Los endpoints de FastAPI y las respuestas JSON deben usar invariablemente claves en **`camelCase`**.

4. **Persistencia Relacional con SQLModel**:
   - Toda tabla en MySQL debe definirse mediante clases de **SQLModel** en Python, permitiendo su inspección directa en phpMyAdmin.

5. **Verificación Real Obligatoria (Gates Verdes)**:
   - Toda tarea se considera concluida únicamente cuando `pytest` y `npm --prefix frontend test` finalicen con el 100% de pruebas en verde.

---

## Protocolo de Trabajo SDD (OpenSpec)

1. **Consultar antes de actuar**: Revisa `openspec/ROADMAP.md` y `openspec/config.yaml`.
2. **Ciclo de Cambio**: Todo desarrollo nuevo parte de una propuesta en `openspec/changes/<ticket-id>-<nombre>/` con `proposal.md`, `design.md`, `spec.md` (EARS/Gherkin) y `tasks.md`.
3. **Validación**: Al concluir el desarrollo y pasar las pruebas (`pytest`, `npm test`, `npm run lint`, `npm run build`), se archiva el cambio en `openspec/changes/archive/` y se actualiza la especificación canónica en `openspec/specs/spec.md`.

---

## Coordinación Multi-Agente

- **Arquitecto (`gemini-architect`)**: Formula especificaciones, modelos de datos y criterios de aceptación.
- **Implementador (`opencode-builder`)**: Desarrolla el código en backend y frontend respetando los contratos.
- **Auditor (`opencode-qa`)**: Ejecuta los tests en contexto fresco y reporta hallazgos en `fixes-required.md`.
- **Handoff**: Al pausar o transferir una sesión, documenta el estado en `docs/handoffs/handoff.md`.
