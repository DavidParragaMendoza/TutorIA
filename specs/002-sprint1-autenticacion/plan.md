# Plan técnico — Spec 002 (Autenticación, RBAC y LOPDP)

## Estructura de módulos
- `backend/app/seguridad/cifrado.py` → hashing y verificación `bcrypt`
- `backend/app/seguridad/jwt.py` → creación y validación de JWT HS256 (`RF-S1-01`)
- `backend/app/seguridad/lopdp.py` → hash SHA-256 + sal para seudonimización LOPDP (`RF-S1-06`)
- `backend/app/baseDatos/semillas.py` → seeding idempotente de 3 roles y 3 usuarios base (`RF-S1-01`)
- `backend/app/servicios/autenticacionServicio.py` → login, contador de intentos fallidos (bloqueo a los 3), logout (`RF-S1-01`, `RF-S1-02`, `RF-S1-03`)
- `backend/app/servicios/usuarioServicio.py` → alta de usuarios, directorio paginado MySQL, cambio de estado y reseteo (`RF-S1-07` a `RF-S1-10`)
- `backend/app/api/v1/endpoints/autenticacion.py` → endpoints `/auth/login`, `/auth/logout`, `/auth/me`
- `backend/app/api/v1/endpoints/usuarios.py` → endpoints `/users` (POST, GET, PATCH)
- `frontend/src/vistas/VistaAutenticacion.jsx` → login real y redirección por rol (`RF-S1-01`, `RF-S1-04`)
- `frontend/src/vistas/VistaConsolaAdministrador.jsx` → tabla sincronizada con MySQL, alta y acciones de estado (`RF-S1-07` a `RF-S1-10`)
- `tests/` → `pytest` (backend) y `vitest` (frontend) por Requisito Funcional

## Modelo de datos y DTOs (MySQL `tutoria_db` / Pydantic)
- **Tablas relacionales impactadas:** `usuarios`, `roles`, `usuario_rol`, `sesiones_usuario`.
- **DTOs Pydantic (100% `camelCase`):**
  - `UsuarioLoginEsquema`: `{ identificador, contrasena }`
  - `UsuarioCreacionEsquema`: `{ cedula, nombresCompletos, correoInstitucional, contrasena?: null, rolId }`
  - `ActualizacionEstadoUsuarioEsquema`: `{ estado: "ACTIVO" | "BLOQUEADO" | "INACTIVO" }`
  - `RespuestaListaUsuariosEsquema`: `{ total, pagina, tamano, usuarios: [...] }`

## Algoritmos y lógicas clave
1. **Seudonimización LOPDP (`RF-S1-06`):**
   - `pseudonimoHash = SHA256(str(usuarioId) + ":" + SAL_LOPDP_SECRET)`.
   - Se genera en login y se incluye en la sesión y claims del JWT. Se prohíbe pasar PII a AnythingLLM.
2. **Control de Intentos Fallidos (`RF-S1-02`):**
   - Credencial incorrecta → `intentosFallidos += 1`.
   - Si `intentosFallidos >= 3` → `estado = "BLOQUEADO"`. Respuesta unificada: `HTTP 401`.
3. **Gestión de Estados y Reseteo (`RF-S1-10`):**
   - Transición a `ACTIVO` (desde `BLOQUEADO` o `INACTIVO`) → resetea automáticamente `intentosFallidos = 0`.
   - **Autobloqueo de Admin:** Si `usuarioAutenticado.id == usuarioIdTarget` y se intenta `BLOQUEADO`/`INACTIVO` → lanza `HTTP 409 Conflict`.

## Decisiones técnicas
- **Clave inicial por defecto:** Si el DTO `UsuarioCreacionEsquema.contrasena` es `None` o no se envía, el backend aplica `bcrypt("Tempo2026!")`.
- **Expiración de Logout (`HU-29`):** Se actualiza `fechaExpiracionToken = ahora(UTC)` en `sesiones_usuario`. No se añaden columnas nuevas a la base de datos.
- **Seeding en Startup:** Invocación de `semillas.py` en el hook `lifespan` de FastAPI tras `create_all()`.
- **Sincronización total:** Eliminación absoluta de `usuariosAuthMock.json` y `usuariosAdminMock.json` en React; la única fuente de verdad es MySQL vía FastAPI.

## Contrato de API REST
- `POST /api/v1/auth/login` → `200 OK` (`RespuestaLoginEsquema`) | `401 Unauthorized`
- `POST /api/v1/auth/logout` → `200 OK` (invalida sesión en servidor)
- `GET /api/v1/auth/me` → `200 OK` (`PerfilUsuarioEsquema`)
- `POST /api/v1/users` → `201 Created` | `409 Conflict` (duplicado)
- `GET /api/v1/users?pagina=1&tamano=100` → `200 OK` (`RespuestaListaUsuariosEsquema`)
- `PATCH /api/v1/users/{usuarioId}/estado` → `200 OK` | `409 Conflict` (autobloqueo) | `422` | `404`

## Estrategia de tests
- **Backend (`pytest`):**
  - `test_cifrado.py` → hashes y verificación bcrypt.
  - `test_lopdp.py` → consistencia de SHA-256 + sal.
  - `test_auth.py` → login exitoso, bloqueo al 3er fallo, logout y token expirado.
  - `test_usuarios.py` → alta rápida, duplicados 409, listado desde MySQL, desbloqueo con reseteo a 0 y autobloqueo 409.
- **Frontend (`vitest`):**
  - `autenticacion.test.jsx` → captura de login y redirección por rol.
  - `consolaAdministrador.test.jsx` → `GET` al montar, mapeo de DTOs, refresco tras alta y llamadas `PATCH` de cambio de estado.
