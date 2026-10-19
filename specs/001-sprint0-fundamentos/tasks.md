# Lista de Tareas (tasks.md) — Sprint 0: Fundamentos y Cimientos

Este documento detalla la secuencia ordenada de tareas que la IA debe ejecutar para completar el Sprint 0. Sigue strictly la arquitectura desacoplada de 3 capas (`arquitetura.md`) y el principio SDD de **inspección y revisión previa antes de cualquier implementación**.

---

## Fase 1: Arquitectura Base y Entorno Virtual

- [x] **Tarea 1.1: Crear Estructura de Directorios del Proyecto**
  - Crear la jerarquía física de carpetas `/frontend`, `/backend` y `/database` respetando la especificación del documento maestro `arquitetura.md`.
  - Se agregó un archivo `.gitkeep` en cada directorio vacío para realizar el respaldo de la estructura en GitHub.

- [x] **Tarea 1.2: Crear y Activar Entorno Virtual de Python**
  - Crear un entorno virtual aislado (`python3.12 -m venv venv`) dentro del directorio `/backend` para congelar versiones y evitar conflictos de librerías globales.
  - Activar el entorno virtual antes de instalar o ejecutar cualquier paquete Python.

- [x] **Tarea 1.3: Configurar Dependencias del Backend**
  - Crear el archivo `backend/requirements.txt` especificando las librerías oficiales (`fastapi`, `sqlmodel`, `pymysql`, `uvicorn`, `pytest`, `python-dotenv`).
  - Instalar las dependencias dentro del entorno virtual activo.

- [x] **Tarea 1.4: Inicializar Proyecto Frontend en React y Tailwind CSS**
  - Inicializar la estructura del proyecto React dentro de `/frontend`.

---

## Fase 2: Inspección y Auditoría Previa (Plantillas y Base de Datos)

