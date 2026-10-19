# AGENTS.md — TutorIA MVP Orquestación

## Proyecto
TutorIA es un sistema de orquestación pedagógica para la enseñanza y repaso de vocabulario de chino mandarín nivel HSK1/A1.
En esta fase de MVP, la plataforma ofrece un chat cerrado con preguntas de opción múltiple apoyado en un motor RAG local, un panel analítico básico para docentes y una consola de administración con control de acceso basado en roles (RBAC).

El sistema opera sobre una arquitectura de 3 capas bien delimitadas:
- `/frontend`: Interfaz de usuario desarrollada en React.
- `/backend`: API asíncrona desarrollada en FastAPI (Python 3.12) con un orquestador de reglas pedagógicas.
- `/database`: Persistencia relacional en MySQL mediante el ORM SQLModel (gestionable visualmente en phpMyAdmin) y almacenamiento vectorial local en AnythingLLM mediante Docker.

## Estructura de Carpetas
- `ProyectoOrquestacion/frontend`: Código fuente del cliente web en React.
- `ProyectoOrquestacion/backend`: Lógica de negocio, controladores de FastAPI, modelos de datos y tuberías de orquestación.
- `ProyectoOrquestacion/database`: Entidades y modelos ORM en SQLModel, configuración de conexión a MySQL y scripts de datos iniciales.

## Stack Tecnológico Oficial
- **Frontend**: React.
- **Backend**: FastAPI (Python 3.12).
- **Persistencia Relacional**: MySQL con ORM **SQLModel**.
- **Motor RAG / IA**: Contenedor local de AnythingLLM en Docker ejecutando el modelo de IA local configurado.

## Comandos de Desarrollo
- Servidor Backend: `uvicorn app.main:app --reload`
- Servidor Frontend: `npm run dev`
- Pruebas Backend: `pytest`
- Pruebas Frontend: `npm test`

## Estilo y Convenciones de Código
- **Idioma del Código**: Todo el código (variables, funciones, métodos, clases y comentarios) debe redactarse en **español**.
- **Convención de Sintaxis**: Utilizar **`camelCase`** de manera uniforme en variables, nombres de funciones, clases y métodos (ejemplos: `usuarioId`, `obtenerRespuestaRag`, `evaluarPuntaje`).
- **Idioma de Interfaz**: Textos de UI, mensajes de error y explicaciones pedagógicas en **español** (a menos que corresponda a caracteres o pinyin de chino mandarín HSK1 propios del contenido de estudio).
- **Formato de Respuestas API**: JSON con claves en **`camelCase`** para mantener coherencia entre FastAPI (SQLModel) y React.

## Reglas Innegociables
1. **Consulta Previa**: Revisa `docs/constitution.md` y la especificación técnica activa en `specs/` antes de escribir o modificar código.
2. **Límites Estrictos del MVP**: Queda totalmente prohibido agregar características fuera de alcance como entornos 3D, evaluación de voz con Whisper o trazado de caracteres Hanzi.
3. **Desarrollo Guiado por Especificación (Spec-Anchored)**: El código debe ser fiel reflejo de la especificación. Si se identifica un cambio necesario durante la implementación, la especificación en `specs/` debe actualizarse primero.
4. **Privacidad de Datos**: No enviar nombres ni datos identificables de estudiantes al contenedor de AnythingLLM. Aplicar siempre el hash SHA-256 para seudonimizar el identificador del estudiante.
5. **Gestión de Base de Datos**: Definir la estructura relacional mediante clases de **SQLModel** en Python para que FastAPI genere automáticamente las tablas en MySQL, permitiendo su inspección visual directa en phpMyAdmin.

## Instrucciones al Finalizar Tareas
- Verificar que el código no contenga errores de sintaxis o ejecución.
- Validar que los campos de los modelos SQLModel coincidan exactamente con los requerimientos de la especificación.
- Ejecutar las pruebas unitarias correspondientes (`pytest` / `npm test`).