# Tareas — Spec 002 (Sprint 1: Autenticación, RBAC y Seudonimización LOPDP)

- [x] T1. Cifrado bcrypt, Seeding e Invocación Lifespan. (RF-S1-01)
      Hecho cuando: `pytest tests/test_cifrado.py tests/test_semillas.py` pasa en verde e inserta de forma idempotente los 3 roles y cuentas por defecto al arrancar FastAPI.

- [x] T2. Tokens JWT (HS256) y Seudonimización LOPDP SHA-256. (RF-S1-01, RF-S1-06)
      Hecho cuando: `pytest tests/test_jwt.py tests/test_lopdp.py` pasa en verde, generando tokens firmados y hashes SHA-256 de 64 caracteres con sal.

- [x] T3. DTOs Pydantic, Login, Bloqueo (3er fallo) y Logout. (RF-S1-01, RF-S1-02, RF-S1-03)
      Hecho cuando: `pytest tests/test_auth.py` en verde valida login exitoso, incremento/bloqueo tras 3 fallos consecutivos con respuesta unificada HTTP 401 e invalidación de token en servidor al hacer logout.

- [x] T4. API REST de Usuarios (Alta Rápida y Consulta Paginada). (RF-S1-07, RF-S1-08, RF-S1-09)
      Hecho cuando: `pytest tests/test_usuarios.py` en verde valida alta con clave inicial por defecto (`Tempo2026!` si es `null`), rechazo de duplicados HTTP 409 y listado paginado desde MySQL.

- [x] T5. Integración Frontend — Interceptores, Login y RBAC. (RF-S1-01, RF-S1-04, RF-S1-05)
      Hecho cuando: `vitest frontend/src/tests/autenticacion.test.jsx` en verde valida captura de formulario, guardado de token/perfil y enrutamiento dinámico según el rol.

- [x] T6. Backend — Endpoint PATCH de Cambio de Estado, Desbloqueo y Autobloqueo 409. (RF-S1-10)
      Hecho cuando: `pytest tests/test_usuarios.py` valida `PATCH /api/v1/users/{usuarioId}/estado`, reseteando `intentosFallidos = 0` al pasar a `ACTIVO` y rechazando con HTTP 409 Conflict el autobloqueo/autoinactivación del Administrador.

- [x] T7. Frontend — Consola Admin Sincronizada y Acciones de Estado. (RF-S1-09, RF-S1-10)
      Hecho cuando: `vitest frontend/src/tests/consolaAdministrador.test.jsx` en verde valida `GET /users` al montar, mapeo DTO a la vista, refresco tras alta/mutación y renderizado de acciones reales de cambio de estado.

- [x] T8. Validación Final de Calidad y Cierre de DoD. (Todos los RFs)
      Hecho cuando: `pytest`, `npm test` (vitest), `npm run lint` y `npm run build` compilen y se ejecuten en **100% VERDE** sin errores ni advertencias.