- [x] **Tarea 2.1: Inspeccionar y Analizar Plantillas de Interfaz (Google Stitch)**
  - Revisar e inspeccionar detalladamente todos los archivos dentro de `plantillas/plantillas-front/` (`.html`, `DESIGN.md` e imágenes `.png`).
  - Identificar la jerarquía de etiquetas, clases de Tailwind CSS y la disposición de las 4 pantallas principales (Login, Chat Estudiante, Tablero Docente y Consola Administrador).

  - [x] **Subtarea 2.1.1: Maquetar la pantalla 1 "Inicio de Sesión" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/1. InicioDeSesion/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Configurar los tokens de diseño (paleta Porcelana y Vermellón, tipografías y radios) en `frontend/src/index.css` mediante `@theme` de Tailwind CSS v4 y las fuentes en `frontend/index.html`.
    - Implementar la vista `frontend/src/vistas/VistaAutenticacion.jsx` (marca, tarjeta de autenticación, campos identificador/contraseña con alternancia de visibilidad, CTA "Ingresar", aviso de cifrado y pie institucional) y renderizarla desde `frontend/src/App.jsx`, sin conexión a la API todavía.
    - Validado con `npm run lint` (0 errores) y `npm run build` (compilación correcta).

  - [x] **Subtarea 2.1.2: Maquetar la pantalla 2 "Recuperación de Credenciales" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/2. Recuperación de Credenciales — TutorIA/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Implementar la vista `frontend/src/vistas/VistaRecuperacionCredenciales.jsx` (tarjeta con acento tricolor, marca de agua Tianzige, campo de correo institucional, aviso de vigencia de 15 minutos, banner de confirmación, botón con estados de envío/reenvío, módulo de validación criptográfica, enlaces de navegación y pie institucional) y renderizarla desde `frontend/src/App.jsx`, sin conexión a la API todavía.
    - Eliminar el año hardcodeado "2024" y toda referencia a la marca "KUMA HuáYu" en `VistaAutenticacion.jsx` y en la nueva vista, usando únicamente la marca "TutorIA".
    - Conectar la navegación local en `frontend/src/App.jsx`: la vista principal es `VistaAutenticacion` y su enlace "¿Olvidó su contraseña?" abre `VistaRecuperacionCredenciales`; el enlace "Volver al inicio de sesión" regresa a la vista principal.
    - Validado con `npm run lint` (0 errores y 0 advertencias) y `npm run build` (compilación correcta).

  - [x] **Subtarea 2.1.3: Maquetar la pantalla 3 "Ruta de Aprendizaje Individualizada" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/3. Ruta de Aprendizaje Individualizada — TutorIA/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Extraer módulos, nivel HSK1, porcentajes de progreso y estadísticas del estudiante a `frontend/src/datosSimulados/rutaAprendizajeMock.json`, dejando el JSX sin datos quemados.
    - Implementar `frontend/src/vistas/VistaRutaAprendizaje.jsx` consumiendo el JSON mediante estado (`useState`): cabecera del estudiante, camino sinuoso con nodo completado, nodo activo con tarjeta de práctica y nodos bloqueados, además de la navegación inferior.
    - Conectar la navegación en `frontend/src/App.jsx`: el inicio de sesión abre la ruta de aprendizaje, "Iniciar Práctica" navega al chat de vocabulario RAG y "Cerrar Sesión" regresa al login.
    - Verificar que no queden referencias a "KUMA HuáYu" ni años hardcodeados; la marca visible es "TutorIA".
    - Validado con `npm run lint` (0 errores y 0 advertencias) y `npm run build` (compilación correcta).

  - [x] **Subtarea 2.1.4: Maquetar la pantalla 4 "Chat Cerrado de Vocabulario RAG" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/4. Interfaz de Chat Cerrado de Vocabulario RAG/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Extraer el historial de chat, las preguntas de opción múltiple y las opciones HSK1 a `frontend/src/datosSimulados/chatVocabularioMock.json`, dejando el JSX sin datos quemados.
    - Implementar `frontend/src/vistas/VistaChatEstudiante.jsx` consumiendo el JSON mediante estado (`useState`): cabecera con módulo y progreso, historial pedagógico, identidad del tutor, tarjeta del reactivo con sinograma/pinyin/tono y audio nativo (Web Speech API `zh-CN`), panel de retroalimentación RAG, barra de entrada de texto deshabilitada (teclado bloqueado) y opciones de respuesta.
    - Simular el estado visual del reactivo con el mock: la opción correcta seleccionada se resalta en verde y despliega el panel de retroalimentación, mientras la opción incorrecta se marca en rojo; "Siguiente Pregunta" avanza al siguiente reactivo.
    - Crear `frontend/src/datosSimulados/usuariosAuthMock.json` con credenciales de prueba para los roles Estudiante (`carlos.bernabe` / `Estudiante123`), Docente (`maria.fernandez` / `Docente123`) y Administrador (`admin` / `Admin123`), validando el login simulado contra ese archivo.
    - Vincular la sesión simulada en `frontend/src/App.jsx` y propagar el usuario autenticado a `VistaRutaAprendizaje` y `VistaChatEstudiante` para reconocer el perfil, nombre e iniciales del estudiante; "Volver a Mi Ruta" y "Cerrar Sesión" quedan conectados.
    - Validado con `npm run lint` (0 errores y 0 advertencias) y `npm run build` (compilación correcta).

  - [x] **Subtarea 2.1.5: Maquetar la pantalla 5 "Panel de Monitoreo Analítico y Gobernanza Docente" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/5. Panel de Monitoreo Analítico y Gobernanza Docente — TutorIA/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Extraer la tabla de estudiantes, los porcentajes de aciertos/fallos, los niveles de riesgo semaforizados y las tarjetas de métricas (KPIs de cohorte) a `frontend/src/datosSimulados/estudiantesDocenteMock.json`, dejando el JSX sin datos quemados.
    - Reemplazar marcas antiguas por "TutorIA" y actualizar el periodo académico vigente (`Periodo Académico 2026-II`) y la fecha de sincronización.
    - Implementar `frontend/src/vistas/VistaTableroDocente.jsx` consumiendo el JSON mediante estado (`useState`): cabecera con perfil docente, selector de aula y búsqueda, banda de KPIs, pestañas de filtro con contadores, tabla de gobernanza con semáforo pedagógico, modal de intervención docente y notificación emergente.
    - Los botones de acción rápida ("Aprobar Avance", "Asignar Repaso" e "Intervenir Ruta") disparan estado local simulado (aprobaciones, notificación y modal) sin recargar la página.
    - Conectar la navegación en `frontend/src/App.jsx`: el inicio de sesión con rol Docente abre el tablero docente y "Cerrar Sesión" regresa al login.
    - Validado con `npm run lint` (0 errores y 0 advertencias) y `npm run build` (compilación correcta).

  - [x] **Subtarea 2.1.6: Maquetar la pantalla 6 "Consola de Administración Centralizada y Parámetros Técnicos de IA" en React**
    - Inspeccionar los insumos de `plantillas/plantillas-front/6. Consola de Administración Centralizada y Parámetros Técnicos de IA/` (`code.html`, `DESIGN.md`, `screen.png`).
    - Extraer la lista de usuarios del sistema (nombres, cédulas, correos, roles y estados) y los parámetros del motor de IA (endpoint RAG, timeout, token de Whisper, telemetría y estado del servicio) a `frontend/src/datosSimulados/usuariosAdminMock.json`.
    - Garantizar el nombre oficial "TutorIA" en encabezados, modales y credenciales (`tutoria.edu`), reemplazando toda referencia a "KUMA HuaYu", y fijar la marca de actualización de pesos en 2026.
    - Implementar `frontend/src/vistas/VistaConsolaAdministrador.jsx` consumiendo el JSON mediante estado (`useState`): barra lateral con marca y roles, pestañas "Gestión de Usuarios" (HU-23) y "Configuración IA" (HU-24), tabla de usuarios mapeada, buscador, filtro por rol, hero del motor RAG y tarjetas técnicas.
    - El formulario modal de "Nuevo Usuario" captura los datos en un estado temporal local (`formularioUsuario`), valida cédulas duplicadas contra el mock y reinicia sus campos al cerrarse.
    - Conectar la navegación en `frontend/src/App.jsx` mediante estados de navegación: cada rol autenticado abre su pantalla (Estudiante → Ruta de Aprendizaje, Docente → Tablero Docente, Administrador → Consola Administrador) y las 6 pantallas quedan enlazadas.
    - Validado con `npm run lint` (0 errores y 0 advertencias) y `npm run build` (compilación correcta).

