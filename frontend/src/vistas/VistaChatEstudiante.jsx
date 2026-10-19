import { useState } from 'react'
import datosChatIniciales from '../datosSimulados/chatVocabularioMock.json'

function VistaChatEstudiante({ alVolverARuta, alCerrarSesion, usuarioSesion }) {
  const [datosChat] = useState(datosChatIniciales)
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [opcionSeleccionadaId, setOpcionSeleccionadaId] = useState(null)

  const { cabecera, historial, tutor, preguntas, textos } = datosChat
  const preguntaActual = preguntas[indicePregunta]

  const perfilEstudiante = usuarioSesion ?? {
    nombreCompleto: 'Estudiante TutorIA',
    nombreCorto: 'Estudiante',
    iniciales: 'ET',
    rol: 'Estudiante',
  }

  const ejercicioVisible = Math.min(
    cabecera.ejercicioActual + indicePregunta,
    cabecera.ejercicioTotal,
  )
  const porcentajeProgreso = Math.round((ejercicioVisible / cabecera.ejercicioTotal) * 100)

  const opcionSeleccionada = preguntaActual.opciones.find(
    (opcion) => opcion.id === opcionSeleccionadaId,
  )
  const respuestaCorrecta = Boolean(opcionSeleccionada?.correcta)

  const reproducirAudio = (texto) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const locucion = new SpeechSynthesisUtterance(texto)
    locucion.lang = 'zh-CN'
    locucion.rate = 0.85
    window.speechSynthesis.speak(locucion)
  }

  const avanzarPregunta = () => {
    setIndicePregunta((indicePrevio) => (indicePrevio + 1) % preguntas.length)
    setOpcionSeleccionadaId(null)
  }

  const obtenerClasesOpcion = (opcion) => {
    if (opcion.id === opcionSeleccionadaId) {
      return opcion.correcta
        ? 'bg-[#EBF7EE] shadow-md ring-2 ring-[#2E7D32]'
        : 'bg-secondary-fixed shadow-md ring-2 ring-secondary'
    }
    return 'bg-surface-container-lowest hover:bg-surface-container-low shadow-sm'
  }

  const obtenerClasesLetra = (opcion) => {
    if (opcion.id === opcionSeleccionadaId) {
      return opcion.correcta ? 'bg-[#2E7D32] text-white' : 'bg-secondary text-on-secondary'
    }
    return 'bg-surface-container text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-on-primary-fixed'
  }

  const obtenerClasesTexto = (opcion) => {
    if (opcion.id === opcionSeleccionadaId) {
      return opcion.correcta ? 'text-[#1b5e20] font-bold' : 'text-secondary font-bold'
    }
    return 'text-on-surface font-medium'
  }

  return (
    <div className="bg-background font-body text-on-surface min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 flex items-center justify-center select-none overflow-hidden opacity-[0.032] z-0"
      >
        <span className="text-[34rem] font-hanzi-serif leading-none text-primary font-medium">和</span>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center min-w-0">
            <button
              className="group inline-flex items-center text-xs sm:text-sm font-headline font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              type="button"
              onClick={alVolverARuta}
            >
              <span className="material-symbols-outlined text-base mr-1 transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              <span>{textos.volverRuta}</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-2 min-w-0 max-w-xl flex-1">
            <div className="text-xs sm:text-sm font-headline font-semibold text-primary truncate tracking-tight max-w-full">
              {cabecera.tituloModulo}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 sm:w-24 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-300"
                  style={{ width: `${porcentajeProgreso}%` }}
                ></div>
              </div>
              <span className="font-label text-[10px] sm:text-[11px] font-medium text-on-surface-variant tracking-normal whitespace-nowrap">
                Ejercicio {ejercicioVisible} de {cabecera.ejercicioTotal}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-5">
            <span className="hidden lg:inline text-xs font-headline font-semibold text-primary whitespace-nowrap">
              {perfilEstudiante.nombreCorto}
            </span>
            <button
              className="text-xs font-headline font-semibold text-on-surface-variant hover:text-secondary transition-colors cursor-pointer whitespace-nowrap"
              type="button"
              onClick={alCerrarSesion}
            >
              {textos.cerrarSesion}
            </button>
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm"
              title={`${perfilEstudiante.nombreCompleto} · ${perfilEstudiante.rol}`}
            >
              <span className="font-headline text-[10px] font-bold text-on-primary">
                {perfilEstudiante.iniciales}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 bg-background">
        <div className="flex flex-col w-full relative">
          <div className="relative z-10 w-full max-w-[760px] mx-auto py-4 sm:py-7 flex flex-col gap-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-surface-container-highest flex-1 max-w-[80px]"></div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                <span className="font-label text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                  {cabecera.etiquetaNivel}
                </span>
              </div>
              <div className="h-px bg-surface-container-highest flex-1 max-w-[80px]"></div>
            </div>

            {historial.map((registro) => (
              <div
                className="rounded-xl bg-surface-container-low/70 px-4 py-3 flex items-center justify-between text-xs text-on-surface-variant shadow-sm transition-all hover:bg-surface-container-low"
                key={registro.hanzi}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="material-symbols-outlined text-[18px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-headline font-semibold text-primary">
                    {registro.titulo}
                  </span>
                  <span className="font-hanzi-serif text-[15px] font-medium text-primary tracking-wide">
                    {registro.hanzi}
                  </span>
                  <span className="font-headline text-[11px] text-outline font-semibold tracking-wide">
                    ({registro.pinyin})
                  </span>
                  <span className="text-outline-variant font-light">•</span>
                  <span className="italic text-on-surface truncate">{registro.significado}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px] font-label text-outline pl-2">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span className="hidden sm:inline">{registro.insignia}</span>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 pl-1">
                <div className="relative flex-shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shadow-[0_2px_8px_rgba(187,0,39,0.22)]">
                  <span className="font-hanzi-serif text-on-secondary font-bold text-lg select-none">
                    学
                  </span>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <span className="font-label text-[7px] font-bold text-on-primary">IA</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-sm font-bold text-primary tracking-tight">
                      {tutor.nombre}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-headline text-[10px] font-semibold tracking-wide">
                      {tutor.insignia}
                    </span>
                  </div>
                  <span className="font-label text-[10px] text-outline">
                    {tutor.descripcion}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(31,78,121,0.06)] flex flex-col items-center text-center relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-[0.025] flex items-center justify-center"
                >
                  <div className="w-48 h-48 border border-primary grid grid-cols-2 grid-rows-2">
                    <div className="border-b border-r border-dashed border-primary"></div>
                    <div className="border-b border-dashed border-primary"></div>
                    <div className="border-r border-dashed border-primary"></div>
                    <div></div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label text-[11px] font-medium tracking-tight mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {preguntaActual.contexto}
                </div>

                <div className="my-1 flex flex-col items-center">
                  <div className="text-[52px] sm:text-[60px] font-hanzi-serif font-normal text-primary tracking-wider leading-none select-all transition-transform duration-300 hover:scale-[1.02]">
                    {preguntaActual.hanzi}
                  </div>
                  <div className="flex items-center gap-2 mt-3.5">
                    <span className="font-headline text-lg sm:text-xl font-semibold text-secondary tracking-wide">
                      {preguntaActual.pinyin}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-label font-medium uppercase tracking-wider">
                      {preguntaActual.tono}
                    </span>
                  </div>
                </div>

                <button
                  className="group mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-primary text-xs font-headline font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  type="button"
                  onClick={() => reproducirAudio(preguntaActual.audioTexto)}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary transition-transform group-hover:scale-110">
                    volume_up
                  </span>
                  <span>{textos.escucharAudio}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                </button>

                <div className="w-full pt-6 mt-6 bg-transparent flex flex-col items-center">
                  <p className="font-headline text-base sm:text-lg font-semibold text-on-surface max-w-md">
                    {preguntaActual.pregunta}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {preguntaActual.instruccion}
                  </p>
                </div>
              </div>
            </div>

            {respuestaCorrecta && (
              <div className="rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-300 bg-[#EBF7EE]">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-[#2E7D32]">
                        <span
                          className="material-symbols-outlined text-white text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          done
                        </span>
                      </div>
                      <div>
                        <div className="font-headline text-sm sm:text-base font-bold text-[#1b5e20] leading-snug">
                          {preguntaActual.retroalimentacion.titulo}
                        </div>
                        <span className="text-xs text-[#2e7d32]/80 font-medium">
                          {preguntaActual.retroalimentacion.subtitulo}
                        </span>
                      </div>
                    </div>

                    <button
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1b5e20] text-xs font-headline font-semibold shadow-sm hover:bg-emerald-50 transition-colors self-start sm:self-auto cursor-pointer"
                      type="button"
                      onClick={() => reproducirAudio(preguntaActual.audioTexto)}
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#2e7d32]">
                        volume_up
                      </span>
                      <span>{textos.pronunciacionNativa}</span>
                      <span className="font-label text-[10px] text-[#2e7d32]/70 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        1.0x
                      </span>
                    </button>
                  </div>

                  <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-md bg-[#2e7d32]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">
                        auto_stories
                      </span>
                    </div>
                    <div className="text-xs leading-relaxed text-[#1c1c16] flex flex-col gap-1">
                      <span className="font-headline font-semibold text-primary text-[11px] uppercase tracking-wider">
                        {preguntaActual.retroalimentacion.etiquetaExplicacion}
                      </span>
                      <p>{preguntaActual.retroalimentacion.explicacion}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-surface-container px-4 py-2.5 flex items-center justify-between gap-3 text-on-surface-variant/70 shadow-sm">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-outline">lock</span>
                  <input
                    aria-label={textos.modoGuiado}
                    className="flex-1 min-w-0 bg-transparent text-xs font-body italic text-outline placeholder:text-outline cursor-not-allowed focus:outline-none"
                    disabled
                    placeholder={textos.modoGuiado}
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px] font-label text-outline bg-surface-container-low px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">tune</span>
                  <span className="hidden sm:inline">{textos.tecladoDesactivado}</span>
                </div>
              </div>

              <div
                aria-label="Opciones de significado"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                role="radiogroup"
              >
                {preguntaActual.opciones.map((opcion) => {
                  const estaSeleccionada = opcion.id === opcionSeleccionadaId
                  return (
                    <button
                      aria-checked={estaSeleccionada}
                      className={`group w-full p-4 rounded-xl flex items-center justify-between transition-all duration-150 text-left cursor-pointer active:scale-[0.99] ${obtenerClasesOpcion(opcion)}`}
                      key={opcion.id}
                      role="radio"
                      type="button"
                      onClick={() => setOpcionSeleccionadaId(opcion.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg font-headline font-semibold text-xs flex items-center justify-center transition-colors ${obtenerClasesLetra(opcion)}`}
                        >
                          {opcion.id}
                        </span>
                        <span
                          className={`font-headline text-sm transition-colors ${obtenerClasesTexto(opcion)}`}
                        >
                          {opcion.texto}
                        </span>
                      </div>
                      {estaSeleccionada ? (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                            opcion.correcta ? 'bg-[#2E7D32]' : 'bg-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-white text-[15px] font-bold">
                            {opcion.correcta ? 'check' : 'close'}
                          </span>
                        </div>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-surface-container-highest group-hover:bg-outline-variant transition-colors"></span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="pt-2 flex flex-col items-center">
                <button
                  className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-headline text-sm font-bold tracking-wide shadow-[0_6px_20px_rgba(187,0,39,0.28)] hover:shadow-[0_8px_26px_rgba(187,0,39,0.36)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  type="button"
                  onClick={avanzarPregunta}
                >
                  <span>{textos.siguientePregunta}</span>
                  <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-[11px] text-outline font-label">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary">spa</span>
                <span className="font-semibold text-on-surface-variant">{textos.pieMarca}</span>
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span>{textos.pieTexto}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 mt-12 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-headline font-semibold tracking-wide text-primary">
              {textos.pieEditorial}
            </span>
            <span className="text-outline-variant">•</span>
            <span>Inmersión Editorial y Fonética</span>
          </div>
          <div className="font-label text-[11px] text-outline">{textos.pieEstado}</div>
        </div>
      </footer>
    </div>
  )
}

export default VistaChatEstudiante
