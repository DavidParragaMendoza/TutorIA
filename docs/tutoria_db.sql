-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-10-2026 a las 04:51:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tutoria_db`
--
CREATE DATABASE IF NOT EXISTS `tutoria_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tutoria_db`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_ruta_aprendizaje`
--

CREATE TABLE `auditoria_ruta_aprendizaje` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matriculaId` bigint(20) UNSIGNED NOT NULL,
  `docenteId` bigint(20) UNSIGNED NOT NULL,
  `sesionId` bigint(20) UNSIGNED DEFAULT NULL,
  `accionRealizada` varchar(30) NOT NULL,
  `observacion` text DEFAULT NULL,
  `fechaAccion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bloques_practica`
--

CREATE TABLE `bloques_practica` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matriculaId` bigint(20) UNSIGNED NOT NULL,
  `sesionId` bigint(20) UNSIGNED NOT NULL,
  `fechaInicio` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `fechaFin` datetime(6) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_glosario`
--

CREATE TABLE `categorias_glosario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombreCategoria` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `idiomaId` bigint(20) UNSIGNED NOT NULL,
  `nivelId` bigint(20) UNSIGNED NOT NULL,
  `institucionId` bigint(20) UNSIGNED NOT NULL,
  `modalidadId` bigint(20) UNSIGNED NOT NULL,
  `tituloPromocional` varchar(200) NOT NULL,
  `requisitoAcademico` varchar(500) DEFAULT NULL,
  `fechaCierrePostulacion` datetime(6) DEFAULT NULL,
  `estadoConvocatoria` varchar(20) NOT NULL DEFAULT 'BORRADOR',
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_intervencion_glosario`
--

CREATE TABLE `detalle_intervencion_glosario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `auditoriaId` bigint(20) UNSIGNED NOT NULL,
  `glosarioId` bigint(20) UNSIGNED NOT NULL,
  `prioridadDocente` smallint(5) UNSIGNED NOT NULL DEFAULT 3,
  `estadoRefuerzo` varchar(20) NOT NULL DEFAULT 'PENDIENTE'
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_dominio_estudiante`
--

CREATE TABLE `estado_dominio_estudiante` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matriculaId` bigint(20) UNSIGNED NOT NULL,
  `glosarioId` bigint(20) UNSIGNED NOT NULL,
  `estadoDominio` varchar(20) NOT NULL DEFAULT 'DEBIL',
  `contadorFallos` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `fechaUltimoError` datetime(6) DEFAULT NULL,
  `ultimaSesionId` bigint(20) UNSIGNED DEFAULT NULL,
  `pesoSrs` decimal(5,2) NOT NULL DEFAULT 0.00,
  `intervaloDias` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `proximaFechaRepaso` datetime(6) DEFAULT NULL,
  `fechaActualizacion` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_interaccion`
--

CREATE TABLE `eventos_interaccion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matriculaId` bigint(20) UNSIGNED NOT NULL,
  `sesionId` bigint(20) UNSIGNED NOT NULL,
  `glosarioId` bigint(20) UNSIGNED NOT NULL,
  `preguntaContingenciaId` bigint(20) UNSIGNED DEFAULT NULL,
  `opcionSeleccionada` varchar(1) NOT NULL,
  `origenRespuesta` varchar(20) NOT NULL,
  `preguntaGeneradaTexto` text NOT NULL,
  `opcionesPresentadasJson` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`opcionesPresentadasJson`)),
  `esCorrecto` tinyint(1) NOT NULL,
  `tiempoRespuestaMs` int(10) UNSIGNED NOT NULL,
  `fechaEvento` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `glosario_hsk1`
--

CREATE TABLE `glosario_hsk1` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nivelId` bigint(20) UNSIGNED NOT NULL,
  `categoriaId` bigint(20) UNSIGNED NOT NULL,
  `caracterHanzi` varchar(10) NOT NULL,
  `pinyin` varchar(100) NOT NULL,
  `traduccionEspanol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `idiomas`
--

CREATE TABLE `idiomas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instituciones_aliadas`
--

