# Constitución del Proyecto — TutorIA MVP Orquestación

Principios innegociables. Toda especificación (`specs/`), plan y tarea debe cumplirlos estrictamente.

1. **Simplicidad y Foco Estricto en el MVP**:
   El alcance se limita exclusivamente al repaso de vocabulario HSK1/A1 mediante un chat cerrado de opción múltiple alimentado por RAG, autenticación JWT (RBAC) y un tablero de monitoreo docente básico. Queda estrictamente prohibido incluir módulos 3D, evaluación de voz (Whisper) o trazado de caracteres Hanzi.

2. **La Especificación Manda (`Spec-Anchored`)**:
   Ningún comportamiento, modelo o endpoint se implementa si no está formalmente definido en la especificación activa (`specs/`). Si se identifica una ambigüedad o falta una decisión técnica, la IA debe detener el trabajo y consultar antes de asumir soluciones.

3. **Arquitectura Desacoplada de 3 Capas**:
   Existe una separación absoluta de responsabilidades entre Presentación (`/frontend` en React), Negocio/Orquestación (`/backend` en FastAPI) y Persistencia (`/database` con SQLModel/MySQL y AnythingLLM). La lógica pedagógica no debe depender directamente de los componentes de interfaz.

4. **Pruebas como Puerta de Salida**:
   Toda tarea finaliza únicamente cuando sus pruebas automatizadas (`pytest` en backend y `npm test` en frontend) estén en verde. Queda prohibido dar por concluida una tarea con pruebas fallidas.

5. **Gobernanza Pedagógica y Privacidad por Diseño**:
   El modelo de IA actuará subordinado a las reglas pedagógicas deterministas de FastAPI. Por protección de datos (LOPDP), jamás se enviarán nombres ni identificadores reales de estudiantes al contenedor de AnythingLLM; se aplicará siempre seudonimización mediante hash SHA-256.

6. **Idioma y Convención Única**:
   Todo el código fuente (variables, funciones, métodos, clases y comentarios), así como la documentación técnica e interfaz de usuario, debe estar en **español** utilizando de forma estricta la convención **`camelCase`** (ejemplos: `usuarioId`, `obtenerRespuestaRag`).