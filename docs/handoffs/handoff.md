# Plantilla de Handoff — TutorIA MVP

> Esta plantilla garantiza la continuidad de trabajo entre distintos agentes o sesiones (por cambio de turno, límite de contexto o relevo de modelo).

---

## 1. Estado Actual (Checkpoint)

- **Rama / Contexto**: `<nombre-de-rama>` (ej. `feature/arnes-sdd`)
- **Change Activo**: `openspec/changes/<ticket-id>-<nombre>/`
  - Estado de artefactos: `[ ] proposal.md`, `[ ] design.md`, `[ ] tasks.md`, `[ ] spec.md`
- **Historia o Feature en Desarrollo**: `<descripción concisa de la actividad>`

---

## 2. Lo que se Implementó (Realidad del Código)

### Backend (FastAPI / SQLModel)

| Archivo | Qué hace |
|---|---|
| `<ruta>` | `<descripción del cambio>` |

### Frontend (React / Vite)

| Archivo | Qué hace |
|---|---|
| `<ruta>` | `<descripción del cambio>` |

---

## 3. Estado de los Gates de Calidad

- **Pruebas Backend (`pytest`)**: `<N>` pasando / `<N>` fallando
- **Pruebas Frontend (`npm --prefix frontend test`)**: `<N>` pasando / `<N>` fallando
- **Linter Frontend (`npm --prefix frontend run lint`)**: 0 errores
- **Build Frontend (`npm --prefix frontend run build`)**: exit 0

---

## 4. Próximos Pasos para el Siguiente Agente

1. **Reanudar**: Continuar desde `<archivo o tarea pendiente>`.
2. **Validar**: Ejecutar los gates de Nivel 1 y Nivel 2.
3. **Archivar**: Al completar la tarea, mover la especificación a `openspec/changes/archive/` y actualizar `openspec/ROADMAP.md` y `openspec/specs/spec.md`.
