# Especificación de Requisitos Funcionales — Sprint 1 (specs/002-sprint1-autenticacion/spec.md)

**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)  
**Sprint:** 002-sprint1-autenticacion  
**Nombre del Sprint:** Autenticación, Seguridad, Control de Acceso por Roles (RBAC) y Seudonimización LOPDP (SHA-256)  
**Estimación Total:** 16 Puntos de Historia (PH)  
**Estado:** BORRADOR DE ESPECIFICACIÓN ACTIVA (Para Revisión y Validación)  
**Metodología:** Spec-Driven Development (SDD)

---

## 1. Visión General y Propósito del Sprint

El **Sprint 1** tiene como objetivo reemplazar el mecanismo de datos simulados en la capa de interfaz (`usuariosAuthMock.json`) e implementar el subsistema real de **Autenticación, Seguridad, RBAC y Seudonimización LOPDP** en la arquitectura de tres capas (React + FastAPI + MySQL).

Este Sprint constituye el primer hito de integración real entre el cliente y el servidor, asegurando que:
1. La identidad de cada usuario sea validada contra las tablas relacionales (`usuarios`, `roles`, `usuario_rol`).
2. Se gestionen sesiones mediante tokens **JWT** cifrados.
3. Se proteja la privacidad del estudiante cumpliendo la **Ley Orgánica de Protección de Datos Personales (LOPDP)** mediante un hash **SHA-256 con sal** (seudonimización irreversible antes de cualquier transmisión hacia la capa RAG/IA).
4. El Administrador disponga de una consola centralizada para la creación de usuarios y asignación de roles.

---

## 2. Historias de Usuario Cubiertas (16 PH)

| ID | Historia de Usuario | PH | Prioridad | Módulo Impactado |
|---|---|---|---|---|
| **HU-01** | **Autenticación de Credenciales:** Como usuario (Estudiante, Docente, Admin), quiero ingresar mis credenciales de acceso, para iniciar sesión de forma segura. | 4 PH | Alta | Backend (`/api/v1/auth/login`) / Frontend (`VistaAutenticacion.jsx`) |
| **HU-02** | **Enrutamiento Dinámico RBAC:** Como usuario autenticado, quiero ser redirigido dinámicamente según mi rol, para acceder únicamente a mis interfaces autorizadas. | 3 PH | Alta | Frontend (`App.jsx`, Enrutador) / Backend (Middleware RBAC) |
| **HU-29** | **Cierre de Sesión Seguro en Servidor:** Como usuario autenticado, quiero cerrar mi sesión activamente, para invalidar el token de seguridad en el servidor y limpiar mi cliente. | 3 PH | Media | Backend (`/api/v1/auth/logout`) / Frontend (`Navegacion.jsx`) |
| **HU-23** | **Consola de Administración de Usuarios:** Como Administrador, quiero una consola para crear usuarios y asignar roles, para gestionar las cuentas del piloto de aula. | 3 PH | Media | Backend (`/api/v1/users`) / Frontend (`VistaConsolaAdministrador.jsx`) |
| **HU-32** | **Seudonimización LOPDP (SHA-256):** Como Módulo de Seguridad, quiero generar un hash SHA-256 del ID de estudiante en el login, para usar un seudónimo en la IA local sin exponer datos PII. | 3 PH | Alta | Backend (`ServicioSeguridad` / `SesionUsuario`) |

---

## 3. Requisitos Funcionales en Notación EARS (Dado / Cuando / Entonces)

### Épica 1: Autenticación, Bloqueo y Control de Sesión (HU-01, HU-29)

* **RF-S1-01 (HU-01 — Login Exitoso):**  
  **DADO QUE** un usuario (Estudiante, Docente o Administrador) se encuentra en la pantalla de inicio de sesión (`VistaAutenticacion.jsx`),  
  **CUANDO** ingresa su identificador (correo institucional o cédula) y contraseña válidas y envía el formulario,  
  **ENTONCES** el backend de FastAPI consultará la base de datos MySQL (`usuarios`), verificará la contraseña con hash seguro (Bcrypt/Argon2), reiniciará el contador de `intentosFallidos` a 0, registrará la sesión en `sesiones_usuario` y retornará un token JWT cifrado conteniendo el identificador de usuario, rol y tiempo de expiración.

* **RF-S1-02 (HU-01 — Bloqueo por Intentos Fallidos):**  
  **SI** un usuario ingresa credenciales incorrectas,  
  **ENTONCES** el backend incrementará el campo `intentosFallidos` en la tabla `usuarios`.  
  **SI** el número de `intentosFallidos` alcanza **3 intentos consecutivos**,  
  **ENTONCES** el backend cambiará el estado de la cuenta a inhabilitada/bloqueada temporalmente y rechazará los subsecuentes intentos de inicio de sesión con un mensaje genérico de seguridad sin revelar detalles de la cuenta.

