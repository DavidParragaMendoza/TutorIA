# Memoria de Contexto y Acuerdos Técnicos — TutorIA MVP (Spec-Driven Development)

**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)  
**Metodología de Desarrollo:** Spec-Driven Development (SDD)  
**Estado Macro:** **SPRINT 0 OFICIALMENTE COMPLETADO (100%)**  
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

## 4. Estructura Física Final del Repositorio

```text
ProyectoOrquestacion/
├── AGENTS.md                                   # Reglas operativas para agentes de IA
├── docs/
│   ├── constitution.md                         # Principios éticos e innegociables
│   └── REPORTE_CONFORMIDAD_BD_20_TABLAS.md     # Especificación exacta de las 20 tablas MySQL
├── specs/
│   ├── 000-mvp-overview/
│   │   └── spec.md                             # Especificación macro del MVP (51 PH)
│   └── 001-sprint0-fundamentos/
│       ├── spec.md                             # Requisitos funcionales EARS del Sprint 0
│       ├── plan.md                             # Diseño técnico de carpetas y modelos
│       └── tasks.md                            # Checklist completado [x] del Sprint 0
├── plantillas/
│   └── plantillas-front/                       # Diseños HTML/Tailwind originales de Stitch
├── backend/
│   ├── .env                                    # Configuración local MySQL phpMyAdmin
│   ├── app/
│   │   ├── main.py                             # FastAPI y SQLModel.metadata.create_all()
│   │   ├── baseDatos/
│   │   │   └── conexion.py                     # Motor SQLModel y generador de sesiones
│   │   └── modelos/                            # 20 archivos de modelos ORM SQLModel
│   ├── tests/
│   │   └── test_modelos.py                     # 43 pruebas unitarias pytest (VERDE)
│   └── requirements.txt                        # fastapi, sqlmodel, pymysql, pytest, uvicorn
└── frontend/
    ├── src/
    │   ├── vistas/                             # 6 vistas base en React
    │   ├── datosSimulados/                     # Mocks JSON de datos de prueba
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js                          # Configuración de Vite y Vitest
    └── package.json                            # Scripts dev, test, build y lint (VERDE)
```

---

## 5. El Esquema Relacional de 20 Entidades en MySQL (`tutoria_db`)

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

## 6. Roadmap Macro y Próximo Paso: Sprint 1

- **Sprint 0 (6 PH - COMPLETADO):** Fundamentos, Scaffolding, 20 modelos SQLModel en MySQL, 6 Vistas React con Mocks JSON y Pruebas Unitarias.
- **Sprint 1 (16 PH - PRÓXIMO):** Autenticación, Seguridad y RBAC.
  - Formulario Login JWT [HU-01]
  - Redirección por Rol [HU-02]
  - Cierre de Sesión en Servidor [HU-29]
  - Consola de Administración [HU-23]
  - Seudonimización LOPDP Hash SHA-256 [HU-32]
  - *Estrategia Sprint 1:* Sustitución de `usuariosAuthMock.json` por la conexión real a los endpoints de FastAPI y MySQL.
- **Sprint 2 (15 PH):** Core Conversacional RAG e Ingesta.
- **Sprint 3 (14 PH):** SRS, Diagnóstico Docente y Resiliencia Defensiva.

---

## 7. Instrucciones para la Transición al IDE en el Sprint 1

Cuando inicies la especificación del **Sprint 1** en tu IDE:
1. Crear la carpeta `specs/002-sprint1-autenticacion/` con sus respectivos `spec.md`, `plan.md` y `tasks.md`.
2. Exigir la creación de Esquemas DTO en Pydantic (`UsuarioLoginEsquema`, `SesionEsquema`) que coincidan exactamente con la tabla `Usuarios` de MySQL.
3. Actualizar la vista `VistaAutenticacion.jsx` para reemplazar el consumo del mock por la petición `axios.post('/api/v1/auth/login')`.
4. Ejecutar siempre el ciclo de desarrollo TDD (Escribir primero tests en `pytest` / `vitest`, luego implementar el código, verificar en verde y marcar `[x]` con parada obligatoria).
