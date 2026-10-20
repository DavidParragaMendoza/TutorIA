# Plan de Tareas Ejecutables (tasks.md) — Sprint 1: Autenticación, Seguridad, RBAC y Seudonimización LOPDP

**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica (HSK1/A1)  
**Sprint:** 1 (Autenticación, Seguridad, RBAC y Seudonimización LOPDP)  
**Estimación Total:** 16 Puntos de Historia (PH)  
**Historias de Usuario Cubiertas:** HU-01 (4 PH), HU-02 (3 PH), HU-29 (3 PH), HU-23 (3 PH), HU-32 (3 PH)  
**Metodología:** Spec-Driven Development (SDD) & Test-Driven Development (TDD)

---

## Leyenda de Estado de Tareas
- `[ ]` Tarea Pendiente
- `[/]` Tarea en Progreso
- `[x]` Tarea Completada y Verificada con Tests

---

## Fase 1: Datos Semilla y Módulo de Cifrado (Backend - 3 PH)

- [x] **TAREA-1.1: Utilitario de Cifrado y Hashing de Contraseñas (`bcrypt`)**
  - **Ubicación:** `backend/app/seguridad/cifrado.py`
  - **Descripción:** Implementar las funciones `obtenerHashContrasena(contrasenaTextoPlano: str) -> str` y `verificarContrasena(contrasenaTextoPlano: str, contrasenaHash: str) -> bool` utilizando `passlib[bcrypt]`.
  - **Criterio de Aceptación:** Retornar hashes válidos de `bcrypt` y verificar coincidencias de forma segura sin fugas de tiempo.
  - **Test:** `backend/tests/test_cifrado.py` (`pytest` en verde).

- [x] **TAREA-1.2: Script de Seeding Idempotente de Base de Datos (`semillas.py`)**
  - **Ubicación:** `backend/app/baseDatos/semillas.py`
  - **Descripción:** Crear función `ejecutarSemillas(db: Session)` que:
    1. Verifique cada rol por `nombre` y cree los registros `ADMINISTRADOR`, `DOCENTE`, `ESTUDIANTE` si no existen.
    2. Registre usuarios por defecto (`nombresCompletos`, `passwordHash` con `bcrypt`, `estado = ACTIVO`) si no existen:
       - `admin@tutoria.edu.ec` (`Admin123*`, Cédula: `1700000001`)
       - `docente@tutoria.edu.ec` (`Docente123*`, Cédula: `1700000002`)
       - `estudiante@tutoria.edu.ec` (`Estudiante123*`, Cédula: `1700000003`)
    3. Asocie cada usuario con su respectivo rol en `usuario_rol`.
  - **Criterio de Aceptación:** Ejecución idempotente (sin duplicar ni lanzar excepciones al reejecutar).
  - **Test:** `backend/tests/test_semillas.py`.

- [x] **TAREA-1.3: Hook de Inicialización Automática en FastAPI (`lifespan`)**
  - **Ubicación:** `backend/app/main.py`
  - **Descripción:** Integrar la invocación de `ejecutarSemillas` dentro del gestor de contexto `lifespan` de FastAPI, ejecutándose inmediatamente después de `SQLModel.metadata.create_all()`.
  - **Criterio de Aceptación:** Al arrancar Uvicorn con la base de datos limpia, las tablas se pueblan automáticamente con los datos semilla.

---

## Fase 2: Lógica de Autenticación, JWT, Seudonimización LOPDP y API REST (Backend - 7 PH)

- [x] **TAREA-2.1: Módulo de Gestión de Tokens JWT**
  - **Ubicación:** `backend/app/seguridad/jwt.py`
  - **Descripción:** Implementar funciones `crearTokenAcceso(datos: dict, tiempoExpiracionMinutos: int | None = None) -> str` y `verificarTokenAcceso(token: str) -> dict` usando `python-jose` (algoritmo `HS256`). Payload con `sub`, `rol`, `pseudonimoHash` y `exp`.
  - **Criterio de Aceptación:** Emitir tokens firmados con la clave secreta del servidor y lanzar excepción apropiada ante tokens expirados o alterados.
  - **Test:** `backend/tests/test_jwt.py`.

