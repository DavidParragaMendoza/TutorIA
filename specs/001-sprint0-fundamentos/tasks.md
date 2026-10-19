# Lista de Tareas (tasks.md) — Sprint 0: Fundamentos y Cimientos

Este documento detalla la secuencia ordenada de tareas que la IA debe ejecutar para completar el Sprint 0. Sigue strictly la arquitectura desacoplada de 3 capas (`arquitetura.md`) y el principio SDD de **inspección y revisión previa antes de cualquier implementación**.

---

## Fase 1: Arquitectura Base y Entorno Virtual

- [x] **Tarea 1.1: Crear Estructura de Directorios del Proyecto**
  - Crear la jerarquía física de carpetas `/frontend`, `/backend` y `/database` respetando la especificación del documento maestro `arquitetura.md`.
  - Se agregó un archivo `.gitkeep` en cada directorio vacío para realizar el respaldo de la estructura en GitHub.

- [ ] **Tarea 1.2: Crear y Activar Entorno Virtual de Python**
  - Crear un entorno virtual aislado (`python3.12 -m venv venv`) dentro del directorio `/backend` para congelar versiones y evitar conflictos de librerías globales.
  - Activar el entorno virtual antes de instalar o ejecutar cualquier paquete Python.

- [ ] **Tarea 1.3: Configurar Dependencias del Backend**
  - Crear el archivo `backend/requirements.txt` especificando las librerías oficiales (`fastapi`, `sqlmodel`, `pymysql`, `uvicorn`, `pytest`, `python-dotenv`).
  - Instalar las dependencias dentro del entorno virtual activo.

- [ ] **Tarea 1.4: Inicializar Proyecto Frontend en React y Tailwind CSS**
  - Inicializar la estructura del proyecto React dentro de `/frontend`.
  - Configurar Tailwind CSS integrando la paleta de colores institucional Porcelana y Vermellón adaptada de las especificaciones de diseño.

---

## Fase 2: Inspección y Auditoría Previa (Plantillas y Base de Datos)

- [ ] **Tarea 2.1: Inspeccionar y Analizar Plantillas de Interfaz (Google Stitch)**
  - Revisar e inspeccionar detalladamente todos los archivos dentro de `plantillas/plantillas-front/` (`.html`, `DESIGN.md` e imágenes `.png`).
  - Identificar la jerarquía de etiquetas, clases de Tailwind CSS y la disposición de las 4 pantallas principales (Login, Chat Estudiante, Tablero Docente y Consola Administrador).

- [ ] **Tarea 2.2: Auditar e Inspeccionar la Definición de la Base de Datos (20 Entidades)**
  - Revisar e inspeccionar el esquema relacional de las 20 entidades definidas en la especificación y notas del proyecto.
  - Verificar minuciosamente los tipos de datos, llaves primarias, llaves foráneas, índices y restricciones de auditoría para asegurar la coherencia antes de codificar.

- [ ] **Tarea 2.3: Generar Reporte de Conformidad del Esquema Relacional**
  - Documentar la validación técnica de las 20 tablas (`Roles`, `Usuarios`, `UsuarioRol`, `Idiomas`, `Niveles`, `PeriodosAcademicos`, `InstitucionesAliadas`, `Modalidades`, `Cursos`, `Paralelos`, `Matriculas`, `SesionesUsuario`, `BloquesPractica`, `EventosInteraccion`, `EstadoDominioEstudiante`, `AuditoriaRutaAprendizaje`, `DetalleIntervencionGlosario`, `CategoriasGlosario`, `GlosarioHsk1`, `PreguntasContingenciaHsk1`).
  - Confirmar que la estructura esté libre de inconsistencias referenciales antes de la creación en MySQL.

---

## Fase 3: Implementación de Persistencia Relacional (SQLModel + MySQL)

- [ ] **Tarea 3.1: Configurar Conexión a MySQL con SQLModel**
  - Crear `backend/app/baseDatos/conexion.py` configurando el motor de SQLModel y la gestión de sesiones mediante `pymysql` usando variables de entorno.

- [ ] **Tarea 3.2: Crear Clases SQLModel en Python (20 Modelos)**
  - Una vez aprobada la auditoría de la Tarea 2.3, crear un archivo `.py` por cada entidad en `backend/app/modelos/` implementando las clases con la anotación `table=True` y la convención `camelCase` en español.

- [ ] **Tarea 3.3: Configurar Arranque de Inicialización en FastAPI**
  - Configurar el evento `startup` en `backend/app/main.py` para importar los 20 modelos e invocar `SQLModel.metadata.create_all(motorMysql)`.

- [ ] **Tarea 3.4: Inspección y Verificación Visual en phpMyAdmin**
  - Ejecutar el backend de FastAPI y verificar en la interfaz de phpMyAdmin que las 20 tablas relacionales hayan sido creadas físicamente en MySQL con sus llaves foráneas y tipos de datos correctos.

---

## Fase 4: Migración y Renderizado Frontend en React

- [ ] **Tarea 4.1: Crear Vistas Modularizadas en React**
  - Convertir las estructuras HTML inspeccionadas en la Tarea 2.1 en componentes de React ubicados en `frontend/src/vistas/`: `VistaAutenticacion.jsx`, `VistaChatEstudiante.jsx`, `VistaTableroDocente.jsx` y `VistaConsolaAdministrador.jsx`.

- [ ] **Tarea 4.2: Inyectar Datos Simulados (Mocks JSON)**
  - Crear archivos JSON con datos de prueba en `frontend/src/datosSimulados/` para alimentar el renderizado visual de cada vista antes de la conexión con la API real.

- [ ] **Tarea 4.3: Validar Renderizado Responsivo y Visual**
  - Ejecutar el servidor de desarrollo en React (`npm run dev`) y verificar que las 4 pantallas carguen correctamente en el navegador sin errores en la consola JavaScript.

---

## Fase 5: Pruebas y Validación de Reglas Innegociables

- [ ] **Tarea 5.1: Ejecutar Pruebas Unitarias del Backend**
  - Crear y ejecutar suite de pruebas con `pytest` para confirmar la instanciación e integridad de las 20 clases de SQLModel.

- [ ] **Tarea 5.2: Ejecutar Pruebas del Frontend**
  - Ejecutar `npm test` para asegurar que todos los componentes maquetados rendericen sin excepciones.

- [ ] **Tarea 5.3: Validar Reglas de Gobernanza de Código**
  - Verificar que todo el código, nombres de archivos, variables y comentarios estén en **español** con convención **`camelCase`**.
