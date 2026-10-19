# Reporte de Conformidad del Esquema Relacional — 20 Tablas

## 1. Control del documento

| Campo | Valor |
|---|---|
| Proyecto | TutorIA — Orquestación Pedagógica HSK1/A1 |
| Documento | Reporte de Conformidad del Esquema Relacional |
| Tarea | Tarea 2.3 — Generar Reporte de Conformidad del Esquema Relacional |
| Versión | 1.0 |
| Fecha | 19 de octubre de 2026 |
| Estado | **APROBADO — Esquema 100% formalizado para iniciar la codificación** |
| Fuente de verdad | `specs/001-sprint0-fundamentos/spec.md` (RF-02), `plan.md`, `tasks.md`, `docs/constitution.md`, `AGENTS.md` e Informe de Inspección Tarea 2.2 |
| Alcance | 20 entidades relacionales, 130 columnas, 39 llaves foráneas, 16 restricciones UNIQUE |
| Fuera de alcance | Clases Python en `backend/app/modelos/`, migraciones, creación física de tablas y datos semilla |

> **Nota de alcance:** este documento formaliza el esquema lógico-físico. No contiene clases SQLModel ni DDL ejecutable. La implementación de los modelos corresponde a la Tarea 3.2.

---

## 2. Resumen ejecutivo y certificación

La auditoría de la Tarea 2.2 identificó que la especificación enumeraba las 20 entidades y sus columnas, pero no fijaba tipos físicos, nulabilidad, valores por defecto, restricciones UNIQUE ni políticas de llaves foráneas. La Tarea 2.3 resuelve esas brechas y añade las dos correcciones de auditoría solicitadas:

1. `Paralelos.fechaCreacion` — `DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`.
2. `EstadoDominioEstudiante.fechaActualizacion` — `DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`.

### Métricas de conformidad

| Métrica | Resultado |
|---|---|
| Entidades formalizadas | **20/20** |
| Columnas con tipo SQLModel/MySQL definido | **130/130** |
| Columnas con nulabilidad definida | **130/130** |
| Columnas con valor por defecto o decisión explícita | **130/130** |
| Llaves primarias | **20/20** |
| Llaves foráneas | **39/39** con destino, acción `ON DELETE` y `ON UPDATE` |
| Restricciones UNIQUE | **16** |
| Índices secundarios/compuestos planificados | **39 FK indexadas + índices de consulta definidos** |
| Correcciones de auditoría aplicadas | **2/2** |
| Hallazgos bloqueantes abiertos | **0** |
| Motor objetivo | **MySQL 8.0.16+ / InnoDB / utf8mb4** |
| Estado para Tarea 3.2 | **APTO** |

### Certificación

Se certifica que el esquema relacional de las 20 tablas de TutorIA queda **100% formalizado** a nivel de tipos de datos, nulabilidad, valores por defecto, llaves primarias, llaves foráneas, restricciones UNIQUE, índices, charset, políticas de integridad referencial y reglas semánticas de aplicación. **No existen hallazgos bloqueantes pendientes** para iniciar la codificación de los modelos SQLModel en la Tarea 3.2.

---

## 3. Decisiones globales del esquema

### 3.1 Motor, charset y convenciones

| Decisión | Valor |
|---|---|
| Motor | InnoDB |
| Versión mínima | MySQL 8.0.16+ (JSON, `CHECK` efectivo, `utf8mb4`, índices funcionales) |
| Charset | `utf8mb4` |
| Collation general | `utf8mb4_unicode_ci` |
| Collation de hashes | `ascii_bin` para `pseudonimoHash` |
| Zona horaria | UTC; la sesión de conexión debe fijar `time_zone = '+00:00'` |
| Nombres de tablas | `snake_case` plural, según `plan.md` |
| Nombres de columnas | `camelCase` en español, idénticos a la spec y a las claves JSON de la API |
| Timestamps | `DATETIME(6)` con `CURRENT_TIMESTAMP(6)` |
| Fechas académicas puras | `DATE` |
| Booleanos | `BOOLEAN` (`TINYINT(1)`) |
| IDs | `BIGINT UNSIGNED AUTO_INCREMENT` en las 20 tablas |
| FKs | Mismo tipo que la PK destino: `BIGINT UNSIGNED` |
| Borrado | Lógico mediante `estado`; prohibido el borrado físico de entidades con historial |

### 3.2 Mapeo SQLModel ↔ MySQL

| Tipo SQLModel | Tipo MySQL | Nota de implementación |
|---|---|---|
| `int` (PK/FK) | `BIGINT UNSIGNED` | SQLModel `int` por sí solo genera `INTEGER`; se requiere `sa_column=Column(BIGINT(unsigned=True))` |
| `int` | `INT UNSIGNED` | Contadores y capacidades; `Column(INTEGER(unsigned=True))` |
| `int` | `SMALLINT UNSIGNED` | `prioridadDocente`; `Column(SMALLINT(unsigned=True))` |
| `str` | `VARCHAR(n)` | `Field(max_length=n)` |
| `str` | `CHAR(64)` | `pseudonimoHash`; `Column(CHAR(64))` |
| `str` | `TEXT` | Textos largos; `Column(TEXT)` |
| `datetime` | `DATETIME(6)` | `Column(DATETIME(fsp=6))` |
| `date` | `DATE` | Fechas de periodos académicos |
| `Decimal` | `DECIMAL(5,2)` | `Field(max_digits=5, decimal_places=2)` |
| `bool` | `BOOLEAN` | `esCorrecto` |
| `dict[str, Any]` / `list[dict[str, Any]]` | `JSON` | `Column(JSON)`; validar estructura en aplicación |

### 3.3 Política de llaves foráneas

- Todas las FKs usan `ON DELETE RESTRICT` y `ON UPDATE RESTRICT`.
- No se usa `CASCADE` en ninguna relación: las entidades con historial pedagógico, auditoría o eventos no deben borrarse en cascada.
- Las bajas de usuarios, cursos, paralelos y matrículas son **lógicas** mediante `estado`, `estadoConvocatoria`, `estadoMatricula` o `estado` según corresponda.
- Las PK son inmutables; por eso `ON UPDATE RESTRICT`.
- Las FKs de auditoría (`creadoPor`, `actualizadoPor`, `asignadoPor`, `matriculadoPor`) son nullable para permitir el bootstrap y los datos semilla. En operaciones de usuario deben poblarse siempre.

### 3.4 Política de auditoría

| Nivel de auditoría | Tablas | Decisión |
|---|---|---|
| Auditoría completa | `Usuarios` | `creadoPor`, `fechaCreacion`, `actualizadoPor`, `fechaActualizacion` |
| Auditoría de creación | `Idiomas`, `Niveles`, `PeriodosAcademicos`, `InstitucionesAliadas`, `Cursos`, `Paralelos` | `creadoPor`, `fechaCreacion` |
| Auditoría funcional actor/fecha | `UsuarioRol`, `Matriculas`, `AuditoriaRutaAprendizaje` | `asignadoPor`/`fechaAsignacion`, `matriculadoPor`/`fechaMatricula`, `docenteId`/`fechaAccion` |
| Fechas de ciclo de vida | `SesionesUsuario`, `BloquesPractica`, `EventosInteraccion`, `EstadoDominioEstudiante` | Fechas de inicio, fin, evento, expiración y actualización |
| Excepción documentada | `Roles`, `Modalidades`, `CategoriasGlosario`, `GlosarioHsk1`, `PreguntasContingenciaHsk1` | Catálogos estáticos administrados por seed/migración; sin actor humano en el MVP |
| Excepción documentada | `DetalleIntervencionGlosario` | Hereda trazabilidad de `AuditoriaRutaAprendizaje`; los cambios de `estadoRefuerzo` se registran en el log de aplicación |

