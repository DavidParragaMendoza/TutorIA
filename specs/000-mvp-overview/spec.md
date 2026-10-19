# Spec 000 — Visión General y Alcance Macro del MVP (TutorIA)

## Contexto y Objetivo Macro
El aprendizaje inicial de chino mandarín (nivel HSK1 / CEFR A1) en la educación superior presenta desafíos de continuidad debido a la brecha horaria con docentes nativos y la falta de práctica autónoma guiada. TutorIA nace para resolver esta problemática mediante una plataforma de orquestación pedagógica que subordina modelos de lenguaje de inteligencia artificial bajo reglas deterministas.

El objetivo de esta versión de Producto Mínimo Viable (MVP) es proporcionar una herramienta ligera y funcional enfocada estrictamente en el aprendizaje y repaso de vocabulario HSK1/A1 a través de un chat cerrado de opción múltiple alimentado por RAG, garantizando que la IA no alucine y ofreciendo un panel de monitoreo analítico básico para el docente.

## Usuarios y Roles (RBAC)
- **Estudiante**: Usuario principal que accede al chat cerrado de opción múltiple para repasar vocabulario HSK1/A1 sin entrada de texto libre.
- **Docente**: Usuario supervisor que visualiza las métricas de acierto/fallo y avance de sus alumnos, con capacidad de aprobar o ajustar rutas de aprendizaje con un solo clic.
- **Administrador**: Usuario técnico responsable de la creación de cuentas, asignación de roles e inspección de usuarios.

## Hoja de Ruta y Distribución del Alcance por Sprints (51 PH / 16 HUs)
La construcción del MVP abarca un total de 51 Puntos de Historia (PH) estructurados en 16 Historias de Usuario / Habilitadores Técnicos, distribuidos en 3 frentes paralelos (Frontend, Backend/Orquestador, Persistencia/RAG):

1. **Sprint 0: Cimientos y Fundamentos (6 PH)**
   - **HU-00A**: Modelo Lógico DER y configuración física de tablas en MySQL (3 PH).
   - **HU-00B**: Maquetación UI/UX en React basada en diseños de Google Stitch (3 PH).
2. **Sprint 1: Seguridad, Autenticación y RBAC (16 PH)**
   - Implementación del Login JWT (HU-01) (4 PH), Redirección por Rol (HU-02) (3 PH), Logout en servidor (HU-29) (3 PH), Seudonimización con hash SHA-256 (HU-32) (3 PH) y Consola de Administración de Usuarios (HU-23) (3 PH).
3. **Sprint 2: Core Conversacional, Motor de Reglas e Ingesta RAG (15 PH)**
   - Chat cerrado de opción múltiple (HU-07) (4 PH), Ingesta asíncrona `/api/v1/events` (HU-13) (3 PH), Motor de Reglas Pedagógicas HSK1 (HU-15) (4 PH) y Pipeline RAG con Chips de Contexto (HU-18) (4 PH).
4. **Sprint 3: Diagnóstico, Analítica Docente y Resiliencia (14 PH)**
   - Diagnóstico de Estado de Dominio (HU-25) (3 PH), Servicio de Explicación y Feedback (HU-17) (3 PH), Tablero Analítico Docente (HU-20) (3 PH), Aprobación de Ruta en 1-Clic (HU-21) (3 PH) y Modo Defensivo de Contingencia (HU-27) (3 PH).

---

## Requisitos Funcionales Macro (Notación EARS en Español)

### Autenticación y Seguridad (Épica 1)
- **RF-01 (HU-01)**: CUANDO un usuario (Estudiante, Docente o Administrador) ingrese credenciales válidas en la pantalla de inicio de sesión, EL SISTEMA autenticará la cuenta y retornará un token JWT cifrado.
- **RF-02 (HU-01)**: SI un usuario ingresa credenciales inválidas por 3 intentos consecutivos, ENTONCES EL SISTEMA bloqueará temporalmente el acceso por seguridad.
- **RF-03 (HU-02)**: MIENTRAS un usuario se autentique correctamente, EL SISTEMA lo redirigirá dinámicamente según su rol: al Chat de Vocabulario para Estudiantes, al Tablero Analítico para Docentes o a la Consola para Administradores.
- **RF-04 (HU-29)**: CUANDO un usuario autenticado solicite cerrar sesión mediante `/api/v1/logout`, EL SISTEMA invalidará el token JWT en el servidor y limpiará la sesión en el cliente.
- **RF-05 (HU-32)**: MIENTRAS se procese la autenticación de un estudiante, EL SISTEMA generará un hash SHA-256 con sal a partir de su ID para utilizarlo como seudónimo exclusivo en el contenedor de AnythingLLM.
- **RF-06 (HU-23)**: CUANDO el Administrador registre un nuevo usuario desde la consola indicando nombre, correo, cédula y rol, EL SISTEMA almacenará la cuenta en MySQL.

