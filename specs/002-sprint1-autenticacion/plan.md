# Plan de Diseño Técnico y Arquitectura — Sprint 1: Autenticación, Seguridad, RBAC y Seudonimización LOPDP

**Proyecto:** TutorIA — Sistema de Orquestación Pedagógica (HSK1/A1)  
**Sprint:** 1 (Autenticación, Seguridad, RBAC, Consola Admin y LOPDP SHA-256 — 16 PH)  
**Documento de Referencia:** `specs/002-sprint1-autenticacion/spec.md`  
**Metodología:** Spec-Driven Development (SDD) & Test-Driven Development (TDD)  

---

## 1. Resumen Ejecutivo y Objetivos del Plan

El **Sprint 1** marca la transición crítica desde la maquetación estática con datos de prueba (`usuariosAuthMock.json`) y la base de datos MySQL relacional vacía generada en el Sprint 0, hacia un **backend real con FastAPI** totalmente integrado con la base de datos `tutoria_db` en phpMyAdmin.

Este plan técnico aborda de forma integral:
1. **Infraestructura de Datos Semilla (Seeding):** Estrategia de carga inicial e idempotente para los catálogos de roles y usuarios por defecto con contraseñas cifradas en `bcrypt`.
2. **Arquitectura de Seguridad & Autenticación:** Generación y validación de tokens JWT (HS256), control de intentos fallidos con bloqueo temporal y cálculo asíncrono del hash seudónimo LOPDP (SHA-256 + sal).
3. **Control de Acceso Basado en Roles (RBAC):** Middleware/Dependencias de FastAPI para la protección de endpoints y enrutamiento dinámico en el cliente React.
4. **Desacoplamiento Frontend:** Sustitución de Mocks JSON por servicios HTTP (`autenticacionServicio.js`) manteniendo cero acoplamiento hardcoded.

---

## 2. Estrategia de Datos Semilla y Poblado Inicial (Seeding)

Para solventar la ausencia de datos iniciales en la base de datos `tutoria_db`, se implementará un subsistema de **seeding idempotente** en el backend.

### 2.1 Módulo Utilitario de Cifrado (`backend/app/seguridad/cifrado.py`)
* Utilizará `passlib[bcrypt]` para el hashing seguro de contraseñas de usuario.
* Métodos principales:
  * `obtenerHashContrasena(contrasenaTextoPlano: str) -> str`: Genera el hash `bcrypt` con sal integrada.
  * `verificarContrasena(contrasenaTextoPlano: str, contrasenaHash: str) -> bool`: Valida credenciales ingresadas.

### 2.2 Script de Seeding Idempotente (`backend/app/baseDatos/semillas.py`)
El script (función `ejecutarSemillas(db: Session)`) verificará la existencia de registros antes de realizar cualquier inserción para evitar duplicados o fallos de restricción `UNIQUE`:

1. **Catálogo de Roles (Tabla `roles`, campos `nombre` y `descripcion`):**
   * Por cada rol, se verifica por `nombre` y se inserta si no existe:
     * `ADMINISTRADOR`
     * `DOCENTE`
     * `ESTUDIANTE`

2. **Usuarios Semilla por Defecto (Tablas `usuarios` y `usuario_rol`):**
   * **Administrador:**
     * `correoInstitucional`: `admin@tutoria.edu.ec`
     * `cedula`: `1700000001`
     * `nombresCompletos`: `Administrador General TutorIA`
     * `passwordHash`: `bcrypt("Admin123*")`
     * Rol asignado: `ADMINISTRADOR`
   * **Docente:**
     * `correoInstitucional`: `docente@tutoria.edu.ec`
     * `cedula`: `1700000002`
     * `nombresCompletos`: `Profesor Li Wei`
     * `passwordHash`: `bcrypt("Docente123*")`
     * Rol asignado: `DOCENTE`
   * **Estudiante:**
     * `correoInstitucional`: `estudiante@tutoria.edu.ec`
     * `cedula`: `1700000003`
     * `nombresCompletos`: `Juan Carlos Pérez`
     * `passwordHash`: `bcrypt("Estudiante123*")`
     * Rol asignado: `ESTUDIANTE`
   * Todos nacen con `estado = ACTIVO` e `intentosFallidos = 0`.

