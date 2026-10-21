<div align="center">

# 📚 TutorIA

### Sistema de Orquestación Pedagógica para el Aprendizaje de Chino Mandarín (HSK1/A1)



<br/>

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Metodología](https://img.shields.io/badge/Metodolog%C3%ADa-Spec--Driven_Development-8A2BE2?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-100%25_Passing-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)

<br/>

> **Metodología:** Spec-Driven Development (SDD) & Test-Driven Development (TDD)
> **Estado del Proyecto:** ✅ Sprint 0 y Sprint 1 Completados (100% Tests en Verde)

<a href="./docs/REPORTE_CIERRE_SPRINT0_SPRINT1.md"><img src="https://img.shields.io/badge/%F0%9F%93%84_Ver_Reporte_de_Cierre_Oficial_(Sprints_0_%26_1)_%E2%86%92-brightgreen?style=for-the-badge" alt="Ver Reporte de Cierre Oficial"/></a>

</div>

---

TutorIA es un sistema web de orquestación pedagógica diseñado para asistir a estudiantes hispanohablantes en el aprendizaje del idioma Chino Mandarín en nivel HSK1/A1. Integra una arquitectura de tres capas (React + FastAPI + MySQL) acoplada con un motor de Inteligencia Artificial local (AnythingLLM/RAG), protegiendo la identidad del estudiante bajo la Ley Orgánica de Protección de Datos Personales (LOPDP).

## 📑 Tabla de Contenidos

[🛠️ Stack](#️-stack-tecnológico) · [🏗️ Arquitectura](#️-arquitectura-y-estructura-del-proyecto) · [🚀 Sprints](#-estado-de-implementación-de-sprints) · [⚙️ Instalación](#️-guía-de-instalación-y-despliegue-local) · [🧪 Pruebas](#-ejecución-de-pruebas-automáticas) · [📋 Gobernanza](#-gobernanza-de-código)

---

## 🛠️ Stack Tecnológico

<table>
  <tr>
    <th align="left">Capa</th>
    <th align="left">Tecnologías</th>
  </tr>
  <tr>
    <td>🎨 <b>Frontend</b></td>
    <td>React 18, Vite, Tailwind CSS, Axios/Fetch API, Vitest</td>
  </tr>
  <tr>
    <td>⚡ <b>Backend</b></td>
    <td>Python 3.12, FastAPI, SQLModel (ORM), PyJWT, Passlib (bcrypt), Pytest</td>
  </tr>
  <tr>
    <td>🗄️ <b>Base de Datos</b></td>
    <td>MySQL 8.0 / phpMyAdmin (20 tablas relacionales)</td>
  </tr>
  <tr>
    <td>🔐 <b>Seguridad & IA</b></td>
    <td>Cifrado SHA-256 + Sal criptográfica (LOPDP), Tokens JWT (HS256), AnythingLLM RAG Local</td>
  </tr>
</table>

---

## 🏗️ Arquitectura y Estructura del Proyecto

El repositorio está organizado bajo una arquitectura modular estricta de tres capas con metodología Spec-Driven Development:

```text
tutoria/
├── backend/                  # Servidor de API REST en FastAPI
│   ├── app/
│   │   ├── api/v1/           # Endpoints de autenticación y usuarios
│   │   ├── baseDatos/        # Conexión MySQL y script de seeding
│   │   ├── esquemas/         # DTOs Pydantic (100% camelCase)
│   │   ├── modelos/          # 20 Entidades relacionales SQLModel
│   │   ├── seguridad/        # Cifrado bcrypt, JWT y Hash LOPDP
│   │   └── servicios/        # Lógica de negocio de Login, RBAC y Consola
│   └── tests/                # Pruebas integradas y unitarias con Pytest
├── frontend/                 # Cliente SPA en React
│   ├── src/
│   │   ├── contexto/         # Estado global de autenticación
│   │   ├── servicios/        # Interceptores Axios y cliente HTTP
│   │   ├── vistas/           # Componentes de UI (Login, Chat, Tablero, Consola)
│   │   └── tests/            # Pruebas de componentes con Vitest
└── specs/                    # Especificaciones formales SDD
    ├── 000-mvp-overview/     # Visión general del MVP
    ├── 001-sprint0-fundamentos/# Spec, Plan y Tasks del Sprint 0
    └── 002-sprint1-autenticacion/# Spec, Plan y Tasks del Sprint 1
```

---

## 🚀 Estado de Implementación de Sprints

<div align="center">

### 🎓 Certificación de Sprint

> Las **5 Historias de Usuario** (HU-01, HU-02, HU-29, HU-23 y HU-32), el testeo de seguridad y la conformidad **LOPDP** están certificados en el reporte oficial de cierre.

**[📄 Ver Reporte de Cierre Oficial (Sprints 0 & 1) →](./docs/REPORTE_CIERRE_SPRINT0_SPRINT1.md)**

</div>

<details open>
<summary><b>✅ Sprint 0 — Fundamentos, Scaffolding y Persistencia</b> <i>(Certificado)</i></summary>
<br/>

| Componente | Detalle |
|:--|:--|
| 🗄️ **Base de Datos** | 20 tablas relacionales mapeadas en SQLModel/MySQL (`usuarios`, `roles`, `sesiones_usuario`, `glosario_hsk1`, etc.). |
| 🖥️ **Interfaz de Usuario** | Maquetación responsiva con Tailwind CSS de las 4 pantallas clave (Login, Chat Estudiante, Tablero Docente, Consola Admin). |

</details>

<details open>
<summary><b>✅ Sprint 1 — Autenticación, Seguridad, RBAC y LOPDP</b> <i>(Certificado)</i></summary>
<br/>

| Historia | Descripción |
|:--|:--|
| 🔑 **HU-01 (Login & Bloqueo)** | Autenticación con contraseña `bcrypt`, emisión de tokens JWT y bloqueo automático de cuenta tras 3 intentos fallidos. |
| 🧭 **HU-02 (RBAC & Redirección)** | Enrutamiento dinámico según rol (`ESTUDIANTE` → Chat/Ruta, `DOCENTE` → Tablero, `ADMINISTRADOR` → Consola). |
| 🚪 **HU-29 (Logout Servidor)** | Invalidación activa de sesión en base de datos y limpieza de almacenamiento en cliente (`localStorage`). |
| 👥 **HU-23 (Consola Admin CRUD)** | Alta de usuarios, validación de cédula/correo duplicados (HTTP 409), gestión de estados (`ACTIVO`, `BLOQUEADO`, `INACTIVO`), reseteo de intentos y prevención de autobloqueo de Admin. |
| 🛡️ **HU-32 (Seudonimización LOPDP)** | Hash SHA-256 unidireccional con sal criptográfica para aislar la PII del estudiante antes de interacciones con IA local. |

</details>

---

## ⚙️ Guía de Instalación y Despliegue Local

### 1️⃣ Requisitos Previos

> - 🐍 Python >= 3.12
> - 🟢 Node.js >= 18.0
> - 🐬 MySQL Server 8.0 / XAMPP phpMyAdmin

### 2️⃣ Configuración del Backend (FastAPI)

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Crear archivo `.env` en `/backend`:

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/tutoria_db
JWT_SECRET_KEY=clave_secreta_jwt_desarrollo_256bits
SAL_LOPDP_SECRET=sal_criptografica_secreta_lopdp_2026
```

Ejecutar servidor de desarrollo con seeding automático:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3️⃣ Configuración del Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Ejecución de Pruebas Automáticas

<table>
<tr>
<td width="50%" valign="top">

### 🐍 Backend (Pytest)

```bash
cd backend
pytest -v
```

</td>
<td width="50%" valign="top">

### ⚛️ Frontend (Vitest)

```bash
cd frontend
npm run test
```

</td>
</tr>
</table>

---

## 📋 Gobernanza de Código

> 🔤 **Idioma y Convenciones:** 100% de variables, funciones, endpoints y DTOs redactados en **Español** usando la convención **`camelCase`**.

> 📐 **Metodología:** Ningún código se escribe sin especificación previa (`spec.md`) y plan congelado (`plan.md`).

---
