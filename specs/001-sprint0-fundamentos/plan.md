# Plan de Diseño Técnico — Sprint 0: Fundamentos y Cimientos

## Referencia Arquitectónica
Este plan se fundamenta strictly en la estructura desacoplada de 3 capas (`/frontend`, `/backend`, `/database`) definida en el documento maestro `arquitetura.md`.

---

## 1. Estructura Física de Archivos para el Sprint 0

Para este Sprint 0, la estructura completa de carpetas y archivos en el repositorio será la siguiente:

```text
ProyectoOrquestacion/
├── plantillas/
│   └── plantillas-front/                     # Archivos HTML, Tailwind CSS y capturas Stitch
├── backend/
│   ├── app/
│   │   ├── main.py                           # Invocación de creación de tablas al iniciar
│   │   ├── baseDatos/
│   │   │   └── conexion.py                   # Motor SQLModel y sesión MySQL
│   │   └── modelos/                          # Mapeo ORM completo de las 20 entidades
│   │       ├── rol.py                        # 1. Entidad Roles
│   │       ├── usuario.py                    # 2. Entidad Usuarios
│   │       ├── usuarioRol.py                 # 3. Entidad Usuario_Rol
│   │       ├── idioma.py                     # 4. Entidad Idiomas
│   │       ├── nivel.py                      # 5. Entidad Niveles
│   │       ├── periodoAcademico.py           # 6. Entidad Periodos_Academicos
│   │       ├── institucionAliada.py          # 7. Entidad Instituciones_Aliadas
│   │       ├── modalidad.py                  # 8. Entidad Modalidades
│   │       ├── curso.py                      # 9. Entidad Cursos
│   │       ├── paralelo.py                   # 10. Entidad Paralelos
│   │       ├── matricula.py                  # 11. Entidad Matriculas
│   │       ├── sesionUsuario.py              # 12. Entidad Sesiones_Usuario
│   │       ├── bloquePractica.py             # 13. Entidad Bloques_Practica
│   │       ├── eventoInteraccion.py          # 14. Entidad Eventos_Interaccion
│   │       ├── estadoDominioEstudiante.py    # 15. Entidad Estado_Dominio_Estudiante
│   │       ├── auditoriaRutaAprendizaje.py   # 16. Entidad Auditoria_Ruta_Aprendizaje
│   │       ├── detalleIntervencionGlosario.py# 17. Entidad Detalle_Intervencion_Glosario
│   │       ├── categoriaGlosario.py          # 18. Entidad Categorias_Glosario
│   │       ├── glosarioHsk1.py               # 19. Entidad Glosario_HSK1
│   │       └── preguntaContingenciaHsk1.py   # 20. Entidad Preguntas_Contingencia_HSK1
│   └── requirements.txt                      # fastapi, sqlmodel, pymysql, pytest
└── frontend/
    ├── src/
    │   ├── componentes/                      # Botones, tarjetas y contenedores
    │   ├── vistas/                           # Autenticación, Chat, Tablero, Consola
    │   ├── datosSimulados/                   # Mocks JSON para validación visual
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json                          # React, Tailwind CSS, Vite
```

---

## 2. Estrategia de Persistencia Relacional (HU-00A)

### Configuración del Motor SQLModel
1. **Conexión a MySQL**:
   - En `backend/app/baseDatos/conexion.py` se configurará la conexión de SQLModel apuntando a MySQL mediante el conector `pymysql`.
   - Se gestionará la cadena de conexión mediante variables de entorno locales adaptadas para la inspección directa en phpMyAdmin.

