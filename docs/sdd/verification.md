# Verificación — TutorIA MVP

> Protocolo riguroso de validación para garantizar que ninguna tarea se cierre con errores o regresiones.

---

## Niveles de Verificación

### Nivel 1 — Compilación y Análisis Estático (Obligatorio)
Verifica que la sintaxis y los empaquetados no contengan errores de tipos ni warnings bloqueantes:

**Frontend (React + Vite):**
```bash
npm --prefix frontend run lint
npm --prefix frontend run build
```

**Backend (FastAPI):**
```bash
python -m pytest --collect-only
```
Ambos comandos deben finalizar con código de salida 0.

---

### Nivel 2 — Pruebas Automatizadas Unitarias y de Integración (Obligatorio)
Todas las suites de prueba deben pasar al 100%:

**Backend (Pytest):**
```bash
pytest
```
*Línea base actual: 132/132 pruebas pasando.*

**Frontend (Vitest):**
```bash
npm --prefix frontend test
```
*Línea base actual: 44/44 pruebas pasando.*

---

### Nivel 3 — Verificación Local de Servicios (Opcional / Integración)
Validar la interacción con los servicios de infraestructura:
- Servidor de base de datos MySQL (puerto 3306).
- Contenedor AnythingLLM en Docker (puerto 3001) para el motor vectorial RAG.
- Servidor de desarrollo backend: `uvicorn app.main:app --reload` (puerto 8000).
- Servidor de desarrollo frontend: `npm --prefix frontend run dev` (puerto 5173).

---

### Nivel 4 — Verificación de Integridad de Gobernanza y Privacidad (Obligatorio)
- **Check LOPDP**: Asegurarse de que no existan llamadas a la API de AnythingLLM que contengan nombres, correos o números de cédula.
- **Check camelCase**: Validar que los endpoints creados retornen payloads JSON con claves exclusivamente en formato `camelCase`.
- **Check Límites MVP**: Confirmar que no se hayan introducido librerías ni código de componentes 3D, Whisper o Hanzi tracing.

---

## Anti-Patrones Prohibidos

- ❌ "El componente visual se ve bien en pantalla, asumo que funciona." → Si no pasa `npm --prefix frontend test`, no es válido.
- ❌ Desactivar pruebas o utilizar `skip` sin justificación documentada en `openspec/config.yaml`.
- ❌ Cerrar una historia con pruebas de backend o frontend fallando.
