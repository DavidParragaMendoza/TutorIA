# Especificación de Requisitos Funcionales — Sprint 1 (specs/002-sprint1-autenticacion/spec.md)
**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)
**Sprint:** 002-sprint1-autenticacion
**Nombre del Sprint:** Autenticación, Seguridad, Control de Acceso por Roles (RBAC) y Seudonimización LOPDP (SHA-256)
**Estimación Total:** 18 Puntos de Historia (16 PH base + 2 PH Sincronización y Gestión de Estados)
**Estado:** **COMPLETADO**
**Metodología:** Spec-Driven Development (SDD)

---

#### 1. Visión General y Propósito del Sprint
El **Sprint 1** tiene como objetivo reemplazar el mecanismo de datos simulados (`usuariosAuthMock.json`) e implementar el subsistema real de **Autenticación, Seguridad, RBAC y Seudonimización LOPDP** en la arquitectura de tres capas (React + FastAPI + MySQL).

Este Sprint asegura que:
1. La identidad de cada usuario se valide contra las tablas relacionales (`usuarios`, `roles`, `usuario_rol`).
2. Se gestionen sesiones mediante tokens **JWT** cifrados (HS256).
3. Se proteja la privacidad del estudiante cumpliendo la **LOPDP** mediante un hash **SHA-256 con sal** (seudonimización irreversible previa a la capa RAG/IA).
4. El Administrador disponga de una consola centralizada sincronizada con MySQL para alta de usuarios y gestión de estados.

---

#### 2. Historias de Usuario Cubiertas (18 PH)
| ID | Historia de Usuario | PH | Prioridad | Módulo Impactado |
| --- | --- | --- | --- | --- |
| **HU-01** | **Autenticación de Credenciales:** Iniciar sesión validando credenciales y manejando bloqueo tras 3 intentos fallidos. | 4 PH | Alta | Backend (`/api/v1/auth/login`) / Frontend (`VistaAutenticacion.jsx`) |
| **HU-02** | **Enrutamiento Dinámico RBAC:** Redirección automática a interfaces según el rol (Estudiante, Docente, Admin). | 3 PH | Alta | Frontend (`App.jsx`) / Backend (`Middleware RBAC`) |
| **HU-29** | **Cierre de Sesión en Servidor:** Invalidación de sesión activa en base de datos al ejecutar logout. | 3 PH | Media | Backend (`/api/v1/auth/logout`) / Frontend (`Navegacion.jsx`) |
| **HU-23** | **Consola de Administración de Usuarios:** Alta de usuarios, directorio sincronizado desde MySQL y gestión de estados (`ACTIVO`, `BLOQUEADO`, `INACTIVO`). | 5 PH | Media | Backend (`/api/v1/users`) / Frontend (`VistaConsolaAdministrador.jsx`) |
| **HU-32** | **Seudonimización LOPDP (SHA-256):** Generación de hash unidireccional para aislar PII antes de consultar AnythingLLM. | 3 PH | Alta | Backend (`ServicioSeguridad` / `SesionUsuario`) |

---

#### 3. Requisitos Funcionales en Notación EARS

##### Épica 1: Autenticación, Bloqueo y Control de Sesión (HU-01, HU-29)
* **RF-S1-01 (HU-01 — Login Exitoso):**
  **DADO QUE** un usuario (Estudiante, Docente o Administrador) ingresa su identificador (correo institucional o cédula) y contraseña en `VistaAutenticacion.jsx`,
  **CUANDO** envía el formulario,
  **ENTONCES** el backend de FastAPI verificará la contraseña contra el hash `bcrypt` en MySQL, reiniciará `intentosFallidos` a 0, registrará la sesión en `sesiones_usuario` y retornará un token JWT cifrado conteniendo `usuarioId`, `rolPrincipal`, `pseudonimoHash` y tiempo de expiración.

