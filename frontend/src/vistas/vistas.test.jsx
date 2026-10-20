import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import usuariosAuthMock from '../datosSimulados/usuariosAuthMock.json'
import rutaAprendizajeMock from '../datosSimulados/rutaAprendizajeMock.json'
import chatVocabularioMock from '../datosSimulados/chatVocabularioMock.json'
import estudiantesDocenteMock from '../datosSimulados/estudiantesDocenteMock.json'
import usuariosAdminMock from '../datosSimulados/usuariosAdminMock.json'
import VistaAutenticacion from './VistaAutenticacion.jsx'
import VistaRecuperacionCredenciales from './VistaRecuperacionCredenciales.jsx'
import VistaRutaAprendizaje from './VistaRutaAprendizaje.jsx'
import VistaChatEstudiante from './VistaChatEstudiante.jsx'
import VistaTableroDocente from './VistaTableroDocente.jsx'
import VistaConsolaAdministrador from './VistaConsolaAdministrador.jsx'

const funcionVacia = () => {}
const buscarUsuario = (rol) => usuariosAuthMock.usuarios.find((usuario) => usuario.rol === rol)

afterEach(() => cleanup())

describe('Mocks JSON', () => {
  it('cargan con contenido válido', () => {
    ;[usuariosAuthMock, rutaAprendizajeMock, chatVocabularioMock, estudiantesDocenteMock, usuariosAdminMock].forEach(
      (mock) => expect(Object.keys(mock).length).toBeGreaterThan(0),
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
    const { container } = render(
      <VistaConsolaAdministrador alCerrarSesion={funcionVacia} usuarioSesion={buscarUsuario('Administrador')} />,
    )
    expect(container.textContent).toContain('TutorIA')
  })
})
