# Memoria de Contexto y Acuerdos Técnicos — TutorIA MVP (Spec-Driven Development)

**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)  
**Metodología de Desarrollo:** Spec-Driven Development (SDD)  
**Estado Macro:** **SPRINT 1 OFICIALMENTE COMPLETADO (100% — 16/16 PH)**  
**Suite Certificada:** **152 pruebas en verde (120 backend + 32 frontend), lint y build sin errores**  
**Última Certificación:** 20 de octubre de 2026 — Auditoría LOPDP aprobada y cierre del Sprint 1  
**Propósito de este Documento:** Sirve como fuente de memoria inmutable, registro de decisiones técnicas y traspaso de contexto completo para Gemini Notebook / NotebookLM e IDEs de desarrollo (Antigravity, Cursor, VSCode, Roo Code).

---

## 1. Visión General del Proyecto y Filosofía SDD

TutorIA es una plataforma educativa de 3 capas diseñada para guiar a estudiantes universitarios hispanohablantes en el repaso de vocabulario HSK1/A1 mediante un chat cerrado de opción múltiple alimentado por un motor RAG local (AnythingLLM en Docker con Ollama/Qwen), subordinado bajo reglas pedagógicas deterministas para evitar alucinaciones de la IA.

### Principios Innegociables del Desarrollo (SDD)
1. **Spec-Anchored (La Especificación Manda):** Prohibido el *vibe coding*. Ningún endpoint, modelo de datos o componente de interfaz se implementa si no está previamente redactado en una especificación activa (`specs/`).
2. **Ciclo de Artefactos SDD:** `AGENTS.md` → `docs/constitution.md` → `specs/000-mvp-overview/spec.md` → `specs/001-sprint0.../spec.md` → `plan.md` → `tasks.md`.
3. **Auditoría Antes de Codificar:** La IA / IDE no genera código a ciegas; primero audita y revisa los esquemas de base de datos y las plantillas existentes.
4. **Validación con Mocks (Sprint 0):** El frontend se maquetó en React desacoplando todos los datos en archivos JSON (`frontend/src/datosSimulados/`) sin strings quemados (*hardcoded*), facilitando la transición a las API reales de FastAPI en los Sprints 1 a 3.

---

## 2. Stack Tecnológico Oficial y Reglas de Gobernanza

- **Frontend:** React maquetado con Tailwind CSS, Vite, Vitest y React Testing Library.
- **Backend:** FastAPI en Python (asíncrono, REST) con Pytest para la suite de pruebas.
- **Persistencia Relacional:** MySQL 8.0+ gestionado visualmente en **phpMyAdmin** (`tutoria_db`), con ORM **SQLModel** (Python, basado en Pydantic y SQLAlchemy).
- **Motor RAG / IA Local:** Contenedor de AnythingLLM ejecutado en Docker (integrado con Ollama / `qwen2.5:3b`).
- **Idioma y Sintaxis Estricta:** Todo el código fuente (variables, funciones, atributos, clases, componentes y comentarios) está redactado **100% en Español** con convención **`camelCase`** de manera uniforme (ejemplos: `usuarioId`, `correoInstitucional`, `obtenerRespuestaRag`).
- **Privacidad LOPDP por Diseño:** Seudonimización irreversible del identificador del estudiante usando **hash SHA-256 con sal** antes de enviar cualquier consulta al contenedor de AnythingLLM (HU-32).
- **Límites Estrictos del MVP (51 PH):** Excluidos del alcance módulos 3D (Three.js), evaluación de pronunciación por voz (Whisper) o lienzo de trazado Hanzi.

---

## 3. Resumen de Logros y Hitos del Sprint 0 (6 PH Completados)

### Fase 1: Configuración de Entorno y Estructura Base
- Estructura física de directorios configurada (`/backend`, `/frontend`, `/database`).
- Entorno virtual (`venv`) configurado e instalado con dependencias (`fastapi`, `sqlmodel`, `pymysql`, `pytest`, `uvicorn`).

### Fase 2: Auditoría y Especificación de Persistencia
- Auditoría relacional completa de las 20 entidades.
- Generación de `docs/REPORTE_CONFORMIDAD_BD_20_TABLAS.md`, certificando tipos de datos exactos, llaves primarias, 39 llaves foráneas, 16 restricciones `UNIQUE` y columnas de auditoría.