CREATE TABLE `instituciones_aliadas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombreInstitucion` varchar(200) NOT NULL,
  `pais` varchar(60) NOT NULL,
  `tipoConvenio` varchar(50) NOT NULL,
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matriculas`
--

CREATE TABLE `matriculas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paraleloId` bigint(20) UNSIGNED NOT NULL,
  `estudianteId` bigint(20) UNSIGNED NOT NULL,
  `fechaMatricula` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `estadoMatricula` varchar(20) NOT NULL DEFAULT 'ACTIVA',
  `matriculadoPor` bigint(20) UNSIGNED DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidades`
--

CREATE TABLE `modalidades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombreModalidad` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'ACTIVA'
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE `niveles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paralelos`
--

CREATE TABLE `paralelos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cursoId` bigint(20) UNSIGNED NOT NULL,
  `periodoAcademicoId` bigint(20) UNSIGNED NOT NULL,
  `docenteId` bigint(20) UNSIGNED NOT NULL,
  `nombreParalelo` varchar(50) NOT NULL,
  `cupoMaximo` int(10) UNSIGNED NOT NULL,
  `horarioDescripcion` varchar(255) DEFAULT NULL,
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodos_academicos`
--

CREATE TABLE `periodos_academicos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'ACTIVO',
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_contingencia_hsk1`
--

CREATE TABLE `preguntas_contingencia_hsk1` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `glosarioId` bigint(20) UNSIGNED NOT NULL,
  `preguntaTexto` varchar(500) NOT NULL,
  `opcionesJson` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`opcionesJson`)),
  `opcionCorrecta` varchar(1) NOT NULL,
  `explicacionBase` varchar(500) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'ESTUDIANTE', 'Estudiante'),
(2, 'DOCENTE', 'Docente'),
(3, 'ADMINISTRADOR', 'Administrador del sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_usuario`
--

CREATE TABLE `sesiones_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuarioId` bigint(20) UNSIGNED NOT NULL,
  `pseudonimoHash` char(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `fechaInicio` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `fechaExpiracionToken` datetime(6) NOT NULL
) ;

--
-- Volcado de datos para la tabla `sesiones_usuario`
--