* **RF-S1-03 (HU-29 — Logout en Servidor):**  
  **DADO QUE** un usuario autenticado presiona el botón "Cerrar Sesión",  
  **CUANDO** el cliente envía la petición `POST /api/v1/auth/logout` con el encabezado de autorización Bearer Token,  
  **ENTONCES** el backend buscará la `SesionUsuario` correspondiente y establecerá `fechaExpiracionToken = ahora (UTC)`, de modo que toda verificación posterior del token determine la sesión como inválida (`fechaExpiracionToken <= fechaActual`) y retorne HTTP 401; el cliente destruirá el almacenamiento local del token y la sesión en React.

---

### Épica 2: Control de Acceso Basado en Roles / RBAC (HU-02)

* **RF-S1-04 (HU-02 — Redirección Dinámica):**  
  **DADO QUE** un usuario se autentica exitosamente y recibe un token JWT con su rol validado,  
  **CUANDO** la aplicación en React procesa la respuesta de login,  
  **ENTONCES** el enrutador del cliente redirigirá automáticamente al usuario según su rol:
  * **Estudiante** $\rightarrow$ `VistaRutaAprendizaje.jsx` / `VistaChatEstudiante.jsx`
  * **Docente** $\rightarrow$ `VistaTableroDocente.jsx`
  * **Administrador** $\rightarrow$ `VistaConsolaAdministrador.jsx`

* **RF-S1-05 (HU-02 — Protección de Rutas y Auditoría):**  
  **SI** un usuario intenta acceder manualmente escribiendo en la barra de navegación la URL de una vista no autorizada para su rol (ejemplo: un Estudiante intentando cargar la Consola de Administrador),  
  **ENTONCES** el componente Guardián de Rutas en React e interceptores en FastAPI rechazarán la petición con un error HTTP 403 Forbidden, redirigirán al usuario a su pantalla de inicio permitida y registrarán el evento de acceso no autorizado en la tabla de auditoría relacional.

---

### Épica 3: Seudonimización de Identidad LOPDP (HU-32)

* **RF-S1-06 (HU-32 — Hash SHA-256 con Sal Criptográfica):**  
  **DADO QUE** la autenticación de un usuario con rol **Estudiante** es exitosa,  
  **CUANDO** el servidor backend de FastAPI genera la sesión de usuario,  
  **ENTONCES** el módulo de seguridad calculará de forma determinista e irreversible un hash **SHA-256** concatenando el `usuarioId` primario con una sal criptográfica del servidor (`SAL_LOPDP_SECRET`):
  $$\text{pseudonimoHash} = \text{SHA256}(\text{usuarioId} + \text{":"} + \text{SAL\_LOPDP\_SECRET})$$
  Este valor se almacenará en la columna `pseudonimoHash` de la tabla `sesiones_usuario` y en los claims del token JWT, siendo el **único identificador transmitido al contenedor de AnythingLLM/RAG**, aislando por completo nombres, apellidos, cédulas y correos de las consultas a la IA.

---

### Épica 4: Consola de Administración de Usuarios (HU-23)

* **RF-S1-07 (HU-23 — Alta de Usuarios):**  
  **DADO QUE** el Administrador se encuentra en la `VistaConsolaAdministrador.jsx`,  
  **CUANDO** completa el formulario de registro de usuario especificando cédula, nombres, apellidos, correo institucional, clave inicial y rol asignado (Estudiante, Docente o Administrador) y envía la solicitud `POST /api/v1/users`,  
  **ENTONCES** el backend validará el formato de los campos, aplicará el hash a la contraseña, insertará el registro en la tabla `usuarios` y asociará el rol correspondiente en `usuario_rol`.

* **RF-S1-08 (HU-23 — Control de Duplicados):**  
  **SI** el Administrador intenta registrar un usuario cuyo correo institucional o número de cédula ya existe en la base de datos MySQL,  
  **ENTONCES** la transacción en SQLModel se abortará, retornando un código de estado HTTP 409 Conflict con una alerta descriptiva para la interfaz.

---

## 4. Contrato de API REST y DTOs (Pydantic / SQLModel)

Todos los esquemas y contratos están definidos en **Español** con convención **camelCase** para sus atributos JSON.

### 4.1 Endpoints de Autenticación

#### `POST /api/v1/auth/login`
* **Descripción:** Valida credenciales, aplica lógica de bloqueo e inicia sesión.
* **Cuerpo de Solicitud (`UsuarioLoginEsquema`):**
  ```json
  {
    "identificador": "0987654321",
    "contrasena": "ClaveSegura123!"
  }
  ```
* **Respuesta Exitosa HTTP 200 OK (`RespuestaLoginEsquema`):**
  ```json
  {
    "tokenAcceso": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tipoToken": "Bearer",
    "expiraEnSegundos": 28800,
    "usuario": {
      "id": 12,
      "nombresCompletos": "Juan Carlos Pérez Gómez",
      "correoInstitucional": "jperez@universidad.edu.ec",
      "rolPrincipal": "ESTUDIANTE",
      "pseudonimoHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
    }
  }
  ```
* **Respuestas de Error:**
  * HTTP 401 Unauthorized: `"Credenciales inválidas"` (mensaje único y genérico también para cuentas bloqueadas o inactivas, para no revelar el estado de la cuenta; se descarta HTTP 423).

