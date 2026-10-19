import { useEffect, useMemo, useState } from 'react'
import datosIniciales from '../datosSimulados/estudiantesDocenteMock.json'

const estilosEstado = {
  alDia: {
    insignia: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    punto: 'bg-[#2E7D32]',
    fila: 'hover:bg-[#FAF8F5]',
  },
  repaso: {
    insignia: 'bg-amber-50 text-amber-800 border-amber-200',
    punto: 'bg-[#FFA500]',
    fila: 'hover:bg-[#FAF8F5]',
  },
  riesgo: {
    insignia: 'bg-red-50 text-brand-cinabrio border-red-200',
    punto: 'bg-[#C8102E]',
    fila: 'bg-red-50/10 hover:bg-red-50/20',
  },
}

const clasesAvatar = {
  porcelain: 'bg-[#E8F0F7] text-brand-porcelain border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  cinabrio: 'bg-red-100 text-brand-cinabrio border-red-300',
}

const clasesBarra = {
  porcelain: 'bg-brand-porcelain',
  amber: 'bg-amber-500',
  cinabrio: 'bg-red-500',
}

const clasesPrecision = {
  porcelain: 'text-slate-800',
  amber: 'text-slate-800',
  cinabrio: 'text-red-600',
}

const clasesErrorHanzi = {
  critico: 'bg-red-50 text-red-700 border-red-200',
  atencion: 'bg-amber-50 text-amber-800 border-amber-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
}

const coloresSegmento = {
  directo: 'bg-emerald-600',
  pista: 'bg-amber-500',
  fallos: 'bg-red-500',
}

const puntosSegmento = {
  directo: 'bg-emerald-600',
  pista: 'bg-amber-500',
  fallos: 'bg-red-500',
}

