import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import {
  ROLES,
  VISTAS,
  normalizarRol,
  obtenerVistaPorRol,
  tieneAccesoVista,
  obtenerVistaDesdeHash,
} from '../servicios/enrutamientoServicio.js'
import RutaProtegida from '../componentes/RutaProtegida.jsx'
import App from '../App.jsx'
import * as autenticacionServicio from '../servicios/autenticacionServicio.js'

describe('TAREA-3.4: Enrutamiento Dinámico y Protección de Rutas RBAC', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    window.location.hash = ''
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  describe('Servicio de Enrutamiento (enrutamientoServicio.js)', () => {
    it('normaliza roles nulos, vacíos y en minúsculas', () => {
      expect(normalizarRol(null)).toBe('')
      expect(normalizarRol(undefined)).toBe('')
      expect(normalizarRol({ rol: 'docente' })).toBe('DOCENTE')
      expect(normalizarRol({ rolPrincipal: 'estudiante' })).toBe('ESTUDIANTE')
      expect(normalizarRol({ rolPrincipal: 'ADMINISTRADOR' })).toBe('ADMINISTRADOR')
    })

    it('redirige al usuario a la vista correspondiente según su rol', () => {
      expect(obtenerVistaPorRol(null)).toBe(VISTAS.AUTENTICACION)
      expect(obtenerVistaPorRol({ rolPrincipal: 'ESTUDIANTE' })).toBe(VISTAS.RUTA_APRENDIZAJE)
      expect(obtenerVistaPorRol({ rolPrincipal: 'DOCENTE' })).toBe(VISTAS.TABLERO_DOCENTE)
      expect(obtenerVistaPorRol({ rolPrincipal: 'ADMINISTRADOR' })).toBe(VISTAS.CONSOLA_ADMINISTRADOR)
    })

    it('valida permisos con la guardia tieneAccesoVista', () => {
      // Vistas públicas
      expect(tieneAccesoVista(VISTAS.AUTENTICACION, null)).toBe(true)
      expect(tieneAccesoVista(VISTAS.RECUPERACION, null)).toBe(true)

      // Sin usuario no accede a vistas privadas
      expect(tieneAccesoVista(VISTAS.RUTA_APRENDIZAJE, null)).toBe(false)
      expect(tieneAccesoVista(VISTAS.TABLERO_DOCENTE, null)).toBe(false)
      expect(tieneAccesoVista(VISTAS.CONSOLA_ADMINISTRADOR, null)).toBe(false)

      // Permisos de ESTUDIANTE
      const estudiante = { rolPrincipal: 'ESTUDIANTE' }
      expect(tieneAccesoVista(VISTAS.RUTA_APRENDIZAJE, estudiante)).toBe(true)
      expect(tieneAccesoVista(VISTAS.CHAT, estudiante)).toBe(true)
      expect(tieneAccesoVista(VISTAS.TABLERO_DOCENTE, estudiante)).toBe(false)
      expect(tieneAccesoVista(VISTAS.CONSOLA_ADMINISTRADOR, estudiante)).toBe(false)

      // Permisos de DOCENTE
      const docente = { rolPrincipal: 'DOCENTE' }
      expect(tieneAccesoVista(VISTAS.TABLERO_DOCENTE, docente)).toBe(true)
      expect(tieneAccesoVista(VISTAS.RUTA_APRENDIZAJE, docente)).toBe(false)
      expect(tieneAccesoVista(VISTAS.CONSOLA_ADMINISTRADOR, docente)).toBe(false)

      // Permisos de ADMINISTRADOR
      const admin = { rolPrincipal: 'ADMINISTRADOR' }
      expect(tieneAccesoVista(VISTAS.CONSOLA_ADMINISTRADOR, admin)).toBe(true)
      expect(tieneAccesoVista(VISTAS.TABLERO_DOCENTE, admin)).toBe(false)
      expect(tieneAccesoVista(VISTAS.RUTA_APRENDIZAJE, admin)).toBe(false)
    })

    it('identifica vistas a partir de los hashes de URL', () => {
      expect(obtenerVistaDesdeHash('#login')).toBe(VISTAS.AUTENTICACION)
      expect(obtenerVistaDesdeHash('#estudiante')).toBe(VISTAS.RUTA_APRENDIZAJE)
      expect(obtenerVistaDesdeHash('#chat')).toBe(VISTAS.CHAT)
      expect(obtenerVistaDesdeHash('#docente')).toBe(VISTAS.TABLERO_DOCENTE)
      expect(obtenerVistaDesdeHash('#admin')).toBe(VISTAS.CONSOLA_ADMINISTRADOR)
      expect(obtenerVistaDesdeHash('#desconocido')).toBeNull()
    })
  })

  describe('Componente de Guardia RutaProtegida', () => {
    it('renderiza children si el usuario posee un rol autorizado', () => {
      const usuarioValido = { rolPrincipal: 'DOCENTE' }
      render(
        <RutaProtegida rolesPermitidos={[ROLES.DOCENTE]} usuario={usuarioValido}>
          <div data-testid="contenido-protegido">Contenido Docente</div>
        </RutaProtegida>,
      )

      expect(screen.getByTestId('contenido-protegido')).not.toBeNull()
      expect(screen.getByText('Contenido Docente')).not.toBeNull()
    })

    it('bloquea renderizado e invoca alDenegarAcceso si el usuario no tiene rol permitido', () => {
      const usuarioNoAutorizado = { rolPrincipal: 'ESTUDIANTE' }
      const funcionDenegar = vi.fn()

      render(
        <RutaProtegida
          alDenegarAcceso={funcionDenegar}
          rolesPermitidos={[ROLES.ADMINISTRADOR]}
          usuario={usuarioNoAutorizado}
        >
          <div data-testid="contenido-protegido">Contenido Admin</div>
        </RutaProtegida>,
      )

      expect(screen.queryByTestId('contenido-protegido')).toBeNull()
      expect(funcionDenegar).toHaveBeenCalledTimes(1)
    })

    it('bloquea renderizado si no existe usuario autenticado', () => {
      const funcionDenegar = vi.fn()

      render(
        <RutaProtegida
          alDenegarAcceso={funcionDenegar}
          rolesPermitidos={[ROLES.ESTUDIANTE]}
          usuario={null}
        >
          <div data-testid="contenido-protegido">Contenido Estudiante</div>
        </RutaProtegida>,
      )

      expect(screen.queryByTestId('contenido-protegido')).toBeNull()
      expect(funcionDenegar).toHaveBeenCalledTimes(1)
    })
  })

  describe('Integración de Flujo RBAC en App.jsx', () => {
    it('renderiza VistaAutenticacion por defecto cuando no hay sesión activa', () => {
      vi.spyOn(autenticacionServicio, 'obtenerUsuarioActual').mockReturnValue(null)

      const { container } = render(<App />)
      expect(container.textContent).toContain('Inicio de sesión')
      expect(container.textContent).toContain('PORTAL INSTITUCIONAL SRS')
    })

    it('carga la consola de administración si el usuario autenticado es ADMINISTRADOR', () => {
      const adminUsuario = {
        id: 1,
        nombresCompletos: 'Administrador Sistema',
        correoInstitucional: 'admin@tutoria.edu.ec',
        rolPrincipal: 'ADMINISTRADOR',
      }
      vi.spyOn(autenticacionServicio, 'obtenerUsuarioActual').mockReturnValue(adminUsuario)

      const { container } = render(<App />)
      expect(container.textContent).toContain('Consola de Administración')
    })

    it('carga el tablero docente si el usuario autenticado es DOCENTE', () => {
      const docenteUsuario = {
        id: 2,
        nombresCompletos: 'Docente Guía',
        correoInstitucional: 'docente@tutoria.edu.ec',
        rolPrincipal: 'DOCENTE',
      }
      vi.spyOn(autenticacionServicio, 'obtenerUsuarioActual').mockReturnValue(docenteUsuario)

      const { container } = render(<App />)
      expect(container.textContent).toContain('Panel de Monitoreo Analítico')
    })

    it('carga la ruta de aprendizaje si el usuario autenticado es ESTUDIANTE', () => {
      const estudianteUsuario = {
        id: 3,
        nombresCompletos: 'Estudiante TutorIA',
        correoInstitucional: 'estudiante@tutoria.edu.ec',
        rolPrincipal: 'ESTUDIANTE',
      }
      vi.spyOn(autenticacionServicio, 'obtenerUsuarioActual').mockReturnValue(estudianteUsuario)

      const { container } = render(<App />)
      expect(container.textContent).toContain('Ruta Pedagógica')
    })

    it('impide a un estudiante ingresar a la ruta de administración vía hash', async () => {
      const estudianteUsuario = {
        id: 3,
        nombresCompletos: 'Estudiante TutorIA',
        correoInstitucional: 'estudiante@tutoria.edu.ec',
        rolPrincipal: 'ESTUDIANTE',
      }
      vi.spyOn(autenticacionServicio, 'obtenerUsuarioActual').mockReturnValue(estudianteUsuario)

      const { container } = render(<App />)

      // Simular cambio manual de hash por URL hacia #admin
      await act(async () => {
        window.location.hash = '#admin'
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      })

      // La guardia RBAC debe haber rechazado el acceso y mantenido en la ruta de estudiante
      expect(container.textContent).not.toContain('Consola de Administración')
      expect(container.textContent).toContain('Ruta Pedagógica')
    })
  })
})