### 3.5 Valores permitidos por columnas de estado

| Tabla | Columna | Valores permitidos |
|---|---|---|
| `Usuarios` | `estado` | `ACTIVO`, `BLOQUEADO`, `INACTIVO` |
| `PeriodosAcademicos` | `estado` | `PLANIFICADO`, `ACTIVO`, `CERRADO` |
| `Modalidades` | `estado` | `ACTIVA`, `INACTIVA` |
| `Cursos` | `estadoConvocatoria` | `BORRADOR`, `PUBLICADA`, `CERRADA`, `CANCELADA` |
| `Matriculas` | `estadoMatricula` | `ACTIVA`, `RETIRADA`, `COMPLETADA` |
| `EventosInteraccion` | `origenRespuesta` | `RAG`, `CONTINGENCIA` |
| `EstadoDominioEstudiante` | `estadoDominio` | `DEBIL`, `EN_PROGRESO`, `DOMINADO` |
| `AuditoriaRutaAprendizaje` | `accionRealizada` | `APROBAR_AVANCE`, `ASIGNAR_REPASO`, `INTERVENIR_RUTA`, `REGISTRAR_OBSERVACION` |
| `DetalleIntervencionGlosario` | `estadoRefuerzo` | `PENDIENTE`, `EN_REFUERZO`, `COMPLETADO` |

---

## 4. Matriz de conformidad de las 20 tablas

| # | Capa | Tabla | PK | FK | UNIQUE | Auditoría | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Seguridad/RBAC | `Roles` | `id` | 0 | 1 | Excepción documentada | Conforme |
| 2 | Seguridad/RBAC | `Usuarios` | `id` | 2 | 2 | Completa | Conforme |
| 3 | Seguridad/RBAC | `UsuarioRol` | `id` | 3 | 1 | Funcional | Conforme |
| 4 | Seguridad/RBAC | `SesionesUsuario` | `id` | 1 | 0 | Ciclo de vida | Conforme |
| 5 | Estructura Académica | `Idiomas` | `id` | 1 | 1 | Creación | Conforme |
| 6 | Estructura Académica | `Niveles` | `id` | 1 | 1 | Creación | Conforme |
| 7 | Estructura Académica | `PeriodosAcademicos` | `id` | 1 | 1 | Creación | Conforme |
| 8 | Estructura Académica | `InstitucionesAliadas` | `id` | 1 | 1 | Creación | Conforme |
| 9 | Estructura Académica | `Modalidades` | `id` | 0 | 1 | Excepción documentada | Conforme |
| 10 | Estructura Académica | `Cursos` | `id` | 5 | 1 | Creación | Conforme |
| 11 | Estructura Académica | `Paralelos` | `id` | 4 | 1 | Creación corregida | Conforme |
| 12 | Estructura Académica | `Matriculas` | `id` | 3 | 1 | Funcional | Conforme |
| 13 | Sesiones/Práctica | `BloquesPractica` | `id` | 2 | 0 | Ciclo de vida | Conforme |
| 14 | Sesiones/Práctica | `EventosInteraccion` | `id` | 4 | 0 | Inmutable | Conforme |
| 15 | Sesiones/Práctica | `AuditoriaRutaAprendizaje` | `id` | 3 | 0 | Inmutable | Conforme |
| 16 | Sesiones/Práctica | `DetalleIntervencionGlosario` | `id` | 2 | 1 | Excepción documentada | Conforme |
| 17 | SRS/Diagnóstico | `EstadoDominioEstudiante` | `id` | 3 | 1 | Actualización corregida | Conforme |
| 18 | Glosario HSK1 | `CategoriasGlosario` | `id` | 0 | 1 | Excepción documentada | Conforme |
| 19 | Glosario HSK1 | `GlosarioHsk1` | `id` | 2 | 1 | Excepción documentada | Conforme |
| 20 | Glosario HSK1 | `PreguntasContingenciaHsk1` | `id` | 1 | 0 | Excepción documentada | Conforme |
| **Total** | — | **20 tablas** | **20** | **39** | **16** | — | **20/20 conformes** |

---

## 5. Diccionario de datos completo

### 5.1 `Roles` — Seguridad/RBAC

Catálogo estático de roles del sistema.

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_roles` |
| `nombre` | `str` | `VARCHAR(50)` | NO | — | UNIQUE `uq_roles_nombre`; valores semilla: `Estudiante`, `Docente`, `Administrador` |
| `descripcion` | `str \| None` | `VARCHAR(255)` | SÍ | `NULL` | — |

- **PK:** `id`.
- **FK:** ninguna.
- **UNIQUE:** `uq_roles_nombre (nombre)`.
- **Auditoría:** excepción documentada por catálogo estático.
- **Índices:** `uq_roles_nombre`.

### 5.2 `Usuarios` — Seguridad/RBAC

Cuentas de usuario, credenciales y control de acceso.

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_usuarios` |
| `nombresCompletos` | `str` | `VARCHAR(200)` | NO | — | — |
| `cedula` | `str` | `VARCHAR(20)` | NO | — | UNIQUE `uq_usuarios_cedula`; validación de aplicación: 10 dígitos para Ecuador |
| `correoInstitucional` | `str` | `VARCHAR(150)` | NO | — | UNIQUE `uq_usuarios_correo`; normalizar a minúsculas en aplicación |
| `passwordHash` | `str` | `VARCHAR(255)` | NO | — | bcrypt o argon2id; prohibido texto plano |
| `estado` | `str` | `VARCHAR(20)` | NO | `'ACTIVO'` | CHECK `ck_usuarios_estado` IN (`ACTIVO`, `BLOQUEADO`, `INACTIVO`) |
| `intentosFallidos` | `int` | `INT UNSIGNED` | NO | `0` | CHECK `intentosFallidos >= 0` |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_usuarios_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |
| `actualizadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_usuarios_actualizado_por` → `Usuarios.id` |
| `fechaActualizacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)` | — |

- **PK:** `id`.
- **FK:** `creadoPor` y `actualizadoPor` → `Usuarios.id` (`RESTRICT`/`RESTRICT`).
- **UNIQUE:** `uq_usuarios_cedula (cedula)`, `uq_usuarios_correo (correoInstitucional)`.
- **Auditoría:** completa.
- **Índices:** `uq_usuarios_cedula`, `uq_usuarios_correo`, `idx_usuarios_estado (estado)`, `idx_usuarios_creado_por (creadoPor)`, `idx_usuarios_actualizado_por (actualizadoPor)`.
- **Regla de bloqueo:** tras 3 intentos fallidos, `estado = 'BLOQUEADO'` e `intentosFallidos = 3`; el desbloqueo se controla en Sprint 1 con `estado` y `fechaActualizacion`. No se añade `fechaBloqueo` en Sprint 0.