- [x] **Tarea 2.2: Auditar e Inspeccionar la Definición de la Base de Datos (20 Entidades)**
  - Revisar e inspeccionar el esquema relacional de las 20 entidades definidas en la especificación y notas del proyecto.
  - Verificar minuciosamente los tipos de datos, llaves primarias, llaves foráneas, índices y restricciones de auditoría para asegurar la coherencia antes de codificar.

- [x] **Tarea 2.3: Generar Reporte de Conformidad del Esquema Relacional**
  - Documentar la validación técnica de las 20 tablas (`Roles`, `Usuarios`, `UsuarioRol`, `Idiomas`, `Niveles`, `PeriodosAcademicos`, `InstitucionesAliadas`, `Modalidades`, `Cursos`, `Paralelos`, `Matriculas`, `SesionesUsuario`, `BloquesPractica`, `EventosInteraccion`, `EstadoDominioEstudiante`, `AuditoriaRutaAprendizaje`, `DetalleIntervencionGlosario`, `CategoriasGlosario`, `GlosarioHsk1`, `PreguntasContingenciaHsk1`).
  - Confirmar que la estructura esté libre de inconsistencias referenciales antes de la creación en MySQL.
  - Reporte generado en `docs/REPORTE_CONFORMIDAD_BD_20_TABLAS.md`.

---

## Fase 3: Implementación de Persistencia Relacional (SQLModel + MySQL)

- [x] **Tarea 3.1: Configurar Conexión a MySQL con SQLModel**
  - Crear `backend/app/baseDatos/conexion.py` configurando el motor de SQLModel y la gestión de sesiones mediante `pymysql` usando variables de entorno.
  - Creado `backend/.env` con los parámetros locales de phpMyAdmin (`root` sin contraseña, base `tutoria_db`) y agregado `.env` al `.gitignore` raíz.
  - Validado que `conexion.py` compila e importa correctamente (`motorMysql` y `obtenerSesion`), sin errores.

- [x] **Tarea 3.2: Crear Clases SQLModel en Python (20 Modelos)**
  - Una vez aprobada la auditoría de la Tarea 2.3, crear un archivo `.py` por cada entidad en `backend/app/modelos/` implementando las clases con la anotación `table=True` y la convención `camelCase` en español.
  - Implementados los 20 modelos con tipos MySQL exactos, 130 columnas, 39 llaves foráneas `RESTRICT`/`RESTRICT`, 16 restricciones UNIQUE, CHECK, índices y auditoría conforme al reporte de conformidad.
  - Creado `backend/app/main.py` con la importación de las 20 entidades y `SQLModel.metadata.create_all(motorMysql)` en el evento `startup`.
  - Verificado en MySQL: 20 tablas físicas en `tutoria_db`, InnoDB y `utf8mb4_unicode_ci`; phpMyAdmin accesible y FastAPI responde correctamente en el arranque.

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
