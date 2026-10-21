# Arquitectura — TutorIA MVP

> Este documento define el estándar arquitectónico y de calidad de TutorIA. Toda revisión técnica se evalúa contra las definiciones aquí descritas.

---

## 1. Principios Arquitectónicos

1. **Separación Estricta de 3 Capas**:
   - **Nivel de Presentación (`/frontend`)**: Aplicación SPA en React 18/19 con Vite y Tailwind CSS. No contiene lógica de negocio ni llamadas directas a base de datos.
   - **Nivel de Aplicación y Orquestación (`/backend`)**: API asíncrona en FastAPI (Python 3.12/3.14) con módulos de servicio pedagógico y pipeline RAG.
   - **Nivel de Persistencia (`/database`)**: Persistencia relacional en MySQL 8.0 gestionada mediante el ORM SQLModel (visualmente inspeccionable en phpMyAdmin) y almacenamiento vectorial local en AnythingLLM vía Docker.

2. **Gobernanza Pedagógica y Subordinación de la IA**:
   - El modelo de lenguaje local no tiene autonomía de decisión curricular.
   - FastAPI actúa como orquestador determinista: valida, filtra y decide qué preguntas o explicaciones se muestran al estudiante según el nivel HSK1/A1.

3. **Privacidad por Diseño (Cumplimiento LOPDP)**:
   - Los datos de filiación del estudiante (nombre, correo, cédula) permanecen aislados en MySQL.
   - Para las interacciones con AnythingLLM, el estudiante se identifica exclusivamente por un hash SHA-256 generado con una sal secreta del servidor.

4. **Resiliencia y Modo Defensivo**:
   - Si AnythingLLM presenta una latencia mayor a 3.0 segundos o se encuentra inalcanzable, el backend conmutará automáticamente a un banco de preguntas estáticas preaprobadas en MySQL, evitando tiempos muertos para el estudiante.

---

## 2. Flujo de Datos

```
┌────────────────────────────────────────────────────────┐
│                   Cliente Web (React)                  │
│    Chat Cerrado HSK1 · Tablero Docente · Consola Admin │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (JSON camelCase)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│        Controladores REST (/api/v1/...)                │
│                            │                           │
│        Servicios de Negocio / Orquestador              │
│        (Reglas Pedagógicas, Ingesta, Diagnóstico)      │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       SQLModel │                        │ SHA-256 + Context Chips
        (PyMySQL│                        │ REST API (top_k=3)
                ▼                        ▼
┌───────────────────────┐        ┌───────────────────────┐
│     MySQL 8.0         │        │ AnythingLLM (Docker)  │
│  Tablas Relacionales  │        │  Vectores HSK1 Local  │
│  (Métricas y Cuentas) │        │  (Embeddings / RAG)   │
└───────────────────────┘        └───────────────────────┘
```

---

## 3. Qué NO Hacer (Anti-Patrones Prohibidos)

- ❌ No realizar consultas directas a base de datos desde el frontend.
- ❌ No transmitir datos de identidad personal (nombres, correos) hacia AnythingLLM.
- ❌ No incluir funcionalidades fuera de alcance (3D, Whisper, trazado Hanzi).
- ❌ No mezclar convenciones de nombres (evitar `snake_case` en nombres de variables o respuestas de API).
- ❌ No permitir entrada de texto libre en el teclado del estudiante durante el chat de vocabulario.
