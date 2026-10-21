import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within, act } from '@testing-library/react'
import clienteApi from '../servicios/clienteApi.js'
import * as autenticacionServicio from '../servicios/autenticacionServicio.js'
import {
  obtenerUsuarios,
  actualizarEstadoUsuario,
} from '../servicios/autenticacionServicio.js'
import VistaConsolaAdministrador from '../vistas/VistaConsolaAdministrador.jsx'

const respuestaDirectorio = {
  total: 4,
  pagina: 1,
  tamano: 100,
  usuarios: [
    {
      id: 1,
      cedula: '1700000001',
      nombresCompletos: 'Administrador TutorIA',
      correoInstitucional: 'admin@tutoria.edu.ec',
      rolPrincipal: 'ADMINISTRADOR',
      estado: 'ACTIVO',
    },
    {
      id: 2,
      cedula: '1700000002',
      nombresCompletos: 'Docente Activo',
      correoInstitucional: 'docente.activo@tutoria.edu.ec',
      rolPrincipal: 'DOCENTE',
      estado: 'ACTIVO',
    },
    {
      id: 3,
      cedula: '1700000003',
      nombresCompletos: 'Estudiante Bloqueado',
      correoInstitucional: 'estudiante.bloqueado@tutoria.edu.ec',
      rolPrincipal: 'ESTUDIANTE',
      estado: 'BLOQUEADO',
    },
    {
      id: 4,
      cedula: '1700000004',
      nombresCompletos: 'Estudiante Inactivo',
      correoInstitucional: 'estudiante.inactivo@tutoria.edu.ec',
      rolPrincipal: 'ESTUDIANTE',
      estado: 'INACTIVO',
    },
  ],
}

const administradorSesion = {
  id: 1,
  nombresCompletos: 'Administrador TutorIA',
  correoInstitucional: 'admin@tutoria.edu.ec',
  rolPrincipal: 'ADMINISTRADOR',
}

function renderizarConsola(usuarioSesion = administradorSesion) {
  return render(
    <VistaConsolaAdministrador alCerrarSesion={vi.fn()} usuarioSesion={usuarioSesion} />,
  )
}