INSERT INTO `sesiones_usuario` (`id`, `usuarioId`, `pseudonimoHash`, `fechaInicio`, `fechaExpiracionToken`) VALUES
(1, 3, '63553810b1c92ab581e59fef8b0dbd6fcdafdffedf74c4b9cd958634c0d232e0', '2026-10-20 16:34:42.035540', '2026-10-20 17:01:54.428630'),
(2, 3, '63553810b1c92ab581e59fef8b0dbd6fcdafdffedf74c4b9cd958634c0d232e0', '2026-10-20 17:01:20.829465', '2026-10-20 17:01:54.428630'),
(3, 2, '1ce53e7d7c9121147bbf2bd8471ff37a7a2799d180442164ad96db72ab54d319', '2026-10-20 17:02:24.207115', '2026-10-20 17:02:40.366453'),
(4, 1, 'e88a9853398747088c55781e090ea2cc4803dd4f8c982b2a240d7c89c39a848a', '2026-10-20 17:02:59.672867', '2026-10-20 17:04:57.570438'),
(5, 4, '354acf636a8bb0e7213f9a154545f2323243584ddc9c17d1e825f1a52571e383', '2026-10-20 17:11:17.859245', '2026-10-20 17:12:03.828173'),
(6, 1, 'e88a9853398747088c55781e090ea2cc4803dd4f8c982b2a240d7c89c39a848a', '2026-10-20 17:13:25.318903', '2026-10-20 17:15:10.838589'),
(7, 1, 'e88a9853398747088c55781e090ea2cc4803dd4f8c982b2a240d7c89c39a848a', '2026-10-20 17:15:55.589247', '2026-10-21 01:15:55.589247'),
(8, 3, '63553810b1c92ab581e59fef8b0dbd6fcdafdffedf74c4b9cd958634c0d232e0', '2026-10-21 02:05:42.118169', '2026-10-21 02:06:17.639389'),
(9, 1, 'e88a9853398747088c55781e090ea2cc4803dd4f8c982b2a240d7c89c39a848a', '2026-10-21 02:06:38.791392', '2026-10-21 02:28:10.167059'),
(10, 4, '354acf636a8bb0e7213f9a154545f2323243584ddc9c17d1e825f1a52571e383', '2026-10-21 02:07:59.620966', '2026-10-21 02:08:12.725205'),
(11, 4, '354acf636a8bb0e7213f9a154545f2323243584ddc9c17d1e825f1a52571e383', '2026-10-21 02:09:57.576468', '2026-10-21 02:17:20.627825'),
(12, 2, '1ce53e7d7c9121147bbf2bd8471ff37a7a2799d180442164ad96db72ab54d319', '2026-10-21 02:17:38.070209', '2026-10-21 02:27:28.737597'),
(13, 5, 'f27d704729ed20c9cd8d29932d6a2a5b7a1af922fad733cfe40aae1a3880af5b', '2026-10-21 02:27:39.571803', '2026-10-21 02:27:48.572696');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombresCompletos` varchar(200) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correoInstitucional` varchar(150) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'ACTIVO',
  `intentosFallidos` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `creadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaCreacion` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `actualizadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaActualizacion` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombresCompletos`, `cedula`, `correoInstitucional`, `passwordHash`, `estado`, `intentosFallidos`, `creadoPor`, `fechaCreacion`, `actualizadoPor`, `fechaActualizacion`) VALUES
(1, 'Administrador General TutorIA', '1700000001', 'admin@tutoria.edu.ec', '$2b$12$UAUoNwE76kvWdQBuWXBRlOf/1pm912nrfFfzjYHzfYlh2464nlLoS', 'ACTIVO', 0, NULL, '2026-10-20 13:29:48.414825', NULL, '2026-10-20 13:29:48.414825'),
(2, 'Profesor Li Wei', '1700000002', 'docente@tutoria.edu.ec', '$2b$12$d0eJ6eanLpBaZQoyAFJ.nONe8Dx4SPV4/qsIMGSRMfs2BTCCMS03y', 'ACTIVO', 0, NULL, '2026-10-20 13:29:48.942723', NULL, '2026-10-20 13:29:48.942723'),
(3, 'Juan Carlos Pérez', '1700000003', 'estudiante@tutoria.edu.ec', '$2b$12$7PTtwMQ23QT5nJh7UmkyX.V/CXNciuPJAfmTqtj3GzyA0vkW.mbbK', 'ACTIVO', 0, NULL, '2026-10-20 13:29:49.460806', NULL, '2026-10-20 13:29:49.460806'),
(4, 'RONALD DAVID PARRAGA', '0850903006', 'davidparragamendoza@gmail.com', '$2b$12$u/u/Mpo8xRKEmP82UzT1.uNN4yZCMoOFFBYWMSZmZsPYMP/1x2RU.', 'ACTIVO', 0, 1, '2026-10-20 14:03:32.251793', 1, '2026-10-21 02:09:45.867648'),
(5, 'Deyvi Prudente', '0987456321', 'deyvipru@gmail.com', '$2b$12$d4ouC.9sj.1Z6Fn.TS0PG.Xo0mL34lbrYB01Vki31Ka83ehM0G41S', 'ACTIVO', 0, 1, '2026-10-20 23:27:23.493796', NULL, '2026-10-20 23:27:23.493796');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuarioId` bigint(20) UNSIGNED NOT NULL,
  `rolId` bigint(20) UNSIGNED NOT NULL,
  `asignadoPor` bigint(20) UNSIGNED DEFAULT NULL,
  `fechaAsignacion` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id`, `usuarioId`, `rolId`, `asignadoPor`, `fechaAsignacion`) VALUES
(1, 1, 3, NULL, '2026-10-20 13:29:48.423432'),
(2, 2, 2, NULL, '2026-10-20 13:29:48.946357'),
(3, 3, 1, NULL, '2026-10-20 13:29:49.463711'),
(4, 4, 1, 1, '2026-10-20 14:03:32.264848'),
(5, 5, 1, 1, '2026-10-20 23:27:23.499982');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_ruta_aprendizaje`
--
ALTER TABLE `auditoria_ruta_aprendizaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_auditoria_matricula_fecha` (`matriculaId`,`fechaAccion`),
  ADD KEY `idx_auditoria_docente` (`docenteId`),
  ADD KEY `idx_auditoria_sesion` (`sesionId`),
  ADD KEY `idx_auditoria_accion` (`accionRealizada`);

