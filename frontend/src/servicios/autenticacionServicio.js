import clienteApi, { CLAVE_TOKEN, CLAVE_USUARIO } from './clienteApi.js'

/**
 * Autentica al usuario contra la API de FastAPI y almacena la sesión.
 * @param {string} identificador - Cédula o correo institucional
 * @param {string} contrasena - Clave en texto plano
 * @returns {Promise<object>} Respuesta con tokenAcceso y datos de usuario
 */
export async function iniciarSesion(identificador, contrasena) {
  const respuesta = await clienteApi.post('/api/v1/auth/login', {
    identificador,
    contrasena,
  })

  const { tokenAcceso, usuario } = respuesta.data

  if (typeof localStorage !== 'undefined') {
    if (tokenAcceso) {
      localStorage.setItem(CLAVE_TOKEN, tokenAcceso)
    }
    if (usuario) {
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
    }
  }

  return respuesta.data
}

/**
 * Cierra la sesión activa invalidando el token en el servidor y limpiando el cliente.
 * @returns {Promise<object>}
 */
export async function cerrarSesion() {
  let respuestaServidor = { mensaje: 'Sesión finalizada exitosamente' }
  try {
    const respuesta = await clienteApi.post('/api/v1/auth/logout')
    respuestaServidor = respuesta.data
  } catch {
    // Si falla la petición remota (ej. 401 previo o red), de todas formas limpiamos la sesión local
  } finally {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CLAVE_TOKEN)
      localStorage.removeItem(CLAVE_USUARIO)
    }
  }
  return respuestaServidor
}

/**
 * Obtiene el perfil del usuario autenticado actualmente y actualiza el almacenamiento local.
 * @returns {Promise<object>} Datos del perfil del usuario
 */
export async function obtenerPerfilUsuario() {
  const respuesta = await clienteApi.get('/api/v1/auth/me')
  if (typeof localStorage !== 'undefined' && respuesta.data) {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.data))
  }
  return respuesta.data
}

/**
 * Registra un nuevo usuario en la base de datos (Exclusivo para rol ADMINISTRADOR).
 * @param {object} datosUsuario - { cedula, nombresCompletos, correoInstitucional, contrasena, rolId }
 * @returns {Promise<object>} Datos del usuario creado
 */
export async function crearUsuario(datosUsuario) {
  const respuesta = await clienteApi.post('/api/v1/users', datosUsuario)
  return respuesta.data
}

/**
 * Obtiene el directorio paginado de usuarios desde MySQL (Exclusivo para ADMINISTRADOR).
 * @param {object} opciones - { pagina, tamano, rol }
 * @returns {Promise<object>} Respuesta paginada con total, pagina, tamano y usuarios
 */
export async function obtenerUsuarios({ pagina = 1, tamano = 100, rol } = {}) {
  const parametros = { pagina, tamano }
  if (rol) parametros.rol = rol
  const respuesta = await clienteApi.get('/api/v1/users', { params: parametros })
  return respuesta.data
}

/**
 * Actualiza el estado de un usuario (Exclusivo para ADMINISTRADOR).
 * @param {number} usuarioId - Identificador del usuario
 * @param {string} estado - ACTIVO, BLOQUEADO o INACTIVO
 * @returns {Promise<object>} Usuario actualizado
 */
export async function actualizarEstadoUsuario(usuarioId, estado) {
  const respuesta = await clienteApi.patch(`/api/v1/users/${usuarioId}/estado`, { estado })
  return respuesta.data
}

/**
 * Obtiene el token JWT actualmente almacenado en localStorage.
 * @returns {string|null}
 */
export function obtenerToken() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(CLAVE_TOKEN)
}

/**
 * Obtiene el objeto de datos del usuario autenticado almacenado en localStorage.
 * @returns {object|null}
 */
export function obtenerUsuarioActual() {
  if (typeof localStorage === 'undefined') return null
  const usuarioTexto = localStorage.getItem(CLAVE_USUARIO)
  if (!usuarioTexto) return null
  try {
    return JSON.parse(usuarioTexto)
  } catch {
    return null
  }
}

/**
 * Comprueba si existe un token de sesión activo.
 * @returns {boolean}
 */
export function estaAutenticado() {
  return Boolean(obtenerToken())
}
