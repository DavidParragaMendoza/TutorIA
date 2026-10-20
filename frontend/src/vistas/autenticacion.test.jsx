import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import clienteApi, { URL_BASE_API, CLAVE_TOKEN, CLAVE_USUARIO } from '../servicios/clienteApi.js'
import * as autenticacionServicio from '../servicios/autenticacionServicio.js'
import {
  iniciarSesion,
  cerrarSesion,
  obtenerPerfilUsuario,
  crearUsuario,
  obtenerToken,
  obtenerUsuarioActual,
  estaAutenticado,
} from '../servicios/autenticacionServicio.js'
import VistaAutenticacion from './VistaAutenticacion.jsx'
import VistaConsolaAdministrador from './VistaConsolaAdministrador.jsx'

describe('Servicio de Autenticación y Cliente API HTTP', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  describe('TAREA-3.1: clienteApi (Axios)', () => {
    it('está configurado con la URL base predeterminada', () => {
      expect(clienteApi.defaults.baseURL).toBe(URL_BASE_API)
    })

    it('inyecta el encabezado Authorization con Bearer token si existe en localStorage', async () => {
      localStorage.setItem(CLAVE_TOKEN, 'token-ficticio-123')
      const configSimulada = { headers: {} }

      const interceptor = clienteApi.interceptors.request.handlers[0]
      const resultadoConfig = await interceptor.fulfilled(configSimulada)

      expect(resultadoConfig.headers.Authorization).toBe('Bearer token-ficticio-123')
    })

    it('no inyecta encabezado Authorization si no hay token en localStorage', async () => {
      const configSimulada = { headers: {} }
      const interceptor = clienteApi.interceptors.request.handlers[0]
      const resultadoConfig = await interceptor.fulfilled(configSimulada)

      expect(resultadoConfig.headers.Authorization).toBeUndefined()
    })

    it('limpia localStorage ante un error HTTP 401', async () => {
      localStorage.setItem(CLAVE_TOKEN, 'token-expirado')
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify({ id: 1 }))

      const interceptorRespuesta = clienteApi.interceptors.response.handlers[0]
      const error401 = {
        response: { status: 401, data: { detail: 'Credenciales inválidas' } },
      }

      await expect(interceptorRespuesta.rejected(error401)).rejects.toEqual(error401)
      expect(localStorage.getItem(CLAVE_TOKEN)).toBeNull()
      expect(localStorage.getItem(CLAVE_USUARIO)).toBeNull()
    })
  })

  describe('TAREA-3.2: autenticacionServicio', () => {
    const respuestaLoginExitosa = {
      tokenAcceso: 'jwt.token.valido',
      tipoToken: 'Bearer',
      expiraEnSegundos: 28800,
      usuario: {
        id: 12,
        nombresCompletos: 'Estudiante Prueba',
        correoInstitucional: 'estudiante@tutoria.edu.ec',
        rolPrincipal: 'ESTUDIANTE',
        pseudonimoHash: 'hash123',
      },
    }

    it('iniciarSesion realiza POST /api/v1/auth/login y almacena token y usuario', async () => {
      vi.spyOn(clienteApi, 'post').mockResolvedValueOnce({ data: respuestaLoginExitosa })

      const resultado = await iniciarSesion('estudiante@tutoria.edu.ec', 'Estudiante123*')

      expect(clienteApi.post).toHaveBeenCalledWith('/api/v1/auth/login', {
        identificador: 'estudiante@tutoria.edu.ec',
        contrasena: 'Estudiante123*',
      })
      expect(resultado).toEqual(respuestaLoginExitosa)
      expect(obtenerToken()).toBe('jwt.token.valido')
      expect(obtenerUsuarioActual()).toEqual(respuestaLoginExitosa.usuario)
      expect(estaAutenticado()).toBe(true)
    })

    it('cerrarSesion realiza POST /api/v1/auth/logout y limpia almacenamiento local', async () => {
      localStorage.setItem(CLAVE_TOKEN, 'token.a.limpiar')
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify({ id: 9 }))
      vi.spyOn(clienteApi, 'post').mockResolvedValueOnce({
        data: { mensaje: 'Sesión finalizada exitosamente' },
      })

      const resultado = await cerrarSesion()

      expect(clienteApi.post).toHaveBeenCalledWith('/api/v1/auth/logout')
      expect(resultado).toEqual({ mensaje: 'Sesión finalizada exitosamente' })
      expect(obtenerToken()).toBeNull()
      expect(obtenerUsuarioActual()).toBeNull()
      expect(estaAutenticado()).toBe(false)
    })

    it('obtenerPerfilUsuario realiza GET /api/v1/auth/me y actualiza datos de usuario', async () => {
      const perfilActualizado = {
        id: 12,
        nombresCompletos: 'Estudiante Actualizado',
        correoInstitucional: 'estudiante@tutoria.edu.ec',
        rolPrincipal: 'ESTUDIANTE',
        pseudonimoHash: 'hash123',
      }
      vi.spyOn(clienteApi, 'get').mockResolvedValueOnce({ data: perfilActualizado })

      const resultado = await obtenerPerfilUsuario()

      expect(clienteApi.get).toHaveBeenCalledWith('/api/v1/auth/me')
      expect(resultado).toEqual(perfilActualizado)
      expect(obtenerUsuarioActual()).toEqual(perfilActualizado)
    })

    it('crearUsuario realiza POST /api/v1/users con los datos del nuevo usuario', async () => {
      const nuevoUsuario = {
        cedula: '0912345678',
        nombresCompletos: 'Docente Nuevo',
        correoInstitucional: 'docente.nuevo@tutoria.edu.ec',
        contrasena: 'Docente123*',
        rolId: 2,
      }
      const respuestaCreacion = {
        id: 15,
        cedula: '0912345678',
        nombresCompletos: 'Docente Nuevo',
        correoInstitucional: 'docente.nuevo@tutoria.edu.ec',
        rolPrincipal: 'DOCENTE',
        estado: 'ACTIVO',
      }
      vi.spyOn(clienteApi, 'post').mockResolvedValueOnce({ data: respuestaCreacion })

      const resultado = await crearUsuario(nuevoUsuario)

      expect(clienteApi.post).toHaveBeenCalledWith('/api/v1/users', nuevoUsuario)
      expect(resultado).toEqual(respuestaCreacion)
    })
  })

  describe('TAREA-3.3: Conexión Real de VistaAutenticacion.jsx', () => {
    it('envía credenciales a iniciarSesion() y llama a alIniciarSesion tras éxito', async () => {
      const alIniciarSesionMock = vi.fn()
      const respuestaApi = {
        tokenAcceso: 'token.jwt.valido',
        usuario: {
          id: 1,
          nombresCompletos: 'Admin TutorIA',
          rolPrincipal: 'ADMINISTRADOR',
        },
      }

      vi.spyOn(autenticacionServicio, 'iniciarSesion').mockResolvedValueOnce(respuestaApi)

      render(
        <VistaAutenticacion
          alIniciarSesion={alIniciarSesionMock}
          alSolicitarRecuperacion={vi.fn()}
        />,
      )

      const inputIdentificador = screen.getByLabelText(/Usuario o Correo Institucional/i)
      const inputContrasena = screen.getByLabelText(/Contraseña de registro/i)
      const botonIngresar = screen.getByRole('button', { name: /Ingresar/i })

      fireEvent.change(inputIdentificador, { target: { value: 'admin@tutoria.edu.ec' } })
      fireEvent.change(inputContrasena, { target: { value: 'Admin123*' } })
      fireEvent.click(botonIngresar)

      await waitFor(() => {
        expect(autenticacionServicio.iniciarSesion).toHaveBeenCalledWith(
          'admin@tutoria.edu.ec',
          'Admin123*',
        )
        expect(alIniciarSesionMock).toHaveBeenCalledWith(respuestaApi.usuario)
      })
    })

    it('muestra mensaje de error cuando la API rechaza las credenciales', async () => {
      const error401 = {
        response: {
          status: 401,
          data: { detail: 'Credenciales inválidas. Cuenta bloqueada temporalmente por 3 intentos fallidos.' },
        },
      }

      vi.spyOn(autenticacionServicio, 'iniciarSesion').mockRejectedValueOnce(error401)

      render(
        <VistaAutenticacion
          alIniciarSesion={vi.fn()}
          alSolicitarRecuperacion={vi.fn()}
        />,
      )

      fireEvent.change(screen.getByLabelText(/Usuario o Correo Institucional/i), {
        target: { value: 'usuario@error.ec' },
      })
      fireEvent.change(screen.getByLabelText(/Contraseña de registro/i), {
        target: { value: 'Invalida123*' },
      })
      fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }))

      await waitFor(() => {
        const alerta = screen.getByRole('alert')
        expect(alerta).not.toBeNull()
        expect(alerta.textContent).toContain('Cuenta bloqueada temporalmente')
      })
    })

    it('muestra estado de carga y deshabilita el botón mientras responde la API', async () => {
      let resolverPromesa
      const promesaPendiente = new Promise((resolve) => {
        resolverPromesa = resolve
      })

      vi.spyOn(autenticacionServicio, 'iniciarSesion').mockReturnValueOnce(promesaPendiente)

      render(
        <VistaAutenticacion
          alIniciarSesion={vi.fn()}
          alSolicitarRecuperacion={vi.fn()}
        />,
      )

      fireEvent.change(screen.getByLabelText(/Usuario o Correo Institucional/i), {
        target: { value: 'admin@tutoria.edu.ec' },
      })
      fireEvent.change(screen.getByLabelText(/Contraseña de registro/i), {
        target: { value: 'Admin123*' },
      })

      const boton = screen.getByRole('button', { name: /Ingresar/i })
      fireEvent.click(boton)

      // Verificamos que durante la espera el botón muestre 'Ingresando...' y esté deshabilitado
      await waitFor(() => {
        expect(screen.getByText('Ingresando...')).not.toBeNull()
        expect(boton.disabled).toBe(true)
      })

      // Resolvemos la promesa para finalizar la prueba
      resolverPromesa({
        tokenAcceso: 'token',
        usuario: { id: 1, rolPrincipal: 'ADMINISTRADOR' },
      })

      await waitFor(() => {
        expect(boton.disabled).toBe(false)
      })
    })
  })

  describe('TAREA-3.5: Conexión Real de VistaConsolaAdministrador.jsx', () => {
    it('crea un usuario vía crearUsuario() y muestra aviso de éxito', async () => {
      const usuarioCreadoRespuesta = {
        id: 99,
        cedula: '0987654321',
        nombresCompletos: 'Nuevo Docente',
        correoInstitucional: 'nuevo.docente@tutoria.edu.ec',
        rolPrincipal: 'DOCENTE',
        estado: 'ACTIVO',
      }

      vi.spyOn(autenticacionServicio, 'crearUsuario').mockResolvedValueOnce(usuarioCreadoRespuesta)

      render(
        <VistaConsolaAdministrador
          alCerrarSesion={vi.fn()}
          usuarioSesion={{
            id: 1,
            nombreCompleto: 'Admin Principal',
            correo: 'admin@tutoria.edu.ec',
            iniciales: 'AP',
          }}
        />,
      )

      // Abrir modal de nuevo usuario
      const botonNuevo = screen.getAllByRole('button', { name: /Nuevo Usuario/i })[0]
      fireEvent.click(botonNuevo)

      expect(screen.getByText('Crea una credencial institucional en el directorio académico')).not.toBeNull()

      // Llenar campos
      fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), {
        target: { value: 'Nuevo Docente' },
      })
      fireEvent.change(screen.getByPlaceholderText('0000000000'), {
        target: { value: '1720000001' },
      })
      fireEvent.change(screen.getByPlaceholderText(/nombre@tutoria.edu/i), {
        target: { value: 'nuevo.docente@tutoria.edu.ec' },
      })

      // Seleccionar rol Docente
      const selectRol = screen.getAllByRole('combobox').find((combobox) => combobox.closest('form'))
      fireEvent.change(selectRol, { target: { value: 'Docente' } })

      // Guardar
      const botonGuardar = screen.getByText('Guardar').closest('button')
      fireEvent.click(botonGuardar)

      await waitFor(() => {
        expect(autenticacionServicio.crearUsuario).toHaveBeenCalledWith({
          cedula: '1720000001',
          nombresCompletos: 'Nuevo Docente',
          correoInstitucional: 'nuevo.docente@tutoria.edu.ec',
          contrasena: 'Tempo2026!',
          rolId: 2,
        })
        expect(screen.getByText('Usuario Registrado')).not.toBeNull()
      })
    })

    it('muestra alerta de duplicidad cuando la API responde con HTTP 409', async () => {
      const error409 = {
        response: {
          status: 409,
          data: { detail: 'Ya existe un usuario registrado con esa cédula o correo' },
        },
      }

      vi.spyOn(autenticacionServicio, 'crearUsuario').mockRejectedValueOnce(error409)

      render(
        <VistaConsolaAdministrador
          alCerrarSesion={vi.fn()}
          usuarioSesion={{
            id: 1,
            nombreCompleto: 'Admin Principal',
            correo: 'admin@tutoria.edu.ec',
            iniciales: 'AP',
          }}
        />,
      )

      fireEvent.click(screen.getAllByRole('button', { name: /Nuevo Usuario/i })[0])

      fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), {
        target: { value: 'Usuario Duplicado' },
      })
      fireEvent.change(screen.getByPlaceholderText('0000000000'), {
        target: { value: '1720000002' },
      })
      fireEvent.change(screen.getByPlaceholderText(/nombre@tutoria.edu/i), {
        target: { value: 'duplicado@tutoria.edu.ec' },
      })

      const botonGuardarDuplicado = screen.getByText('Guardar').closest('button')
      fireEvent.click(botonGuardarDuplicado)

      await waitFor(() => {
        expect(screen.getByText('Error al Registrar')).not.toBeNull()
        expect(screen.getByText(/Ya existe un usuario registrado con esa cédula o correo/i)).not.toBeNull()
      })
    })
  })
})