function obtenerFila(nombreUsuario) {
  const coincidencias = screen.getAllByText(nombreUsuario)
  return coincidencias.map((elemento) => elemento.closest('tr')).find(Boolean)
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('RF-S1-09: autenticacionServicio consume el directorio real de MySQL', () => {
  it('obtenerUsuarios realiza GET /api/v1/users con pagina y tamano', async () => {
    const respuestaApi = { data: respuestaDirectorio }
    vi.spyOn(clienteApi, 'get').mockResolvedValueOnce(respuestaApi)

    const resultado = await obtenerUsuarios({ pagina: 1, tamano: 100 })

    expect(clienteApi.get).toHaveBeenCalledWith('/api/v1/users', {
      params: { pagina: 1, tamano: 100 },
    })
    expect(resultado).toEqual(respuestaDirectorio)
  })

  it('obtenerUsuarios usa pagina 1 y tamano 100 por defecto', async () => {
    vi.spyOn(clienteApi, 'get').mockResolvedValueOnce({ data: respuestaDirectorio })

    await obtenerUsuarios()

    expect(clienteApi.get).toHaveBeenCalledWith('/api/v1/users', {
      params: { pagina: 1, tamano: 100 },
    })
  })
})

describe('RF-S1-10: autenticacionServicio actualiza el estado del usuario', () => {
  it('actualizarEstadoUsuario realiza PATCH al endpoint de estado', async () => {
    const usuarioActualizado = { ...respuestaDirectorio.usuarios[2], estado: 'ACTIVO' }
    vi.spyOn(clienteApi, 'patch').mockResolvedValueOnce({ data: usuarioActualizado })

    const resultado = await actualizarEstadoUsuario(3, 'ACTIVO')

    expect(clienteApi.patch).toHaveBeenCalledWith('/api/v1/users/3/estado', {
      estado: 'ACTIVO',
    })
    expect(resultado).toEqual(usuarioActualizado)
  })
})

describe('RF-S1-09: VistaConsolaAdministrador se sincroniza desde la API', () => {
  it('invoca obtenerUsuarios al montar y mapea los DTOs a la tabla', async () => {
    const servicioUsuarios = vi
      .spyOn(autenticacionServicio, 'obtenerUsuarios')
      .mockResolvedValueOnce(respuestaDirectorio)

    renderizarConsola()

    expect(await screen.findByText('Docente Activo')).toBeTruthy()
    expect(servicioUsuarios).toHaveBeenCalledWith({ pagina: 1, tamano: 100 })
    expect(screen.getByText('docente.activo@tutoria.edu.ec')).toBeTruthy()
    expect(screen.getByText('Estudiante Bloqueado')).toBeTruthy()
    expect(screen.getByText('estudiante.bloqueado@tutoria.edu.ec')).toBeTruthy()
    expect(screen.getByText('Estudiante Inactivo')).toBeTruthy()
    expect(screen.getAllByText('Docente').length).toBeGreaterThan(0)
    expect(screen.queryByText('Carlos Bernabé')).toBeNull()
  })

  it('renderiza badges cromáticos según ACTIVO, BLOQUEADO e INACTIVO', async () => {
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockResolvedValueOnce(
      respuestaDirectorio,
    )

    renderizarConsola()
    await screen.findByText('Docente Activo')

    const badgeActivo = screen.getAllByText('ACTIVO')[0]
    const badgeBloqueado = screen.getByText('BLOQUEADO')
    const badgeInactivo = screen.getByText('INACTIVO')

    expect(badgeActivo.className).toContain('bg-emerald-50')
    expect(badgeBloqueado.className).toContain('bg-red-50')
    expect(badgeInactivo.className).toContain('bg-amber-50')
  })

  it('muestra un estado de carga mientras consulta la API', async () => {
    let resolverConsulta
    const consultaPendiente = new Promise((resolver) => {
      resolverConsulta = resolver
    })
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockReturnValueOnce(
      consultaPendiente,
    )

    renderizarConsola()

    expect(screen.getByRole('status').textContent).toContain('Cargando directorio')

    await act(async () => {
      resolverConsulta(respuestaDirectorio)
    })

    expect(await screen.findByText('Docente Activo')).toBeTruthy()
  })

  it('muestra un error con reintento y vuelve a consultar la API', async () => {
    const servicioUsuarios = vi
      .spyOn(autenticacionServicio, 'obtenerUsuarios')
      .mockRejectedValueOnce(new Error('Fallo de red'))
      .mockResolvedValueOnce(respuestaDirectorio)

    renderizarConsola()

    expect(await screen.findByText(/No fue posible cargar el directorio/i)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }))

    expect(await screen.findByText('Docente Activo')).toBeTruthy()
    expect(servicioUsuarios).toHaveBeenCalledTimes(2)
  })
})