--
-- Indices de la tabla `bloques_practica`
--
ALTER TABLE `bloques_practica`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bloques_sesion` (`sesionId`),
  ADD KEY `idx_bloques_matricula_fecha` (`matriculaId`,`fechaInicio`);

--
-- Indices de la tabla `categorias_glosario`
--
ALTER TABLE `categorias_glosario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categorias_nombre` (`nombreCategoria`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cursos_convocatoria` (`idiomaId`,`nivelId`,`institucionId`,`modalidadId`,`tituloPromocional`),
  ADD KEY `idx_cursos_institucion` (`institucionId`),
  ADD KEY `idx_cursos_idioma` (`idiomaId`),
  ADD KEY `idx_cursos_nivel` (`nivelId`),
  ADD KEY `idx_cursos_modalidad` (`modalidadId`),
  ADD KEY `idx_cursos_creado_por` (`creadoPor`),
  ADD KEY `idx_cursos_estado` (`estadoConvocatoria`);

--
-- Indices de la tabla `detalle_intervencion_glosario`
--
ALTER TABLE `detalle_intervencion_glosario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_detalle_intervencion_auditoria_glosario` (`auditoriaId`,`glosarioId`),
  ADD KEY `idx_detalle_glosario` (`glosarioId`),
  ADD KEY `idx_detalle_estado` (`estadoRefuerzo`);

--
-- Indices de la tabla `estado_dominio_estudiante`
--
ALTER TABLE `estado_dominio_estudiante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_estado_dominio_matricula_glosario` (`matriculaId`,`glosarioId`),
  ADD KEY `idx_estado_dominio_proxima` (`proximaFechaRepaso`),
  ADD KEY `idx_estado_dominio_glosario` (`glosarioId`),
  ADD KEY `idx_estado_dominio_ultima_sesion` (`ultimaSesionId`),
  ADD KEY `idx_estado_dominio_estado` (`estadoDominio`);

--
-- Indices de la tabla `eventos_interaccion`
--
ALTER TABLE `eventos_interaccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_eventos_sesion_fecha` (`sesionId`,`fechaEvento`),
  ADD KEY `idx_eventos_pregunta` (`preguntaContingenciaId`),
  ADD KEY `idx_eventos_glosario` (`glosarioId`),
  ADD KEY `idx_eventos_matricula_fecha` (`matriculaId`,`fechaEvento`),
  ADD KEY `idx_eventos_origen` (`origenRespuesta`);

--
-- Indices de la tabla `glosario_hsk1`
--
ALTER TABLE `glosario_hsk1`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_glosario_nivel_hanzi_pinyin` (`nivelId`,`caracterHanzi`,`pinyin`),
  ADD KEY `idx_glosario_categoria` (`categoriaId`),
  ADD KEY `idx_glosario_nivel` (`nivelId`),
  ADD KEY `idx_glosario_hanzi` (`caracterHanzi`);

--
-- Indices de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_idiomas_nombre` (`nombre`),
  ADD KEY `idx_idiomas_creado_por` (`creadoPor`);

--
-- Indices de la tabla `instituciones_aliadas`
--
ALTER TABLE `instituciones_aliadas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_instituciones_nombre_pais` (`nombreInstitucion`,`pais`),
  ADD KEY `idx_instituciones_creado_por` (`creadoPor`);