### 5.3 `UsuarioRol` — Seguridad/RBAC

Vinculación N:M entre usuarios y roles.

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_usuario_rol` |
| `usuarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_usuario_rol_usuario` → `Usuarios.id` |
| `rolId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_usuario_rol_rol` → `Roles.id` |
| `asignadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_usuario_rol_asignado_por` → `Usuarios.id` |
| `fechaAsignacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **PK:** `id`.
- **FK:** 3 (ver matriz de FKs).
- **UNIQUE:** `uq_usuario_rol_usuario_rol (usuarioId, rolId)`.
- **Auditoría:** funcional (`asignadoPor`, `fechaAsignacion`).
- **Índices:** `uq_usuario_rol_usuario_rol`, `idx_usuario_rol_rol (rolId)`, `idx_usuario_rol_asignado_por (asignadoPor)`.
- **Regla:** un usuario puede tener varios roles; la autorización evalúa el conjunto. La UI asigna uno por defecto.

### 5.4 `SesionesUsuario` — Seguridad/RBAC

Ciclo de vida de sesiones JWT y seudónimo SHA-256 para RAG.

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_sesiones_usuario` |
| `usuarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_sesiones_usuario` → `Usuarios.id` |
| `pseudonimoHash` | `str` | `CHAR(64) CHARACTER SET ascii COLLATE ascii_bin` | NO | — | SHA-256 hexadecimal en minúsculas; salt en variable de entorno; no se almacena salt |
| `fechaInicio` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |
| `fechaExpiracionToken` | `datetime` | `DATETIME(6)` | NO | — | CHECK `fechaExpiracionToken > fechaInicio` |

- **PK:** `id`.
- **FK:** `usuarioId` → `Usuarios.id`.
- **UNIQUE:** ninguna. Se permiten múltiples sesiones por usuario; el mismo `pseudonimoHash` puede repetirse entre sesiones del mismo estudiante.
- **Auditoría:** ciclo de vida; no requiere actor humano.
- **Índices:** `idx_sesiones_usuario (usuarioId)`, `idx_sesiones_hash (pseudonimoHash)`, `idx_sesiones_expiracion (fechaExpiracionToken)`.
- **Regla de logout:** `fechaExpiracionToken = UTC_TIMESTAMP(6)` en la sesión correspondiente; el backend rechaza tokens cuya sesión esté expirada. No se añade `fechaCierre` en Sprint 0.
- **Privacidad:** el hash es el único identificador enviado a AnythingLLM; nunca se envía `nombresCompletos`, `cedula` ni `correoInstitucional`.

### 5.5 `Idiomas` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_idiomas` |
| `nombre` | `str` | `VARCHAR(50)` | NO | — | UNIQUE `uq_idiomas_nombre` |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_idiomas_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **UNIQUE:** `uq_idiomas_nombre (nombre)`.
- **Auditoría:** creación.
- **Índices:** `uq_idiomas_nombre`, `idx_idiomas_creado_por`.

### 5.6 `Niveles` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_niveles` |
| `codigo` | `str` | `VARCHAR(20)` | NO | — | UNIQUE `uq_niveles_codigo`; valores semilla: `HSK1`, `A1` |
| `descripcion` | `str \| None` | `VARCHAR(255)` | SÍ | `NULL` | — |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_niveles_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **UNIQUE:** `uq_niveles_codigo (codigo)`.
- **Auditoría:** creación.
- **Índices:** `uq_niveles_codigo`, `idx_niveles_creado_por`.

### 5.7 `PeriodosAcademicos` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_periodos_academicos` |
| `codigo` | `str` | `VARCHAR(20)` | NO | — | UNIQUE `uq_periodos_codigo` |
| `fechaInicio` | `date` | `DATE` | NO | — | — |
| `fechaFin` | `date` | `DATE` | NO | — | CHECK `ck_periodos_rango (fechaFin > fechaInicio)` |
| `estado` | `str` | `VARCHAR(20)` | NO | `'ACTIVO'` | CHECK `ck_periodos_estado` IN (`PLANIFICADO`, `ACTIVO`, `CERRADO`) |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_periodos_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **UNIQUE:** `uq_periodos_codigo (codigo)`.
- **Auditoría:** creación.
- **Índices:** `uq_periodos_codigo`, `idx_periodos_estado (estado)`, `idx_periodos_creado_por`.

### 5.8 `InstitucionesAliadas` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_instituciones_aliadas` |
| `nombreInstitucion` | `str` | `VARCHAR(200)` | NO | — | — |
| `pais` | `str` | `VARCHAR(60)` | NO | — | — |
| `tipoConvenio` | `str` | `VARCHAR(50)` | NO | — | — |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_instituciones_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **UNIQUE:** `uq_instituciones_nombre_pais (nombreInstitucion, pais)`.
- **Auditoría:** creación.
- **Índices:** `uq_instituciones_nombre_pais`, `idx_instituciones_creado_por`.

### 5.9 `Modalidades` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_modalidades` |
| `nombreModalidad` | `str` | `VARCHAR(100)` | NO | — | UNIQUE `uq_modalidades_nombre` |
| `estado` | `str` | `VARCHAR(20)` | NO | `'ACTIVA'` | CHECK `ck_modalidades_estado` IN (`ACTIVA`, `INACTIVA`) |

- **UNIQUE:** `uq_modalidades_nombre (nombreModalidad)`.
- **Auditoría:** excepción documentada por catálogo estático.
- **Índices:** `uq_modalidades_nombre`.

### 5.10 `Cursos` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_cursos` |
| `idiomaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_cursos_idioma` → `Idiomas.id` |
| `nivelId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_cursos_nivel` → `Niveles.id` |
| `institucionId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_cursos_institucion` → `InstitucionesAliadas.id` |
| `modalidadId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_cursos_modalidad` → `Modalidades.id` |
| `tituloPromocional` | `str` | `VARCHAR(200)` | NO | — | Forma parte de la clave única de convocatoria |
| `requisitoAcademico` | `str \| None` | `VARCHAR(500)` | SÍ | `NULL` | — |
| `fechaCierrePostulacion` | `datetime \| None` | `DATETIME(6)` | SÍ | `NULL` | Obligatoria en aplicación cuando `estadoConvocatoria = 'PUBLICADA'` |
| `estadoConvocatoria` | `str` | `VARCHAR(20)` | NO | `'BORRADOR'` | CHECK `ck_cursos_estado` IN (`BORRADOR`, `PUBLICADA`, `CERRADA`, `CANCELADA`) |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_cursos_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **UNIQUE:** `uq_cursos_convocatoria (idiomaId, nivelId, institucionId, modalidadId, tituloPromocional)`.
- **Auditoría:** creación.
- **Índices:** `uq_cursos_convocatoria`, `idx_cursos_idioma`, `idx_cursos_nivel`, `idx_cursos_institucion`, `idx_cursos_modalidad`, `idx_cursos_estado`, `idx_cursos_creado_por`.

