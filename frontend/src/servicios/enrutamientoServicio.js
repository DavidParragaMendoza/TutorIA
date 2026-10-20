/**
 * Servicio de enrutamiento y guardias de control de acceso basado en roles (RBAC).
 * Centraliza la lógica de redirección y permisos de vistas en TutorIA.
 */

export const ROLES = {
  ESTUDIANTE: 'ESTUDIANTE',
  DOCENTE: 'DOCENTE',
  ADMINISTRADOR: 'ADMINISTRADOR',
}

export const VISTAS = {
  AUTENTICACION: 'autenticacion',
  RECUPERACION: 'recuperacion',
  RUTA_APRENDIZAJE: 'rutaAprendizaje',
  CHAT: 'chat',
  TABLERO_DOCENTE: 'tableroDocente',
  CONSOLA_ADMINISTRADOR: 'consolaAdministrador',
}

/**
 * Normaliza el rol del usuario a mayúsculas.
 * @param {object|null} usuario
 * @returns {string}
 */
export function normalizarRol(usuario) {
  if (!usuario) return ''
  return (usuario.rolPrincipal || usuario.rol || '').toUpperCase()
}

/**
 * Determina la vista principal correspondiente según el rol pedagógico del usuario.
 * @param {object|null} usuario
 * @returns {string} Identificador de la vista autorizada
 */
export function obtenerVistaPorRol(usuario) {
  if (!usuario) return VISTAS.AUTENTICACION
  const rol = normalizarRol(usuario)
  if (rol === ROLES.DOCENTE) return VISTAS.TABLERO_DOCENTE
  if (rol === ROLES.ADMINISTRADOR) return VISTAS.CONSOLA_ADMINISTRADOR
  if (rol === ROLES.ESTUDIANTE) return VISTAS.RUTA_APRENDIZAJE
  return VISTAS.AUTENTICACION
}

/**
 * Valida si un usuario tiene autorización para cargar una vista específica (Guardia RBAC).
 * @param {string} vista
 * @param {object|null} usuario
 * @returns {boolean}
 */
export function tieneAccesoVista(vista, usuario) {
  if (vista === VISTAS.AUTENTICACION || vista === VISTAS.RECUPERACION) {
    return true
  }

  if (!usuario) {
    return false
  }

  const rol = normalizarRol(usuario)

  if (vista === VISTAS.CONSOLA_ADMINISTRADOR) {
    return rol === ROLES.ADMINISTRADOR
  }

  if (vista === VISTAS.TABLERO_DOCENTE) {
    return rol === ROLES.DOCENTE
  }

  if (vista === VISTAS.RUTA_APRENDIZAJE || vista === VISTAS.CHAT) {
    return rol === ROLES.ESTUDIANTE
  }

  return false
}

/**
 * Mapeo de fragmento hash (#ruta) a identificador de vista interna.
 */
const MAPA_HASH_VISTAS = {
  '#login': VISTAS.AUTENTICACION,
  '#recuperar': VISTAS.RECUPERACION,
  '#estudiante': VISTAS.RUTA_APRENDIZAJE,
  '#chat': VISTAS.CHAT,
  '#docente': VISTAS.TABLERO_DOCENTE,
  '#admin': VISTAS.CONSOLA_ADMINISTRADOR,
}

const MAPA_VISTAS_HASH = {
  [VISTAS.AUTENTICACION]: '#login',
  [VISTAS.RECUPERACION]: '#recuperar',
  [VISTAS.RUTA_APRENDIZAJE]: '#estudiante',
  [VISTAS.CHAT]: '#chat',
  [VISTAS.TABLERO_DOCENTE]: '#docente',
  [VISTAS.CONSOLA_ADMINISTRADOR]: '#admin',
}

/**
 * Obtiene la vista a partir del hash de la URL actual.
 * @param {string} hash
 * @returns {string|null}
 */
export function obtenerVistaDesdeHash(hash) {
  if (!hash) return null
  return MAPA_HASH_VISTAS[hash.toLowerCase()] || null
}

/**
 * Actualiza el hash de la URL sin recargar la página.
 * @param {string} vista
 */
export function sincronizarHashConVista(vista) {
  const hashEsperado = MAPA_VISTAS_HASH[vista]
  if (hashEsperado && window.location.hash !== hashEsperado) {
    window.history.replaceState(null, '', hashEsperado)
  }
}