describe('RF-S1-10: acciones reales de cambio de estado en la consola', () => {
  it('renderiza las acciones correspondientes al estado de cada cuenta', async () => {
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockResolvedValueOnce(
      respuestaDirectorio,
    )

    renderizarConsola({ ...administradorSesion, id: 99 })
    await screen.findByText('Docente Activo')

    const filaActiva = obtenerFila('Docente Activo')
    expect(within(filaActiva).getByRole('button', { name: /Bloquear/i })).toBeTruthy()
    expect(within(filaActiva).getByRole('button', { name: /Inactivar/i })).toBeTruthy()

    const filaBloqueada = obtenerFila('Estudiante Bloqueado')
    expect(within(filaBloqueada).getByRole('button', { name: /Desbloquear/i })).toBeTruthy()
    expect(within(filaBloqueada).getByRole('button', { name: /Inactivar/i })).toBeTruthy()

    const filaInactiva = obtenerFila('Estudiante Inactivo')
    expect(within(filaInactiva).getByRole('button', { name: /Activar/i })).toBeTruthy()
    expect(within(filaInactiva).queryByRole('button', { name: /Bloquear/i })).toBeNull()
  })

  it('oculta las acciones destructivas sobre la cuenta del Administrador en sesión', async () => {
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockResolvedValueOnce(
      respuestaDirectorio,
    )

    renderizarConsola(administradorSesion)
    await screen.findAllByText('Administrador TutorIA')

    const filaPropia = obtenerFila('Administrador TutorIA')
    expect(within(filaPropia).queryByRole('button', { name: /Bloquear/i })).toBeNull()
    expect(within(filaPropia).queryByRole('button', { name: /Inactivar/i })).toBeNull()
    expect(within(filaPropia).getByText('Tu cuenta')).toBeTruthy()
  })

  it('ejecuta PATCH, muestra aviso y refresca el listado desde la API', async () => {
    const directorioConBloqueo = {
      ...respuestaDirectorio,
      usuarios: respuestaDirectorio.usuarios.map((usuario) =>
        usuario.id === 2 ? { ...usuario, estado: 'BLOQUEADO' } : usuario,
      ),
    }
    const servicioUsuarios = vi
      .spyOn(autenticacionServicio, 'obtenerUsuarios')
      .mockResolvedValueOnce(respuestaDirectorio)
      .mockResolvedValueOnce(directorioConBloqueo)
    const servicioEstado = vi
      .spyOn(autenticacionServicio, 'actualizarEstadoUsuario')
      .mockResolvedValueOnce({ ...respuestaDirectorio.usuarios[1], estado: 'BLOQUEADO' })

    renderizarConsola()
    await screen.findByText('Docente Activo')

    fireEvent.click(within(obtenerFila('Docente Activo')).getByRole('button', { name: /Bloquear/i }))

    await waitFor(() => {
      expect(servicioEstado).toHaveBeenCalledWith(2, 'BLOQUEADO')
      expect(servicioUsuarios).toHaveBeenCalledTimes(2)
    })
    await waitFor(() => {
      const filaActualizada = obtenerFila('Docente Activo')
      expect(within(filaActualizada).getByRole('button', { name: /Desbloquear/i })).toBeTruthy()
    })
    expect(screen.getByText('Estado Actualizado')).toBeTruthy()
  })

  it('muestra el detalle de error cuando la API rechaza el cambio de estado', async () => {
    vi.spyOn(autenticacionServicio, 'obtenerUsuarios').mockResolvedValueOnce(
      respuestaDirectorio,
    )
    vi.spyOn(autenticacionServicio, 'actualizarEstadoUsuario').mockRejectedValueOnce({
      response: { status: 409, data: { detail: 'El Administrador no puede bloquear su cuenta' } },
    })

    renderizarConsola()
    await screen.findByText('Docente Activo')

    fireEvent.click(within(obtenerFila('Docente Activo')).getByRole('button', { name: /Bloquear/i }))

    expect(await screen.findByText('Error al Actualizar Estado')).toBeTruthy()
    expect(screen.getByText('El Administrador no puede bloquear su cuenta')).toBeTruthy()
  })
})

describe('RF-S1-09: refresco del directorio tras crear un usuario', () => {
  it('vuelve a consultar la API y muestra el usuario devuelto por MySQL', async () => {
    const usuarioCreado = {
      id: 5,
      cedula: '1700000005',
      nombresCompletos: 'Nuevo Docente API',
      correoInstitucional: 'nuevo.docente@tutoria.edu.ec',
      rolPrincipal: 'DOCENTE',
      estado: 'ACTIVO',
    }
    const directorioActualizado = {
      ...respuestaDirectorio,
      total: 5,
      usuarios: [usuarioCreado, ...respuestaDirectorio.usuarios],
    }
    const servicioUsuarios = vi
      .spyOn(autenticacionServicio, 'obtenerUsuarios')
      .mockResolvedValueOnce(respuestaDirectorio)
      .mockResolvedValueOnce(directorioActualizado)
    vi.spyOn(autenticacionServicio, 'crearUsuario').mockResolvedValueOnce(usuarioCreado)

    renderizarConsola()
    await screen.findByText('Docente Activo')

    fireEvent.click(screen.getAllByRole('button', { name: /Nuevo Usuario/i })[0])
    fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), {
      target: { value: 'Nuevo Docente API' },
    })
    fireEvent.change(screen.getByPlaceholderText('0000000000'), {
      target: { value: '1700000005' },
    })
    fireEvent.change(screen.getByPlaceholderText(/nombre@tutoria.edu/i), {
      target: { value: 'nuevo.docente@tutoria.edu.ec' },
    })
    fireEvent.click(screen.getByText('Guardar').closest('button'))

    await waitFor(() => {
      expect(autenticacionServicio.crearUsuario).toHaveBeenCalled()
      expect(servicioUsuarios).toHaveBeenCalledTimes(2)
    })
    expect(await screen.findByText('Nuevo Docente API')).toBeTruthy()
    expect(screen.getByText('Usuario Registrado')).toBeTruthy()
  })
})
