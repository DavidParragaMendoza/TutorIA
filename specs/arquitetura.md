```text
├── frontend/                   # Nivel de Presentación (N-Tier)
│   └── web/                    # Panel analítico y control docente
├── backend/                    # Nivel de Aplicación (N-Tier)
│   ├── api/                    # Puntos de acceso asíncronos
│   ├── servicios_modulos/      # Arquitectura Basada en Servicios
│   │   ├── ingesta_validacion/
│   │   ├── modelo_estudiante/
│   │   ├── diagnostico/
│   │   ├── predictor/
│   │   ├── motor_reglas/
│   │   ├── motor_decision/
│   │   ├── recomendador/
│   │   ├── explicacion/
│   │   └── registro_analitica/
│   └── pipeline_rag/           # Arquitectura Tuberías y Filtros
│       ├── filtro_nivel_a1.py
│       ├── inyector_vectores.py
│       ├── chips_contexto.py
│       ├── deconstruccion_logo.py
│       └── llm_core.py
└── database/                   # Nivel de Datos (N-Tier)
    ├── relacional/             # Trazabilidad, métricas y progreso
    └── vectorial/              # Biblioteca local de fragmentos RAG
```

## 📁 Estructura por Sub-Carpetas

**1. Nivel de Presentación:** `/frontend`

```text
frontend/
└── web/            # Interfaz del panel analítico para docentes
```

**2. Nivel de Aplicación o Negocio:** `/backend`

```text
backend/
├── api/                    # Endpoints asíncronos REST/WebSocket
├── servicios_modulos/      # Arquitectura Basada en Servicios
│   ├── ingesta_validacion/
│   ├── modelo_estudiante/
│   ├── diagnostico/
│   ├── predictor/
│   ├── motor_reglas/
│   ├── motor_decision/
│   ├── recomendador/
│   ├── explicacion/
│   └── registro_analitica/
└── pipeline_rag/           # Arquitectura de Tuberías y Filtros
    ├── filtro_nivel_a1.py
    ├── inyector_vectores.py
    ├── chips_contexto.py
    ├── deconstruccion_logo.py
    └── llm_core.py
```

**3. Nivel de Datos:** `/database`

```text
database/
├── relacional/     # Tablas/Esquemas inmutables de métricas y progreso
└── vectorial/      # Colecciones vectorizadas oficiales para el motor RAG
```