--
-- Indices de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_matriculas_paralelo_estudiante` (`paraleloId`,`estudianteId`),
  ADD KEY `idx_matriculas_estado` (`estadoMatricula`),
  ADD KEY `idx_matriculas_matriculado_por` (`matriculadoPor`),
  ADD KEY `idx_matriculas_estudiante` (`estudianteId`);

--
-- Indices de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_modalidades_nombre` (`nombreModalidad`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_niveles_codigo` (`codigo`),
  ADD KEY `idx_niveles_creado_por` (`creadoPor`);

--
-- Indices de la tabla `paralelos`
--
ALTER TABLE `paralelos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_paralelos_curso_periodo_nombre` (`cursoId`,`periodoAcademicoId`,`nombreParalelo`),
  ADD KEY `idx_paralelos_docente` (`docenteId`),
  ADD KEY `idx_paralelos_creado_por` (`creadoPor`),
  ADD KEY `idx_paralelos_periodo` (`periodoAcademicoId`);

--
-- Indices de la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_periodos_codigo` (`codigo`),
  ADD KEY `idx_periodos_estado` (`estado`),
  ADD KEY `idx_periodos_creado_por` (`creadoPor`);

--
-- Indices de la tabla `preguntas_contingencia_hsk1`
--
ALTER TABLE `preguntas_contingencia_hsk1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_preguntas_glosario` (`glosarioId`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indices de la tabla `sesiones_usuario`
--
ALTER TABLE `sesiones_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sesiones_usuario` (`usuarioId`),
  ADD KEY `idx_sesiones_hash` (`pseudonimoHash`),
  ADD KEY `idx_sesiones_expiracion` (`fechaExpiracionToken`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_cedula` (`cedula`),
  ADD UNIQUE KEY `uq_usuarios_correo` (`correoInstitucional`),
  ADD KEY `idx_usuarios_actualizado_por` (`actualizadoPor`),
  ADD KEY `idx_usuarios_estado` (`estado`),
  ADD KEY `idx_usuarios_creado_por` (`creadoPor`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_rol_usuario_rol` (`usuarioId`,`rolId`),
  ADD KEY `idx_usuario_rol_rol` (`rolId`),
  ADD KEY `idx_usuario_rol_asignado_por` (`asignadoPor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_ruta_aprendizaje`
--
ALTER TABLE `auditoria_ruta_aprendizaje`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bloques_practica`
--
ALTER TABLE `bloques_practica`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias_glosario`
--
ALTER TABLE `categorias_glosario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_intervencion_glosario`
--
ALTER TABLE `detalle_intervencion_glosario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_dominio_estudiante`
--
ALTER TABLE `estado_dominio_estudiante`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos_interaccion`
--
ALTER TABLE `eventos_interaccion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `glosario_hsk1`
--
ALTER TABLE `glosario_hsk1`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `instituciones_aliadas`
--
ALTER TABLE `instituciones_aliadas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paralelos`
--
ALTER TABLE `paralelos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas_contingencia_hsk1`
--
ALTER TABLE `preguntas_contingencia_hsk1`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sesiones_usuario`
--
ALTER TABLE `sesiones_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria_ruta_aprendizaje`
--
ALTER TABLE `auditoria_ruta_aprendizaje`
  ADD CONSTRAINT `fk_auditoria_docente` FOREIGN KEY (`docenteId`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_auditoria_matricula` FOREIGN KEY (`matriculaId`) REFERENCES `matriculas` (`id`),
  ADD CONSTRAINT `fk_auditoria_sesion` FOREIGN KEY (`sesionId`) REFERENCES `sesiones_usuario` (`id`);

--
-- Filtros para la tabla `bloques_practica`
--
ALTER TABLE `bloques_practica`
  ADD CONSTRAINT `fk_bloques_matricula` FOREIGN KEY (`matriculaId`) REFERENCES `matriculas` (`id`),
  ADD CONSTRAINT `fk_bloques_sesion` FOREIGN KEY (`sesionId`) REFERENCES `sesiones_usuario` (`id`);

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_cursos_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_cursos_idioma` FOREIGN KEY (`idiomaId`) REFERENCES `idiomas` (`id`),
  ADD CONSTRAINT `fk_cursos_institucion` FOREIGN KEY (`institucionId`) REFERENCES `instituciones_aliadas` (`id`),
  ADD CONSTRAINT `fk_cursos_modalidad` FOREIGN KEY (`modalidadId`) REFERENCES `modalidades` (`id`),
  ADD CONSTRAINT `fk_cursos_nivel` FOREIGN KEY (`nivelId`) REFERENCES `niveles` (`id`);

--
-- Filtros para la tabla `detalle_intervencion_glosario`
--
ALTER TABLE `detalle_intervencion_glosario`
  ADD CONSTRAINT `fk_detalle_auditoria` FOREIGN KEY (`auditoriaId`) REFERENCES `auditoria_ruta_aprendizaje` (`id`),
  ADD CONSTRAINT `fk_detalle_glosario` FOREIGN KEY (`glosarioId`) REFERENCES `glosario_hsk1` (`id`);

--
-- Filtros para la tabla `estado_dominio_estudiante`
--
ALTER TABLE `estado_dominio_estudiante`
  ADD CONSTRAINT `fk_estado_dominio_glosario` FOREIGN KEY (`glosarioId`) REFERENCES `glosario_hsk1` (`id`),
  ADD CONSTRAINT `fk_estado_dominio_matricula` FOREIGN KEY (`matriculaId`) REFERENCES `matriculas` (`id`),
  ADD CONSTRAINT `fk_estado_dominio_ultima_sesion` FOREIGN KEY (`ultimaSesionId`) REFERENCES `sesiones_usuario` (`id`);

--
-- Filtros para la tabla `eventos_interaccion`
--
ALTER TABLE `eventos_interaccion`
  ADD CONSTRAINT `fk_eventos_glosario` FOREIGN KEY (`glosarioId`) REFERENCES `glosario_hsk1` (`id`),
  ADD CONSTRAINT `fk_eventos_matricula` FOREIGN KEY (`matriculaId`) REFERENCES `matriculas` (`id`),
  ADD CONSTRAINT `fk_eventos_pregunta_contingencia` FOREIGN KEY (`preguntaContingenciaId`) REFERENCES `preguntas_contingencia_hsk1` (`id`),
  ADD CONSTRAINT `fk_eventos_sesion` FOREIGN KEY (`sesionId`) REFERENCES `sesiones_usuario` (`id`);

--
-- Filtros para la tabla `glosario_hsk1`
--
ALTER TABLE `glosario_hsk1`
  ADD CONSTRAINT `fk_glosario_categoria` FOREIGN KEY (`categoriaId`) REFERENCES `categorias_glosario` (`id`),
  ADD CONSTRAINT `fk_glosario_nivel` FOREIGN KEY (`nivelId`) REFERENCES `niveles` (`id`);

--
-- Filtros para la tabla `idiomas`
--
ALTER TABLE `idiomas`
  ADD CONSTRAINT `fk_idiomas_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `instituciones_aliadas`
--
ALTER TABLE `instituciones_aliadas`
  ADD CONSTRAINT `fk_instituciones_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD CONSTRAINT `fk_matriculas_estudiante` FOREIGN KEY (`estudianteId`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_matriculas_matriculado_por` FOREIGN KEY (`matriculadoPor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_matriculas_paralelo` FOREIGN KEY (`paraleloId`) REFERENCES `paralelos` (`id`);

--
-- Filtros para la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD CONSTRAINT `fk_niveles_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `paralelos`
--
ALTER TABLE `paralelos`
  ADD CONSTRAINT `fk_paralelos_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_paralelos_curso` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`),
  ADD CONSTRAINT `fk_paralelos_docente` FOREIGN KEY (`docenteId`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_paralelos_periodo` FOREIGN KEY (`periodoAcademicoId`) REFERENCES `periodos_academicos` (`id`);

--
-- Filtros para la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  ADD CONSTRAINT `fk_periodos_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `preguntas_contingencia_hsk1`
--
ALTER TABLE `preguntas_contingencia_hsk1`
  ADD CONSTRAINT `fk_preguntas_glosario` FOREIGN KEY (`glosarioId`) REFERENCES `glosario_hsk1` (`id`);

--
-- Filtros para la tabla `sesiones_usuario`
--
ALTER TABLE `sesiones_usuario`
  ADD CONSTRAINT `fk_sesiones_usuario` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_actualizado_por` FOREIGN KEY (`actualizadoPor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_usuarios_creado_por` FOREIGN KEY (`creadoPor`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `fk_usuario_rol_asignado_por` FOREIGN KEY (`asignadoPor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_usuario_rol_rol` FOREIGN KEY (`rolId`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `fk_usuario_rol_usuario` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