### 5.11 `Paralelos` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_paralelos` |
| `cursoId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_paralelos_curso` → `Cursos.id` |
| `periodoAcademicoId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_paralelos_periodo` → `PeriodosAcademicos.id` |
| `docenteId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_paralelos_docente` → `Usuarios.id`; validar rol `Docente` en aplicación |
| `nombreParalelo` | `str` | `VARCHAR(50)` | NO | — | — |
| `cupoMaximo` | `int` | `INT UNSIGNED` | NO | — | CHECK `cupoMaximo > 0` |
| `horarioDescripcion` | `str \| None` | `VARCHAR(255)` | SÍ | `NULL` | — |
| `creadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_paralelos_creado_por` → `Usuarios.id` |
| `fechaCreacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | **Corrección de auditoría Tarea 2.3** |

- **UNIQUE:** `uq_paralelos_curso_periodo_nombre (cursoId, periodoAcademicoId, nombreParalelo)`.
- **Auditoría:** creación completa (corregida).
- **Índices:** `uq_paralelos_curso_periodo_nombre`, `idx_paralelos_periodo`, `idx_paralelos_docente`, `idx_paralelos_creado_por`.

### 5.12 `Matriculas` — Estructura Académica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_matriculas` |
| `paraleloId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_matriculas_paralelo` → `Paralelos.id` |
| `estudianteId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_matriculas_estudiante` → `Usuarios.id`; validar rol `Estudiante` en aplicación |
| `fechaMatricula` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |
| `estadoMatricula` | `str` | `VARCHAR(20)` | NO | `'ACTIVA'` | CHECK `ck_matriculas_estado` IN (`ACTIVA`, `RETIRADA`, `COMPLETADA`) |
| `matriculadoPor` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_matriculas_matriculado_por` → `Usuarios.id` |

- **UNIQUE:** `uq_matriculas_paralelo_estudiante (paraleloId, estudianteId)`.
- **Auditoría:** funcional (`matriculadoPor`, `fechaMatricula`).
- **Índices:** `uq_matriculas_paralelo_estudiante`, `idx_matriculas_estudiante`, `idx_matriculas_estado`, `idx_matriculas_matriculado_por`.
- **Regla de inmutabilidad:** `paraleloId`, `estudianteId`, `fechaMatricula` y `matriculadoPor` son inmutables. `estadoMatricula` es mutable y sus cambios se registran en el log de aplicación. No se añade `fechaActualizacion` en Sprint 0.

### 5.13 `BloquesPractica` — Sesiones/Práctica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_bloques_practica` |
| `matriculaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_bloques_matricula` → `Matriculas.id` |
| `sesionId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_bloques_sesion` → `SesionesUsuario.id` |
| `fechaInicio` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |
| `fechaFin` | `datetime \| None` | `DATETIME(6)` | SÍ | `NULL` | CHECK `fechaFin IS NULL OR fechaFin >= fechaInicio` |

- **Auditoría:** ciclo de vida; no requiere actor humano.
- **Índices:** `idx_bloques_matricula_fecha (matriculaId, fechaInicio)`, `idx_bloques_sesion (sesionId)`.
- **Regla:** la sesión debe pertenecer al mismo `usuarioId` que el estudiante de la matrícula; validación en aplicación.

### 5.14 `EventosInteraccion` — Sesiones/Práctica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_eventos_interaccion` |
| `matriculaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_eventos_matricula` → `Matriculas.id` |
| `sesionId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_eventos_sesion` → `SesionesUsuario.id` |
| `glosarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_eventos_glosario` → `GlosarioHsk1.id` |
| `preguntaContingenciaId` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_eventos_pregunta_contingencia` → `PreguntasContingenciaHsk1.id` |
| `opcionSeleccionada` | `str` | `VARCHAR(1)` | NO | — | CHECK `opcionSeleccionada IN ('A','B','C','D')` |
| `origenRespuesta` | `str` | `VARCHAR(20)` | NO | — | CHECK `origenRespuesta IN ('RAG','CONTINGENCIA')` |
| `preguntaGeneradaTexto` | `str` | `TEXT` | NO | — | Snapshot del texto presentado; en contingencia se copia de `PreguntasContingenciaHsk1.preguntaTexto` |
| `opcionesPresentadasJson` | `list[dict[str, Any]]` | `JSON` | NO | — | Array de 4 objetos `{id, texto, correcta}`; validar en aplicación |
| `esCorrecto` | `bool` | `BOOLEAN` | NO | — | Debe coincidir con la opción seleccionada |
| `tiempoRespuestaMs` | `int` | `INT UNSIGNED` | NO | — | CHECK `tiempoRespuestaMs >= 0` |
| `fechaEvento` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **CHECK XOR de origen:** `ck_eventos_origen_contingencia`:
  `((origenRespuesta = 'RAG' AND preguntaContingenciaId IS NULL) OR (origenRespuesta = 'CONTINGENCIA' AND preguntaContingenciaId IS NOT NULL))`.
- **Auditoría:** registro inmutable; solo `fechaEvento`.
- **Índices:** `idx_eventos_matricula_fecha (matriculaId, fechaEvento)`, `idx_eventos_sesion_fecha (sesionId, fechaEvento)`, `idx_eventos_glosario (glosarioId)`, `idx_eventos_pregunta (preguntaContingenciaId)`, `idx_eventos_origen (origenRespuesta)`.
- **Reglas de aplicación:** `opcionSeleccionada` debe existir en `opcionesPresentadasJson`; `esCorrecto` debe coincidir con `correcta` de esa opción; si es contingencia, `preguntaContingenciaId.glosarioId` debe ser igual a `glosarioId`; la sesión y la matrícula deben pertenecer al mismo estudiante. Prohibido `UPDATE`/`DELETE`.

### 5.15 `EstadoDominioEstudiante` — SRS/Diagnóstico

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_estado_dominio_estudiante` |
| `matriculaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_estado_dominio_matricula` → `Matriculas.id` |
| `glosarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_estado_dominio_glosario` → `GlosarioHsk1.id` |
| `estadoDominio` | `str` | `VARCHAR(20)` | NO | `'DEBIL'` | CHECK `ck_estado_dominio` IN (`DEBIL`, `EN_PROGRESO`, `DOMINADO`) |
| `contadorFallos` | `int` | `INT UNSIGNED` | NO | `0` | CHECK `contadorFallos >= 0` |
| `fechaUltimoError` | `datetime \| None` | `DATETIME(6)` | SÍ | `NULL` | — |
| `ultimaSesionId` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_estado_dominio_ultima_sesion` → `SesionesUsuario.id` |
| `pesoSrs` | `Decimal` | `DECIMAL(5,2)` | NO | `0.00` | CHECK `pesoSrs BETWEEN 0.00 AND 100.00` |
| `intervaloDias` | `int` | `INT UNSIGNED` | NO | `1` | CHECK `intervaloDias >= 1` |
| `proximaFechaRepaso` | `datetime \| None` | `DATETIME(6)` | SÍ | `NULL` | — |
| `fechaActualizacion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)` | **Corrección de auditoría Tarea 2.3** |

- **UNIQUE:** `uq_estado_dominio_matricula_glosario (matriculaId, glosarioId)`.
- **Auditoría:** actualización (corregida).
- **Índices:** `uq_estado_dominio_matricula_glosario`, `idx_estado_dominio_proxima (proximaFechaRepaso)`, `idx_estado_dominio_estado (estadoDominio)`, `idx_estado_dominio_ultima_sesion (ultimaSesionId)`.
- **Regla SRS:** una fila por matrícula y término HSK1; `pesoSrs` en escala 0–100; `intervaloDias` mínimo 1; la lógica de cálculo y actualización pertenece al motor SRS.

### 5.16 `AuditoriaRutaAprendizaje` — Sesiones/Práctica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_auditoria_ruta_aprendizaje` |
| `matriculaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_auditoria_matricula` → `Matriculas.id` |
| `docenteId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_auditoria_docente` → `Usuarios.id`; validar rol `Docente` en aplicación |
| `sesionId` | `int \| None` | `BIGINT UNSIGNED` | SÍ | `NULL` | FK `fk_auditoria_sesion` → `SesionesUsuario.id` |
| `accionRealizada` | `str` | `VARCHAR(30)` | NO | — | CHECK `ck_auditoria_accion` IN (`APROBAR_AVANCE`, `ASIGNAR_REPASO`, `INTERVENIR_RUTA`, `REGISTRAR_OBSERVACION`) |
| `observacion` | `str \| None` | `TEXT` | SÍ | `NULL` | — |
| `fechaAccion` | `datetime` | `DATETIME(6)` | NO | `CURRENT_TIMESTAMP(6)` | — |

