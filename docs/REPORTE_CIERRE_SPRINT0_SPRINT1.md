<div align="center">

# 📜 Reporte de Cierre y Certificación SDD

### Sprints 0 y 1 — TutorIA

*Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)*

<br/>

![Cierre](https://img.shields.io/badge/Cierre-100%25_Certificado_%7C_DoD_Passed-brightgreen?style=for-the-badge)
![Metodología](https://img.shields.io/badge/Metodolog%C3%ADa-Spec--Driven_Development-8A2BE2?style=for-the-badge)
![Backend](https://img.shields.io/badge/Tests_Backend-Pytest_100%25_Passing-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)
![Frontend](https://img.shields.io/badge/Tests_Frontend-Vitest_100%25_Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)
![LOPDP](https://img.shields.io/badge/Cobertura_LOPDP-SHA--256_Validated-blue?style=for-the-badge&logo=letsencrypt&logoColor=white)

<br/>

[⬅️ Volver al README Principal](../README.md) | [📋 Ver Especificación del Sprint 1](../specs/002-sprint1-autenticacion/spec.md) | [🏗️ Ver Arquitectura del Proyecto](../README.md#️-arquitectura-y-estructura-del-proyecto)

</div>

<br/>

| | |
|:--|:--|
| **Proyecto** | TutorIA — Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1) |
| **Metodología** | Spec-Driven Development (SDD) & Test-Driven Development (TDD) |
| **Alcance Certificado** | Sprint 0 (Cimientos y Scaffolding) + Sprint 1 (Autenticación, Seguridad, RBAC, Consola Admin y LOPDP SHA-256) |
| **Estimación Total Certificada** | 18 Puntos de Historia (Sprint 1) + Base Relacional Sprint 0 |
| **Estado** | ✅ **FINALIZADO Y CERTIFICADO — 100% DoD Cumplido** |

---

## 🎓 1. Resumen Ejecutivo

> El presente reporte certifica la finalización exitosa de las fases de cimentación e integración de seguridad del proyecto **TutorIA**. Se ha reemplazado la totalidad de los datos simulados en la capa de interfaz (`usuariosAuthMock.json`, `usuariosAdminMock.json`) por un backend real en **FastAPI**, persistencia en **MySQL** (`tutoria_db`, 20 tablas) y cliente **React**.

> Todos los Requisitos Funcionales han sido validados tanto mediante suites de pruebas automatizadas (`pytest` y `vitest`) en 100% verde, como por pruebas de integración manual en entorno local.

---

## 📊 2. Matriz de Historias de Usuario Certificadas

<table>
  <tr>
    <th>ID</th>
    <th>Historia de Usuario</th>
    <th>PH</th>
    <th>Módulo / Requisitos</th>
    <th>Estado</th>
    <th>Evidencia de Verificación</th>
  </tr>
  <tr>
    <td><b>HU-01</b></td>
    <td><b>🔑 Autenticación de Credenciales:</b> Validación segura de credenciales, hash <code>bcrypt</code> y bloqueo temporal tras 3 intentos fallidos consecutivos.</td>
    <td align="center">4 PH</td>
    <td>Backend (<code>/api/v1/auth/login</code>) / Frontend (<code>VistaAutenticacion.jsx</code>)</td>
    <td align="center"><img src="https://img.shields.io/badge/CERTIFICADO-brightgreen?style=flat-square" alt="CERTIFICADO"/></td>
    <td>Login exitoso con credenciales válidas. Bloqueo automático al 3er fallo consecutivo con respuesta unificada <code>HTTP 401</code>.</td>
  </tr>
  <tr>
    <td><b>HU-02</b></td>
    <td><b>🧭 Enrutamiento Dinámico RBAC:</b> Redirección automática a interfaces según el rol (Estudiante, Docente, Admin).</td>
    <td align="center">3 PH</td>
    <td>Frontend (<code>App.jsx</code>) / Middleware RBAC</td>
    <td align="center"><img src="https://img.shields.io/badge/CERTIFICADO-brightgreen?style=flat-square" alt="CERTIFICADO"/></td>
    <td>Redirección verificada: Estudiante a Chat RAG/Ruta, Docente a Tablero, Admin a Consola. Acceso no autorizado bloqueado (<code>HTTP 403</code>).</td>
  </tr>
  <tr>
    <td><b>HU-29</b></td>
    <td><b>🚪 Cierre de Sesión en Servidor:</b> Invalidación de sesión activa en la BD y destrucción de estado local.</td>
    <td align="center">3 PH</td>
    <td>Backend (<code>/api/v1/auth/logout</code>) / Frontend (<code>Navegacion.jsx</code>)</td>
    <td align="center"><img src="https://img.shields.io/badge/CERTIFICADO-brightgreen?style=flat-square" alt="CERTIFICADO"/></td>
    <td>Petición <code>POST /logout</code> establece <code>fechaExpiracionToken = ahora(UTC)</code> en <code>sesiones_usuario</code>. Limpieza total de <code>localStorage</code>.</td>
  </tr>
  <tr>
    <td><b>HU-23</b></td>
    <td><b>👥 Consola de Administración de Usuarios:</b> CRUD completo, alta rápida, control de cédulas duplicadas y gestión de estados (<code>ACTIVO</code>, <code>BLOQUEADO</code>, <code>INACTIVO</code>).</td>
    <td align="center">5 PH</td>
    <td>Backend (<code>/api/v1/users</code>) / Frontend (<code>VistaConsolaAdministrador.jsx</code>)</td>
    <td align="center"><img src="https://img.shields.io/badge/CERTIFICADO-brightgreen?style=flat-square" alt="CERTIFICADO"/></td>
    <td>Alta de usuarios con clave inicial por defecto (<code>Tempo2026!</code>), rechazo <code>HTTP 409</code> por duplicados, desbloqueo con reseteo a 0 intentos y prevención de autobloqueo de Admin (<code>HTTP 409</code>).</td>
  </tr>
  <tr>
    <td><b>HU-32</b></td>
    <td><b>🛡️ Seudonimización LOPDP (SHA-256):</b> Hash unidireccional irreversible para aislar PII antes de la IA local.</td>
    <td align="center">3 PH</td>
    <td>Backend (<code>ServicioSeguridad</code> / <code>SesionUsuario</code>)</td>
    <td align="center"><img src="https://img.shields.io/badge/CERTIFICADO-brightgreen?style=flat-square" alt="CERTIFICADO"/></td>
    <td>Hash <code>SHA-256</code> con sal almacenado en <code>sesiones_usuario.pseudonimoHash</code>. Cero fuga de cédula, correo o nombres hacia AnythingLLM.</td>
  </tr>
</table>

> **Total certificado:** 4 + 3 + 3 + 5 + 3 = **18 Puntos de Historia** ✅

---

## 🧪 3. Resultados de Pruebas de Integración y Calidad (QA)

### 3.1 🔍 Verificación Manual

<details open>
<summary><b>🔑 1. Autenticación Multi-Rol</b></summary>

> Probado el ingreso con cuentas de Estudiante, Docente y Administrador. Redirección RBAC 100% funcional.

</details>

<details open>
<summary><b>🔒 2. Control de Bloqueo por Intentos Fallidos</b></summary>

> Verificado que al errar la clave 3 veces la cuenta pasa a estado `BLOQUEADO`. Se comprobó que el usuario bloqueado no puede ingresar hasta que el Administrador ejecute la acción de desbloqueo desde la Consola.

</details>

<details open>
<summary><b>🧹 3. Limpieza de Sesión en Logout</b></summary>

> Verificado mediante Herramientas de Desarrollador (`F12 -> Aplicación -> Local Storage`); todas las llaves de sesión y JWT se eliminan al hacer clic en "Cerrar Sesión".

</details>

<details open>
<summary><b>👥 4. Consola Admin & Persistencia MySQL</b></summary>

> Verificada la creación de usuarios con validación de cédula/correo único (`HTTP 409 Conflict`), renderizado de badges cromáticos por estado y refresco automático de la tabla desde MySQL sin Mocks.

</details>

### 3.2 🤖 Pruebas Automatizadas

| Suite | Cobertura | Status |
|:--|:--|:--:|
| 🐍 **Backend (`pytest`)** | Cobertura completa de modelos, cifrado `bcrypt`, tokens `JWT`, cálculo `SHA-256` LOPDP, login/logout, endpoints de usuarios y transiciones de estado. | ![PASS](https://img.shields.io/badge/100%25_PASS-VERDE-brightgreen?style=flat-square) |
| ⚛️ **Frontend (`vitest`)** | Pruebas de renderizado de componentes, captura de formularios, interceptores de cliente API, enrutamiento RBAC y sincronización de la Consola de Administración. | ![PASS](https://img.shields.io/badge/100%25_PASS-VERDE-brightgreen?style=flat-square) |

---

## 🏛️ 4. Gobernanza y Estándares de Arquitectura

| Ámbito | Estándar |
|:--|:--|
| 🔤 **Convención de Código** | 100% en español con sintaxis `camelCase` en DTOs y modelos JSON de la API REST. |
| 🗄️ **Persistencia Relacional** | Operatividad certificada sobre 20 tablas relacionales en MySQL (`tutoria_db`). |
| 🛡️ **Seguridad LOPDP** | Aislamiento total de PII en la capa RAG. |

---

## 🏁 5. Declaración de Cierre

> Con este reporte se declara oficialmente **CERRADO Y CONGELADO EL SPRINT 1**. El sistema se encuentra estable, seguro y listo para la integración del **Sprint 2: Motor de Orquestación Pedagógica y RAG Chino Mandarín (HSK1/A1)**.

<div align="center">

**TutorIA** · Spec-Driven Development · Sprint 0 + Sprint 1 ✅

---

[⬅️ Volver al README Principal](../README.md) | [📋 Ver Especificación del Sprint 1](../specs/002-sprint1-autenticacion/spec.md) | [🏗️ Ver Arquitectura del Proyecto](../README.md#️-arquitectura-y-estructura-del-proyecto)

</div>
