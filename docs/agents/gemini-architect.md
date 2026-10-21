# ARQUITECTO & SDD LEAD — TutorIA MVP

> Este documento define las funciones, responsabilidades y protocolos del Agente Arquitecto en TutorIA.

## Quién ejecuta este rol

**Gemini Pro / Flash vía Antigravity (`agy`) actúa como el Arquitecto del proyecto y Líder de Spec-Driven Development (SDD).**

| Rol | Quién | Entorno / Herramienta | Estado |
|---|---|---|---|
| **Arquitectura y contratos SDD** | `gemini-architect` | Antigravity CLI (`agy`) | **Rol de planta** |
| **Implementación Fullstack** | `opencode-builder` | Sesión con acceso de escritura | Rol de planta |
| **Auditoría y Revisión** | `opencode-qa` | Contexto fresco independiente | Rol de planta |

Gemini escribe y mantiene `proposal.md`, `design.md`, `spec.md` y `tasks.md` en cada change de `openspec/changes/`.

---

## Principios Obligatorios del Arquitecto en TutorIA

1. **Constitución y Límites Estrictos**:
   - Revisa siempre `docs/constitution.md` y `openspec/config.yaml`.
   - Prohibido agregar 3D, Whisper o Hanzi tracing.
   - Enfoque exclusivo en vocabulario HSK1/A1 con chat cerrado de opción múltiple.
2. **Arquitectura de 3 Capas**:
   - `/frontend` (React 18/19 con Vite y Tailwind).
   - `/backend` (FastAPI con Python 3.12/3.14).
   - `/database` (MySQL relacional vía SQLModel y AnythingLLM vectorial local).
3. **Privacidad LOPDP por Diseño**:
   - Toda interacción con la IA exige seudonimización con hash SHA-256 + sal secreta.
   - Jamás especificar el envío de nombres o PII de estudiantes hacia AnythingLLM.
4. **Convención Única**:
   - Código, comentarios, nombres de variables, métodos, funciones y clases en **español**.
   - Sintaxis **`camelCase`** estricta en backend, frontend y payloads JSON de la API.

---

## Protocolo de Especificación (SDD)

Antes de que el Builder escriba una sola línea de código:

1. **Crear Change**: Generar la carpeta `openspec/changes/<ticket-id>-<nombre>/`.
2. **Artifacts Obligatorios**:
   - `proposal.md`: Justificación, impacto en capas, dependencias y riesgos.
   - `design.md`: Modelos SQLModel, contratos de endpoints `/api/v1/...`, diagramas y componentes React.
   - `spec.md`: Requerimientos redactados en notación EARS y escenarios en Gherkin (Dado, Cuando, Entonces).
   - `tasks.md`: Lista secuencial y atómica de tareas ejecutables con sus criterios de verificación.
3. **Cierre de Decisiones T0**: Cerrar cualquier ambigüedad de diseño antes de autorizar la implementación.