### Core Conversacional e Ingesta RAG (Épica 2)
- **RF-07 (HU-07)**: MIENTRAS el estudiante utilice el Chat de Vocabulario, EL SISTEMA mantendrá bloqueada la entrada de texto libre del teclado y presentará reactivos de opción múltiple generados por el pipeline RAG.
- **RF-08 (HU-07)**: CUANDO el estudiante seleccione la opción de respuesta en una pregunta, EL SISTEMA mostrará retroalimentación visual inmediata (color verde si es correcta) y enviará el evento de interacción al backend.
- **RF-09 (HU-13)**: CUANDO el backend reciba un payload JSON en el endpoint `/api/v1/events`, EL SISTEMA validará la estructura e insertará el registro en MySQL respondiendo HTTP 202 en menos de 1.0 segundo.
- **RF-10 (HU-15)**: MIENTRAS la tubería de procesamiento RAG intercepte un mensaje, EL SISTEMA filtrará y depurará cualquier palabra o estructura que exceda el catálogo oficial HSK1/A1.
- **RF-11 (HU-18)**: CUANDO el pipeline RAG consulte la base vectorial local (AnythingLLM), EL SISTEMA recuperará hasta 3 fragmentos (top_k=3, similitud ≥ 70%) e inyectará los Chips de Contexto con temperatura 0.0.

### Diagnóstico, Feedback y Resiliencia (Épica 3)
- **RF-12 (HU-25)**: CUANDO finalice un bloque de práctica, EL SISTEMA clasificará el estado de dominio del estudiante por término HSK1 (Débil, En Progreso, Dominado) en MySQL.
- **RF-13 (HU-17)**: CUANDO el estudiante cometa un error, EL SISTEMA entregará una explicación amigable limitada estrictamente al glosario HSK1 con una extensión máxima de 30 palabras.
- **RF-14 (HU-27)**: SI el contenedor local de AnythingLLM o la IA sufre una desconexión o supera un timeout de 3.0 segundos, ENTONCES EL SISTEMA activará el modo defensivo despachando reactivos estáticos de opción múltiple desde MySQL.
- **RF-15 (HU-20)**: MIENTRAS el docente consulte su tablero analítico, EL SISTEMA presentará el listado de alumnos con sus porcentajes de aciertos/fallos e indicadores visuales de riesgo en menos de 1.5 segundos.
- **RF-16 (HU-21)**: CUANDO el docente presione "Aprobar Avance" o "Asignar Repaso" en la tarjeta de un estudiante, EL SISTEMA actualizará de forma inmutable la ruta de estudio en MySQL en menos de 1.0 segundo.

---

## Requisitos No Funcionales Macro
- **RNF-01 (Portabilidad y Desacoplamiento)**: Arquitectura de 3 capas (React, FastAPI, MySQL/AnythingLLM) con comunicación exclusiva vía HTTPS/REST.
- **RNF-02 (Eficiencia y Latencia)**: Ingesta de eventos `/api/v1/events` en &lt; 1.0s (HTTP 202). Carga del tablero docente en &lt; 1.5s.
- **RNF-03 (Seguridad LOPDP)**: Seudonimización irreversible SHA-256 de identificadores antes de enviar consultas a la IA.
- **RNF-04 (Resiliencia y Fiabilidad)**: Timeout de 3.0s en el motor RAG/LLM con conmutación automática a preguntas estáticas de contingencia.
- **RNF-05 (Adecuación Pedagógica)**: Explicaciones formativas acotadas a HSK1/A1 con un máximo de 30 palabras.

---

## Casos Límite Cubiertos
- **Timeout o Saturación de GPU local**: Si AnythingLLM tarda más de 3.0 segundos en responder, se activa el modo defensivo despachando reactivos estáticos relacionales para evitar congelamientos.
- **Bloqueo por Intentos Fallidos**: Tras 3 intentos incorrectos de login, la cuenta se inhabilita temporalmente.
- **Similitud Vectorial Baja**: Si las búsquedas en AnythingLLM arrojan similitud menor al 70% (&lt;0.70), se aborta la inyección dinámica y se utiliza la plantilla estática A1.

---

## Fuera de Alcance del MVP (Postergado a Fase 2)
1. **Entorno 3D e Interacción con Avatares**: Escenas en Three.js, exploración de mundo abierto y misiones interactivas con NPCs.
2. **Evaluación de Voz y Pronunciación**: Procesamiento de audio con OpenAI Whisper.
3. **Reconocimiento y Trazado Hanzi**: Lienzo de dibujo digital y deconstrucción de trazos.
4. **Predictor de Machine Learning Complejo**: Sustituido en el MVP por el Motor de Reglas Pedagógicas deterministas.

---

## Criterios de Finalización (Definition of Done)
1. El 100% de los Requisitos Funcionales (RF-01 a RF-16) implementados y validados mediante pruebas automatizadas (`pytest` y `npm test`).
2. Cero fugas de datos personales hacia el contenedor de AnythingLLM (validación de hash SHA-256).
3. Piloto funcional de aula ejecutado sin congelamientos de pantalla ni excepciones no capturadas.

## Dudas Abiertas
- Ninguna. El alcance del MVP y las Historias de Usuario han sido homologados y consolidados por el equipo TECED.