### Fase 3: Modelos SQLModel y Despliegue en MySQL
- Creación de `backend/.env` y `backend/app/baseDatos/conexion.py` configurados para MySQL (`tutoria_db`) en phpMyAdmin.
- Implementación de los 20 modelos ORM en `backend/app/modelos/` en sintaxis `camelCase` para atributos y `snake_case` para tablas relacionales.
- Inicialización en `backend/app/main.py` mediante `SQLModel.metadata.create_all()`.
- **Verificación visual exitosa en phpMyAdmin:** Las 20 tablas relacionales fueron instanciadas físicamente en MySQL sin errores.

### Fase 4: Maquetación y Desacoplamiento de Frontend
- Conversión de plantillas de Stitch a 6 vistas modulares en `frontend/src/vistas/`:
  1. `VistaAutenticacion.jsx` (Login y selección de rol)
  2. `VistaRecuperacionCredenciales.jsx` (Recuperación de clave)
  3. `VistaRutaAprendizaje.jsx` (Módulos y progreso HSK1)
  4. `VistaChatEstudiante.jsx` (Chat cerrado de vocabulario RAG)
  5. `VistaTableroDocente.jsx` (Monitoreo analítico y semáforos de riesgo)
  6. `VistaConsolaAdministrador.jsx` (Gestión centralizada de usuarios)
- Limpieza total de marcas antiguas (*KUMA HuáYu* → *TutorIA*) y actualización de años.
- Aislamiento de datos de prueba en Mocks JSON (`frontend/src/datosSimulados/`):
  - `usuariosAuthMock.json`, `chatVocabularioMock.json`, `rutaAprendizajeMock.json`, `estudiantesDocenteMock.json`, `usuariosAdminMock.json`.

### Fase 5: Suite de Pruebas Automatizadas y Control de Calidad
- **Backend (`pytest`):** **43 pruebas en verde** (`test_modelos.py`) confirmando instanciación y registro de metadata de las 20 clases SQLModel.
- **Frontend (`vitest`):** **7 pruebas en verde** (`vistas.test.jsx`) verificando el correcto renderizado de las 6 vistas con sus Mocks JSON.
- **Compilación e Inspección (`npm run build` / `npm run lint`):** Compilación exitosa de 27 módulos con **0 errores y 0 advertencias**.
- **Gobernanza:** 100% código en español, convención `camelCase` verificada y ausencia total de residuos.

---

## 4. Resumen de Logros y Hitos del Sprint 1 (16 PH Completados)

**Estado:** **SPRINT 1 OFICIALMENTE COMPLETADO AL 100% (16/16 PH)**  
**Historias cubiertas:** HU-01, HU-02, HU-23, HU-29 y HU-32.  
**Suite certificada:** **152 pruebas en verde** (120 backend + 32 frontend), con `npm run lint` y `npm run build` sin errores.

### Fase 1: Datos Semilla y Cifrado (3 PH)
- Implementación de `backend/app/seguridad/cifrado.py` con `passlib[bcrypt]`.
- Implementación de `backend/app/baseDatos/semillas.py` con seeding idempotente de 3 roles y 3 usuarios semilla con contraseñas `bcrypt`.
- Ejecución verificada de `python -m app.baseDatos.semillas` sobre `tutoria_db` en MySQL: roles `ESTUDIANTE`, `DOCENTE` y `ADMINISTRADOR`; usuarios `admin@tutoria.edu.ec`, `docente@tutoria.edu.ec` y `estudiante@tutoria.edu.ec`, todos `ACTIVO`, con `intentosFallidos = 0` y rol asignado en `usuario_rol`.
- El `lifespan` de FastAPI ejecuta `SQLModel.metadata.create_all()` y `ejecutarSemillas()` en cada arranque.