- [x] **TAREA-2.2: Servicio de Seudonimización LOPDP (Hash SHA-256 con Sal)**
  - **Ubicación:** `backend/app/seguridad/lopdp.py`
  - **Descripción:** Implementar `generarSeudonimoHash(usuarioId: int, salSecreta: str) -> str` que calcule `SHA256(str(usuarioId) + ":" + salSecreta)`.
  - **Criterio de Aceptación:** Retornar un string hexadecimal de 64 caracteres único y determinista. No expone cédula, correo ni nombres.
  - **Test:** `backend/tests/test_lopdp.py`.

- [x] **TAREA-2.3: Esquemas DTO de Entrada y Salida (Pydantic / SQLModel)**
  - **Ubicación:** `backend/app/esquemas/autenticacionEsquemas.py` y `usuarioEsquemas.py`
  - **Descripción:** Definir las clases:
    - `UsuarioLoginEsquema` (identificador [correo o cédula], contrasena)
    - `PerfilUsuarioEsquema` (id, nombresCompletos, correoInstitucional, rolPrincipal, pseudonimoHash)
    - `RespuestaLoginEsquema` (tokenAcceso, tipoToken, expiraEnSegundos, usuario: PerfilUsuarioEsquema)
    - `UsuarioCreacionEsquema` (cedula, nombresCompletos, correoInstitucional, contrasena, rolId)
    - `RespuestaUsuarioEsquema` (id, cedula, nombresCompletos, correoInstitucional, rolPrincipal, estado) y `RespuestaListaUsuariosEsquema` (total, pagina, tamano, usuarios)
  - **Criterio de Aceptación:** Atributos strictly en **camelCase** y validaciones de correo (formato), cédula (10 dígitos) y contraseña (mínimo 8 caracteres) en Pydantic.
  - **Test:** `backend/tests/test_esquemas.py`.

- [x] **TAREA-2.4: Servicio de Autenticación y Bloqueo por Intentos Fallidos**
  - **Ubicación:** `backend/app/servicios/autenticacionServicio.py`
  - **Descripción:** Implementar métodos de negocio:
    - `autenticarUsuario(sesionBD, credenciales)`: Valida usuario (por correo o cédula) y hash de clave. Solo las cuentas `ACTIVO` verifican clave; `BLOQUEADO` e `INACTIVO` se rechazan igual con 401 unificado.
    - Manejo de bloqueo: Si falla, incrementa `intentosFallidos` en la tabla `usuarios`. Al llegar a 3, cambia `estado` a `BLOQUEADO` (valores válidos: `ACTIVO`, `BLOQUEADO`, `INACTIVO`).
    - Al autenticar con éxito, resetea `intentosFallidos` a 0 y registra la sesión en `sesiones_usuario` (almacenando el `pseudonimoHash` LOPDP).
  - **Criterio de Aceptación:** Bloqueo estricto al tercer intento consecutivo fallido. HTTP 401 unificado para no revelar causa de falla.

- [x] **TAREA-2.5: Endpoints REST de Autenticación (`/api/v1/auth`)**
  - **Ubicación:** `backend/app/api/v1/endpoints/autenticacion.py`
  - **Endpoints:**
    - `POST /api/v1/auth/login` (HU-01, HU-32)
    - `POST /api/v1/auth/logout` (HU-29)
    - `GET /api/v1/auth/me` (HU-02)
  - **Criterio de Aceptación:** Generar respuestas JSON compatibles con los DTOs, manejar excepciones HTTP (401, 403, 409) e invalidar la sesión en servidor al hacer logout asignando `fechaExpiracionToken = ahora (UTC)` en `sesiones_usuario` (sin columnas nuevas); un token con sesión expirada retorna 401.

- [x] **TAREA-2.6: Endpoints REST de Administración de Usuarios (`/api/v1/users`)**
  - **Ubicación:** `backend/app/api/v1/endpoints/usuarios.py`
  - **Endpoints:**
    - `POST /api/v1/users` (HU-23): Creación de usuario por parte del Administrador.
    - `GET /api/v1/users`: Listado de usuarios con filtrado por rol.
  - **Criterio de Aceptación:** Rechazar duplicados en correo o cédula con `HTTP 409 Conflict`. Exigir rol `ADMINISTRADOR` vía dependencia de seguridad RBAC.

- [x] **TAREA-2.7: Suite de Pruebas Integradas Backend (`pytest`)**
  - **Ubicación:** `backend/tests/test_auth.py` y `backend/tests/test_usuarios.py`
  - **Criterio de Aceptación:** Cobertura de login exitoso, login con contraseña errónea, bloqueo tras 3 fallos, cálculo de hash SHA-256 LOPDP, logout y creación de usuario admin. **Suite en verde (100% pass)**.

