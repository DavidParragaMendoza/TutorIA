# Convenciones de Código y Estilo — TutorIA MVP

> La homogeneidad del código maximiza la predictibilidad y la calidad del desarrollo asistido por agentes.

---

## 1. Idioma y Nomenclatura

- **Idioma Único**: Todo el código fuente (variables, funciones, métodos, clases, atributos, nombres de archivos de servicio y comentarios) debe redactarse en **español**.
- **Excepciones de Idioma**: Exclusivamente caracteres chinos (Hanzi) y fonética Pinyin propios del contenido de estudio del nivel HSK1/A1.
- **Sintaxis camelCase Uniforme**:
  - Variables: `usuarioId`, `correoElectronico`, `esActivo`, `tokenAcceso`.
  - Funciones y métodos: `autenticarUsuario`, `obtenerRespuestaRag`, `evaluarPuntaje`.
  - Clases y Modelos SQLModel: `Usuario`, `RolUsuario`, `HistorialSesion`, `EventoAprendizaje`.
  - Campos de Modelos SQLModel: `usuarioId`, `nombreCompleto`, `contrasenaHash`.
  - Claves en payloads JSON (FastAPI y React): `{ "usuarioId": 1, "tokenAcceso": "..." }`.

---

## 2. Convenciones de Backend (FastAPI / Python)

- **Versión**: Python 3.12 o 3.14.
- **ORM**: SQLModel sobre SQLAlchemy 2.0. Las tablas se generan automáticamente en MySQL.
- **Estructura de Endpoints**:
  - Rutas bajo el prefijo `/api/v1/`.
  - Códigos de estado HTTP semánticos: `200 OK`, `201 Created`, `202 Accepted` (para eventos asíncronos), `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.
- **Manejo de Errores**:
  - Utilizar `HTTPException` con detalle estructurado en español y claves en camelCase.
  - No exponer trazas de error internas de la base de datos al cliente.

---

## 3. Convenciones de Frontend (React / Vite)

- **Versión**: React 18/19, Vite, Tailwind CSS.
- **Componentes**: Funcionales, basados en Hooks nativos (`useState`, `useEffect`, `useCallback`).
- **Nombres de Componentes**: `PascalCase` (ej: `VistaChatEstudiante.jsx`, `RutaProtegida.jsx`).
- **Hooks y Servicios**: `camelCase` (ej: `autenticacionServicio.js`, `clienteApi.js`).
- **Estilos**: Clases de utilidad Tailwind CSS con enfoque responsivo y accesible.

---

## 4. Convenciones de Pruebas

- **Backend**: Suites con `pytest` en `backend/tests/test_*.py`. Uso de fixtures en `conftest.py` y bases de datos de prueba en memoria.
- **Frontend**: Pruebas con `vitest` y `@testing-library/react` en `frontend/src/tests/` o colocaladas como `*.test.jsx`.
