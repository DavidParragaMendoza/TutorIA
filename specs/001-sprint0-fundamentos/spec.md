# Spec 001 — Sprint 0: Fundamentos y Cimientos del Sistema

## Contexto y Objetivo del Sprint
El Sprint 0 establece la infraestructura inicial y los cimientos de la plataforma TutorIA MVP (6 Puntos de Historia). El objetivo principal de esta fase es inspeccionar, adaptar e implementar los prototipos de interfaz prediseñados en Google Stitch que se encuentran dentro de la carpeta `plantillas/` (archivos HTML con Tailwind CSS integrado, `DESIGN.md` e imágenes) y materializar el modelo lógico completo de 20 entidades relacionales en código Python utilizando el ORM SQLModel para MySQL.

Al finalizar este Sprint, la plataforma contará con su esquema relacional integro desplegado y verificado visualmente en phpMyAdmin, así como con la estructura base de componentes web maquetados en React.

## Historias de Usuario Incluidas (6 PH)
- **HU-00A (3 PH)**: Configuración Física de Base de Datos Relacional en MySQL mediante modelos ORM en SQLModel basados en el diseño lógico oficial de 20 tablas.
- **HU-00B (3 PH)**: Maquetación de Interfaz de Usuario UI/UX en React adaptando las plantillas HTML, Tailwind CSS y especificaciones visuales de Google Stitch.

---

## Requisitos Funcionales (Notación EARS en Español)

### Persistencia Relacional y Modelado ORM Completo (HU-00A)
- **RF-01**: CUANDO el backend de FastAPI se inicie, EL SISTEMA ejecutará el mapeo de SQLModel y creará automáticamente el conjunto completo de 20 tablas relacionales en MySQL si aún no existen.
- **RF-02**: EL SISTEMA definirá exactamente las siguientes 20 entidades base en SQLModel con sus correspondientes llaves primarias, llaves foráneas, índices y restricciones de auditoría:

  1. `Roles`: Catálogo estático de permisos (`id`, `nombre`, `descripcion`).
  2. `Usuarios`: Centraliza las cuentas de usuario, credenciales cifradas y control LOPDP (`id`, `nombresCompletos`, `cedula`, `correoInstitucional`, `passwordHash`, `estado`, `intentosFallidos`, `creadoPor`, `fechaCreacion`, `actualizadoPor`, `fechaActualizacion`).
  3. `UsuarioRol`: Vinculación N:M entre personas y permisos (`id`, `usuarioId`, `rolId`, `asignadoPor`, `fechaAsignacion`).
  4. `Idiomas`: Catálogo maestro de idiomas (`id`, `nombre`, `creadoPor`, `fechaCreacion`).
  5. `Niveles`: Clasificación de dificultad HSK1/A1 (`id`, `codigo`, `descripcion`, `creadoPor`, `fechaCreacion`).
  6. `PeriodosAcademicos`: Estructura temporal para ciclos lectivos (`id`, `codigo`, `fechaInicio`, `fechaFin`, `estado`, `creadoPor`, `fechaCreacion`).
  7. `InstitucionesAliadas`: Catálogo de convenios e instituciones (`id`, `nombreInstitucion`, `pais`, `tipoConvenio`, `creadoPor`, `fechaCreacion`).
  8. `Modalidades`: Método de enseñanza (`id`, `nombreModalidad`, `estado`).
  9. `Cursos`: Entidad que agrupa las reglas de la convocatoria uniendo idioma, nivel, institución y modalidad (`id`, `idiomaId`, `nivelId`, `institucionId`, `modalidadId`, `tituloPromocional`, `requisitoAcademico`, `fechaCierrePostulacion`, `estadoConvocatoria`, `creadoPor`, `fechaCreacion`).
  10. `Paralelos`: Materializa el aula con su docente responsable asignado (`id`, `cursoId`, `periodoAcademicoId`, `docenteId`, `nombreParalelo`, `cupoMaximo`, `horarioDescripcion`, `creadoPor`).
  11. `Matriculas`: Registra la inscripción inmutable del estudiante en un paralelo (`id`, `paraleloId`, `estudianteId`, `fechaMatricula`, `estadoMatricula`, `matriculadoPor`).
  12. `SesionesUsuario`: Gestiona el ciclo de vida JWT y guarda el seudónimo SHA-256 para el RAG (`id`, `usuarioId`, `pseudonimoHash`, `fechaInicio`, `fechaExpiracionToken`).
  13. `BloquesPractica`: Agrupa los intentos independientes de lección por estudiante (`id`, `matriculaId`, `sesionId`, `fechaInicio`, `fechaFin`).
  14. `EventosInteraccion`: Registro inmutable de cada respuesta enviada en el chat (`id`, `matriculaId`, `sesionId`, `glosarioId`, `preguntaContingenciaId`, `opcionSeleccionada`, `origenRespuesta`, `preguntaGeneradaTexto`, `opcionesPresentadasJson`, `esCorrecto`, `tiempoRespuestaMs`, `fechaEvento`).
  15. `EstadoDominioEstudiante`: Rastrea la asimilación del vocabulario HSK1 e inyecta parámetros para el algoritmo SRS (`id`, `matriculaId`, `glosarioId`, `estadoDominio`, `contadorFallos`, `fechaUltimoError`, `ultimaSesionId`, `pesoSrs`, `intervaloDias`, `proximaFechaRepaso`).
  16. `AuditoriaRutaAprendizaje`: Registro inmutable de decisiones del profesor en su tablero (`id`, `matriculaId`, `docenteId`, `sesionId`, `accionRealizada`, `observacion`, `fechaAccion`).
  17. `DetalleIntervencionGlosario`: Especifica los términos HSK1 ordenados a reforzar por el docente (`id`, `auditoriaId`, `glosarioId`, `prioridadDocente`, `estadoRefuerzo`).
  18. `CategoriasGlosario`: Agrupación temática del vocabulario HSK1 (`id`, `nombreCategoria`, `descripcion`).
  19. `GlosarioHsk1`: Catálogo oficial de términos HSK1/A1 (`id`, `nivelId`, `categoriaId`, `caracterHanzi`, `pinyin`, `traduccionEspanol`).
  20. `PreguntasContingenciaHsk1`: Banco defensivo de reactivos estáticos relacionales para tolerar timeouts en AnythingLLM (`id`, `glosarioId`, `preguntaTexto`, `opcionesJson`, `opcionCorrecta`, `explicacionBase`).