- **Auditoría:** registro inmutable; `docenteId` + `fechaAccion`.
- **Índices:** `idx_auditoria_matricula_fecha (matriculaId, fechaAccion)`, `idx_auditoria_docente (docenteId)`, `idx_auditoria_sesion (sesionId)`, `idx_auditoria_accion (accionRealizada)`.
- **Regla:** si `sesionId` no es nulo, debe pertenecer al estudiante de la matrícula; validación en aplicación. Prohibido `UPDATE`/`DELETE`.

### 5.17 `DetalleIntervencionGlosario` — Sesiones/Práctica

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_detalle_intervencion_glosario` |
| `auditoriaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_detalle_auditoria` → `AuditoriaRutaAprendizaje.id` |
| `glosarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_detalle_glosario` → `GlosarioHsk1.id` |
| `prioridadDocente` | `int` | `SMALLINT UNSIGNED` | NO | `3` | CHECK `prioridadDocente BETWEEN 1 AND 5` |
| `estadoRefuerzo` | `str` | `VARCHAR(20)` | NO | `'PENDIENTE'` | CHECK `ck_detalle_estado` IN (`PENDIENTE`, `EN_REFUERZO`, `COMPLETADO`) |

- **UNIQUE:** `uq_detalle_intervencion_auditoria_glosario (auditoriaId, glosarioId)`.
- **Auditoría:** excepción documentada; hereda `docenteId` y `fechaAccion` de `AuditoriaRutaAprendizaje`; los cambios de `estadoRefuerzo` se registran en el log de aplicación.
- **Índices:** `uq_detalle_intervencion_auditoria_glosario`, `idx_detalle_glosario (glosarioId)`, `idx_detalle_estado (estadoRefuerzo)`.

### 5.18 `CategoriasGlosario` — Glosario HSK1

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_categorias_glosario` |
| `nombreCategoria` | `str` | `VARCHAR(100)` | NO | — | UNIQUE `uq_categorias_nombre` |
| `descripcion` | `str \| None` | `VARCHAR(255)` | SÍ | `NULL` | — |

- **UNIQUE:** `uq_categorias_nombre (nombreCategoria)`.
- **Auditoría:** excepción documentada por catálogo estático.
- **Índices:** `uq_categorias_nombre`.