### Fase 2: Autenticación, JWT, RBAC y API REST (7 PH)
- Tokens JWT HS256 con claims `sub`, `rol`, `pseudonimoHash` y `exp` (480 minutos).
- Endpoints operativos: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`, `POST /api/v1/users` y `GET /api/v1/users`.
- Bloqueo de cuenta al tercer intento fallido consecutivo y respuesta HTTP 401 unificada.
- Logout en servidor mediante `fechaExpiracionToken = ahora (UTC)` en `sesiones_usuario`.
- Creación y listado de usuarios protegidos por RBAC `ADMINISTRADOR`, con rechazo HTTP 409 ante correo o cédula duplicados.

### Fase 3: Integración Frontend con API Real (4 PH)
- `clienteApi.js` con `baseURL` de FastAPI e interceptor JWT; limpieza de sesión ante HTTP 401.
- `autenticacionServicio.js` para login, logout, perfil y creación de usuarios.
- `VistaAutenticacion.jsx` conectada a la API real, con estados de carga, error y redirección por rol.
- `RutaProtegida.jsx` y enrutamiento dinámico RBAC para `/estudiante/*`, `/docente/*` y `/admin/*`.
- `VistaConsolaAdministrador.jsx` conectada a `POST /api/v1/users`, con alertas de éxito/duplicidad y refresco de la tabla.

### Fase 4: Auditoría LOPDP, Calidad y Cierre (2 PH)
- **TAREA-4.1 — Auditoría de seudonimización LOPDP:** PASS. Se realizó un login real del estudiante y se verificó en MySQL que `sesiones_usuario.pseudonimoHash` contiene un SHA-256 hexadecimal de 64 caracteres, determinista y coincidente con `SHA256(f"{usuarioId}:{SAL_LOPDP_SECRET}")`. Las columnas de `sesiones_usuario` son únicamente `id`, `usuarioId`, `pseudonimoHash`, `fechaInicio` y `fechaExpiracionToken`; no se almacenan nombres, cédulas, correos ni contraseñas.
- **TAREA-4.2 — Suite completa y compilación:** Backend `pytest`: **120/120 passed, 0 warnings**. Frontend `npm test`: **32/32 passed** en 3 archivos. `npm run lint`: **0 warnings, 0 errores**. `npm run build`: **85 módulos transformados, 0 errores**. Se actualizó `backend/requirements.txt` de `httpx` a `httpx2` para eliminar la advertencia de `starlette.testclient` y certificar la suite sin advertencias.
- **TAREA-4.3 — Registro y cierre:** Este documento certifica el Sprint 1 al 100% y `specs/002-sprint1-autenticacion/tasks.md` registra las tareas 4.1, 4.2 y 4.3 como completadas.

### Definición de Terminado (DoD) del Sprint 1
1. [x] Script de semillas funcional, idempotente y ejecutado en el startup de FastAPI.
2. [x] Endpoints `/login`, `/logout`, `/me` y `/users` operativos.
3. [x] Cero datos sensibles (cédula, correo, nombre) expuestos en las variables de sesión del RAG.
4. [x] Suite de pruebas Pytest y Vitest en 100% verde (152 pruebas).
5. [x] Cero advertencias de linter y compilación `npm run build` exitosa.

---

## 5. Estructura Física Final del Repositorio

```text
ProyectoOrquestacion/
├── AGENTS.md                                   # Reglas operativas para agentes de IA
├── MEMORIA_CONTEXTO_SDD_TUTORIA.md             # Memoria y certificación de Sprints
├── docs/
│   ├── constitution.md                         # Principios éticos e innegociables
│   └── REPORTE_CONFORMIDAD_BD_20_TABLAS.md     # Especificación exacta de las 20 tablas MySQL
├── specs/
│   ├── 000-mvp-overview/
│   │   └── spec.md                             # Especificación macro del MVP (51 PH)
│   ├── 001-sprint0-fundamentos/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md                            # Checklist completado [x] del Sprint 0
│   └── 002-sprint1-autenticacion/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md                            # Checklist completado [x] del Sprint 1
├── plantillas/
│   └── plantillas-front/                       # Diseños HTML/Tailwind originales de Stitch
├── backend/
│   ├── .env                                    # MySQL, JWT_SECRET_KEY y SAL_LOPDP_SECRET
│   ├── app/
│   │   ├── main.py                             # FastAPI, CORS, lifespan y seeding
│   │   ├── api/v1/
│   │   │   ├── router.py
│   │   │   └── endpoints/
│   │   │       ├── autenticacion.py            # /login, /logout y /me
│   │   │       └── usuarios.py                 # /users con RBAC ADMINISTRADOR
│   │   ├── baseDatos/
│   │   │   ├── conexion.py                     # Motor SQLModel y sesiones
│   │   │   └── semillas.py                     # Seeding idempotente de roles y usuarios
│   │   ├── esquemas/
│   │   │   ├── autenticacionEsquemas.py        # DTOs camelCase de autenticación
│   │   │   └── usuarioEsquemas.py              # DTOs camelCase de usuarios
│   │   ├── modelos/                            # 20 archivos de modelos ORM SQLModel
│   │   ├── seguridad/
│   │   │   ├── cifrado.py                      # bcrypt
│   │   │   ├── jwt.py                          # JWT HS256
│   │   │   ├── lopdp.py                        # SHA-256 con sal
│   │   │   └── dependencias.py                 # RBAC y obtención del usuario actual
│   │   └── servicios/
│   │       ├── autenticacionServicio.py        # Login, bloqueo, sesión y logout
│   │       └── usuarioServicio.py              # Creación y listado de usuarios
│   ├── tests/                                  # 120 pruebas pytest (VERDE)
│   ├── requirements.txt
│   └── venv/
└── frontend/
    ├── src/
    │   ├── contexto/
    │   │   └── ContextoAutenticacion.jsx       # Estado global de sesión y JWT
    │   ├── servicios/
    │   │   ├── clienteApi.js                   # Axios con interceptor JWT
    │   │   └── autenticacionServicio.js        # Login, logout, perfil y usuarios
    │   ├── vistas/                             # 6 vistas, RutaProtegida y 32 pruebas
    │   ├── datosSimulados/                     # Mocks JSON conservados para pruebas
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js                          # Configuración de Vite y Vitest
    └── package.json                            # Scripts dev, test, build y lint (VERDE)
```

---

## 6. El Esquema Relacional de 20 Entidades en MySQL (`tutoria_db`)

1. `Rol` (`roles`): Catálogo estático de permisos.
2. `Usuario` (`usuarios`): Cuentas, credenciales e historial de intentos fallidos.
3. `UsuarioRol` (`usuario_rol`): Relación N:M entre usuarios y roles.
4. `Idioma` (`idiomas`): Catálogo de idiomas.
5. `Nivel` (`niveles`): Dificultad HSK1/A1.
6. `PeriodoAcademico` (`periodos_academicos`): Ciclos lectivos universitarios.
7. `InstitucionAliada` (`instituciones_aliadas`): Convenios institucionales.
8. `Modalidad` (`modalidades`): Métodos de enseñanza.
9. `Curso` (`cursos`): Agrupa idioma, nivel, institución y modalidad.
10. `Paralelo` (`paralelos`): Aula con docente asignado.
11. `Matricula` (`matriculas`): Inscripción del estudiante.
12. `SesionUsuario` (`sesiones_usuario`): Tokens JWT y hash SHA-256 LOPDP.
13. `BloquePractica` (`bloques_practica`): Intentos de lección HSK1.
14. `EventoInteraccion` (`eventos_interaccion`): Trazabilidad inmutable de respuestas en el chat.
15. `EstadoDominioEstudiante` (`estado_dominio_estudiante`): Asimilación léxica y parámetros SRS.
16. `AuditoriaRutaAprendizaje` (`auditoria_ruta_aprendizaje`): Decisiones y observaciones del docente.
17. `DetalleIntervencionGlosario` (`detalle_intervencion_glosario`): Términos HSK1 a reforzar por prioridad.
18. `CategoriaGlosario` (`categorias_glosario`): Categorías temáticas HSK1.
19. `GlosarioHsk1` (`glosario_hsk1`): Vocabulario oficial HSK1/A1 (Hanzi, Pinyin, Español).
20. `PreguntaContingenciaHsk1` (`preguntas_contingencia_hsk1`): Banco estático defensivo para timeouts.

---

## 7. Roadmap Macro y Próximo Paso: Sprint 2

- **Sprint 0 (6 PH - COMPLETADO):** Fundamentos, Scaffolding, 20 modelos SQLModel en MySQL, 6 Vistas React con Mocks JSON y Pruebas Unitarias.
- **Sprint 1 (16 PH - COMPLETADO AL 100%):** Autenticación, Seguridad, RBAC y Seudonimización LOPDP.
  - Login JWT y redirección por rol [HU-01, HU-02] — COMPLETADO.
  - Logout con invalidación en servidor [HU-29] — COMPLETADO.
  - Consola de Administración de usuarios [HU-23] — COMPLETADO.
  - Seudonimización SHA-256 con sal [HU-32] — COMPLETADO y auditado en MySQL.
  - *Resultado certificado:* 152 pruebas en verde (120 backend + 32 frontend), lint y build sin errores.
- **Sprint 2 (15 PH - PRÓXIMO):** Core Conversacional RAG e Ingesta.
- **Sprint 3 (14 PH):** SRS, Diagnóstico Docente y Resiliencia Defensiva.

---

## 8. Instrucciones para la Transición al IDE en el Sprint 2

Cuando inicies la especificación del **Sprint 2** en tu IDE:
1. Partir de la suite certificada del Sprint 1 (152 pruebas en verde) y mantener el ciclo TDD (`pytest` / `npm test`).
2. Reutilizar el token JWT y el `pseudonimoHash` LOPDP generado en `sesiones_usuario`; es el único identificador permitido para las interacciones con AnythingLLM.
3. No enviar nombres, cédulas, correos ni ningún dato identificable del estudiante al contenedor de AnythingLLM.
4. Documentar primero la especificación del Sprint 2 en `specs/` antes de implementar endpoints o componentes.
5. Ejecutar siempre `npm run lint` y `npm run build` antes de cerrar cada fase.
