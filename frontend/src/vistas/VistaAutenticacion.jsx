import { useState } from 'react'
import usuariosMock from '../datosSimulados/usuariosAuthMock.json'

function VistaAutenticacion({ alSolicitarRecuperacion, alIniciarSesion }) {
  const [identificador, setIdentificador] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mensajeError, setMensajeError] = useState('')

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const identificadorNormalizado = identificador.trim().toLowerCase()
    const usuarioEncontrado = usuariosMock.usuarios.find((usuario) =>
      [usuario.correo, usuario.usuario].some(
        (valor) => valor.toLowerCase() === identificadorNormalizado,
      ),
    )

    if (!usuarioEncontrado || usuarioEncontrado.contrasena !== contrasena) {
      setMensajeError('Credenciales inválidas. Verifica tu usuario o correo y tu contraseña.')
      return
    }

    setMensajeError('')
    alIniciarSesion(usuarioEncontrado)
  }

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

      {/* LIENZO PRINCIPAL: TARJETA DE AUTENTICACIÓN CENTRADA */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[430px]">
          <div className="bg-[#faf8f5] rounded-xl border border-[#d8e2ea] shadow-[0_8px_30px_-6px_rgba(31,78,121,0.06),0_2px_10px_-2px_rgba(0,0,0,0.02)] p-7 sm:p-9 transition-all">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/50 text-[11px] font-label text-primary-container mb-3 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                <span>PORTAL INSTITUCIONAL SRS</span>
              </div>
              <h1 className="font-headline text-2xl sm:text-[28px] font-bold text-primary tracking-tight leading-snug">
                Inicio de sesión
              </h1>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Portal Institucional de Mandarín Estándar
              </p>
            </div>

            <form className="space-y-5" onSubmit={manejarEnvio}>
              <div>
                <label
                  className="block font-headline text-xs font-semibold text-on-surface mb-2 tracking-normal"
                  htmlFor="identificador"
                >
                  Usuario o Correo Institucional
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[19px]">alternate_email</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-surface-container-lowest text-on-surface placeholder:text-outline-variant border border-[#d8e2ea] rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/15 transition-all font-body"
                    id="identificador"
                    name="identificador"
                    placeholder="ej. carlos@tutoria.edu o cédula"
                    required
                    type="text"
                    value={identificador}
                    onChange={(evento) => setIdentificador(evento.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="block font-headline text-xs font-semibold text-on-surface tracking-normal"
                    htmlFor="contrasena"
                  >
                    Contraseña de registro
                  </label>
                  <button
                    className="text-xs font-headline font-medium text-primary-container hover:text-primary transition-colors hover:underline cursor-pointer"
                    type="button"
                    onClick={alSolicitarRecuperacion}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[19px]">lock</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-11 py-2.5 text-sm bg-surface-container-lowest text-on-surface placeholder:text-outline-variant border border-[#d8e2ea] rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/15 transition-all font-body tracking-wider"
                    id="contrasena"
                    name="contrasena"
                    placeholder="••••••••••••"
                    required
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={contrasena}
                    onChange={(evento) => setContrasena(evento.target.value)}
                  />
                  <button
                    aria-label="Alternar visibilidad de contraseña"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setMostrarContrasena((valorPrevio) => !valorPrevio)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mostrarContrasena ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {mensajeError && (
                <div
                  className="rounded-lg border border-error/30 bg-error-container/60 px-3.5 py-2.5 text-xs text-on-error-container"
                  role="alert"
                >
                  {mensajeError}
                </div>
              )}

              <div className="pt-2">
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-secondary hover:bg-[#ad0d26] active:bg-[#960920] text-on-secondary font-headline font-bold text-sm shadow-[0_2px_8px_rgba(200,16,46,0.24)] hover:shadow-[0_4px_14px_rgba(200,16,46,0.32)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                  type="submit"
                >
                  <span>Ingresar</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-on-surface-variant/75 text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
            <span>Canal cifrado SSL de 256 bits · Red Académica TutorIA</span>
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

export default VistaAutenticacion
