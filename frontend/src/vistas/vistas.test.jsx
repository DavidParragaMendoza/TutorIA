import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as autenticacionServicio from '../servicios/autenticacionServicio.js'
import rutaAprendizajeMock from '../datosSimulados/rutaAprendizajeMock.json'
import chatVocabularioMock from '../datosSimulados/chatVocabularioMock.json'
import estudiantesDocenteMock from '../datosSimulados/estudiantesDocenteMock.json'
import VistaAutenticacion from './VistaAutenticacion.jsx'
import VistaRecuperacionCredenciales from './VistaRecuperacionCredenciales.jsx'
import VistaRutaAprendizaje from './VistaRutaAprendizaje.jsx'
import VistaChatEstudiante from './VistaChatEstudiante.jsx'
import VistaTableroDocente from './VistaTableroDocente.jsx'
import VistaConsolaAdministrador from './VistaConsolaAdministrador.jsx'

const funcionVacia = () => {}
const usuariosSesion = {
  Estudiante: {
    id: 3,
    nombresCompletos: 'Estudiante TutorIA',
    correoInstitucional: 'estudiante@tutoria.edu.ec',
    rolPrincipal: 'ESTUDIANTE',
  },
  Docente: {
    id: 2,
    nombresCompletos: 'Docente TutorIA',
    correoInstitucional: 'docente@tutoria.edu.ec',
    rolPrincipal: 'DOCENTE',
  },
  Administrador: {
    id: 1,
    nombresCompletos: 'Administrador TutorIA',
    correoInstitucional: 'admin@tutoria.edu.ec',
    rolPrincipal: 'ADMINISTRADOR',
  },
}
const buscarUsuario = (rol) => usuariosSesion[rol]

afterEach(() => cleanup())

describe('Mocks JSON pedagógicos', () => {
  it('cargan con contenido válido', () => {
    ;[rutaAprendizajeMock, chatVocabularioMock, estudiantesDocenteMock].forEach((mock) =>
      expect(Object.keys(mock).length).toBeGreaterThan(0),
    )
  })
})

describe('Vistas', () => {
  it('renderiza VistaAutenticacion', () => {
    const { container } = render(
      <VistaAutenticacion alSolicitarRecuperacion={funcionVacia} alIniciarSesion={funcionVacia} />,
    )
    expect(container.textContent).toContain('TutorIA')
  })

  it('renderiza VistaRecuperacionCredenciales', () => {
    const { container } = render(<VistaRecuperacionCredenciales alVolverAlLogin={funcionVacia} />)
    expect(container.textContent).toContain('TutorIA')
  })

  it('renderiza VistaRutaAprendizaje', () => {
    const { container } = render(
      <VistaRutaAprendizaje
        alIniciarPractica={funcionVacia}
        alCerrarSesion={funcionVacia}
        usuarioSesion={buscarUsuario('Estudiante')}
      />,
    )
    expect(container.textContent).toContain('HSK1')
  })

  it('renderiza VistaChatEstudiante', () => {
    const { container } = render(
      <VistaChatEstudiante
        alVolverARuta={funcionVacia}
        alCerrarSesion={funcionVacia}
        usuarioSesion={buscarUsuario('Estudiante')}
      />,
    )
    expect(container.textContent.length).toBeGreaterThan(0)
  })

  it('renderiza VistaTableroDocente', () => {
    const { container } = render(
      <VistaTableroDocente alCerrarSesion={funcionVacia} usuarioSesion={buscarUsuario('Docente')} />,
    )
    expect(container.textContent).toContain('TutorIA')
  })

  it('renderiza VistaConsolaAdministrador', () => {
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockResolvedValue({
      total: 0,
      pagina: 1,
      tamano: 100,
      usuarios: [],
    })
    const { container } = render(
      <VistaConsolaAdministrador alCerrarSesion={funcionVacia} usuarioSesion={buscarUsuario('Administrador')} />,
    )
    expect(container.textContent).toContain('TutorIA')
  })
})
