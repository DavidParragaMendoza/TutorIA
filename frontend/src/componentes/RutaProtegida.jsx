import { normalizarRol } from '../servicios/enrutamientoServicio.js'

/**
 * Componente de guardia de ruta RBAC (HU-02).
 * Valida la existencia de una sesión activa y la posesión de un rol permitido
 * antes de permitir el acceso y renderizado de vistas protegidas.
 *
 * @param {object} props
 * @param {string[]} props.rolesPermitidos - Lista de roles con autorización (ej. ['DOCENTE'])
 * @param {object|null} props.usuario - Objeto de usuario autenticado o null
 * @param {Function} [props.alDenegarAcceso] - Callback invocado si el acceso es denegado
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si es autorizado
 */
function RutaProtegida({ rolesPermitidos = [], usuario = null, alDenegarAcceso, children }) {
  if (!usuario) {
    if (typeof alDenegarAcceso === 'function') {
      alDenegarAcceso()
    }
    return null
  }

  const rolActual = normalizarRol(usuario)
  const estaAutorizado = rolesPermitidos.some(
    (rol) => rol.toUpperCase() === rolActual,
  )

  if (!estaAutorizado) {
    if (typeof alDenegarAcceso === 'function') {
      alDenegarAcceso()
    }
    return null
  }

  return children
}

export default RutaProtegida
