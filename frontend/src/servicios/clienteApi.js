import axios from 'axios'

export const URL_BASE_API = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000'
export const CLAVE_TOKEN = 'tokenAcceso'
export const CLAVE_USUARIO = 'usuarioSesion'

const clienteApi = axios.create({
  baseURL: URL_BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de petición para adjuntar Bearer Token JWT
clienteApi.interceptors.request.use(
  (configuracion) => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem(CLAVE_TOKEN) : null
      if (token) {
        configuracion.headers = configuracion.headers || {}
        configuracion.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Entornos donde localStorage no esté disponible
    }
    return configuracion
  },
  (error) => Promise.reject(error),
)

// Interceptor de respuesta para manejar expiración o invalidez de sesión (HTTP 401)
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(CLAVE_TOKEN)
          localStorage.removeItem(CLAVE_USUARIO)
        }
      } catch {
        // Silenciar errores de acceso a almacenamiento
      }
    }
    return Promise.reject(error)
  },
)

export default clienteApi
