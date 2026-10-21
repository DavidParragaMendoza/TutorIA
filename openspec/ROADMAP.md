# Roadmap — TutorIA MVP Orquestación Pedagógica HSK1/A1

> **Punto de entrada para sesiones y agentes.** Este archivo fija el orden, las decisiones ya cerradas y los hechos verificados del código para garantizar continuidad y trazabilidad rigurosa en el desarrollo de TutorIA.
>
> Fecha de referencia: 2026-10-20 · Metodología: Spec-Driven Development (SDD) & OpenSpec · Stack: FastAPI (Python 3.12/3.14), SQLModel/MySQL, React 18/19, AnythingLLM.

---

## Contexto en una línea

TutorIA es un sistema web de orquestación pedagógica para la enseñanza de chino mandarín HSK1/A1 que subordina modelos de lenguaje locales (AnythingLLM) a reglas deterministas en FastAPI, con control de acceso RBAC, protección LOPDP mediante seudonimización SHA-256 y un tablero analítico docente.

---

## Estado Real del Código y Gates de Calidad

Los cimientos del proyecto, los modelos relacionales de datos y todo el flujo de autenticación RBAC con seudonimización LOPDP ya están implementados y verificados:

| Componente | Qué cubre | Runner / Herramienta | Estado |
|---|---|---|---|
| **Backend (FastAPI)** | Modelos SQLModel, JWT, hashing SHA-256, RBAC, endpoints de usuario | `pytest` | ✅ 132/132 pruebas en verde |
| **Frontend (React)** | Vistas de Login, Chat, Tablero Docente, Consola Admin, Rutas protegidas | `npm --prefix frontend test` | ✅ 44/44 pruebas en verde |
| **Frontend Linter** | Reglas de sintaxis y buenas prácticas en React | `npm --prefix frontend run lint` | ✅ 0 errores, 0 warnings (Oxlint) |
| **Frontend Build** | Compilación y empaquetado para producción | `npm --prefix frontend run build` | ✅ Exit code 0 (Vite) |

---

## Decisiones Arquitectónicas Cerradas (Innegociables)

1. **Convención camelCase Estricta**: Todas las variables, nombres de funciones, clases, métodos, endpoints y claves JSON de respuesta de la API utilizan exclusivamente `camelCase` (ej: `usuarioId`, `obtenerRespuestaRag`, `contrasenaHash`).
2. **Idioma Único (Español)**: Toda la documentación, comentarios de código, mensajes de error e interfaces de usuario están en español, excepto los caracteres Hanzi y el Pinyin específicos del material de estudio HSK1.
3. **Privacidad LOPDP por Diseño**: Antes de realizar cualquier consulta al contenedor de AnythingLLM, el identificador del estudiante debe transformarse con hash irreversible `SHA-256(estudianteId + sal)`. Ningún dato identificable (PII) sale de la base de datos relacional hacia la IA.
4. **Límites Estrictos del MVP**: Totalmente prohibido incorporar módulos 3D, evaluación de voz (Whisper) o trazado de trazos Hanzi. El chat es cerrado con preguntas de opción múltiple.
5. **Modo Defensivo**: Si AnythingLLM tarda más de 3.0 segundos o se encuentra inalcanzable, FastAPI despacha automáticamente reactivos estáticos de contingencia desde MySQL.

---

## Grafo de Dependencias y Estado de Sprints

```
[Sprint 0: Cimientos] ──→ [Sprint 1: Auth & RBAC] ──→ [Sprint 2: Chat & RAG] ──→ [Sprint 3: Analítica Docente]
       (HECHO)                     (HECHO)                  (SIGUIENTE)                    (PLANIFICADO)
```

### Detalle de Historias de Usuario

| Sprint | Ticket | HU | Descripción | Capas | Dependencia | Estado |
|---|---|---|---|---|---|---|
| **Sprint 0** | TUT-00A | HU-00A | Modelo Lógico DER y creación de tablas SQLModel en MySQL | Backend / DB | — | ✅ Completado |
| **Sprint 0** | TUT-00B | HU-00B | Maquetación UI/UX en React de todas las pantallas del MVP | Frontend | — | ✅ Completado |
| **Sprint 1** | TUT-01 | HU-01 | Login con autenticación JWT cifrada y bloqueo tras 3 intentos | Fullstack | HU-00A | ✅ Completado |
| **Sprint 1** | TUT-02 | HU-02 | Redirección dinámica por rol RBAC (Estudiante, Docente, Admin) | Fullstack | HU-01 | ✅ Completado |
| **Sprint 1** | TUT-29 | HU-29 | Cierre de sesión seguro e invalidación de token JWT | Fullstack | HU-01 | ✅ Completado |
| **Sprint 1** | TUT-32 | HU-32 | Seudonimización con hash SHA-256 + sal (Cumplimiento LOPDP) | Backend | HU-01 | ✅ Completado |
| **Sprint 1** | TUT-23 | HU-23 | Consola de administración y gestión de cuentas de usuario | Fullstack | HU-01, HU-02 | ✅ Completado |
| **Sprint 2** | TUT-07 | HU-07 | Interfaz de Chat cerrado de opción múltiple para estudiantes | Fullstack | HU-02, HU-32 | ⏳ Próximo |
| **Sprint 2** | TUT-13 | HU-13 | Endpoint asíncrono `/api/v1/events` para ingesta de interacción | Backend | HU-07 | ⏳ Próximo |
| **Sprint 2** | TUT-15 | HU-15 | Motor de Reglas Pedagógicas HSK1/A1 deterministas | Backend | HU-13 | ⏳ Próximo |
| **Sprint 2** | TUT-18 | HU-18 | Pipeline RAG local en AnythingLLM con Chips de Contexto | Backend / IA | HU-15 | ⏳ Próximo |
| **Sprint 3** | TUT-25 | HU-25 | Servicio de Diagnóstico de Estado de Dominio de vocabulario | Backend | HU-13 | 📅 Planificado |
| **Sprint 3** | TUT-17 | HU-17 | Generación de Explicaciones pedagógicas breves (máx 30 palabras) | Backend / IA | HU-15, TUT-18 | 📅 Planificado |
| **Sprint 3** | TUT-20 | HU-20 | Tablero de monitoreo analítico en tiempo real para Docentes | Fullstack | HU-25 | 📅 Planificado |
| **Sprint 3** | TUT-21 | HU-21 | Aprobación o ajuste de Ruta de Aprendizaje en 1-clic | Fullstack | HU-20 | 📅 Planificado |
| **Sprint 3** | TUT-27 | HU-27 | Modo defensivo de contingencia ante caída o timeout de IA | Backend | HU-18 | 📅 Planificado |

---

## Protocolo de Verificación Antes de Commit o Merge

Todo agente o desarrollador debe ejecutar y verificar en verde los siguientes comandos antes de dar por cerrada cualquier tarea:

1. **Pruebas Backend**:
   ```bash
   pytest
   ```
2. **Pruebas Frontend**:
   ```bash
   npm --prefix frontend test
   ```
3. **Linter Frontend**:
   ```bash
   npm --prefix frontend run lint
   ```
4. **Build Frontend**:
   ```bash
   npm --prefix frontend run build
   ```
