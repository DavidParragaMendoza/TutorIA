import { useEffect, useMemo, useState } from 'react'
import datosIniciales from '../datosSimulados/usuariosAdminMock.json'
import { crearUsuario as crearUsuarioServicio } from '../servicios/autenticacionServicio.js'

const clasesTonoAvatar = {
  porcelain: 'bg-brand-porcelain/10 text-brand-porcelain',
  emerald: 'bg-emerald-600/10 text-emerald-700',
  cinabrio: 'bg-brand-cinabrio/10 text-brand-cinabrio',
}

const clasesRol = {
  Estudiante: 'bg-blue-50 text-brand-porcelain border-brand-porcelain/20',
  Docente: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Administrador: 'bg-brand-cinabrio/10 text-brand-cinabrio border-brand-cinabrio/20',
}

const clasesTonoAccion = {
  porcelain: 'text-brand-porcelain hover:bg-surface-container',
  secondary: 'text-brand-cinabrio hover:bg-brand-cinabrio/10',
  emerald: 'text-emerald-700 hover:bg-emerald-50',
  neutral: 'text-slate-600 hover:bg-surface-container',
}

function VistaConsolaAdministrador({ alCerrarSesion, usuarioSesion }) {
  const [datos] = useState(datosIniciales)
  const {
    marca,
    sistema,
    administrador,
    encabezado,
    pestanas,
    directorio,
    filtrosRol,
    usuarios,
    paginacion,
    parametrosIa,
    modalUsuario,
    textos,
  } = datos

  const perfilAdmin = usuarioSesion ?? administrador

  const [listaUsuarios, setListaUsuarios] = useState(usuarios)
  const [pestanaActiva, setPestanaActiva] = useState('usuarios')
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [rolFiltro, setRolFiltro] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardandoUsuario, setGuardandoUsuario] = useState(false)
  const [formularioUsuario, setFormularioUsuario] = useState(modalUsuario.camposIniciales)
  const [tokenVisible, setTokenVisible] = useState(false)
  const [valoresRag, setValoresRag] = useState(() =>
    Object.fromEntries(parametrosIa.motorRag.campos.map((campo) => [campo.clave, campo.valor])),
  )
  const [tokenAudio, setTokenAudio] = useState(parametrosIa.motorAudio.token)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(null), 4000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  useEffect(() => {
    if (!modalAbierto) return undefined
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') setModalAbierto(false)
    }
    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [modalAbierto])

  const usuariosFiltrados = useMemo(() => {
    const termino = terminoBusqueda.trim().toLowerCase()
    return listaUsuarios.filter((usuario) => {
      const coincideRol = rolFiltro === 'todos' || usuario.rol === rolFiltro
      const coincideBusqueda =
        termino === '' ||
        usuario.nombreCompleto.toLowerCase().includes(termino) ||
        usuario.cedula.includes(termino) ||
        usuario.correo.toLowerCase().includes(termino)
      return coincideRol && coincideBusqueda
    })
  }, [listaUsuarios, rolFiltro, terminoBusqueda])

  const cedulaDuplicada = listaUsuarios.some(
    (usuario) => usuario.cedula === formularioUsuario.cedula.trim(),
  )

  const actualizarCampo = (clave, valor) => {
    setFormularioUsuario((previos) => ({ ...previos, [clave]: valor }))
  }

  const abrirModal = () => {
    setFormularioUsuario(modalUsuario.camposIniciales)
    setModalAbierto(true)
  }

  const guardarUsuario = async (evento) => {
    evento.preventDefault()

    const mapeoRolId = {
      Estudiante: 1,
      ESTUDIANTE: 1,
      Docente: 2,
      DOCENTE: 2,
      Administrador: 3,
      ADMINISTRADOR: 3,
    }

    const rolId = mapeoRolId[formularioUsuario.rol] || 1
    const datosEnvio = {
      cedula: formularioUsuario.cedula.trim(),
      nombresCompletos: formularioUsuario.nombres.trim(),
      correoInstitucional: formularioUsuario.correo.trim(),
      contrasena: formularioUsuario.contrasena?.trim() || 'Tempo2026!',
      rolId,
    }

    setGuardandoUsuario(true)
    try {
      const usuarioCreado = await crearUsuarioServicio(datosEnvio)
      setModalAbierto(false)
      setAviso({
        tipo: 'exito',
        titulo: 'Usuario Registrado',
        descripcion: `${usuarioCreado.nombresCompletos} fue añadido al directorio académico como ${usuarioCreado.rolPrincipal}.`,
      })
      const nuevoParaLista = {
        id: `USR-${usuarioCreado.id}`,
        iniciales: usuarioCreado.nombresCompletos.slice(0, 2).toUpperCase(),
        nombreCompleto: usuarioCreado.nombresCompletos,
        cedula: usuarioCreado.cedula,
        correo: usuarioCreado.correoInstitucional,
        rol: formularioUsuario.rol,
        estado: 'Activo',
        tonoAvatar: 'porcelain',
        acciones: [],
      }
      setListaUsuarios((prev) => [nuevoParaLista, ...prev])
      setFormularioUsuario(modalUsuario.camposIniciales)
    } catch (error) {
      const detalle = error.response?.data?.detail
      setAviso({
        tipo: 'error',
        titulo: 'Error al Registrar',
        descripcion: detalle || 'Ocurrió un error al registrar el usuario en el servidor.',
      })
    } finally {
      setGuardandoUsuario(false)
    }
  }

  const restablecerParametros = () => {
    setValoresRag(
      Object.fromEntries(parametrosIa.motorRag.campos.map((campo) => [campo.clave, campo.valor])),
    )
    setTokenAudio(parametrosIa.motorAudio.token)
    setAviso({
      titulo: 'Parámetros Restablecidos',
      descripcion: 'Los valores técnicos del motor de IA volvieron a su configuración por defecto.',
    })
  }

  const guardarParametros = () => {
    setAviso({
      titulo: 'Configuración IA Guardada',
      descripcion: 'Los parámetros del motor RAG y del audio fonético fueron persistidos localmente.',
    })
  }

  const copiarToken = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(tokenAudio)
    setAviso({
      titulo: 'Token Copiado',
      descripcion: 'La clave del pipeline fonético fue copiada al portapapeles.',
    })
  }

  return (
    <div className="h-full bg-brand-bg font-body text-brand-porcelain antialiased flex flex-col md:flex-row relative min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-brand-card border-r border-brand-border-light flex flex-col justify-between shrink-0 z-20 md:h-screen md:sticky md:top-0 shadow-sm">
        <div>
          <div className="p-6 border-b border-brand-border-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-cinabrio flex items-center justify-center text-white shadow-sm ring-2 ring-brand-cinabrio/20">
                <span className="font-hanzi-serif text-xl font-bold tracking-tight">华</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-brand-porcelain">
                    {marca.nombreBase}
                    <span className="text-brand-cinabrio">{marca.nombreDestacado}</span>
                  </span>
                </div>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-cinabrio bg-brand-cinabrio/10 px-2 py-0.5 rounded">
                  {marca.etiquetaRol}
                </span>
              </div>
            </div>
          </div>

          <div className="px-4 py-6">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-brand-porcelain/50 mb-3">
              {textos.menuPrincipal}
            </p>
            <nav className="space-y-1.5">
              {pestanas.map((pestana) => {
                const activa = pestana.clave === pestanaActiva
                return (
                  <button
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 cursor-pointer ${
                      activa
                        ? 'bg-brand-porcelain text-white shadow-sm'
                        : 'text-brand-porcelain/80 hover:bg-brand-porcelain/10 hover:text-brand-porcelain'
                    }`}
                    key={pestana.clave}
                    type="button"
                    onClick={() => setPestanaActiva(pestana.clave)}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        activa ? '' : 'text-brand-porcelain/60'
                      }`}
                    >
                      {pestana.icono}
                    </span>
                    <span className="text-sm">{pestana.etiqueta}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-brand-border-light bg-brand-card/80">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-brand-bg/60">
            <div className="w-8 h-8 rounded-full bg-brand-porcelain/15 flex items-center justify-center text-brand-porcelain font-bold text-xs">
              {perfilAdmin.iniciales}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-brand-porcelain truncate">
                {perfilAdmin.nombreCompleto}
              </p>
              <p className="text-[11px] text-brand-porcelain/60 truncate">{perfilAdmin.correo}</p>
            </div>
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-brand-border-light text-brand-porcelain/80 hover:text-brand-cinabrio hover:border-brand-cinabrio/30 hover:bg-brand-cinabrio/5 text-xs font-semibold transition-all duration-150 cursor-pointer"
            type="button"
            onClick={alCerrarSesion}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>{textos.cerrarSesion}</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-10 text-[180px] font-hanzi-serif font-bold text-brand-porcelain/[0.04] leading-none z-0 hidden lg:block select-none"
        >
          华语
        </div>

        <header className="relative z-10 px-6 py-6 md:px-8 border-b border-surface-container-highest/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-label font-semibold tracking-wide bg-surface-container-highest text-brand-porcelain">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {sistema.etiquetaVersion}
              </span>
              <span className="text-xs text-on-surface-variant font-label">{sistema.cluster}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-brand-porcelain tracking-tight">
              {encabezado.titulo}
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant font-body mt-0.5 max-w-2xl">
              {encabezado.subtitulo}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-high/60 p-1.5 rounded-xl shadow-inner self-start lg:self-center">
            {pestanas.map((pestana) => {
              const activa = pestana.clave === pestanaActiva
              return (
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-headline font-semibold transition-all duration-200 cursor-pointer ${
                    activa
                      ? 'bg-brand-porcelain text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-brand-porcelain'
                  }`}
                  key={pestana.clave}
                  type="button"
                  onClick={() => setPestanaActiva(pestana.clave)}
                >
                  <span className="material-symbols-outlined text-base">{pestana.icono}</span>
                  <span>{pestana.etiqueta}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-label ${
                      activa
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {pestana.insignia}
                  </span>
                </button>
              )
            })}
          </div>
        </header>

        <div className="relative z-10 p-6 md:p-8 space-y-8 flex-1">
          {/* ============ SECCIÓN 1: GESTIÓN DE USUARIOS ============ */}
          {pestanaActiva === 'usuarios' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-headline font-bold text-brand-porcelain">
                      {directorio.titulo}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      {directorio.estado}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-body">
                    {directorio.descripcion}
                  </p>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-brand-cinabrio hover:bg-secondary-container text-white px-5 py-2.5 rounded-xl font-headline font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all duration-150 active:scale-95 shrink-0 cursor-pointer"
                  type="button"
                  onClick={abrirModal}
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>+ {directorio.botonNuevo}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                <div className="md:col-span-6 lg:col-span-7 relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-on-surface-variant/60 text-lg">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all"
                    placeholder={textos.buscarPlaceholder}
                    type="text"
                    value={terminoBusqueda}
                    onChange={(evento) => setTerminoBusqueda(evento.target.value)}
                  />
                </div>
                <div className="md:col-span-3 lg:col-span-3 relative">
                  <select
                    className="w-full pl-3.5 pr-8 py-2.5 text-xs bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all appearance-none cursor-pointer font-medium"
                    value={rolFiltro}
                    onChange={(evento) => setRolFiltro(evento.target.value)}
                  >
                    {filtrosRol.map((filtro) => (
                      <option key={filtro.valor} value={filtro.valor}>
                        {filtro.etiqueta}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
                <div className="md:col-span-3 lg:col-span-2 flex items-center justify-end">
                  <div className="w-full md:w-auto px-4 py-2 bg-surface-container-low rounded-xl flex items-center justify-between md:justify-center gap-2 text-xs font-headline font-semibold text-brand-porcelain">
                    <span className="text-on-surface-variant font-normal">
                      {directorio.etiquetaRegistros}
                    </span>
                    <span className="font-label text-sm text-brand-porcelain font-bold">
                      {usuariosFiltrados.length} usuarios
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container border-b border-surface-container-highest text-[11px] font-label font-bold text-on-surface-variant tracking-wider uppercase">
                        <th className="py-3.5 px-6">{textos.columnaNombre}</th>
                        <th className="py-3.5 px-4">{textos.columnaCedula}</th>
                        <th className="py-3.5 px-4">{textos.columnaCorreo}</th>
                        <th className="py-3.5 px-4">{textos.columnaRol}</th>
                        <th className="py-3.5 px-4">{textos.columnaEstado}</th>
                        <th className="py-3.5 px-6 text-right">{textos.columnaAcciones}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-highest/60 text-xs font-body">
                      {usuariosFiltrados.map((usuario) => {
                        const activo = usuario.estado === 'Activo'
                        return (
                          <tr
                            className={`hover:bg-surface-container-low/50 transition-colors ${
                              usuario.destacado ? 'bg-brand-cinabrio/5' : ''
                            }`}
                            key={usuario.id}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg font-headline font-bold flex items-center justify-center text-xs ${clasesTonoAvatar[usuario.tonoAvatar]}`}
                                >
                                  {usuario.iniciales}
                                </div>
                                <div>
                                  <p className="font-headline font-semibold text-brand-porcelain">
                                    {usuario.nombreCompleto}
                                  </p>
                                  <p className="text-[10px] text-on-surface-variant font-label">
                                    ID: {usuario.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-label font-medium text-on-surface">
                              {usuario.cedula}
                            </td>
                            <td className="py-4 px-4 text-on-surface-variant font-label">
                              {usuario.correo}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${clasesRol[usuario.rol]}`}
                              >
                                {usuario.rol}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  activo
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'bg-red-50 text-error'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    activo ? 'bg-emerald-600' : 'bg-error'
                                  }`}
                                ></span>
                                {usuario.estado}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                              {usuario.acciones.map((accion) => (
                                <button
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-headline font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer ${clasesTonoAccion[accion.tono]}`}
                                  key={accion.clave}
                                  type="button"
                                  onClick={() =>
                                    setAviso({
                                      titulo: `${accion.etiqueta} usuario`,
                                      descripcion: `Acción «${accion.etiqueta}» ejecutada sobre ${usuario.nombreCompleto}.`,
                                    })
                                  }
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {accion.icono}
                                  </span>
                                  {accion.etiqueta}
                                </button>
                              ))}
                            </td>
                          </tr>
                        )
                      })}

                      {usuariosFiltrados.length === 0 && (
                        <tr>
                          <td
                            className="py-10 px-6 text-center text-sm text-on-surface-variant"
                            colSpan={6}
                          >
                            No se encontraron cuentas para el filtro o la búsqueda aplicada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-surface-container/50 border-t border-surface-container-highest/60 flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="font-label text-[11px]">
                    Mostrando {usuariosFiltrados.length} de {paginacion.total} {paginacion.mensaje}
                  </span>
                  <span className="font-body text-[11px]">
                    {paginacion.copiaSeguridad.split(':')[0]}:{' '}
                    <strong className="font-label">{paginacion.copiaSeguridad.split(':')[1]}</strong>
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ============ SECCIÓN 2: CONFIGURACIÓN IA ============ */}
          {pestanaActiva === 'ia' && (
            <section className="space-y-6">
              <div className="bg-brand-porcelain text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                      </span>
                      <span className="text-xs font-label uppercase tracking-widest text-white/80">
                        {parametrosIa.hero.etiqueta}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-headline font-bold">
                      {parametrosIa.hero.titulo}
                    </h2>
                    <p className="text-xs md:text-sm text-on-primary-container max-w-xl">
                      {parametrosIa.hero.detalle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm self-start md:self-auto">
                    <span className="material-symbols-outlined text-3xl text-emerald-400">
                      verified
                    </span>
                    <div>
                      <p className="text-[10px] font-label uppercase tracking-wider text-white/70">
                        {parametrosIa.hero.estadoEtiqueta}
                      </p>
                      <p className="text-xs font-headline font-bold text-white">
                        {parametrosIa.hero.estadoValor}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute right-6 -bottom-8 text-9xl text-white/5 font-hanzi-serif font-bold select-none pointer-events-none"
                >
                  神
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card: Motor RAG */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-porcelain/10 text-brand-porcelain flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">
                          {parametrosIa.motorRag.icono}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-base text-brand-porcelain">
                          {parametrosIa.motorRag.titulo}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant font-body">
                          {parametrosIa.motorRag.descripcion}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">
                      {parametrosIa.motorRag.insignia}
                    </span>
                  </div>
                  <form className="space-y-4" onSubmit={(evento) => evento.preventDefault()}>
                    {parametrosIa.motorRag.campos.map((campo) => (
                      <div key={campo.clave}>
                        <label className="block text-xs font-label font-bold text-brand-porcelain mb-1.5 uppercase tracking-wider">
                          {campo.etiqueta}
                        </label>
                        <div className="relative">
                          <input
                            className="w-full px-3.5 py-2.5 text-xs bg-surface-container-lowest rounded-xl border border-outline-variant/50 text-on-surface font-label focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all"
                            type="text"
                            value={valoresRag[campo.clave]}
                            onChange={(evento) =>
                              setValoresRag((previos) => ({
                                ...previos,
                                [campo.clave]: evento.target.value,
                              }))
                            }
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant/40 text-base">
                            {campo.icono}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-on-surface-variant">{campo.ayuda}</p>
                      </div>
                    ))}
                  </form>
                </div>

                {/* Card: Motor de Audio */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-cinabrio/10 text-brand-cinabrio flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">
                          {parametrosIa.motorAudio.icono}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-base text-brand-porcelain">
                          {parametrosIa.motorAudio.titulo}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant font-body">
                          {parametrosIa.motorAudio.descripcion}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-label px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">
                      {parametrosIa.motorAudio.insignia}
                    </span>
                  </div>
                  <form className="space-y-4" onSubmit={(evento) => evento.preventDefault()}>
                    <div>
                      <label className="block text-xs font-label font-bold text-brand-porcelain mb-1.5 uppercase tracking-wider">
                        {parametrosIa.motorAudio.etiquetaToken}
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-3.5 pr-20 py-2.5 text-xs bg-surface-container-lowest rounded-xl border border-outline-variant/50 text-on-surface font-label focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all"
                          type={tokenVisible ? 'text' : 'password'}
                          value={tokenAudio}
                          onChange={(evento) => setTokenAudio(evento.target.value)}
                        />
                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                          <button
                            className="p-1 text-on-surface-variant/60 hover:text-brand-porcelain transition-colors cursor-pointer"
                            type="button"
                            onClick={() => setTokenVisible((valorPrevio) => !valorPrevio)}
                          >
                            <span className="material-symbols-outlined text-base">
                              {tokenVisible ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                          <button
                            className="p-1 text-on-surface-variant/60 hover:text-brand-porcelain transition-colors cursor-pointer"
                            type="button"
                            onClick={copiarToken}
                          >
                            <span className="material-symbols-outlined text-base">
                              content_copy
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-[11px] text-on-surface-variant">
                        {parametrosIa.motorAudio.ayudaToken}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {parametrosIa.motorAudio.telemetria.map((metrica) => (
                        <div className="p-3 bg-surface-container rounded-xl" key={metrica.etiqueta}>
                          <span className="text-[10px] font-label uppercase text-on-surface-variant">
                            {metrica.etiqueta}
                          </span>
                          <p
                            className={`font-label text-sm font-bold mt-0.5 ${
                              metrica.tono === 'secondary'
                                ? 'text-brand-cinabrio'
                                : 'text-brand-porcelain'
                            }`}
                          >
                            {metrica.valor}
                          </p>
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-body">
                  {parametrosIa.ultimaActualizacion.split(':')[0]}:{' '}
                  <strong className="font-label text-brand-porcelain">
                    {parametrosIa.ultimaActualizacion.split(':').slice(1).join(':').trim()}
                  </strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-headline font-semibold text-on-surface-variant hover:text-brand-porcelain hover:bg-surface-container transition-colors cursor-pointer"
                    type="button"
                    onClick={restablecerParametros}
                  >
                    {parametrosIa.botonRestablecer}
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 bg-brand-cinabrio hover:bg-secondary-container text-white px-5 py-2.5 rounded-xl font-headline font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                    type="button"
                    onClick={guardarParametros}
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>{parametrosIa.botonGuardar}</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* MODAL: REGISTRO DE USUARIO */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-porcelain/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-brand-card border border-brand-border-light rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-porcelain via-brand-porcelain to-brand-cinabrio"></div>
            <div className="p-6 border-b border-brand-border-light flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-brand-cinabrio/10 text-brand-cinabrio flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">person_add</span>
                </div>
                <div>
                  <h2 className="text-lg font-headline font-bold text-brand-porcelain tracking-tight">
                    {modalUsuario.titulo}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant font-body">
                    {modalUsuario.subtitulo}
                  </p>
                </div>
              </div>
              <button
                className="text-brand-porcelain/40 hover:text-brand-porcelain p-1 rounded-lg hover:bg-brand-bg transition-colors cursor-pointer"
                type="button"
                onClick={() => setModalAbierto(false)}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={guardarUsuario}>
              <div>
                <label className="block text-xs font-headline font-bold text-brand-porcelain mb-1.5">
                  {modalUsuario.etiquetaNombres} <span className="text-brand-cinabrio">*</span>
                </label>
                <input
                  className="w-full px-3.5 py-2.5 text-xs bg-brand-card rounded-xl border border-brand-border-light text-brand-porcelain placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all"
                  placeholder={modalUsuario.marcadorNombres}
                  type="text"
                  value={formularioUsuario.nombres}
                  onChange={(evento) => actualizarCampo('nombres', evento.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-headline font-bold text-brand-porcelain">
                    {modalUsuario.etiquetaCedula} <span className="text-brand-cinabrio">*</span>
                  </label>
                  <span className="text-[10px] text-brand-porcelain/50 font-label">
                    {modalUsuario.ayudaCedula}
                  </span>
                </div>
                <div className="relative">
                  <input
                    className={`w-full px-3.5 py-2.5 text-xs bg-brand-card rounded-xl text-brand-porcelain focus:outline-none shadow-sm transition-all font-label ${
                      cedulaDuplicada
                        ? 'border-2 border-error text-error font-bold focus:ring-1 focus:ring-error'
                        : 'border border-brand-border-light focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain'
                    }`}
                    placeholder={modalUsuario.marcadorCedula}
                    type="text"
                    value={formularioUsuario.cedula}
                    onChange={(evento) => actualizarCampo('cedula', evento.target.value)}
                  />
                  {cedulaDuplicada && (
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-error text-base">
                      error
                    </span>
                  )}
                </div>
                {cedulaDuplicada && (
                  <p className="mt-1.5 text-[11px] font-headline font-bold text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>{modalUsuario.errorDuplicado}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-brand-porcelain mb-1.5">
                  {modalUsuario.etiquetaCorreo} <span className="text-brand-cinabrio">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full px-3.5 py-2.5 text-xs bg-brand-card rounded-xl border border-brand-border-light text-brand-porcelain placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all font-label"
                    placeholder={modalUsuario.marcadorCorreo}
                    type="email"
                    value={formularioUsuario.correo}
                    onChange={(evento) => actualizarCampo('correo', evento.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-brand-porcelain/30 text-base">
                    mail
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-brand-porcelain mb-1.5">
                  {modalUsuario.etiquetaRol} <span className="text-brand-cinabrio">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3.5 py-2.5 text-xs bg-brand-card rounded-xl border border-brand-border-light text-brand-porcelain focus:outline-none focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain shadow-sm transition-all appearance-none cursor-pointer font-medium"
                    value={formularioUsuario.rol}
                    onChange={(evento) => actualizarCampo('rol', evento.target.value)}
                  >
                    {modalUsuario.rolesDisponibles.map((rol) => (
                      <option key={rol.valor} value={rol.valor}>
                        {rol.etiqueta}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-brand-porcelain/40 pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border-light flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-xl text-xs font-headline font-semibold text-brand-porcelain/70 hover:text-brand-porcelain hover:bg-brand-bg transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setModalAbierto(false)}
                >
                  {modalUsuario.botonCancelar}
                </button>
                <button
                  className="inline-flex items-center gap-1.5 bg-brand-cinabrio hover:bg-brand-cinabrio/90 text-white px-5 py-2.5 rounded-xl font-headline font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={guardandoUsuario || cedulaDuplicada}
                  type="submit"
                >
                  {guardandoUsuario ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>{modalUsuario.botonGuardar}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AVISO EMERGENTE */}
      <aside
        aria-live="polite"
        className={`fixed bottom-6 right-8 z-[60] flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl transition-all duration-300 ${
          aviso ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            aviso?.tipo === 'error' ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {aviso?.tipo === 'error' ? 'error' : 'check_circle'}
        </span>
        <div>
          <p className="text-xs font-bold text-white tracking-wide">
            {aviso ? aviso.titulo : 'Consola Administrativa'}
          </p>
          <p className="text-[11px] text-slate-300 font-label">
            {aviso ? aviso.descripcion : textos.pieEstado}
          </p>
        </div>
      </aside>
    </div>
  )
}

export default VistaConsolaAdministrador