2. **Mapeo Explícito de las 20 Entidades en Python**:
   Se creará un archivo `.py` independiente por cada entidad dentro de `backend/app/modelos/`, implementando las 20 clases con la anotación `table=True` y la convención `camelCase` en español:
   - `rol.py`: Clase `Rol` (tabla `roles`).
   - `usuario.py`: Clase `Usuario` (tabla `usuarios`).
   - `usuarioRol.py`: Clase `UsuarioRol` (tabla `usuario_rol`).
   - `idioma.py`: Clase `Idioma` (tabla `idiomas`).
   - `nivel.py`: Clase `Nivel` (tabla `niveles`).
   - `periodoAcademico.py`: Clase `PeriodoAcademico` (tabla `periodos_academicos`).
   - `institucionAliada.py`: Clase `InstitucionAliada` (tabla `instituciones_aliadas`).
   - `modalidad.py`: Clase `Modalidad` (tabla `modalidades`).
   - `curso.py`: Clase `Curso` (tabla `cursos`).
   - `paralelo.py`: Clase `Paralelo` (tabla `paralelos`).
   - `matricula.py`: Clase `Matricula` (tabla `matriculas`).
   - `sesionUsuario.py`: Clase `SesionUsuario` (tabla `sesiones_usuario`).
   - `bloquePractica.py`: Clase `BloquePractica` (tabla `bloques_practica`).
   - `eventoInteraccion.py`: Clase `EventoInteraccion` (tabla `eventos_interaccion`).
   - `estadoDominioEstudiante.py`: Clase `EstadoDominioEstudiante` (tabla `estado_dominio_estudiante`).
   - `auditoriaRutaAprendizaje.py`: Clase `AuditoriaRutaAprendizaje` (tabla `auditoria_ruta_aprendizaje`).
   - `detalleIntervencionGlosario.py`: Clase `DetalleIntervencionGlosario` (tabla `detalle_intervencion_glosario`).
   - `categoriaGlosario.py`: Clase `CategoriaGlosario` (tabla `categorias_glosario`).
   - `glosarioHsk1.py`: Clase `GlosarioHsk1` (tabla `glosario_hsk1`).
   - `preguntaContingenciaHsk1.py`: Clase `PreguntaContingenciaHsk1` (tabla `preguntas_contingencia_hsk1`).

3. **Inicialización Automática del Esquema**:
   - En `backend/app/main.py`, la función de arranque (`startup`) importará las 20 entidades e invocará `SQLModel.metadata.create_all(motorMysql)`.

4. **Verificación Visual**:
   - Se abrirá la interfaz de phpMyAdmin para confirmar que las 20 tablas, sus atributos, tipos de datos e índices coincidan exactamente con la especificación.

---

## 3. Estrategia de Adaptación de Frontend (HU-00B)

### Inspección y Extracción de Insumos
1. **Procesamiento de Plantillas Stitch**:
   - Se inspeccionarán los archivos `.html` y el archivo `DESIGN.md` ubicados en `plantillas/plantillas-front/` para extraer las clases de Tailwind CSS y la paleta cromática Porcelana y Vermellón.
2. **Configuración de Tailwind CSS en React**:
   - Se integrará Tailwind CSS en `/frontend` configurando los colores y tipografías requeridas.

### Creación de Componentes y Vistas Modularizadas
1. **Estructuración de Vistas en React (`frontend/src/vistas/`)**:
   - `VistaAutenticacion.jsx`: Adaptación de la pantalla de inicio de sesión.
   - `VistaChatEstudiante.jsx`: Adaptación del chat cerrado con teclado bloqueado y tarjetas de preguntas de opción múltiple.
   - `VistaTableroDocente.jsx`: Adaptación del panel de monitoreo con tabla de estudiantes e indicadores semaforizados.
   - `VistaConsolaAdministrador.jsx`: Adaptación del directorio de usuarios y modales.
2. **Inyección de Datos Simulados (`frontend/src/datosSimulados/`)**:
   - Se crearán archivos JSON locales con datos simulados de prueba para alimentar el renderizado visual de cada pantalla antes de la integración con el backend.

---

## 4. Plan de Pruebas y Criterios de Calidad

1. **Pruebas de Backend (`pytest`)**:
   - Verificación de que las 20 clases de SQLModel instancian correctamente y que la conexión a MySQL no presenta errores.
2. **Pruebas de Frontend (`npm test`)**:
   - Verificación de que las 4 vistas de React renderizan correctamente sin lanzar excepciones en la consola.
3. **Cumplimiento de Convenciones**:
   - Código, variables, nombres de archivos y comentarios redactados 100% en **español** con sintaxis **`camelCase`**.