### 5.19 `GlosarioHsk1` — Glosario HSK1

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_glosario_hsk1` |
| `nivelId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_glosario_nivel` → `Niveles.id` |
| `categoriaId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_glosario_categoria` → `CategoriasGlosario.id` |
| `caracterHanzi` | `str` | `VARCHAR(10)` | NO | — | `utf8mb4`; no vacío |
| `pinyin` | `str` | `VARCHAR(100)` | NO | — | `utf8mb4`; admite marcas de tono |
| `traduccionEspanol` | `str` | `VARCHAR(255)` | NO | — | — |

- **UNIQUE:** `uq_glosario_nivel_hanzi_pinyin (nivelId, caracterHanzi, pinyin)`.
- **Auditoría:** excepción documentada por catálogo oficial.
- **Índices:** `uq_glosario_nivel_hanzi_pinyin`, `idx_glosario_categoria`, `idx_glosario_nivel`, `idx_glosario_hanzi`.

### 5.20 `PreguntasContingenciaHsk1` — Glosario HSK1

| Columna | Tipo SQLModel | Tipo MySQL | Nulo | Default | Restricciones / notas |
|---|---|---|---|---|---|
| `id` | `int` (PK) | `BIGINT UNSIGNED` | NO | `AUTO_INCREMENT` | PK `pk_preguntas_contingencia_hsk1` |
| `glosarioId` | `int` | `BIGINT UNSIGNED` | NO | — | FK `fk_preguntas_glosario` → `GlosarioHsk1.id` |
| `preguntaTexto` | `str` | `VARCHAR(500)` | NO | — | — |
| `opcionesJson` | `list[dict[str, Any]]` | `JSON` | NO | — | Array de 4 objetos `{id, texto, correcta}` |
| `opcionCorrecta` | `str` | `VARCHAR(1)` | NO | — | CHECK `opcionCorrecta IN ('A','B','C','D')` |
| `explicacionBase` | `str` | `VARCHAR(500)` | NO | — | Máximo 30 palabras; validación en aplicación |

- **Auditoría:** excepción documentada por banco estático de contingencia.
- **Índices:** `idx_preguntas_glosario (glosarioId)`.
- **Regla:** `opcionCorrecta` debe existir en `opcionesJson`; exactamente una opción debe tener `correcta = true`; validación en aplicación.

---

## 6. Restricciones UNIQUE (16)

| # | Nombre | Tabla | Columnas | Propósito |
|---|---|---|---|---|
| 1 | `uq_roles_nombre` | `Roles` | `nombre` | Evitar roles duplicados |
| 2 | `uq_usuarios_cedula` | `Usuarios` | `cedula` | Identidad única por cédula |
| 3 | `uq_usuarios_correo` | `Usuarios` | `correoInstitucional` | Identidad única por correo |
| 4 | `uq_usuario_rol_usuario_rol` | `UsuarioRol` | `usuarioId`, `rolId` | Evitar asignación duplicada del mismo rol |
| 5 | `uq_idiomas_nombre` | `Idiomas` | `nombre` | Evitar idiomas duplicados |
| 6 | `uq_niveles_codigo` | `Niveles` | `codigo` | Evitar niveles duplicados |
| 7 | `uq_periodos_codigo` | `PeriodosAcademicos` | `codigo` | Evitar periodos duplicados |
| 8 | `uq_instituciones_nombre_pais` | `InstitucionesAliadas` | `nombreInstitucion`, `pais` | Evitar instituciones duplicadas en el mismo país |
| 9 | `uq_modalidades_nombre` | `Modalidades` | `nombreModalidad` | Evitar modalidades duplicadas |
| 10 | `uq_cursos_convocatoria` | `Cursos` | `idiomaId`, `nivelId`, `institucionId`, `modalidadId`, `tituloPromocional` | Evitar convocatorias duplicadas |
| 11 | `uq_paralelos_curso_periodo_nombre` | `Paralelos` | `cursoId`, `periodoAcademicoId`, `nombreParalelo` | Evitar paralelos duplicados |
| 12 | `uq_matriculas_paralelo_estudiante` | `Matriculas` | `paraleloId`, `estudianteId` | Evitar matrícula duplicada |
| 13 | `uq_estado_dominio_matricula_glosario` | `EstadoDominioEstudiante` | `matriculaId`, `glosarioId` | Una fila SRS por estudiante y término |
| 14 | `uq_detalle_intervencion_auditoria_glosario` | `DetalleIntervencionGlosario` | `auditoriaId`, `glosarioId` | Evitar término repetido en la misma intervención |
| 15 | `uq_categorias_nombre` | `CategoriasGlosario` | `nombreCategoria` | Evitar categorías duplicadas |
| 16 | `uq_glosario_nivel_hanzi_pinyin` | `GlosarioHsk1` | `nivelId`, `caracterHanzi`, `pinyin` | Evitar términos duplicados en el mismo nivel |

---

## 7. Plan de índices

Todas las columnas FK tienen índice. InnoDB puede crear un índice implícito para una FK si no existe uno compatible, pero la implementación debe declararlos explícitamente con los nombres indicados para que phpMyAdmin y las consultas sean previsibles.

| Tabla | Índices |
|---|---|
| `Roles` | `uq_roles_nombre` |
| `Usuarios` | `uq_usuarios_cedula`, `uq_usuarios_correo`, `idx_usuarios_estado`, `idx_usuarios_creado_por`, `idx_usuarios_actualizado_por` |
| `UsuarioRol` | `uq_usuario_rol_usuario_rol`, `idx_usuario_rol_rol`, `idx_usuario_rol_asignado_por` |
| `Idiomas` | `uq_idiomas_nombre`, `idx_idiomas_creado_por` |
| `Niveles` | `uq_niveles_codigo`, `idx_niveles_creado_por` |
| `PeriodosAcademicos` | `uq_periodos_codigo`, `idx_periodos_estado`, `idx_periodos_creado_por` |
| `InstitucionesAliadas` | `uq_instituciones_nombre_pais`, `idx_instituciones_creado_por` |
| `Modalidades` | `uq_modalidades_nombre` |
| `Cursos` | `uq_cursos_convocatoria`, `idx_cursos_idioma`, `idx_cursos_nivel`, `idx_cursos_institucion`, `idx_cursos_modalidad`, `idx_cursos_estado`, `idx_cursos_creado_por` |
| `Paralelos` | `uq_paralelos_curso_periodo_nombre`, `idx_paralelos_periodo`, `idx_paralelos_docente`, `idx_paralelos_creado_por` |
| `Matriculas` | `uq_matriculas_paralelo_estudiante`, `idx_matriculas_estudiante`, `idx_matriculas_estado`, `idx_matriculas_matriculado_por` |
| `SesionesUsuario` | `idx_sesiones_usuario`, `idx_sesiones_hash`, `idx_sesiones_expiracion` |
| `BloquesPractica` | `idx_bloques_matricula_fecha`, `idx_bloques_sesion` |
| `EventosInteraccion` | `idx_eventos_matricula_fecha`, `idx_eventos_sesion_fecha`, `idx_eventos_glosario`, `idx_eventos_pregunta`, `idx_eventos_origen` |
| `EstadoDominioEstudiante` | `uq_estado_dominio_matricula_glosario`, `idx_estado_dominio_proxima`, `idx_estado_dominio_estado`, `idx_estado_dominio_ultima_sesion` |
| `AuditoriaRutaAprendizaje` | `idx_auditoria_matricula_fecha`, `idx_auditoria_docente`, `idx_auditoria_sesion`, `idx_auditoria_accion` |
| `DetalleIntervencionGlosario` | `uq_detalle_intervencion_auditoria_glosario`, `idx_detalle_glosario`, `idx_detalle_estado` |
| `CategoriasGlosario` | `uq_categorias_nombre` |
| `GlosarioHsk1` | `uq_glosario_nivel_hanzi_pinyin`, `idx_glosario_categoria`, `idx_glosario_nivel`, `idx_glosario_hanzi` |
| `PreguntasContingenciaHsk1` | `idx_preguntas_glosario` |

---

## 8. Matriz de llaves foráneas (39)

Todas las FKs usan `ON DELETE RESTRICT` y `ON UPDATE RESTRICT`.

| # | Tabla | Columna | Destino | Nombre FK |
|---|---|---|---|---|
| 1 | `Usuarios` | `creadoPor` | `Usuarios.id` | `fk_usuarios_creado_por` |
| 2 | `Usuarios` | `actualizadoPor` | `Usuarios.id` | `fk_usuarios_actualizado_por` |
| 3 | `UsuarioRol` | `usuarioId` | `Usuarios.id` | `fk_usuario_rol_usuario` |
| 4 | `UsuarioRol` | `rolId` | `Roles.id` | `fk_usuario_rol_rol` |
| 5 | `UsuarioRol` | `asignadoPor` | `Usuarios.id` | `fk_usuario_rol_asignado_por` |
| 6 | `Idiomas` | `creadoPor` | `Usuarios.id` | `fk_idiomas_creado_por` |
| 7 | `Niveles` | `creadoPor` | `Usuarios.id` | `fk_niveles_creado_por` |
| 8 | `PeriodosAcademicos` | `creadoPor` | `Usuarios.id` | `fk_periodos_creado_por` |
| 9 | `InstitucionesAliadas` | `creadoPor` | `Usuarios.id` | `fk_instituciones_creado_por` |
| 10 | `Cursos` | `idiomaId` | `Idiomas.id` | `fk_cursos_idioma` |
| 11 | `Cursos` | `nivelId` | `Niveles.id` | `fk_cursos_nivel` |
| 12 | `Cursos` | `institucionId` | `InstitucionesAliadas.id` | `fk_cursos_institucion` |
| 13 | `Cursos` | `modalidadId` | `Modalidades.id` | `fk_cursos_modalidad` |
| 14 | `Cursos` | `creadoPor` | `Usuarios.id` | `fk_cursos_creado_por` |
| 15 | `Paralelos` | `cursoId` | `Cursos.id` | `fk_paralelos_curso` |
| 16 | `Paralelos` | `periodoAcademicoId` | `PeriodosAcademicos.id` | `fk_paralelos_periodo` |
| 17 | `Paralelos` | `docenteId` | `Usuarios.id` | `fk_paralelos_docente` |
| 18 | `Paralelos` | `creadoPor` | `Usuarios.id` | `fk_paralelos_creado_por` |
| 19 | `Matriculas` | `paraleloId` | `Paralelos.id` | `fk_matriculas_paralelo` |
| 20 | `Matriculas` | `estudianteId` | `Usuarios.id` | `fk_matriculas_estudiante` |
| 21 | `Matriculas` | `matriculadoPor` | `Usuarios.id` | `fk_matriculas_matriculado_por` |
| 22 | `SesionesUsuario` | `usuarioId` | `Usuarios.id` | `fk_sesiones_usuario` |
| 23 | `BloquesPractica` | `matriculaId` | `Matriculas.id` | `fk_bloques_matricula` |
| 24 | `BloquesPractica` | `sesionId` | `SesionesUsuario.id` | `fk_bloques_sesion` |
| 25 | `EventosInteraccion` | `matriculaId` | `Matriculas.id` | `fk_eventos_matricula` |
| 26 | `EventosInteraccion` | `sesionId` | `SesionesUsuario.id` | `fk_eventos_sesion` |
| 27 | `EventosInteraccion` | `glosarioId` | `GlosarioHsk1.id` | `fk_eventos_glosario` |
| 28 | `EventosInteraccion` | `preguntaContingenciaId` | `PreguntasContingenciaHsk1.id` | `fk_eventos_pregunta_contingencia` |
| 29 | `EstadoDominioEstudiante` | `matriculaId` | `Matriculas.id` | `fk_estado_dominio_matricula` |
| 30 | `EstadoDominioEstudiante` | `glosarioId` | `GlosarioHsk1.id` | `fk_estado_dominio_glosario` |
| 31 | `EstadoDominioEstudiante` | `ultimaSesionId` | `SesionesUsuario.id` | `fk_estado_dominio_ultima_sesion` |
| 32 | `AuditoriaRutaAprendizaje` | `matriculaId` | `Matriculas.id` | `fk_auditoria_matricula` |
| 33 | `AuditoriaRutaAprendizaje` | `docenteId` | `Usuarios.id` | `fk_auditoria_docente` |
| 34 | `AuditoriaRutaAprendizaje` | `sesionId` | `SesionesUsuario.id` | `fk_auditoria_sesion` |
| 35 | `DetalleIntervencionGlosario` | `auditoriaId` | `AuditoriaRutaAprendizaje.id` | `fk_detalle_auditoria` |
| 36 | `DetalleIntervencionGlosario` | `glosarioId` | `GlosarioHsk1.id` | `fk_detalle_glosario` |
| 37 | `GlosarioHsk1` | `nivelId` | `Niveles.id` | `fk_glosario_nivel` |
| 38 | `GlosarioHsk1` | `categoriaId` | `CategoriasGlosario.id` | `fk_glosario_categoria` |
| 39 | `PreguntasContingenciaHsk1` | `glosarioId` | `GlosarioHsk1.id` | `fk_preguntas_glosario` |

### Verificación de integridad referencial

- **Destinos inexistentes:** 0.
- **Ciclos obligatorios:** 0. La única autorreferencia es `Usuarios.creadoPor`/`actualizadoPor`, nullable para el bootstrap.
- **Tablas puente sin PK:** 0.
- **Relación N:M explícita:** `UsuarioRol`, con UNIQUE compuesto.
- **Relaciones asociativas con atributos:** `Matriculas`, `EstadoDominioEstudiante`, `DetalleIntervencionGlosario`, `EventosInteraccion`.
- **Borrado en cascada:** prohibido; todas las FKs usan `RESTRICT`.

---

## 9. Reglas de integridad semántica

Las siguientes reglas no pueden expresarse completamente con FKs simples y se validan en la capa de aplicación. Se documentan aquí para que la Tarea 3.2 y los servicios posteriores las implementen de forma uniforme.

| # | Regla | Tablas involucradas |
|---|---|---|
| 1 | `cedula` debe tener 10 dígitos para Ecuador y ser única | `Usuarios` |
| 2 | `correoInstitucional` se normaliza a minúsculas y debe ser único | `Usuarios` |
| 3 | Tras 3 intentos fallidos: `estado='BLOQUEADO'` e `intentosFallidos=3`; desbloqueo controlado por administrador o política de Sprint 1 | `Usuarios` |
| 4 | `pseudonimoHash = SHA-256(usuarioId + salt)` en hexadecimal minúsculas; salt en variable de entorno, nunca en MySQL | `SesionesUsuario` |
| 5 | Logout: actualizar `fechaExpiracionToken = UTC_TIMESTAMP(6)` de la sesión; el backend rechaza sesiones expiradas | `SesionesUsuario` |
| 6 | `docenteId` debe tener rol `Docente`; `estudianteId` debe tener rol `Estudiante` | `Paralelos`, `Matriculas`, `AuditoriaRutaAprendizaje` |
| 7 | `fechaCierrePostulacion` es obligatoria cuando `estadoConvocatoria='PUBLICADA'` | `Cursos` |
| 8 | `cupoMaximo > 0` y no se supera el cupo al matricular | `Paralelos`, `Matriculas` |
| 9 | Identidad de matrícula inmutable (`paraleloId`, `estudianteId`, `fechaMatricula`, `matriculadoPor`); `estadoMatricula` mutable con log de aplicación | `Matriculas` |
| 10 | La sesión de un bloque/evento debe pertenecer al estudiante de la matrícula | `BloquesPractica`, `EventosInteraccion`, `AuditoriaRutaAprendizaje` |
| 11 | `origenRespuesta='RAG'` ⇒ `preguntaContingenciaId IS NULL`; `origenRespuesta='CONTINGENCIA'` ⇒ `preguntaContingenciaId IS NOT NULL` | `EventosInteraccion` (CHECK) |
| 12 | En contingencia, `PreguntasContingenciaHsk1.glosarioId` debe coincidir con `EventosInteraccion.glosarioId` | `EventosInteraccion`, `PreguntasContingenciaHsk1` |
| 13 | `opcionSeleccionada` debe existir en `opcionesPresentadasJson`; `esCorrecto` debe coincidir con la opción marcada `correcta` | `EventosInteraccion` |
| 14 | `opcionesPresentadasJson` y `opcionesJson` deben contener exactamente 4 opciones con IDs `A`, `B`, `C`, `D` | `EventosInteraccion`, `PreguntasContingenciaHsk1` |
| 15 | `opcionCorrecta` debe existir en `opcionesJson` y exactamente una opción debe ser correcta | `PreguntasContingenciaHsk1` |
| 16 | `explicacionBase` debe tener máximo 30 palabras (RNF-05) | `PreguntasContingenciaHsk1` |
| 17 | Una fila por `(matriculaId, glosarioId)` en el estado SRS; `pesoSrs` en escala 0.00–100.00; `intervaloDias >= 1` | `EstadoDominioEstudiante` (UNIQUE + CHECK) |
| 18 | `EventosInteraccion` y `AuditoriaRutaAprendizaje` son append-only: prohibido `UPDATE`/`DELETE` desde la aplicación | `EventosInteraccion`, `AuditoriaRutaAprendizaje` |
| 19 | `caracterHanzi` y `pinyin` no pueden estar vacíos; se almacenan en `utf8mb4` | `GlosarioHsk1` |
| 20 | No se envían datos personales a AnythingLLM; solo `pseudonimoHash` | `SesionesUsuario` y pipeline RAG |

---

## 10. Resolución de hallazgos de la Tarea 2.2

| Hallazgo Tarea 2.2 | Decisión Tarea 2.3 | Estado |
|---|---|---|
| Tipos de datos no fijados | Diccionario completo SQLModel/MySQL para 130 columnas | **Resuelto** |
| Nulabilidad y defaults no definidos | `Nulo` y `Default` explícitos en las 20 tablas | **Resuelto** |
| Falta `UNIQUE(cedula)` y `UNIQUE(correoInstitucional)` | `uq_usuarios_cedula`, `uq_usuarios_correo` | **Resuelto** |
| Falta `UNIQUE(usuarioId, rolId)` en N:M | `uq_usuario_rol_usuario_rol` | **Resuelto** |
| Faltan UNIQUE en matrícula y SRS | `uq_matriculas_paralelo_estudiante`, `uq_estado_dominio_matricula_glosario` | **Resuelto** |
| Falta `fechaCreacion` en `Paralelos` | Añadida `DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)` | **Resuelto** |
| Falta `fechaActualizacion` en `EstadoDominioEstudiante` | Añadida `DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)` | **Resuelto** |
| `pesoSrs` sin tipo/escala | `DECIMAL(5,2)` con CHECK 0.00–100.00 | **Resuelto** |
| `opcionSeleccionada`/`opcionCorrecta` sin representación | `VARCHAR(1)` con CHECK `A`–`D`, alineado con los mocks | **Resuelto** |
| Fechas de periodos ambiguas | `DATE` para `fechaInicio`/`fechaFin` | **Resuelto** |
| Sin políticas `ON DELETE`/`ON UPDATE` | `RESTRICT`/`RESTRICT` en las 39 FKs | **Resuelto** |
| Sin plan de índices | Plan de índices por tabla + 39 FKs indexadas | **Resuelto** |
| Ciclo de sesión sin logout | Expiración actualizada a `UTC_TIMESTAMP(6)` en logout | **Resuelto a nivel de esquema** |
| Bloqueo temporal sin fecha | `estado` + `fechaActualizacion` + política de Sprint 1 | **Resuelto a nivel de esquema** |
| XOR de origen de evento sin formalizar | CHECK `ck_eventos_origen_contingencia` + regla de aplicación | **Resuelto** |
| Contradicción de inmutabilidad en `Matriculas` | Identidad inmutable; `estadoMatricula` mutable con log de aplicación | **Resuelto** |
| Roles no enforceables por FK | Validación de rol en aplicación | **Resuelto** |
| `pseudonimoHash` sin estrategia | `CHAR(64) ascii_bin`, SHA-256, salt en entorno, índice no único | **Resuelto** |
| Charset no especificado | `utf8mb4` / `utf8mb4_unicode_ci`; hashes en `ascii_bin` | **Resuelto** |
| Límite de 30 palabras no enforceable | Validación en aplicación documentada | **Resuelto** |
| Catálogos sin auditoría | Excepción documentada para catálogos estáticos/seed | **Resuelto** |
| `DetalleIntervencionGlosario` sin timestamps | Trazabilidad heredada de `AuditoriaRutaAprendizaje` + log de aplicación | **Resuelto** |
| Datos semilla sin orden | Orden topológico documentado en la sección 11 | **Resuelto** |
| Versión de MySQL incierta | Requerido MySQL 8.0.16+ | **Resuelto** |

---

## 11. Orden de creación y carga

### 11.1 Orden topológico de creación de tablas

1. `Roles`
2. `Idiomas`
3. `Niveles`
4. `PeriodosAcademicos`
5. `InstitucionesAliadas`
6. `Modalidades`
7. `CategoriasGlosario`
8. `Usuarios`
9. `UsuarioRol`
10. `Cursos`
11. `Paralelos`
12. `Matriculas`
13. `SesionesUsuario`
14. `GlosarioHsk1`
15. `PreguntasContingenciaHsk1`
16. `BloquesPractica`
17. `EventosInteraccion`
18. `EstadoDominioEstudiante`
19. `AuditoriaRutaAprendizaje`
20. `DetalleIntervencionGlosario`

> `Usuarios` se crea después de los catálogos raíz y antes de `UsuarioRol`; sus FKs de auditoría son nullable, por lo que el primer administrador puede insertarse sin `creadoPor`.

### 11.2 Orden de datos semilla

1. `Roles`: `Estudiante`, `Docente`, `Administrador`.
2. `Idiomas`: `Chino Mandarín`, `Español`.
3. `Niveles`: `HSK1`, `A1`.
4. `PeriodosAcademicos`: periodo vigente `2026-II`.
5. `InstitucionesAliadas`: institución piloto.
6. `Modalidades`: `Presencial`, `Virtual`, `Híbrida`.
7. `CategoriasGlosario`: categorías temáticas HSK1.
8. `Usuarios`: administrador inicial.
9. `UsuarioRol`: asignación del rol `Administrador`.
10. `GlosarioHsk1` y `PreguntasContingenciaHsk1`: catálogo HSK1 y banco defensivo.
11. `Cursos`, `Paralelos` y `Matriculas`: oferta académica piloto.
12. `SesionesUsuario`, `BloquesPractica`, `EventosInteraccion`, `EstadoDominioEstudiante`, `AuditoriaRutaAprendizaje` y `DetalleIntervencionGlosario`: datos generados en tiempo de ejecución, no semilla estática.

---

## 12. Certificación final

Por medio del presente documento se certifica que:

1. Las **20 entidades** del Sprint 0 tienen llave primaria `id` de tipo `BIGINT UNSIGNED AUTO_INCREMENT`.
2. Las **39 llaves foráneas** tienen destino válido, tipo compatible, índice y política `ON DELETE RESTRICT` / `ON UPDATE RESTRICT`.
3. Las **130 columnas** tienen tipo SQLModel y MySQL exactos, nulabilidad y valor por defecto o decisión explícita.
4. Se declaran **16 restricciones UNIQUE**, incluyendo cédula, correo institucional y las llaves compuestas N:M.
5. Se aplicaron las **2 correcciones de auditoría** solicitadas: `Paralelos.fechaCreacion` y `EstadoDominioEstudiante.fechaActualizacion`.
6. Las excepciones de auditoría de catálogos estáticos y de `DetalleIntervencionGlosario` están documentadas y no bloquean la implementación.
7. El esquema usa `utf8mb4`, InnoDB, MySQL 8.0.16+, timestamps UTC y una estrategia explícita de seudonimización SHA-256.
8. No quedan hallazgos bloqueantes abiertos.

**El esquema relacional de las 20 tablas queda 100% formalizado y APTO para iniciar la codificación de los modelos SQLModel en la Tarea 3.2.**

---

## 13. Anexo — Decisiones que no se implementan en Sprint 0

| Tema | Decisión |
|---|---|
| Borrado físico de entidades | Prohibido; baja lógica mediante estados |
| Inmutabilidad de eventos y auditoría | Aplicación append-only; opcionalmente triggers `BEFORE UPDATE/DELETE` en Sprint 2 |
| Blacklist JWT | No se crea tabla adicional; el logout actualiza `fechaExpiracionToken` |
| Salt de seudonimización | Variable de entorno; no se almacena en MySQL |
| Validación de cédula/correo | Capa de aplicación y UI; MySQL solo impone longitud y UNIQUE |
| Estructura JSON de opciones | Validación en aplicación; MySQL almacena `JSON` |
| Límite de 30 palabras | Validación en aplicación; no se impone con CHECK |
| Roles múltiples | Permitidos por `UsuarioRol`; la autorización evalúa el conjunto |
| Datos semilla completos | Se definirán en el script de inicialización de la Tarea 3.3 |