* **RF-S1-02 (HU-01 — Bloqueo por Intentos Fallidos):**
  **SI** un usuario ingresa credenciales incorrectas,
  **ENTONCES** el backend incrementará el campo `intentosFallidos` en la tabla `usuarios`.
  **SI** el número de `intentosFallidos` alcanza **3 intentos consecutivos**,
  **ENTONCES** el backend cambiará el estado de la cuenta a `BLOQUEADO` y rechazará los subsecuentes intentos con una respuesta HTTP 401 unificada (*"Credenciales inválidas"*), sin revelar el estado interno de la cuenta.

* **RF-S1-03 (HU-29 — Logout en Servidor):**
  **DADO QUE** un usuario autenticado presiona el botón "Cerrar Sesión",
  **CUANDO** el cliente envía `POST /api/v1/auth/logout` con el encabezado `Bearer Token`,
  **ENTONCES** el backend establecerá `fechaExpiracionToken = ahora(UTC)` en la tabla `sesiones_usuario`, invalidando peticiones futuras con ese token (HTTP 401); el cliente destruirá el token y estado en React.

---

##### Épica 2: Control de Acceso Basado en Roles / RBAC (HU-02)
* **RF-S1-04 (HU-02 — Redirección Dinámica):**
  **DADO QUE** un usuario se autentica exitosamente y recibe su token JWT,
  **CUANDO** la aplicación React procesa la respuesta,
  **ENTONCES** el enrutador redirigirá automáticamente según el rol:
  * **Estudiante** \\(\rightarrow\\) `/estudiante/chat` (`VistaChatEstudiante.jsx`)
  * **Docente** \\(\rightarrow\\) `/docente/tablero` (`VistaTableroDocente.jsx`)
  * **Administrador** \\(\rightarrow\\) `/admin/consola` (`VistaConsolaAdministrador.jsx`)

* **RF-S1-05 (HU-02 — Protección de Rutas):**
  **SI** un usuario intenta acceder manualmente a una URL no autorizada para su rol,
  **ENTONCES** el Guardián de Rutas en React e interceptores en FastAPI rechazarán la petición con error HTTP 403 Forbidden, redirigiendo a la pantalla inicial permitida para su rol.

---

##### Épica 3: Seudonimización de Identidad LOPDP (HU-32)
* **RF-S1-06 (HU-32 — Hash SHA-256 con Sal Criptográfica):**
  **DADO QUE** un usuario con rol **Estudiante** se autentica con éxito,
  **CUANDO** el servidor genera la sesión,
  **ENTONCES** el módulo de seguridad calculará de forma determinista e irreversible:
  \\[\text{pseudonimoHash} = \text{SHA256}(\text{usuarioId} + \text{":"} + \text{SAL\_LOPDP\_SECRET})\\]
  Este valor se almacenará en `sesiones_usuario` y en los claims del JWT, siendo el **único identificador transmitido al motor RAG/AnythingLLM**, aislando la PII (nombres, cédulas, correos).

---

##### Épica 4: Consola de Administración de Usuarios (HU-23)
* **RF-S1-07 (HU-23 — Alta de Usuarios):**
  **DADO QUE** el Administrador se encuentra en `VistaConsolaAdministrador.jsx`,
  **CUANDO** completa el formulario especificando cédula, nombres completos, correo institucional, rol asignado y opcionalmente contraseña, enviando `POST /api/v1/users`,
  **ENTONCES** el backend validará los campos, aplicará el hash `bcrypt` a la contraseña enviada o a la clave inicial por defecto (`Tempo2026!` si el campo se omite) e insertará el registro en `usuarios` y `usuario_rol`.

* **RF-S1-08 (HU-23 — Control de Duplicados):**
  **SI** el Administrador intenta registrar un usuario cuyo correo institucional o cédula ya existe en MySQL,
  **ENTONCES** la transacción se abortará, retornando HTTP 409 Conflict con una alerta descriptiva.

* **RF-S1-09 (HU-23 — Sincronización del Directorio):**
  **DADO QUE** el Administrador accede o recarga la consola,
  **CUANDO** el componente se monta o tras una mutación (alta/cambio de estado),
  **ENTONCES** ejecutará `GET /api/v1/users?pagina=1&tamano=100`, reemplazando el estado local exclusivamente con la respuesta de MySQL. Queda prohibido inicializar o usar `usuariosAdminMock.json`.

