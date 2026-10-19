import { useState } from 'react'
import datosIniciales from '../datosSimulados/rutaAprendizajeMock.json'

function VistaRutaAprendizaje({ alIniciarPractica, alCerrarSesion, usuarioSesion }) {
  const [datosRuta] = useState(datosIniciales)
  const { marca, estudiante, encabezado, nodos, textos } = datosRuta

  const perfilEstudiante = usuarioSesion ?? estudiante

  const nodoCompletado = nodos.find((nodo) => nodo.estado === 'completado')
  const nodoActivo = nodos.find((nodo) => nodo.estado === 'activo')
  const nodosBloqueados = nodos.filter((nodo) => nodo.estado === 'bloqueado')

  return (
    <div className="min-h-screen text-slate-800 bg-brand-bg flex flex-col justify-between relative selection:bg-brand-porcelain selection:text-white">
      <div className="oriental-watermark" aria-hidden="true">
        学
      </div>
      <div className="oriental-watermark-left" aria-hidden="true">
        道
      </div>

      {/* CABECERA SUPERIOR */}
      <header className="w-full bg-brand-card/95 backdrop-blur-md border-b border-brand-border sticky top-0 z-40 px-6 sm:px-12 py-3.5 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-cinabrio text-white flex items-center justify-center font-hanzi-serif text-xl font-bold shadow-sm">
              学
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black tracking-tight text-brand-porcelain">
                  {marca.nombreBase}
                  <span className="text-brand-cinabrio">{marca.nombreDestacado}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 font-hanzi-serif">
                  {marca.hanzi}
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-400 font-bold -mt-0.5">
                {marca.subtitulo}
              </p>
            </div>
          </div>

          <div className="text-center hidden md:block">
            <div className="flex items-center justify-center gap-2">
              <span className="text-base font-bold text-slate-800 tracking-tight">
                ¡Hola, {perfilEstudiante.nombreCompleto}!
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF1F7] text-brand-porcelain border border-[#D0DFEB]">
                {perfilEstudiante.estado}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Curso {perfilEstudiante.nivelHsk}{' '}
              <span className="text-slate-300 mx-1">·</span> Paralelo {perfilEstudiante.paralelo}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs text-brand-porcelain">
                {perfilEstudiante.iniciales}
              </div>
              <div className="text-left hidden lg:block leading-tight">
                <p className="text-xs font-bold text-slate-700">{perfilEstudiante.nombreCorto}</p>
                <p className="text-[10px] text-slate-400 font-medium">{perfilEstudiante.rol}</p>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-slate-200 mx-0.5"></div>

            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-cinabrio hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
              title="Cerrar sesión actual"
              type="button"
              onClick={alCerrarSesion}
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
              <span className="hidden sm:inline">{textos.cerrarSesion}</span>
            </button>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-center md:hidden">
          <p className="text-sm font-bold text-slate-800">¡Hola, {perfilEstudiante.nombreCompleto}!</p>
          <p className="text-xs text-slate-500">
            Curso {perfilEstudiante.nivelHsk} · Paralelo {perfilEstudiante.paralelo}
          </p>
        </div>
      </header>

      {/* CAMINO DE APRENDIZAJE */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 relative z-10 flex flex-col items-center">
        <div className="text-center mb-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-porcelain mb-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-cinabrio"></span>
            <span>{encabezado.etiqueta}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {encabezado.titulo}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
            {encabezado.descripcion}
          </p>
        </div>

        <div className="relative w-full max-w-2xl py-6 flex flex-col items-center">
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 600 780"
          >
            <path
              d="M 300,50 C 300,150 180,160 180,260 C 180,380 400,390 400,520 C 400,640 300,640 300,720"
              stroke="#D8E2EA"
              strokeWidth="6"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <path
              d="M 300,50 C 300,150 180,160 180,260"
              stroke="#2E7D32"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>

          <div className="w-full relative z-10 space-y-16 sm:space-y-20">
            <div className="flex flex-col items-center relative">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-brand-emerald-bg border-[3px] border-brand-emerald flex items-center justify-center text-brand-emerald shadow-md transition-transform duration-300 group-hover:scale-105">
                  <span className="material-symbols-outlined text-[32px] font-black">
                    {nodoCompletado.icono}
                  </span>
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-brand-emerald text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                  {nodoCompletado.porcentaje}%
                </span>
              </div>

              <div className="mt-3 text-center bg-brand-card/90 border border-brand-border-light px-3.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                <p className="text-xs font-bold text-brand-emerald flex items-center gap-1 justify-center">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  {nodoCompletado.etiqueta}
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 relative pt-2">
              <div className="flex flex-col items-center shrink-0 lg:mt-6">
                <div className="relative">
                  <div
                    className="w-20 h-20 sm:w-[5.5rem] sm:h-[5.5rem] rounded-full bg-brand-porcelain border-4 border-brand-cinabrio flex items-center justify-center text-white node-pulse cursor-pointer transition-transform duration-300 hover:scale-105"
                    title="Módulo actual activo"
                  >
                    <span className="font-hanzi-serif text-3xl font-black text-amber-50">学</span>
                  </div>
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-brand-cinabrio text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                    {nodoActivo.etiquetaNodo}
                  </span>
                </div>

                <span className="mt-4 text-[11px] font-bold text-brand-porcelain uppercase tracking-wider">
                  {textos.nodoActivo}
                </span>
              </div>

              <section
                aria-labelledby="titulo-tarea-activa"
                className="w-full max-w-md bg-brand-card border-2 border-brand-porcelain/30 rounded-2xl p-6 sm:p-7 shadow-xl shadow-brand-porcelain/10 relative overflow-hidden transition-all duration-300 hover:border-brand-cinabrio/50"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-brand-cinabrio"></div>

                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-cinabrio text-[18px]">
                      assignment_turned_in
                    </span>
                    <span className="text-xs font-extrabold text-brand-cinabrio uppercase tracking-wider">
                      {textos.tareaProfesor}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF1F7] text-brand-porcelain border border-[#D0DFEB]">
                    {nodoActivo.prioridad}
                  </span>
                </div>

                <h2
                  className="text-lg sm:text-xl font-extrabold text-brand-porcelain tracking-tight leading-snug"
                  id="titulo-tarea-activa"
                >
                  {nodoActivo.titulo}{' '}
                  <span className="text-brand-cinabrio font-hanzi-serif text-xl font-bold ml-1">
                    {nodoActivo.hanzi}
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
                  {nodoActivo.descripcion}
                </p>

                <div className="mt-4 pt-3.5 border-t border-brand-border/70 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      schedule
                    </span>
                    Duración: {nodoActivo.duracion}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      forum
                    </span>
                    {nodoActivo.modalidad}
                  </span>
                </div>

                <div className="mt-5">
                  <button
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-cinabrio hover:bg-[#b00c26] text-white font-bold text-sm tracking-wide shadow-lg shadow-brand-cinabrio/30 hover:shadow-xl hover:shadow-brand-cinabrio/40 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] cursor-pointer"
                    type="button"
                    onClick={alIniciarPractica}
                  >
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                    <span className="uppercase tracking-wider">{nodoActivo.textoBoton}</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400 mt-2.5 font-normal">
                  {nodoActivo.nota}
                </p>
              </section>
            </div>

            {nodosBloqueados.map((nodo, indice) => (
              <div
                className={`flex flex-col items-center relative lg:translate-x-12 ${
                  indice === nodosBloqueados.length - 1 ? 'pb-8' : ''
                }`}
                key={nodo.id}
              >
                <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-[#EFEAE1]/70 border-2 border-dashed border-brand-border-light flex items-center justify-center text-slate-400 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">lock</span>
                </div>

                <div className="mt-2.5 text-center bg-brand-card/80 border border-brand-border-light px-3.5 py-1 rounded-full">
                  <p className="text-xs font-medium text-slate-500">{nodo.titulo}</p>
                  <p className="text-[10px] text-slate-400 italic">{nodo.descripcionEstado}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* NAVEGACIÓN INFERIOR */}
      <nav
        aria-label="Navegación inferior"
        className="sticky bottom-0 z-40 w-full bg-brand-card/95 backdrop-blur-md border-t border-brand-border py-2.5 px-6 shadow-sm"
      >
        <div className="max-w-md mx-auto flex items-center justify-around gap-4">
          <button
            aria-current="page"
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-brand-porcelain text-white shadow-sm font-semibold text-xs transition-all cursor-default"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">alt_route</span>
            <span>{textos.rutaActiva}</span>
          </button>

          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-slate-600 hover:text-brand-porcelain hover:bg-slate-200/50 font-medium text-xs transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">person</span>
            <span>{textos.perfil}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default VistaRutaAprendizaje