- **RF-03**: MIENTRAS se establezcan las relaciones entre modelos SQLModel, EL SISTEMA aplicará restricciones de integridad referencial (llaves foráneas) e índices para optimizar las consultas en MySQL.

### Adaptación de Interfaz y Componentes React (HU-00B)
- **RF-04**: CUANDO la aplicación frontend en React se ejecute, EL SISTEMA renderizará la interfaz aplicando la paleta institucional Porcelana y Vermellón integrada con Tailwind CSS.
- **RF-05**: EL SISTEMA adaptará los insumos de la carpeta `plantillas/` (archivos HTML descargados de Google Stitch, `DESIGN.md` e imágenes capturadas) para construir la estructura de componentes React en `/frontend`:
  - `VistaAutenticacion`: Layouts de Login (opciones Split screen y Centrado) con validación visual de credenciales.
  - `VistaChatEstudiante`: Layout del chat cerrado de opción múltiple con teclado bloqueado, tarjeta de reactivo RAG y barra de progreso.
  - `VistaTableroDocente`: Layout del panel de monitoreo con tabla semaforizada de alumnos, indicadores de riesgo y botonera de acción rápida en 1-clic.
  - `VistaConsolaAdministrador`: Layout de directorio de usuarios, modal de registro y parámetros del entorno IA local.
- **RF-06**: MIENTRAS no estén conectados los controladores reales del backend, EL SISTEMA utilizará archivos de datos simulados (mocks JSON) en React para verificar el renderizado visual de todas las pantallas.

---

## Requisitos No Funcionales del Sprint
- **RNF-01 (Compatibilidad ORM y Visualización)**: Los 20 modelos en SQLModel deben compilar en Python y ser inspeccionables visualmente en phpMyAdmin sin inconsistencias de llaves foráneas.
- **RNF-02 (Fidelidad de Diseño)**: Los componentes de React deben conservar la fidelidad de colores, tipografías e iconografía definidas en las plantillas descargadas de Google Stitch.
- **RNF-03 (Sintaxis Estricta)**: Código, atributos, componentes y comentarios redactados 100% en **español** utilizando **`camelCase`** de manera uniforme.

---

## Casos Límite Cubiertos
- **Tablas Preexistentes en MySQL**: Al iniciar FastAPI, SQLModel verificará el esquema sin sobrescribir ni duplicar estructuras previamente creadas en phpMyAdmin.
- **Ancho de Pantalla Responsivo**: Las vistas adaptadas en React deberán ajustar su distribución para resoluciones móviles y de escritorio.

---

## Fuera de Alcance del Sprint 0
- Emisión y validación de tokens de sesión JWT (corresponde al Sprint 1).
- Conexión con el contenedor de AnythingLLM o ejecución de búsquedas vectoriales RAG (corresponde al Sprint 2).
- Lógica de cálculo dinámico del motor de reglas pedagógicas y repetición espaciada SRS (corresponde a Sprints 2 y 3).

---

## Criterios de Finalización (Definition of Done)
1. Las 20 clases en SQLModel creadas y mapeadas en el backend sin errores.
2. Las 20 tablas relacionales generadas y verificadas visualmente en MySQL vía phpMyAdmin.
3. Componentes de React maquetados en el frontend renderizando las vistas de Login, Chat, Tablero Docente y Consola Admin con datos simulados.
4. Pruebas unitarias de inicialización en verde (`pytest` y `npm test`).

## Dudas Abiertas
- Ninguna. El listado de 20 entidades relacionales y las plantillas de Google Stitch cubren la totalidad de los cimientos del sistema.