function VistaTableroDocente({ alCerrarSesion, usuarioSesion }) {
  const [datos] = useState(datosIniciales)
  const {
    marca,
    docente,
    periodoAcademico,
    aulas,
    estadoRag,
    kpiParticipacion,
    kpiPrecision,
    kpiAlerta,
    filtros,
    estudiantes,
    paginacion,
    modalIntervencion,
    notificacion,
    textos,
  } = datos

  const perfilDocente = usuarioSesion ?? docente

  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [avancesAprobados, setAvancesAprobados] = useState([])
  const [estudianteIntervenido, setEstudianteIntervenido] = useState(null)
  const [seleccionHanzi, setSeleccionHanzi] = useState(() =>
    modalIntervencion.hanzi
      .filter((caracter) => caracter.seleccionado)
      .map((caracter) => caracter.caracter),
  )
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(null), 4000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  useEffect(() => {
    if (!estudianteIntervenido) return undefined
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') setEstudianteIntervenido(null)
    }
    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [estudianteIntervenido])

  const estudiantesFiltrados = useMemo(() => {
    const termino = terminoBusqueda.trim().toLowerCase()
    return estudiantes.filter((estudiante) => {
      const coincideFiltro =
        filtroActivo === 'todos' || estudiante.estado === filtroActivo
      const coincideBusqueda =
        termino === '' ||
        estudiante.nombreCompleto.toLowerCase().includes(termino) ||
        estudiante.hash.toLowerCase().includes(termino)
      return coincideFiltro && coincideBusqueda
    })
  }, [estudiantes, filtroActivo, terminoBusqueda])

  const aprobarAvance = (estudiante) => {
    if (!estudiante.puedeAprobar) return
    setAvancesAprobados((previos) =>
      previos.includes(estudiante.id) ? previos : [...previos, estudiante.id],
    )
    setAviso({
      titulo: notificacion.tituloAprobacion,
      descripcion: `${notificacion.descripcionAprobacion} ${estudiante.nombreCompleto}.`,
    })
  }

  const asignarRepaso = (estudiante) => {
    setAviso({
      titulo: notificacion.tituloRepaso,
      descripcion: `${notificacion.descripcionRepaso} ${estudiante.nombreCompleto}.`,
    })
  }

  const alternarHanzi = (caracter) => {
    setSeleccionHanzi((previos) =>
      previos.includes(caracter)
        ? previos.filter((valor) => valor !== caracter)
        : [...previos, caracter],
    )
  }

  const confirmarIntervencion = () => {
    const nombre = estudianteIntervenido?.nombreCompleto ?? 'el estudiante'
    setEstudianteIntervenido(null)
    setAviso({
      titulo: notificacion.tituloIntervencion,
      descripcion: `${seleccionHanzi.length} caracteres prioritarios · ${notificacion.descripcionIntervencion} ${nombre}.`,
    })
  }

  const abrirIntervencionCohorte = () => {
    const casoCritico = estudiantes.find((estudiante) => estudiante.estado === 'riesgo')
    if (casoCritico) setEstudianteIntervenido(casoCritico)
  }

  return (
    <div className="min-h-screen text-slate-800 bg-brand-bg flex flex-col relative selection:bg-brand-porcelain/15 selection:text-brand-porcelain pb-12">
      <div
        aria-hidden="true"
        className="watermark-kanji fixed right-[-2rem] bottom-[-3rem] text-[30rem] leading-none font-black text-brand-porcelain/[0.025] select-none pointer-events-none z-0 font-hanzi-serif"
      >
        师
      </div>

      {/* 1. HEADER SUPERIOR DE NAVEGACIÓN DOCENTE */}
      <header className="sticky top-0 z-40 bg-brand-card/95 backdrop-blur-md border-b border-brand-border px-5 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-cinabrio text-white flex items-center justify-center font-hanzi-serif text-xl font-black shadow-sm shadow-brand-cinabrio/20 ring-1 ring-brand-cinabrio/30">
                学
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                    {marca.nombreBase}
                    <span className="text-brand-cinabrio">{marca.nombreDestacado}</span>
                  </span>
                  <span className="text-xs text-slate-400">/</span>
                  <span className="font-hanzi-serif text-sm font-bold text-brand-porcelain">
                    {marca.hanzi}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-brand-porcelain/10 text-brand-porcelain border border-brand-porcelain/20">
                    {marca.etiquetaRol}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-700">
                    Prof. {perfilDocente.nombreCompleto}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{docente.cargo}</span>
                </p>
              </div>
            </div>

            <button
              className="lg:hidden p-2 text-slate-400 hover:text-brand-cinabrio rounded-lg text-xs cursor-pointer"
              title={textos.cerrarSesion}
              type="button"
              onClick={alCerrarSesion}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center gap-3 w-full max-w-2xl">
            <div className="relative shrink-0 w-64 sm:w-72">
              <label className="sr-only" htmlFor="selector-aula">
                Seleccionar Aula
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-porcelain text-[19px] pointer-events-none">
                  school
                </span>
                <select
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#D8D2C4] text-xs sm:text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain/30 cursor-pointer transition-colors"
                  defaultValue="101"
                  id="selector-aula"
                >
                  {aulas.map((aula) => (
                    <option key={aula.id} value={aula.id}>
                      {aula.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative flex-1">
              <label className="sr-only" htmlFor="busqueda-estudiante">
                Buscar por estudiante o hash
              </label>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                search
              </span>
              <input
                className="w-full pl-9 pr-14 py-2 rounded-xl bg-white border border-[#D8D2C4] text-xs sm:text-sm placeholder-slate-400 text-slate-800 shadow-sm focus:border-brand-porcelain focus:ring-1 focus:ring-brand-porcelain/30 transition-colors"
                id="busqueda-estudiante"
                placeholder={textos.buscarPlaceholder}
                type="text"
                value={terminoBusqueda}
                onChange={(evento) => setTerminoBusqueda(evento.target.value)}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-label font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
                  Ctrl+K
                </kbd>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="tracking-tight font-label text-[11px]">{estadoRag}</span>
            </div>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-cinabrio hover:bg-red-50/80 rounded-xl transition-colors border border-transparent hover:border-red-200/50 cursor-pointer"
              type="button"
              onClick={alCerrarSesion}
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>{textos.cerrarSesion}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-5 sm:px-8 pt-8 space-y-7 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-cinabrio"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-porcelain font-label">
                {textos.protocolo}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {textos.titulo}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {textos.subtitulo}
            </p>
            <p className="text-xs text-brand-porcelain font-semibold mt-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {periodoAcademico.etiqueta}
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">
                {periodoAcademico.rango} · Sincronizado {periodoAcademico.fechaSincronizacion}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D8D2C4] text-xs font-semibold text-slate-700 shadow-sm hover:bg-brand-card hover:text-brand-porcelain transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px] text-slate-500">sync</span>
              <span>{textos.sincronizarSrs}</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-porcelain text-white text-xs font-bold shadow-sm shadow-brand-porcelain/20 hover:bg-[#183e61] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>{textos.descargarInforme}</span>
            </button>
          </div>
        </div>

        {/* 2. BANDA DE KPIs DE COHORTE */}
        <section aria-label="KPIs de Cohorte" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* KPI 1: Participación */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-brand-porcelain/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-label">
                  {kpiParticipacion.etiquetaSuperior}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  {kpiParticipacion.titulo}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-porcelain flex items-center justify-center border border-blue-100">
                <span className="material-symbols-outlined text-[22px]">
                  {kpiParticipacion.icono}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-label">
                {kpiParticipacion.valor}{' '}
                <span className="text-lg font-normal text-slate-400">
                  {kpiParticipacion.total}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {kpiParticipacion.insignia}
              </span>
            </div>
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                {kpiParticipacion.detalleIzquierda}{' '}
                <strong>{kpiParticipacion.detalleIzquierdaValor}</strong>
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {kpiParticipacion.detalleDerecha}
              </span>
            </div>
          </div>

          {/* KPI 2: Precisión */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-brand-porcelain/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-label">
                  {kpiPrecision.etiquetaSuperior}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  {kpiPrecision.titulo}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center border border-emerald-100">
                <span className="material-symbols-outlined text-[22px]">
                  {kpiPrecision.icono}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-brand-porcelain tracking-tight font-label">
                {kpiPrecision.valor}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-slate-600">
                {kpiPrecision.descripcion}
              </span>
            </div>
            <div className="mt-3.5 space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                {kpiPrecision.segmentos.map((segmento) => (
                  <div
                    className={`${coloresSegmento[segmento.tipo]} h-2`}
                    key={segmento.tipo}
                    style={{ width: `${segmento.porcentaje}%` }}
                    title={segmento.etiqueta}
                  ></div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                {kpiPrecision.segmentos.map((segmento) => (
                  <span className="flex items-center gap-1" key={segmento.tipo}>
                    <span
                      className={`w-2 h-2 rounded-full ${puntosSegmento[segmento.tipo]}`}
                    ></span>
                    {segmento.etiqueta}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KPI 3: Alerta */}
          <div className="bg-white border-2 border-red-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-red-50/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cinabrio font-label flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cinabrio"></span>
                  </span>
                  {kpiAlerta.etiquetaSuperior}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{kpiAlerta.titulo}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-cinabrio flex items-center justify-center border border-red-200">
                <span className="material-symbols-outlined text-[22px]">{kpiAlerta.icono}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-600 leading-relaxed">{kpiAlerta.descripcionHtml}</p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-red-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-cinabrio">
                {kpiAlerta.pieIzquierda}
              </span>
              <button
                className="text-xs font-bold text-brand-cinabrio hover:text-[#9e0b23] flex items-center gap-0.5 underline underline-offset-2 cursor-pointer"
                type="button"
                onClick={abrirIntervencionCohorte}
              >
                {kpiAlerta.accion} →
              </button>
            </div>
          </div>
        </section>

        {/* 3. TABLA DE ESTUDIANTES Y GOBERNANZA EN 1-CLIC */}
        <section
          aria-label="Tabla de Gobernanza de Estudiantes"
          className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-card/50">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" role="tablist">
              {filtros.map((filtro) => {
                const activo = filtro.clave === filtroActivo
                return (
                  <button
                    aria-selected={activo}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activo
                        ? 'bg-brand-porcelain text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-semibold'
                    }`}
                    key={filtro.clave}
                    role="tab"
                    type="button"
                    onClick={() => setFiltroActivo(filtro.clave)}
                  >
                    {filtro.punto && (
                      <span className={`w-2 h-2 rounded-full ${filtro.punto}`}></span>
                    )}
                    {filtro.etiqueta}{' '}
                    <span className={activo ? 'ml-1 opacity-80' : 'text-slate-400 font-label'}>
                      ({filtro.total})
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-500 font-label hidden sm:inline">
                {textos.modoGobernanza}
              </span>
              <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>{textos.ajustesSrs}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F4EE] border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-slate-500 font-label">
                  <th className="py-3.5 px-5" scope="col">
                    {textos.columnaEstudiante}
                  </th>
                  <th className="py-3.5 px-5" scope="col">
                    {textos.columnaUnidad}
                  </th>
                  <th className="py-3.5 px-5" scope="col">
                    {textos.columnaPrecision}
                  </th>
                  <th className="py-3.5 px-5" scope="col">
                    {textos.columnaEstado}
                  </th>
                  <th className="py-3.5 px-5 text-right" scope="col">
                    {textos.columnaAcciones}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEAE1] text-xs sm:text-sm">
                {estudiantesFiltrados.map((estudiante) => {
                  const estilo = estilosEstado[estudiante.estado]
                  const fueAprobado = avancesAprobados.includes(estudiante.id)
                  return (
                    <tr
                      className={`${estilo.fila} transition-colors group`}
                      key={estudiante.id}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 ${clasesAvatar[estudiante.tonoAvatar]}`}
                          >
                            {estudiante.iniciales}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 group-hover:text-brand-porcelain transition-colors">
                                {estudiante.nombreCompleto}
                              </p>
                              {estudiante.requiereAtencion && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-brand-cinabrio uppercase">
                                  {textos.etiquetaAtencion}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-label text-slate-400 tracking-tight mt-0.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">
                                fingerprint
                              </span>
                              <span>{estudiante.hash}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 text-xs">
                            {estudiante.moduloActual}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`${clasesBarra[estudiante.tonoBarra]} h-1.5 rounded-full`}
                                style={{ width: `${estudiante.progreso}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-[11px] font-label font-semibold ${clasesPrecision[estudiante.tonoAvatar]}`}
                            >
                              {estudiante.progreso}%
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <p
                            className={`font-bold text-xs font-label ${clasesPrecision[estudiante.tonoAvatar]}`}
                          >
                            {estudiante.precisionTexto}
                          </p>
                          <p className="text-[11px] text-slate-500">{estudiante.aciertosTexto}</p>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${estilo.insignia}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${estilo.punto}`}></span>
                          {estudiante.estadoEtiqueta}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            className={`px-2.5 py-1.5 rounded-lg border font-semibold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                              !estudiante.puedeAprobar
                                ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                                : fueAprobado
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                            disabled={!estudiante.puedeAprobar}
                            title={
                              estudiante.puedeAprobar
                                ? textos.tooltipAprobar
                                : textos.tooltipAprobarBloqueado
                            }
                            type="button"
                            onClick={() => aprobarAvance(estudiante)}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {fueAprobado ? 'done_all' : 'check'}
                            </span>
                            <span>
                              {fueAprobado ? 'Avance Aprobado' : textos.botonAprobar}
                            </span>
                          </button>
                          <button
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-brand-cinabrio border border-red-200 font-semibold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                            title={textos.tooltipRepaso}
                            type="button"
                            onClick={() => asignarRepaso(estudiante)}
                          >
                            <span className="material-symbols-outlined text-[15px]">refresh</span>
                            <span>{textos.botonRepaso}</span>
                          </button>
                          <button
                            className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                              estudiante.intervencionPrioritaria
                                ? 'bg-brand-cinabrio hover:bg-[#a80d26] text-white ring-1 ring-brand-cinabrio'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-[#D8D2C4]'
                            }`}
                            title={textos.tooltipIntervenir}
                            type="button"
                            onClick={() => setEstudianteIntervenido(estudiante)}
                          >
                            <span className="material-symbols-outlined text-[15px]">alt_route</span>
                            <span>{textos.botonIntervenir}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {estudiantesFiltrados.length === 0 && (
                  <tr>
                    <td className="py-10 px-5 text-center text-sm text-slate-500" colSpan={5}>
                      No se encontraron estudiantes para el filtro o la búsqueda aplicada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-brand-card border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>
                {textos.mostrando}{' '}
                <strong className="text-slate-800">{estudiantesFiltrados.length}</strong>{' '}
                {textos.de}{' '}
                <strong className="text-slate-800">{paginacion.totalCohorte}</strong>{' '}
                {textos.estudiantesCohorte}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-medium">
                {paginacion.mensajeSincronizacion}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D8D2C4] text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                disabled
                type="button"
              >
                {textos.anterior}
              </button>
              <span className="px-3 py-1 rounded-lg bg-brand-porcelain text-white font-bold">
                {paginacion.paginaActual}
              </span>
              {Array.from({ length: paginacion.paginas - 1 }, (_, indice) => indice + 2).map(
                (numeroPagina) => (
                  <button
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D8D2C4] text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    key={numeroPagina}
                    type="button"
                  >
                    {numeroPagina}
                  </button>
                ),
              )}
              <button
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D8D2C4] text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                type="button"
              >
                {textos.siguiente}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 4. MODAL INTERVENCION DOCENTE */}
      {estudianteIntervenido && (
        <div
          aria-labelledby="titulo-modal-intervencion"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
        >
          <div className="relative w-full max-w-xl bg-brand-card rounded-3xl border border-[#D8D2C4] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 bg-white border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-cinabrio text-white flex items-center justify-center font-hanzi-serif text-lg font-black shadow-sm">
                  {modalIntervencion.sello}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cinabrio font-label">
                    {modalIntervencion.etiqueta}
                  </span>
                  <h2
                    className="text-base font-bold text-slate-900 leading-tight"
                    id="titulo-modal-intervencion"
                  >
                    {modalIntervencion.tituloPrefijo}{' '}
                    <span className="text-brand-porcelain font-extrabold">
                      {estudianteIntervenido.nombreCompleto}
                    </span>
                  </h2>
                </div>
              </div>
              <button
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Cerrar ventana"
                type="button"
                onClick={() => setEstudianteIntervenido(null)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-porcelain text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p className="font-bold text-brand-porcelain">{modalIntervencion.avisoTitulo}</p>
                  <p className="mt-0.5">{modalIntervencion.avisoTexto}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-label">
                    {modalIntervencion.etiquetaCaracteres}
                  </h3>
                  <span className="text-[11px] text-brand-cinabrio font-semibold">
                    {modalIntervencion.notaCaracteres}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {modalIntervencion.hanzi.map((caracter) => {
                    const seleccionado = seleccionHanzi.includes(caracter.caracter)
                    return (
                      <label
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-brand-border hover:border-brand-cinabrio/40 cursor-pointer transition-all shadow-sm group"
                        key={caracter.caracter}
                      >
                        <div className="flex items-center gap-3.5">
                          <input
                            checked={seleccionado}
                            className="w-4 h-4 rounded text-brand-cinabrio border-slate-300"
                            type="checkbox"
                            onChange={() => alternarHanzi(caracter.caracter)}
                          />
                          <div className="w-12 h-12 rounded-xl bg-brand-bg text-brand-porcelain flex items-center justify-center font-hanzi-serif text-2xl font-black border border-brand-border">
                            {caracter.caracter}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-label text-xs font-bold text-slate-800">
                                {caracter.pinyin}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {caracter.significado}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {caracter.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label font-bold border ${clasesErrorHanzi[caracter.tonoError]}`}
                          >
                            {caracter.porcentajeError}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white border border-brand-border rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-label">
                  {modalIntervencion.etiquetaModalidad}
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {modalIntervencion.modalidades.map((modalidad) => (
                    <label
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-brand-border bg-white cursor-pointer font-medium text-slate-700 hover:bg-slate-50"
                      key={modalidad.id}
                    >
                      <input
                        className="text-brand-cinabrio"
                        defaultChecked={modalidad.predeterminada}
                        name="modalidad-intervencion"
                        type="radio"
                        value={modalidad.id}
                      />
                      <span>{modalidad.etiqueta}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-brand-bg border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-label text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">lock</span>
                {modalIntervencion.firmaCriptografica}
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  type="button"
                  onClick={() => setEstudianteIntervenido(null)}
                >
                  {modalIntervencion.botonCancelar}
                </button>
                <button
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-cinabrio hover:bg-[#a80d26] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-brand-cinabrio/20 transition-all cursor-pointer"
                  type="button"
                  onClick={confirmarIntervencion}
                >
                  <span className="material-symbols-outlined text-[17px]">bolt</span>
                  <span>{modalIntervencion.botonConfirmar}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE CONFIRMACIÓN */}
      <aside
        aria-live="polite"
        className={`fixed bottom-6 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl transition-all duration-300 ${
          aviso ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-emerald-400 text-[22px]">
          check_circle
        </span>
        <div>
          <p className="text-xs font-bold text-white tracking-wide">
            {aviso ? aviso.titulo : 'Acción de Gobernanza Ejecutada'}
          </p>
          <p className="text-[11px] text-slate-300 font-label">
            {aviso ? aviso.descripcion : 'La ruta del estudiante ha sido actualizada en la base SRS.'}
          </p>
        </div>
      </aside>
    </div>
  )
}

export default VistaTableroDocente