#### `POST /api/v1/auth/logout`
* **Descripción:** Invalida el token JWT activo y cierra la sesión en el servidor.
* **Encabezado:** `Authorization: Bearer <tokenAcceso>`
* **Respuesta Exitosa HTTP 200 OK:**
  ```json
  {
    "mensaje": "Sesión finalizada exitosamente"
  }
  ```

#### `GET /api/v1/auth/me`
* **Descripción:** Obtiene los datos del perfil y rol del usuario con sesión activa.
* **Encabezado:** `Authorization: Bearer <tokenAcceso>`
* **Respuesta Exitosa HTTP 200 OK (`PerfilUsuarioEsquema`)**

---

### 4.2 Endpoints de Administración de Usuarios (`/api/v1/users`)

#### `POST /api/v1/users`
* **Permiso requerido:** Exclusivo para rol `ADMINISTRADOR`.
* **Cuerpo de Solicitud (`UsuarioCreacionEsquema`):**
  ```json
  {
    "cedula": "0912345678",
    "nombresCompletos": "María Augusta López Vera",
    "correoInstitucional": "mlopez@universidad.edu.ec",
    "contrasena": "Tempo2026!",
    "rolId": 2
  }
  ```
* **Respuesta Exitosa HTTP 201 Created (`RespuestaUsuarioEsquema`)**
* **Respuesta de Error:**
  * HTTP 409 Conflict: `"El correo institucional o número de cédula ya se encuentra registrado"`

#### `GET /api/v1/users`
* **Permiso requerido:** Exclusivo para rol `ADMINISTRADOR`.
* **Respuesta Exitosa HTTP 200 OK:** Lista paginada con parámetros `pagina` (por defecto 1), `tamano` (por defecto 20) y `rol` (filtro opcional por nombre de rol): `{ "total", "pagina", "tamano", "usuarios": [ {id, cedula, nombresCompletos, correoInstitucional, rolPrincipal, estado} ] }`.
* **Validaciones de `UsuarioCreacionEsquema`:** `cedula` de 10 dígitos, `correoInstitucional` con formato de correo, `contrasena` de mínimo 8 caracteres, `rolId` existente (422 si no existe).

---

## 5. Mapeo de Entidades SQLModel (MySQL — tutoria_db)

El Sprint 1 opera directamente sobre 4 de las 20 tablas creadas e inspeccionadas en el Sprint 0:

1. **`usuarios` (`Usuario`):**
   * Campos clave: `id`, `cedula`, `nombres`, `apellidos`, `correo_institucional`, `contrasena_hash`, `intentos_fallidos`, `activo`.
2. **`roles` (`Rol`):**
   * Registros estáticos: `1: ESTUDIANTE`, `2: DOCENTE`, `3: ADMINISTRADOR`.
3. **`usuario_rol` (`UsuarioRol`):**
   * Mapeo N:M asociando el `usuario_id` con su `rol_id`.
4. **`sesiones_usuario` (`SesionUsuario`):**
   * Campos reales (esquema inmutable de 20 tablas): `id`, `usuarioId`, `pseudonimoHash`, `fechaInicio`, `fechaExpiracionToken`. No se agregan columnas nuevas; el logout se implementa expirando `fechaExpiracionToken`.

---

## 6. Requisitos No Funcionales del Sprint 1

* **RNF-S1-01 (Desempeño):** La autenticación (`/api/v1/auth/login`) debe procesarse y responder en menos de **300 ms**.
* **RNF-S1-02 (Cifrado y Expiración):** Firma de tokens JWT utilizando el algoritmo **HS256** con secreto criptográfico de mínimo 256 bits y tiempo de expiración predeterminado de **8 horas**.
* **RNF-S1-03 (Privacidad Cero-Fugas LOPDP):** El hash SHA-256 debe ser unidireccional e irreversible. Está strictly prohibido transmitir el correo, cédula o nombres a la capa de integración RAG.
* **RNF-S1-04 (Gobernanza de Código):** 100% de los identificadores, variables, métodos y DTOs redactados en **Español con sintaxis camelCase**.

---

## 7. Criterios de Aceptación y Definición de Terminado (Definition of Done)

1. **Sustitución Total de Mocks:** La vista `VistaAutenticacion.jsx` no utiliza `usuariosAuthMock.json`; todas las interacciones de login se comunican vía Axios/Fetch con el backend FastAPI.
2. **Pruebas de Backend (Pytest):** Cobertura de tests para:
   * Login exitoso con emisión de JWT.
   * Rechazo de credenciales inválidas.
   * Bloqueo de cuenta al acumulase 3 intentos fallidos consecutivos.
   * Generación correcta y determinista del hash SHA-256 LOPDP.
   * Restricción RBAC de endpoints según el rol.
3. **Pruebas de Frontend (Vitest):** Cobertura de tests para:
   * Renderizado y envío de credenciales en `VistaAutenticacion.jsx`.
   * Redirección exitosa por rol (Estudiante, Docente, Admin).
   * Cierre de sesión y limpieza de estado.
4. **Calidad de Código:** Compilación limpia sin errores (`npm run build`) e inspección estática en verde (`npm run lint`).