---

## Fase 3: Integración Frontend - Sustitución de Mocks por API Real (Frontend - 4 PH)

- [x] **TAREA-3.1: Cliente API HTTP con Interceptores Token JWT**
  - **Ubicación:** `frontend/src/servicios/clienteApi.js`
  - **Descripción:** Configurar cliente `axios` con `baseURL: 'http://localhost:8000'` e interceptores que:
    1. Adjunten automáticamente el encabezado `Authorization: Bearer <token>` si existe en `localStorage`.
    2. Intercepten respuestas `HTTP 401` para limpiar la sesión local e invalidar el acceso.

- [x] **TAREA-3.2: Servicio de Autenticación Frontend**
  - **Ubicación:** `frontend/src/servicios/autenticacionServicio.js`
  - **Descripción:** Crear métodos `iniciarSesion(identificador, contrasena)`, `cerrarSesion()`, `obtenerPerfilUsuario()`, `crearUsuario(datosUsuario)` consumiendo los endpoints de FastAPI y gestionando `localStorage`.

- [x] **TAREA-3.3: Conexión Real de `VistaAutenticacion.jsx` (HU-01, HU-02)**
  - **Ubicación:** `frontend/src/vistas/VistaAutenticacion.jsx`
  - **Descripción:** Reemplazar el consumo de `usuariosAuthMock.json` por la invocación a `autenticacionServicio.iniciarSesion`.
  - **Criterios:**
    - Mostrar indicador de carga durante la petición.
    - Mostrar mensaje de error si las credenciales son incorrectas o la cuenta está bloqueada.
    - Guardar token y perfil en el estado global/contexto y redirigir al usuario según su `rolPrincipal`.

- [x] **TAREA-3.4: Enrutamiento Dinámico y Protección de Rutas RBAC (`App.jsx`)**
  - **Ubicación:** `frontend/src/App.jsx`
  - **Descripción:** Implementar componente de guardia de ruta (`RutaProtegida.jsx`) que valide la presencia de un token activo y el rol autorizado para la vista solicitada (`/estudiante/*`, `/docente/*`, `/admin/*`). Redirigir a `/login` si intenta acceso no autorizado.

- [x] **TAREA-3.5: Conexión Real de `VistaConsolaAdministrador.jsx` (HU-23)**
  - **Ubicación:** `frontend/src/vistas/VistaConsolaAdministrador.jsx`
  - **Descripción:** Conectar el formulario modal de "Crear Usuario" con la petición `POST /api/v1/users`.
  - **Criterios:** Reemplazar la inserción en el mock por la API real, desplegar alertas de éxito/error (cédula o correo duplicado) y refrescar la tabla de usuarios.

- [x] **TAREA-3.6: Suite de Pruebas Frontend en Vitest**
  - **Ubicación:** `frontend/src/tests/autenticacion.test.jsx`
  - **Criterios:** Verificar el renderizado de la pantalla de login, la captura de formulario, el manejo de respuestas simuladas de la API (exitosas y con error) y la redirección por rol. **Pruebas en verde (100% pass)**.

---

## Fase 4: Validación de Calidad, Auditoría LOPDP y DoD (2 PH)

- [ ] **TAREA-4.1: Auditoría de Seudonimización LOPDP en MySQL**
  - **Descripción:** Inspeccionar la tabla `sesiones_usuario` en phpMyAdmin tras un login de estudiante para comprobar que la columna `pseudonimoHash` contiene un hash SHA-256 válido y que no existen nombres, cédulas ni correos almacenados en variables de sesión expuestas a la IA.

- [ ] **TAREA-4.2: Ejecución Completa de la Suite de Pruebas y Compilación**
  - **Backend:** `pytest` (Verificar 100% verde sin advertencias).
  - **Frontend:** `npm run test` (Vitest en verde), `npm run build` (0 errores de compilación) y `npm run lint` (0 advertencias).

- [ ] **TAREA-4.3: Registro en Memoria y Cierre de Sprint 1**
  - **Descripción:** Actualizar `MEMORIA_CONTEXTO_SDD_TUTORIA.md` certificando el cumplimiento de las 5 HUs del Sprint 1 y la transición de datos simulados a la API real de FastAPI.
