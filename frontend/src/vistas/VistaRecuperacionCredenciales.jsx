import { useEffect, useRef, useState } from 'react'

function VistaRecuperacionCredenciales({ alVolverAlLogin }) {
  const [correoInstitucional, setCorreoInstitucional] = useState('')
  const [estadoEnvio, setEstadoEnvio] = useState('inicial')
  const temporizadores = useRef([])

  useEffect(() => {
    const temporizadoresActuales = temporizadores.current

    return () => {
      temporizadoresActuales.forEach((temporizador) => clearTimeout(temporizador))
    }
  }, [])

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    setEstadoEnvio('enviando')

    temporizadores.current.push(
      setTimeout(() => {
        setEstadoEnvio('enviado')
        temporizadores.current.push(
          setTimeout(() => {
            setEstadoEnvio('reenvio')
          }, 4000),
        )
      }, 1000),
    )
  }

  const textosBoton = {
    inicial: { texto: 'Enviar Token Temporal', icono: 'arrow_forward' },
    enviando: { texto: 'Transmitiendo solicitud...', icono: 'hourglass_top' },
    enviado: { texto: 'Token Enviado Correctamente', icono: 'done' },
    reenvio: { texto: 'Reenviar Token', icono: 'refresh' },
  }

  const botonActual = textosBoton[estadoEnvio]

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col justify-between relative selection:bg-secondary-fixed selection:text-on-secondary-fixed overflow-x-hidden">
      {/* FONDO ATMOSFÉRICO: CALIGRAFÍA Y PAISAJE SHANSHUI */}
      <div className="fixed inset-0 shanshui-watermark overflow-hidden flex items-center justify-center opacity-100 z-0 pointer-events-none">
        <svg
          className="absolute w-[120vw] md:w-[95vw] max-w-none text-primary-container opacity-[0.045] transform -translate-y-6"
          fill="none"
          viewBox="0 0 1400 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 780 C180 620, 290 690, 480 610 C650 540, 780 640, 960 560 C1150 470, 1260 580, 1450 510 L1450 950 L-50 950 Z"
            fill="currentColor"
          ></path>
          <path
            d="M120 620 C260 480, 390 520, 540 430 C720 330, 890 440, 1080 360 C1220 300, 1340 380, 1480 320 L1480 900 L120 900 Z"
            fill="currentColor"
            opacity="0.6"
          ></path>
          <path
            d="M280 470 C410 320, 560 360, 690 280 C840 190, 980 260, 1140 210 C1240 180, 1320 220, 1420 180 L1420 850 L280 850 Z"
            fill="currentColor"
            opacity="0.35"
          ></path>
          <text
            fill="currentColor"
            fontFamily="'Noto Serif SC', serif"
            fontSize="110"
            fontWeight="700"
            opacity="0.5"
            x="110"
            y="320"
          >
            博学笃行
          </text>
          <text
            fill="currentColor"
            fontFamily="'Noto Serif SC', serif"
            fontSize="44"
            fontWeight="400"
            opacity="0.35"
            x="110"
            y="440"
          >
            格物致知 · 华语深研
          </text>
          <path
            d="M50 720 Q 300 690, 600 730 T 1150 710 T 1450 740"
            fill="none"
            opacity="0.25"
            stroke="currentColor"
            strokeDasharray="12 18"
            strokeWidth="1.5"
          ></path>
          <path
            d="M150 760 Q 400 740, 750 770 T 1300 750"
            fill="none"
            opacity="0.2"
            stroke="currentColor"
            strokeDasharray="8 14"
            strokeWidth="1"
          ></path>
        </svg>
      </div>

      {/* BARRA SUPERIOR / CABECERA DE MARCA */}
      <header className="relative z-10 w-full px-6 py-5 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 bg-secondary rounded-[3px] shadow-sm flex items-center justify-center p-1 border border-secondary-container transition-transform duration-200 group-hover:scale-105"
            title="TutorIA · 学"
          >
            <span className="font-hanzi font-bold text-surface-container-lowest text-lg leading-none select-none">
              学
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-lg font-bold tracking-tight text-[#1f4e79]">
                Tutor<span className="text-secondary">IA</span>
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label border border-outline-variant/40">
                AI
              </span>
            </div>
            <span className="text-[11px] font-hanzi font-medium tracking-wide text-on-surface-variant">
              Plataforma Inteligente de Mandarín · 智能导师
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-headline">
          <a
            className="hidden sm:inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container-high/60"
            href="#"
          >
            <span className="material-symbols-outlined text-[17px]">language</span>
            <span>Español / 中文</span>
          </a>
          <a
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container-high/60"
            href="#"
          >
            <span className="material-symbols-outlined text-[17px]">help_outline</span>
            <span>Ayuda</span>
          </a>
        </div>
      </header>

      {/* LIENZO PRINCIPAL: TARJETA DE RECUPERACIÓN DE CREDENCIALES */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-2 sm:py-6">
          <div className="relative w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden">
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-secondary to-primary-container"></div>

            {/* MARCA DE AGUA TIANZIGE (CUADRÍCULA DE PRÁCTICA) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden"
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    height="64"
                    id="patronTianzige"
                    patternUnits="userSpaceOnUse"
                    width="64"
                  >
                    <line
                      stroke="currentColor"
                      strokeDasharray="2 3"
                      strokeWidth="1"
                      x1="0"
                      x2="64"
                      y1="32"
                      y2="32"
                    ></line>
                    <line
                      stroke="currentColor"
                      strokeDasharray="2 3"
                      strokeWidth="1"
                      x1="32"
                      x2="32"
                      y1="0"
                      y2="64"
                    ></line>
                    <rect
                      fill="none"
                      height="64"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      width="64"
                      x="0"
                      y="0"
                    ></rect>
                  </pattern>
                </defs>
                <rect className="text-primary" fill="url(#patronTianzige)" height="100%" width="100%"></rect>
              </svg>
            </div>

            <div className="relative z-10 p-6 sm:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-label font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>SEGURIDAD INSTITUCIONAL · 重置密码</span>
                </div>
                <span className="font-label text-[11px] text-on-surface-variant font-medium tracking-tight">
                  TUTORIA-AUTH // v4.2
                </span>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex items-baseline gap-3">
                  <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                    Recuperar Credenciales
                  </h1>
                  <span className="font-hanzi text-lg font-medium text-on-surface-variant/70 select-none">
                    找回凭证
                  </span>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Ingresa tu correo institucional registrado para enviarte un enlace de validación y
                  un token temporal de acceso seguro cifrado por el sistema académico.
                </p>
              </div>

              <form className="space-y-6" onSubmit={manejarEnvio}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="block font-headline text-xs font-semibold text-primary uppercase tracking-wider"
                      htmlFor="correoInstitucional"
                    >
                      Correo Institucional <span className="text-secondary">*</span>
                    </label>
                    <span className="font-label text-[11px] text-on-surface-variant">
                      TutorIA Cloud ID
                    </span>
                  </div>
                  <div className="relative rounded-lg shadow-sm bg-surface-container-low transition-all duration-200 focus-within:bg-surface-container-lowest focus-within:shadow-md">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3.5 bg-transparent text-sm font-body text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-colors border-0"
                      id="correoInstitucional"
                      name="correoInstitucional"
                      placeholder="ej. carlos@tutoria.edu o usuario@academico.edu"
                      required
                      type="email"
                      value={correoInstitucional}
                      onChange={(evento) => setCorreoInstitucional(evento.target.value)}
                    />
                  </div>
                  <div className="flex items-start gap-2 pt-1.5 text-xs text-on-surface-variant/90">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                      schedule
                    </span>
                    <p className="leading-relaxed">
                      Se enviará un código numérico temporal válido por{' '}
                      <span className="font-label font-medium text-primary">15 minutos</span> a tu
                      bandeja institucional oficial.
                    </p>
                  </div>
                </div>

                {estadoEnvio === 'enviado' && (
                  <div className="rounded-lg p-4 bg-surface-container-high transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          mark_email_read
                        </span>
                      </div>
                      <div className="flex flex-col text-xs space-y-1">
                        <span className="font-headline font-semibold text-primary">
                          Token Despachado con Éxito
                        </span>
                        <span className="font-body text-on-surface-variant">
                          Revisa tu bandeja de entrada o carpeta de correos prioritarios para
                          continuar el proceso.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg bg-secondary hover:bg-secondary-container active:scale-[0.99] text-on-secondary font-headline font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 group disabled:opacity-90 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={estadoEnvio === 'enviando'}
                  >
                    <span>{botonActual.texto}</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                      {botonActual.icono}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t-0 bg-surface-container-low rounded-lg p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center font-hanzi font-bold text-sm shrink-0">
                  印
                </div>
                <div className="flex flex-col text-xs leading-tight">
                  <span className="font-headline font-semibold text-primary">
                    Validación Criptográfica Académica
                  </span>
                  <span className="font-body text-on-surface-variant text-[11px] mt-0.5">
                    Protocolo estandarizado para alumnos del ciclo SRS y docentes certificados.
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body pt-2">
                <button
                  className="inline-flex items-center gap-1.5 font-headline font-medium text-primary hover:text-primary-container transition-colors py-1 group cursor-pointer"
                  type="button"
                  onClick={alVolverAlLogin}
                >
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">
                    arrow_back
                  </span>
                  <span>Volver al inicio de sesión</span>
                </button>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors text-center sm:text-right"
                  href="#"
                >
                  ¿No recuerdas tu correo?{' '}
                  <span className="font-semibold underline underline-offset-4 decoration-outline-variant">
                    Soporte Académico
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-on-surface-variant font-label opacity-75">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">
                verified_user
              </span>
              <span>SSL 256-BIT ENCRYPTION</span>
            </div>
            <span className="text-outline-variant">/</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary">school</span>
              <span>PORTAL ACADÉMICO TUTORIA</span>
            </div>
          </div>
        </div>
      </main>

      {/* PIE DE PÁGINA INSTITUCIONAL */}
      <footer className="relative z-10 w-full py-6 px-6 border-t border-outline-variant/30 text-center text-xs font-body text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="font-medium">© TutorIA</span>
            <span className="text-outline-variant">·</span>
            <span>Sistema Académico</span>
          </div>
          <div className="flex items-center gap-5">
            <a className="hover:text-primary transition-colors" href="#">
              Privacidad
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Términos Institucionales
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Contacto de Soporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VistaRecuperacionCredenciales