### 2.3 Mecanismo de Ejecución
* **CLI Manual:** `python -m app.baseDatos.semillas`
* **Automático en Inicio de App:** Invocado dentro del evento `lifespan` de FastAPI en `app/main.py`, garantizando que la aplicación sea ejecutable de inmediato sin intervención manual previa.

---

## 3. Estructura Física y Módulos a Crear / Modificar

```text
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── autenticacion.py     # POST /login, POST /logout, GET /me
│   │       │   └── usuarios.py          # POST /users (Consola Admin)
│   │       └── router.py                # Agregador de rutas v1
│   ├── baseDatos/
│   │   ├── conexion.py                  # Generador de sesiones DB
│   │   └── semillas.py                  # Seeding idempotente
│   ├── esquemas/
│   │   └── autenticacionEsquemas.py     # DTOs Pydantic en camelCase
│   ├── seguridad/
│   │   ├── cifrado.py                   # bcrypt hashing
│   │   ├── jwt.py                       # Generación/Validación JWT (HS256)
│   │   ├── lopdp.py                     # Algoritmo SHA-256 + sal
│   │   └── dependencias.py              # Middleware RBAC (obtenerUsuarioActual)
│   ├── servicios/
│   │   ├── autenticacionServicio.py     # Lógica de negocio de login, bloqueo y logout
│   │   └── usuarioServicio.py           # Creación de usuarios y asignación de roles
│   └── main.py                          # Inclusión de CORS, router v1 y lifespan seeding
├── tests/
│   ├── test_auth.py                     # Pytest para login, bloqueo, JWT, logout y perfil
│   └── test_usuarios.py                 # Pytest para creación de usuarios y duplicidad
└── .env                                 # JWT_SECRET_KEY, SAL_LOPDP_SECRET

frontend/
├── src/
│   ├── contexto/
│   │   └── ContextoAutenticacion.jsx    # Estado global de sesión y JWT
│   ├── servicios/
│   │   ├── clienteApi.js                # Instancia de Axios/Fetch con interceptor JWT
│   │   └── autenticacionServicio.js     # Llamadas HTTP a /api/v1/auth/ y /api/v1/users
│   └── vistas/
│       ├── VistaAutenticacion.jsx       # Conexión con API real de login
│       └── VistaConsolaAdministrador.jsx# Conexión con API real de creación de usuarios
```

---

## 4. Diseño del Subsistema de Seguridad (JWT, RBAC y LOPDP)

### 4.1 Generación de Tokens JWT (`backend/app/seguridad/jwt.py`)
* **Funciones:** `crearTokenAcceso(datos: dict, tiempoExpiracionMinutos: int | None = None) -> str` y `verificarTokenAcceso(token: str) -> dict`.
* **Algoritmo:** `HS256` utilizando `python-jose[cryptography]`.
* **Expiración por Defecto:** 480 minutos (8 horas).
* **Estructura del Payload JWT:**
```json
{
  "sub": "12",
  "correo": "estudiante@tutoria.edu.ec",
  "rol": "ESTUDIANTE",
  "pseudonimoHash": "a8f5f167f44f4964e6c998dee827110c...",
  "exp": 1729388000
}
```

### 4.2 Módulo de Seudonimización LOPDP (`backend/app/seguridad/lopdp.py`)
* **Función:** `generarSeudonimoHash(usuarioId: int, salSecreta: str) -> str`
* **Fórmula de Hashing SHA-256:**
  `hashSeudonimo = hashlib.sha256(f"{usuarioId}:{salSecreta}".encode('utf-8')).hexdigest()`