* **RF-S1-10 (HU-23 — Gestión de Estados y Desbloqueo Administrativo):**
  **DADO QUE** un usuario existe en el directorio,
  **CUANDO** el Administrador ejecuta `PATCH /api/v1/users/{usuarioId}/estado` con `{ "estado": "ACTIVO" | "BLOQUEADO" | "INACTIVO" }`,
  **ENTONCES** el backend actualizará el campo `estado`, `actualizadoPor` y `fechaActualizacion`.
  * **Regla de Reseteo:** Al establecer `estado = "ACTIVO"` (desde `BLOQUEADO` e `INACTIVO`), el backend reiniciará `intentosFallidos = 0`.
  * **Regla de Autobloqueo:** Si `usuarioAutenticado.id == usuarioIdTarget` y se intenta establecer `BLOQUEADO` e `INACTIVO`, el backend responderá HTTP 409 Conflict (*"El Administrador no puede bloquear ni inhabilitar su propia cuenta en sesión"*).

---

#### 4. Contrato de API REST y DTOs (Pydantic / SQLModel)
Convención: **100% camelCase** en JSON externo.

##### 4.1 Endpoints de Autenticación
* `POST /api/v1/auth/login` \\(\rightarrow\\) `200 OK` (`RespuestaLoginEsquema`) | `401 Unauthorized`
* `POST /api/v1/auth/logout` \\(\rightarrow\\) `200 OK` (`{ "mensaje": "Sesión finalizada exitosamente" }`)
* `GET /api/v1/auth/me` \\(\rightarrow\\) `200 OK` (`PerfilUsuarioEsquema`)

##### 4.2 Endpoints de Usuarios
* **`POST /api/v1/users`**
  * Payload (`UsuarioCreacionEsquema`):
    ```json
    {
      "cedula": "0912345678",
      "nombresCompletos": "María Augusta López Vera",
      "correoInstitucional": "mlopez@universidad.edu.ec",
      "contrasena": null,
      "rolId": 2
    }
    ```
    *Nota:* Si `contrasena` es `null` o se omite, el backend asigna `Tempo2026!`.
* **`GET /api/v1/users?pagina=1&tamano=100`** \\(\rightarrow\\) `200 OK` (`RespuestaListaUsuariosEsquema`)
* **`PATCH /api/v1/users/{usuarioId}/estado`**
  * Payload (`ActualizacionEstadoUsuarioEsquema`): `{ "estado": "ACTIVO" }`
  * Respuestas: `200 OK` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found` | `409 Conflict` (Autobloqueo) | `422 Unprocessable Entity`

---

#### 5. Mapeo de Entidades SQLModel (MySQL — `tutoria_db`)
Operación directa sobre 4 tablas del Sprint 0:
1. **`usuarios`:** `id`, `cedula`, `nombresCompletos`, `correoInstitucional`, `passwordHash`, `estado`, `intentosFallidos`, `creadoPor`, `actualizadoPor`, `fechaCreacion`, `fechaActualizacion`.
2. **`roles`:** 1: `ESTUDIANTE`, 2: `DOCENTE`, 3: `ADMINISTRADOR`.
3. **`usuario_rol`:** N:M (`usuario_id`, `rol_id`).
4. **`sesiones_usuario`:** `id`, `usuarioId`, `pseudonimoHash`, `fechaInicio`, `fechaExpiracionToken`.

---

#### 6. Criterios de Aceptación (DoD)
1. Sustitución 100% de mocks por API REST real de FastAPI.
2. Cero datos PII expuestos hacia AnythingLLM/RAG (validación de `pseudonimoHash` SHA-256).
3. Autobloqueo del Administrador rechazado con HTTP 409 Conflict.
4. Desbloqueo de cuentas con reseteo de `intentosFallidos = 0`.
5. Pruebas backend (`pytest`) y frontend (`vitest`) en **100% VERDE**.