# Especificación Canónica del Sistema — TutorIA MVP

> Este documento es la fuente única de verdad canónica para las capabilities puras de TutorIA en su fase de MVP. Cualquier propuesta de cambio en `openspec/changes/` debe contrastarse con este contrato.

---

## 1. Capabilities Puras del Sistema

### CAP-01: Autenticación, Seguridad y RBAC
El sistema gestiona el acceso seguro mediante credenciales únicas con roles estrictos: `Estudiante`, `Docente` y `Administrador`.
- Emisión de tokens JWT con algoritmo HS256 y expiración configurable.
- Bloqueo temporal de cuenta tras 3 intentos fallidos de autenticación.
- Revocación en servidor del token al invocar el endpoint de cierre de sesión (`/api/v1/logout`).
- Redirección automática al recurso correspondiente según el rol del usuario autenticado.

### CAP-02: Seudonimización y Privacidad LOPDP por Diseño
El sistema protege la privacidad de los estudiantes según la Ley Orgánica de Protección de Datos Personales (LOPDP).
- Generación de identificador seudónimo mediante hash SHA-256 más sal criptográfica secreta antes de enviar cualquier consulta al motor de IA AnythingLLM.
- Prohibición estricta de transmitir nombres, correos o números de cédula al contenedor vectorial o LLM.

### CAP-03: Chat Cerrado de Vocabulario HSK1/A1
El sistema provee una interfaz de práctica conversacional guiada para estudiantes.
- Teclado y campo de texto libre completamente deshabilitados para evitar desviaciones.
- Presentación de preguntas cerradas de opción múltiple con 3 distractores y 1 respuesta correcta.
- Retroalimentación formativa inmediata (indicador visual de color y explicación breve de hasta 30 palabras).
- Transmisión en tiempo real de eventos de interacción al backend vía `/api/v1/events`.

### CAP-04: Orquestación Pedagógica y Motor de Reglas
El sistema subordina los modelos de lenguaje de inteligencia artificial a reglas pedagógicas deterministas de FastAPI.
- Filtrado estricto de vocabulario limitado al catálogo oficial HSK1/CEFR A1.
- Tubería de validación previa antes de desplegar cualquier reactivo generado por la IA.
- Control determinista del flujo de aprendizaje: la IA propone contenido, pero FastAPI decide qué mostrar.

### CAP-05: Ingesta y Recuperación Aumentada (Pipeline RAG)
El sistema conecta con un contenedor local de AnythingLLM en Docker para recuperar fragmentos contextuales de estudio.
- Búsqueda semántica con recuperación de hasta 3 fragmentos (`top_k=3`) con umbral de similitud ≥ 70%.
- Inyección de Chips de Contexto con temperatura 0.0 para anular la alucinación de la IA.
- Modo de contingencia defensivo: ante fallas o latencia mayor a 3.0 segundos de AnythingLLM, despacho inmediato de preguntas estáticas prealmacenadas en MySQL.

### CAP-06: Diagnóstico de Dominio y Analítica Docente
El sistema registra la trazabilidad de interacción y calcula el estado de aprendizaje.
- Clasificación del nivel de dominio por término HSK1: `Débil`, `En Progreso` y `Dominado`.
- Panel analítico para docentes con métricas consolidadas de aciertos/fallos por estudiante y grupo.
- Capacidad de aprobación o ajuste de la ruta individualizada de aprendizaje en un solo clic.

### CAP-07: Consola de Administración Centralizada
El sistema ofrece al rol Administrador la gestión integral de cuentas y parámetros operativos.
- Registro, edición y cambio de estado de usuarios en MySQL.
- Monitoreo del estado del servicio de IA local y parámetros del motor RAG.

---

## 2. Requerimientos Canónicos en Notación EARS

### REQ-SEC-01 (Autenticación Exitosa)
CUANDO un usuario proporcione credenciales válidas en `/api/v1/login`, el sistema DEBE retornar un token JWT con el rol y el tiempo de expiración.

### REQ-SEC-02 (Protección contra Fuerza Bruta)
SI un usuario falla 3 intentos consecutivos de autenticación, ENTONCES el sistema DEBE bloquear temporalmente el acceso por seguridad.

### REQ-SEC-03 (Seudonimización LOPDP)
MIENTRAS se envíe una solicitud al motor AnythingLLM, el sistema DEBE seudonimizar el identificador del estudiante mediante SHA-256 con sal criptográfica sin incluir ningún dato de identidad personal.

### REQ-CHAT-01 (Restricción de Texto Libre)
MIENTRAS el estudiante permanezca en la pantalla de chat de vocabulario, el sistema DEBE mantener desactivado el teclado y la entrada de texto libre, permitiendo únicamente la selección de opciones de respuesta.

### REQ-RAG-01 (Tolerancia a Fallos y Modo Defensivo)
SI la respuesta de AnythingLLM supera el umbral de 3.0 segundos o el contenedor está inalcanzable, ENTONCES el sistema DEBE conmutar automáticamente a reactivos estáticos validados desde MySQL.

### REQ-DOC-01 (Monitoreo Docente)
MIENTRAS el docente consulte su tablero analítico, el sistema DEBE presentar el listado de alumnos con sus porcentajes de aciertos y fallos en un tiempo inferior a 1.5 segundos.
