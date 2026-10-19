import { useState } from 'react'
import VistaAutenticacion from './vistas/VistaAutenticacion.jsx'
import VistaRecuperacionCredenciales from './vistas/VistaRecuperacionCredenciales.jsx'
import VistaRutaAprendizaje from './vistas/VistaRutaAprendizaje.jsx'
import VistaChatEstudiante from './vistas/VistaChatEstudiante.jsx'
import VistaTableroDocente from './vistas/VistaTableroDocente.jsx'
import VistaConsolaAdministrador from './vistas/VistaConsolaAdministrador.jsx'

function App() {
  const [vistaActual, setVistaActual] = useState('autenticacion')
  const [sesionActual, setSesionActual] = useState(null)

  const vistasPorRol = {
    Docente: 'tableroDocente',
    Administrador: 'consolaAdministrador',
  }

  const iniciarSesion = (usuario) => {
    setSesionActual(usuario)
    setVistaActual(vistasPorRol[usuario.rol] ?? 'rutaAprendizaje')
  }

  const cerrarSesion = () => {
    setSesionActual(null)
    setVistaActual('autenticacion')
  }

  if (vistaActual === 'recuperacion') {
    return (
      <VistaRecuperacionCredenciales alVolverAlLogin={() => setVistaActual('autenticacion')} />
    )
  }

  if (vistaActual === 'rutaAprendizaje') {
    return (
      <VistaRutaAprendizaje
        alIniciarPractica={() => setVistaActual('chat')}
        alCerrarSesion={cerrarSesion}
        usuarioSesion={sesionActual}
      />
    )
  }

  if (vistaActual === 'chat') {
    return (
      <VistaChatEstudiante
        alVolverARuta={() => setVistaActual('rutaAprendizaje')}
        alCerrarSesion={cerrarSesion}
        usuarioSesion={sesionActual}
      />
    )
  }

  if (vistaActual === 'tableroDocente') {
    return (
      <VistaTableroDocente
        alCerrarSesion={cerrarSesion}
        usuarioSesion={sesionActual}
      />
    )
  }

  if (vistaActual === 'consolaAdministrador') {
    return (
      <VistaConsolaAdministrador
        alCerrarSesion={cerrarSesion}
        usuarioSesion={sesionActual}
      />
    )
  }

  return (
    <VistaAutenticacion
      alSolicitarRecuperacion={() => setVistaActual('recuperacion')}
      alIniciarSesion={iniciarSesion}
    />
  )
}

export default App
