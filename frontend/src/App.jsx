import { useEffect, useState, useCallback } from 'react'
import VistaAutenticacion from './vistas/VistaAutenticacion.jsx'
import VistaRecuperacionCredenciales from './vistas/VistaRecuperacionCredenciales.jsx'
import VistaRutaAprendizaje from './vistas/VistaRutaAprendizaje.jsx'
import VistaChatEstudiante from './vistas/VistaChatEstudiante.jsx'
import VistaTableroDocente from './vistas/VistaTableroDocente.jsx'
import VistaConsolaAdministrador from './vistas/VistaConsolaAdministrador.jsx'
import RutaProtegida from './componentes/RutaProtegida.jsx'
import {
  cerrarSesion as cerrarSesionServicio,
  obtenerUsuarioActual,
} from './servicios/autenticacionServicio.js'
import {
  ROLES,
  VISTAS,
  obtenerVistaPorRol,
  tieneAccesoVista,
  obtenerVistaDesdeHash,
  sincronizarHashConVista,
} from './servicios/enrutamientoServicio.js'

function App() {
  const [sesionActual, setSesionActual] = useState(() => obtenerUsuarioActual())
  const [vistaActual, setVistaActual] = useState(() => {
    const usuarioInicial = obtenerUsuarioActual()
    const vistaPorHash = typeof window !== 'undefined' ? obtenerVistaDesdeHash(window.location.hash) : null

    if (vistaPorHash && tieneAccesoVista(vistaPorHash, usuarioInicial)) {
      return vistaPorHash
    }

    return usuarioInicial ? obtenerVistaPorRol(usuarioInicial) : VISTAS.AUTENTICACION
  })

  // Sincronización bidireccional y guardián de rutas ante navegación manual en la URL
  const navegarAVista = useCallback(
    (vistaSolicitada) => {
      if (tieneAccesoVista(vistaSolicitada, sesionActual)) {
        setVistaActual(vistaSolicitada)
        sincronizarHashConVista(vistaSolicitada)
      } else {
        const vistaAutorizada = obtenerVistaPorRol(sesionActual)
        setVistaActual(vistaAutorizada)
        sincronizarHashConVista(vistaAutorizada)
      }
    },
    [sesionActual],
  )

  useEffect(() => {
    const manejarCambioHash = () => {
      const vistaHash = obtenerVistaDesdeHash(window.location.hash)
      if (vistaHash) {
        navegarAVista(vistaHash)
      }
    }

    window.addEventListener('hashchange', manejarCambioHash)
    sincronizarHashConVista(vistaActual)

    return () => {
      window.removeEventListener('hashchange', manejarCambioHash)
    }
  }, [vistaActual, navegarAVista])

  const manejarInicioSesion = (usuario) => {
    setSesionActual(usuario)
    const vistaDestino = obtenerVistaPorRol(usuario)
    setVistaActual(vistaDestino)
    sincronizarHashConVista(vistaDestino)
  }

  const manejarCierreSesion = async () => {
    try {
      await cerrarSesionServicio()
    } finally {
      setSesionActual(null)
      setVistaActual(VISTAS.AUTENTICACION)
      sincronizarHashConVista(VISTAS.AUTENTICACION)
    }
  }

  const redirigirPorAccesoDenegado = () => {
    const vistaAutorizada = obtenerVistaPorRol(sesionActual)
    setVistaActual(vistaAutorizada)
    sincronizarHashConVista(vistaAutorizada)
  }

  // Enrutamiento condicional con protección RBAC
  if (vistaActual === VISTAS.RECUPERACION) {
    return (
      <VistaRecuperacionCredenciales
        alVolverAlLogin={() => navegarAVista(VISTAS.AUTENTICACION)}
      />
    )
  }

  if (vistaActual === VISTAS.RUTA_APRENDIZAJE) {
    return (
      <RutaProtegida
        alDenegarAcceso={redirigirPorAccesoDenegado}
        rolesPermitidos={[ROLES.ESTUDIANTE]}
        usuario={sesionActual}
      >
        <VistaRutaAprendizaje
          alCerrarSesion={manejarCierreSesion}
          alIniciarPractica={() => navegarAVista(VISTAS.CHAT)}
          usuarioSesion={sesionActual}
        />
      </RutaProtegida>
    )
  }

  if (vistaActual === VISTAS.CHAT) {
    return (
      <RutaProtegida
        alDenegarAcceso={redirigirPorAccesoDenegado}
        rolesPermitidos={[ROLES.ESTUDIANTE]}
        usuario={sesionActual}
      >
        <VistaChatEstudiante
          alCerrarSesion={manejarCierreSesion}
          alVolverARuta={() => navegarAVista(VISTAS.RUTA_APRENDIZAJE)}
          usuarioSesion={sesionActual}
        />
      </RutaProtegida>
    )
  }

  if (vistaActual === VISTAS.TABLERO_DOCENTE) {
    return (
      <RutaProtegida
        alDenegarAcceso={redirigirPorAccesoDenegado}
        rolesPermitidos={[ROLES.DOCENTE]}
        usuario={sesionActual}
      >
        <VistaTableroDocente
          alCerrarSesion={manejarCierreSesion}
          usuarioSesion={sesionActual}
        />
      </RutaProtegida>
    )
  }

  if (vistaActual === VISTAS.CONSOLA_ADMINISTRADOR) {
    return (
      <RutaProtegida
        alDenegarAcceso={redirigirPorAccesoDenegado}
        rolesPermitidos={[ROLES.ADMINISTRADOR]}
        usuario={sesionActual}
      >
        <VistaConsolaAdministrador
          alCerrarSesion={manejarCierreSesion}
          usuarioSesion={sesionActual}
        />
      </RutaProtegida>
    )
  }

  return (
    <VistaAutenticacion
      alIniciarSesion={manejarInicioSesion}
      alSolicitarRecuperacion={() => navegarAVista(VISTAS.RECUPERACION)}
    />
  )
}

export default App
