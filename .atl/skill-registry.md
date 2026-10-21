# Skill Registry — TutorIA MVP

> Registro de habilidades y herramientas disponibles para los agentes y subagentes en TutorIA.

Last updated: 2026-10-20

## Contrato de Uso

Cualquier agente que invoque subagentes consulta este registro para identificar y cargar las instrucciones operativas correspondientes a la tarea en curso.

---

## Habilidades y Protocolos Registrados

| Habilidad / Protocolo | Disparador / Descripción | Ámbito | Referencia |
|---|---|---|---|
| `sdd-architect` | Definición de especificaciones, contratos EARS, modelos de datos SQLModel y desglose de tareas. | Arquitectura | `docs/agents/gemini-architect.md` |
| `sdd-builder` | Implementación de lógica en FastAPI, modelos SQLModel y vistas en React con Tailwind. | Implementación | `docs/agents/opencode-builder.md` |
| `sdd-qa` | Verificación de suites en verde (`pytest`, `vitest`), linter, build y auditoría de privacidad LOPDP. | Calidad | `docs/agents/opencode-qa.md` |
| `session-handoff` | Cierre de sesión, checkpointing y documentación de continuidad para relevo de agentes. | Gobernanza | `docs/handoffs/handoff.md` |
| `lopdp-privacy` | Verificación de seudonimización SHA-256 antes de enviar datos al contenedor AnythingLLM. | Seguridad | `docs/sdd/architecture.md` |
| `camelcase-audit` | Auditoría de sintaxis camelCase estricta en código Python, JavaScript y payloads JSON. | Calidad | `docs/sdd/conventions.md` |

---

## Protocolo de Carga

1. Identificar el contexto de la tarea (planificación, codificación, auditoría o cierre de sesión).
2. Consultar las directrices del archivo de referencia antes de modificar código o artefactos.
3. Al terminar la tarea, ejecutar la verificación obligatoria de Nivel 1 y Nivel 2 descrita en `docs/sdd/verification.md`.