* **Aislamiento:** El seudónimo resultante es el único identificador almacenado en la entidad `SesionUsuario` y transmitido al contenedor de AnythingLLM durante la interacción RAG (Sprint 2).

### 4.3 Control de Intentos Fallidos y Bloqueo
* **Lógica en `autenticacionServicio.py`:**
  1. Si las credenciales son incorrectas: `intentosFallidos += 1`.
  2. Si `intentosFallidos >= 3`: `estado = "BLOQUEADO"` (valores válidos del campo `estado`: `ACTIVO`, `BLOQUEADO`, `INACTIVO`).
  3. Retorna HTTP 401: `"Credenciales inválidas o cuenta bloqueada por seguridad."`

### 4.4 Estrategia de Logout (HU-29)
* El esquema de `sesiones_usuario` es inmutable (sin `fechaCierre`, `activa` ni `tokenJwt`).
* `POST /api/v1/auth/logout` busca la sesión del usuario y asigna `fechaExpiracionToken = datetime.now(timezone.utc)`.
* La dependencia de autenticación rechaza con HTTP 401 todo token cuya sesión tenga `fechaExpiracionToken <= fechaActual`.
* Claves de entorno requeridas en `backend/.env`: `JWT_SECRET_KEY` y `SAL_LOPDP_SECRET`.

---

## 5. Mapeo DTO (Pydantic) y Convención camelCase

Todos los DTOs de comunicación API cumplirán strictly con la convención **camelCase** en la interfaz externa JSON y se mapearán transparentemente a los modelos SQLModel en el backend.

```python
# backend/app/esquemas/autenticacionEsquemas.py
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class UsuarioLoginEsquema(BaseModel):
    identificador: str  # Correo o Cédula
    claveAcceso: str

class RespuestaLoginEsquema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    tokenAcceso: str
    tipoToken: str = "Bearer"
    usuarioId: int
    nombreCompleto: str
    correoInstitucional: EmailStr
    codigoRol: str
    pseudonimoHash: str

class UsuarioCreacionEsquema(BaseModel):
    nombreCompleto: str
    correoInstitucional: EmailStr
    cedula: str
    claveAcceso: str
    codigoRol: str
```

---

## 6. Estrategia de Pruebas y Plan de Ejecución TDD

### 6.1 Backend (Pytest)
1. **`test_cifrado.py`:** Verificación de generación de hashes `bcrypt` y comparación exitosa.
2. **`test_semillas.py`:** Confirmación de inserción de 3 roles y 3 usuarios por defecto al ejecutar el seeding.
3. **`test_autenticacion.py`:**
   * Login exitoso para los 3 roles.
   * Acumulación de 3 intentos fallidos y verificación del `estado = "BLOQUEADO"`.
   * Verificación de la presencia del campo `pseudonimoHash` (64 caracteres hexadecimales) en la respuesta del login.
   * Invalidation de sesión mediante `/api/v1/auth/logout`.
4. **`test_usuarios.py`:** Creación exitosa de un nuevo usuario desde el rol Admin y prueba de rechazo HTTP 409 por correo o cédula duplicada.

### 6.2 Frontend (Vitest)
1. Actualizar `vistas.test.jsx` para verificar que `VistaAutenticacion.jsx` envíe los datos en formato JSON mediante el nuevo servicio y maneje estados de carga/error.
2. Validar que la redirección dinámica dirija a la ruta correspondiente según el rol almacenado en el token.

---

## 7. Criterios de Aceptación y Definición de Terminado (DoD)

1. [ ] Script `semillas.py` funcional y ejecutado en el startup de FastAPI.
2. [ ] Endpoints `/login`, `/logout`, `/me` y `/users` operativos y respondiendo en $< 300\text{ ms}$.
3. [ ] Cero datos sensibles (cédula, correo, nombre) expuestos en las variables de sesión del RAG.
4. [ ] Suite de pruebas Pytest y Vitest en 100% VERDE.
5. [ ] Cero advertencias de linter y compilación `npm run build` exitosa.
