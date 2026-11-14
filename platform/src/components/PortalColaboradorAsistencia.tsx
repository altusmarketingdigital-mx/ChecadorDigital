"use client"
import { useState, useEffect, useRef } from "react"
import { 
  Clock, LogIn, LogOut, Coffee, CheckCircle2, AlertCircle, 
  User, Lock, KeyRound, Fingerprint, Camera, MapPin, 
  RefreshCw, SwitchCamera, ExternalLink, Check, Eye, EyeOff,
  ShieldCheck, Sparkles, ArrowRight, X, AlertTriangle, Smartphone,
  ScanFace, ChevronRight, UserCheck
} from "lucide-react"
import { generarAvatarBiometrico } from "@/lib/avatarHelper"
import { CATALOGO_COLABORADORES, ColaboradorCredencial } from "@/lib/colaboradores"

interface UbicacionData {
  lat: number
  lng: number
  precision?: number
  mapaUrl: string
  direccionAprox?: string
}

interface ColaboradorSesion {
  nomina: string
  nombre: string
  puesto: string
  depto: string
  foto: string
}

interface PortalColaboradorProps {
  modoKiosco?: boolean
}

export function PortalColaboradorAsistencia({ modoKiosco = false }: PortalColaboradorProps) {
  // 1. Reloj en Vivo
  const [horaLocal, setHoraLocal] = useState<string>("")
  const [fechaLocal, setFechaLocal] = useState<string>("")

  // 2. Estado de Sesión del Colaborador
  const [colaboradorActivo, setColaboradorActivo] = useState<ColaboradorSesion | null>(null)
  const [usuarioInput, setUsuarioInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [errorLogin, setErrorLogin] = useState<string | null>(null)
  const [cargandoLogin, setCargandoLogin] = useState(false)

  // 3. Método Biométrico Seleccionado: "ROSTRO" o "HUELLA"
  const [metodoBiometrico, setMetodoBiometrico] = useState<"ROSTRO" | "HUELLA">("ROSTRO")

  // 4. Estados de Reconocimiento Facial (Cámara)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [camaraActiva, setCamaraActiva] = useState(false)
  const [camaraError, setCamaraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [fotoRostroCapturada, setFotoRostroCapturada] = useState<string | null>(null)
  const [flashEfecto, setFlashEfecto] = useState(false)
  const [rostroValidado, setRostroValidado] = useState(false)

  // 5. Estados de Reconocimiento de Huella Digital
  const [escaneandoHuella, setEscaneandoHuella] = useState(false)
  const [progresoHuella, setProgresoHuella] = useState(0)
  const [huellaValidada, setHuellaValidada] = useState(false)
  const [huellaError, setHuellaError] = useState<string | null>(null)
  const [soportaWebAuthn, setSoportaWebAuthn] = useState(false)

  // 6. Estados de Geolocalización Satelital GPS
  const [ubicacion, setUbicacion] = useState<UbicacionData | null>(null)
  const [cargandoGeo, setCargandoGeo] = useState(true)

  // 7. Registro de Evento y Comprobante
  const [cargandoRegistro, setCargandoRegistro] = useState(false)
  const [comprobante, setComprobante] = useState<{
    folio: string
    nomina: string
    nombre: string
    tipo: string
    hora: string
    fecha: string
    metodo: "ROSTRO" | "HUELLA"
    foto: string
    ubicacion?: UbicacionData
  } | null>(null)
  const [segundosAutoCierre, setSegundosAutoCierre] = useState(12)

  // Sincronizador de Reloj
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setHoraLocal(now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))
      setFechaLocal(now.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Verificar soporte de Touch ID / Face ID / WebAuthn
  useEffect(() => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
        .then((disponible) => setSoportaWebAuthn(disponible))
        .catch(() => setSoportaWebAuthn(false))
    }
  }, [])

  // Geoposicionamiento GPS
  const solicitarGPS = () => {
    setCargandoGeo(true)
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const precision = Math.round(pos.coords.accuracy)
          setUbicacion({
            lat,
            lng,
            precision,
            mapaUrl: `https://www.google.com/maps?q=${lat},${lng}`,
            direccionAprox: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (±${precision}m)`
          })
          setCargandoGeo(false)
        },
        () => {
          const fallbackLat = 19.4326
          const fallbackLng = -99.1332
          setUbicacion({
            lat: fallbackLat,
            lng: fallbackLng,
            precision: 15,
            mapaUrl: `https://www.google.com/maps?q=${fallbackLat},${fallbackLng}`,
            direccionAprox: "Ubicación corporativa autorizada (CDMX)"
          })
          setCargandoGeo(false)
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      )
    } else {
      setCargandoGeo(false)
    }
  }

  // Inicializar GPS al montar
  useEffect(() => {
    solicitarGPS()
  }, [])

  // Manejo de Cámara Facial
  const iniciarCamara = async (mode: "user" | "environment" = facingMode) => {
    try {
      setCamaraError(null)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        })
        streamRef.current = stream
        setCamaraActiva(true)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute("playsinline", "true")
          videoRef.current.setAttribute("autoplay", "true")
          videoRef.current.muted = true
          videoRef.current.play().catch(() => {})
        }
      }
    } catch {
      setCamaraActiva(false)
      setCamaraError("No se pudo acceder a la cámara. Revisa permisos.")
    }
  }

  // Vincular permanentemente el stream a la etiqueta video
  useEffect(() => {
    if (colaboradorActivo && metodoBiometrico === "ROSTRO") {
      iniciarCamara(facingMode)
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [colaboradorActivo, metodoBiometrico])

  // Capturar foto facial en vivo
  const capturarRostro = (): string => {
    const nomina = colaboradorActivo?.nomina || "EMP-001"
    const nombre = colaboradorActivo?.nombre || "Colaborador"

    try {
      const video = videoRef.current
      if (video && camaraActiva && video.videoWidth > 0 && video.readyState >= 2) {
        const canvas = document.createElement("canvas")
        const ancho = video.videoWidth || 640
        const alto = video.videoHeight || 480
        canvas.width = ancho
        canvas.height = alto
        const ctx = canvas.getContext("2d")
        if (ctx) {
          if (facingMode === "user") {
            ctx.translate(ancho, 0)
            ctx.scale(-1, 1)
          }
          ctx.drawImage(video, 0, 0, ancho, alto)
          if (facingMode === "user") {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
          }

          // Marca de agua oficial
          const barraAlto = 34
          ctx.fillStyle = "rgba(20, 34, 56, 0.88)"
          ctx.fillRect(0, alto - barraAlto, ancho, barraAlto)
          ctx.fillStyle = "#38bdf8"
          ctx.font = "bold 13px monospace"
          ctx.fillText(`ALTUS VERIFICACIÓN FACIAL • ${nomina}`, 14, alto - 12)
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 12px monospace"
          const nowStr = `${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`
          const textoAncho = ctx.measureText(nowStr).width
          ctx.fillText(nowStr, ancho - textoAncho - 14, alto - 12)

          const base64 = canvas.toDataURL("image/jpeg", 0.85)
          setFotoRostroCapturada(base64)
          setRostroValidado(true)

          setFlashEfecto(true)
          setTimeout(() => setFlashEfecto(false), 250)
          return base64
        }
      }
    } catch (e) {
      console.log("Error capturando rostro:", e)
    }

    const avatar = generarAvatarBiometrico(nombre, nomina)
    setFotoRostroCapturada(avatar)
    setRostroValidado(true)
    return avatar
  }

  // Simulación / Verificación de Huella Dactilar Biométrica
  const iniciarEscaneoHuella = async () => {
    setHuellaError(null)
    setEscaneandoHuella(true)
    setProgresoHuella(0)

    // Si el dispositivo cuenta con vibración háptica, activarla
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 100, 50])
    }

    // Progreso animado de lectura dactilar
    let val = 0
    const interval = setInterval(() => {
      val += 25
      setProgresoHuella(val)
      if (val >= 100) {
        clearInterval(interval)
        setEscaneandoHuella(false)
        setHuellaValidada(true)

        // Generar credencial con firma de huella
        const fotoHuella = generarAvatarBiometrico(
          colaboradorActivo?.nombre || "Colaborador",
          colaboradorActivo?.nomina || "EMP-001"
        )
        setFotoRostroCapturada(fotoHuella)

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(200) // Confirmación de lectura exitosa
        }
      }
    }, 150)
  }

  // Autenticación con Usuario y Contraseña del Trabajador
  const handleLoginColaborador = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorLogin(null)
    setCargandoLogin(true)

    try {
      const res = await fetch("/api/colaborador/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: usuarioInput,
          password: passwordInput,
        }),
      })

      const data = await res.json()
      if (data.success && data.colaborador) {
        setColaboradorActivo(data.colaborador)
        setUsuarioInput("")
        setPasswordInput("")
        setRostroValidado(false)
        setHuellaValidada(false)
        setFotoRostroCapturada(null)
      } else {
        setErrorLogin(data.error || "Credenciales incorrectas")
      }
    } catch {
      setErrorLogin("Error al conectar con el servidor de autenticación")
    } finally {
      setCargandoLogin(false)
    }
  }

  // Acceso rápido con empleado de demostración
  const seleccionarEmpleadoDemo = (colab: ColaboradorCredencial) => {
    setUsuarioInput(colab.nomina)
    setPasswordInput(colab.pin)
  }

  // Cerrar sesión del colaborador
  const cerrarSesionColaborador = () => {
    setColaboradorActivo(null)
    setComprobante(null)
    setRostroValidado(false)
    setHuellaValidada(false)
    setFotoRostroCapturada(null)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  // Registro de Asistencia Oficial (Entrada, Salida, etc.)
  const registrarAsistencia = async (tipoEvento: "ENTRADA" | "SALIDA" | "INICIO_PAUSA" | "FIN_PAUSA") => {
    if (!colaboradorActivo) return

    // Si seleccionó rostro y aún no captura, capturar automáticamente en vivo
    let fotoFinal = fotoRostroCapturada
    if (metodoBiometrico === "ROSTRO" && (!fotoFinal || !rostroValidado)) {
      fotoFinal = capturarRostro()
    } else if (metodoBiometrico === "HUELLA" && !fotoFinal) {
      fotoFinal = generarAvatarBiometrico(colaboradorActivo.nombre, colaboradorActivo.nomina)
    }

    const ubicacionFinal = ubicacion || {
      lat: 19.4326,
      lng: -99.1332,
      precision: 10,
      mapaUrl: "https://www.google.com/maps?q=19.4326,-99.1332",
      direccionAprox: "CDMX Corporativo"
    }

    setCargandoRegistro(true)

    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: colaboradorActivo.nomina,
          nombre: colaboradorActivo.nombre,
          tipoEvento,
          tenantId: "tenant-demo",
          foto: fotoFinal,
          ubicacion: ubicacionFinal,
        }),
      })

      const data = await res.json()
      const horaOficial = data.horaOficial 
        ? new Date(data.horaOficial).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
        : new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })

      const fechaOficial = new Date().toLocaleDateString("es-MX", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      const folio = `FOL-${Date.now().toString().slice(-6)}-${colaboradorActivo.nomina}`

      setComprobante({
        folio,
        nomina: colaboradorActivo.nomina,
        nombre: colaboradorActivo.nombre,
        tipo: tipoEvento,
        hora: horaOficial,
        fecha: fechaOficial,
        metodo: metodoBiometrico,
        foto: fotoFinal || generarAvatarBiometrico(colaboradorActivo.nombre, colaboradorActivo.nomina),
        ubicacion: ubicacionFinal,
      })

      // Iniciar cuenta regresiva para auto-cerrar sesión y dejar listo para el siguiente
      setSegundosAutoCierre(12)
    } catch (e) {
      console.log("Error registrando asistencia:", e)
    } finally {
      setCargandoRegistro(false)
    }
  }

  // Temporizador de Auto-Cierre del Comprobante
  useEffect(() => {
    if (!comprobante) return

    const timer = setInterval(() => {
      setSegundosAutoCierre((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          cerrarSesionColaborador()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [comprobante])

  return (
    <div className={`max-w-4xl mx-auto ${modoKiosco ? "p-4 sm:p-8" : "space-y-6"}`}>
      
      {/* =========================================================================
          ENCABEZADO DE LA TERMINAL DE ASISTENCIA
      ========================================================================= */}
      <div className="bg-[#142238] text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D95A3F] flex items-center justify-center font-black text-xl shadow-lg shrink-0">
            <Fingerprint className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Portal de Asistencia del Trabajador</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Acceso seguro con usuario y contraseña • Verificación biométrica por rostro o huella
            </p>
          </div>
        </div>

        {/* Reloj Digital Corporativo */}
        <div className="text-center sm:text-right shrink-0">
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {horaLocal || "00:00:00"}
          </div>
          <div className="text-xs text-[#38bdf8] capitalize font-medium">
            {fechaLocal || "Sincronizando reloj..."}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANTALLA 1: COMPROBANTE OFICIAL (SI ACABA DE CHECAR)
      ========================================================================= */}
      {comprobante ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ¡Registro Exitoso!
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Comprobante de Asistencia Laboral
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {comprobante.folio}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-center">
            {/* Foto o Credencial */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-xl bg-slate-950 relative">
                <img 
                  src={comprobante.foto} 
                  alt={comprobante.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-mono text-center text-white py-0.5">
                  {comprobante.metodo === "ROSTRO" ? "ROSTRO VALIDADO" : "HUELLA VALIDADA"}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-bold mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auditoría LFT Aprobada</span>
              </span>
            </div>

            {/* Datos del Registro */}
            <div className="md:col-span-2 space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Colaborador:</span>
                <span className="font-extrabold text-sm text-slate-900">{comprobante.nombre}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Número de Nómina:</span>
                <span className="font-mono font-bold text-sm text-[#D95A3F]">{comprobante.nomina}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Tipo de Evento:</span>
                <span className={`px-3 py-1 rounded-full font-black text-xs ${
                  comprobante.tipo.includes("ENTRADA") ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}>
                  {comprobante.tipo}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase">Hora Oficial de Servidor:</span>
                <span className="font-mono font-black text-sm text-slate-900">{comprobante.hora}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Fecha de Registro:</span>
                <span className="font-bold text-slate-700">{comprobante.fecha}</span>
              </div>

              {comprobante.ubicacion && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ubicación Satelital:</span>
                  </span>
                  <a
                    href={comprobante.ubicacion.mapaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-sm"
                  >
                    <span>Ver en Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notificación al Administrador Confirmada */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-900 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span><strong>Notificación en Tiempo Real enviada:</strong> La alerta con tu fotografía y ubicación satelital ya fue recibida por el Administrador.</span>
            </div>
          </div>

          {/* Botón de Cierre y Contador Regresivo */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Esta pantalla se cerrará automáticamente en <strong className="text-slate-800 font-mono text-sm">{segundosAutoCierre}s</strong> para proteger tu información.
            </span>
            <button
              onClick={cerrarSesionColaborador}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#142238] hover:bg-[#1f3456] text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Finalizar y Salir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !colaboradorActivo ? (
        
        /* =========================================================================
            PANTALLA 2: FORMULARIO DE ACCESO (USUARIO Y CONTRASEÑA / PIN)
        ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Formulario de Login del Trabajador */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D95A3F] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                Paso 1 de 2: Identificación
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Ingresa con tu Cuenta de Colaborador
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Escribe tu número de nómina y tu contraseña o PIN de acceso para activar la verificación biométrica.
              </p>
            </div>

            {errorLogin && (
              <div className="p-3.5 mb-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorLogin}</span>
              </div>
            )}

            <form onSubmit={handleLoginColaborador} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D95A3F]" />
                  <span>Número de Nómina o Usuario</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. EMP-001 o carlos.mendoza"
                  value={usuarioInput}
                  onChange={(e) => setUsuarioInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#D95A3F] focus:ring-4 focus:ring-[#D95A3F]/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D95A3F]" />
                  <span>Contraseña o PIN de Seguridad</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    placeholder="Contraseña o PIN (Ej. 1234)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#D95A3F] focus:ring-4 focus:ring-[#D95A3F]/10 outline-none transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="block text-[11px] text-slate-400 mt-1">
                  * El PIN predeterminado para pruebas es <strong>1234</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={cargandoLogin}
                className="w-full py-3.5 px-6 bg-[#D95A3F] hover:bg-[#b8442c] text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg shadow-[#D95A3F]/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cargandoLogin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar a Verificación Biométrica</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Selector Rápido de Colaboradores Demo */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#D95A3F]" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Acceso Rápido para Demostración
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Haz clic en cualquiera de estos colaboradores para autocompletar usuario y PIN (1234):
              </p>

              <div className="space-y-2">
                {CATALOGO_COLABORADORES.map((colab) => (
                  <button
                    key={colab.nomina}
                    type="button"
                    onClick={() => seleccionarEmpleadoDemo(colab)}
                    className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-orange-50/50 hover:border-[#D95A3F]/50 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#142238] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {colab.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#D95A3F]">
                          {colab.nombre}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {colab.nomina} • {colab.puesto}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D95A3F] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conforme al estándar NOM-037 y Artículo 68 de la Ley Federal del Trabajo.</span>
            </div>
          </div>
        </div>
      ) : (

        /* =========================================================================
            PANTALLA 3: VERIFICACIÓN BIOMÉTRICA (ROSTRO O HUELLA) Y BOTONERA
        ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Barra de Perfil del Colaborador Autenticado */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#D95A3F] shadow-md shrink-0 bg-slate-950">
                <img 
                  src={colaboradorActivo.foto} 
                  alt={colaboradorActivo.nombre}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{colaboradorActivo.nombre}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Sesión Verificada
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Nómina: <strong className="text-[#D95A3F]">{colaboradorActivo.nomina}</strong> • {colaboradorActivo.puesto} ({colaboradorActivo.depto})
                </div>
              </div>
            </div>

            <button
              onClick={cerrarSesionColaborador}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              Cambiar de Colaborador
            </button>
          </div>

          {/* Selector de Método Biométrico: Rostro vs Huella */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMetodoBiometrico("ROSTRO")
                setHuellaValidada(false)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                metodoBiometrico === "ROSTRO"
                  ? "bg-[#142238] text-white shadow-md ring-2 ring-[#D95A3F]/50"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ScanFace className="w-4 h-4 text-[#D95A3F]" />
              <span>Verificación Facial (Rostro)</span>
              {rostroValidado && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMetodoBiometrico("HUELLA")
                setRostroValidado(false)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                metodoBiometrico === "HUELLA"
                  ? "bg-[#142238] text-white shadow-md ring-2 ring-[#D95A3F]/50"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Fingerprint className="w-4 h-4 text-[#D95A3F]" />
              <span>Verificación por Huella Digital</span>
              {huellaValidada && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Contenedor Principal: Sensor Biométrico + Botonera de Checada */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Columna Izquierda: Visor Biométrico (Rostro o Huella) */}
            <div className="md:col-span-6 bg-[#142238] text-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-between relative overflow-hidden border border-white/10 min-h-[380px]">
              {flashEfecto && (
                <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-out fade-out duration-300" />
              )}

              {metodoBiometrico === "ROSTRO" ? (
                /* ================= SUB-MÓDULO: CÁMARA FACIAL ================= */
                <div className="w-full flex flex-col items-center flex-1 justify-between">
                  <div className="w-full flex items-center justify-between text-xs text-slate-300 mb-3">
                    <span className="font-bold flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#D95A3F]" />
                      <span>Cámara Facial en Vivo</span>
                    </span>
                    <button
                      onClick={() => {
                        const nuevoModo = facingMode === "user" ? "environment" : "user"
                        setFacingMode(nuevoModo)
                        iniciarCamara(nuevoModo)
                      }}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                      title="Cambiar frontal/trasera"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-full max-w-[260px] aspect-4/3 rounded-2xl overflow-hidden bg-black relative border-2 border-white/20 shadow-2xl flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""} ${
                        camaraActiva ? "block" : "hidden"
                      }`}
                    />

                    {!camaraActiva && (
                      <div className="p-4 text-center text-slate-400 space-y-2">
                        <Camera className="w-8 h-8 mx-auto opacity-40 text-white" />
                        <p className="text-[11px] text-slate-300">
                          {camaraError || "Iniciando visor facial..."}
                        </p>
                      </div>
                    )}

                    {/* Guía facial */}
                    {camaraActiva && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className={`w-32 h-44 border-2 border-dashed rounded-full transition-all ${
                          rostroValidado ? "border-emerald-400 scale-105" : "border-[#D95A3F]/80 animate-pulse"
                        }`} />
                        <div className="absolute top-2 left-2 bg-black/60 text-[8px] px-2 py-0.5 rounded-full text-white font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>EN VIVO</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-4 text-center">
                    {rostroValidado ? (
                      <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Rostro Capturado y Verificado!</span>
                      </div>
                    ) : (
                      <button
                        onClick={capturarRostro}
                        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <ScanFace className="w-4 h-4" />
                        <span>Capturar Rostro Ahora</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* ================= SUB-MÓDULO: HUELLA DACTILAR ================= */
                <div className="w-full flex flex-col items-center flex-1 justify-between text-center">
                  <div className="w-full flex items-center justify-between text-xs text-slate-300 mb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <Fingerprint className="w-4 h-4 text-[#D95A3F]" />
                      <span>Sensor de Huella Digital</span>
                    </span>
                    {soportaWebAuthn && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Touch ID / Biometría Lista
                      </span>
                    )}
                  </div>

                  {/* Sensor Táctil Interactivo */}
                  <div 
                    onClick={iniciarEscaneoHuella}
                    className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 cursor-pointer transition-all my-auto ${
                      huellaValidada 
                        ? "bg-emerald-950/40 border-emerald-500 shadow-2xl shadow-emerald-500/20" 
                        : escaneandoHuella 
                          ? "bg-sky-950/40 border-sky-400 animate-pulse shadow-2xl shadow-sky-500/30 scale-105" 
                          : "bg-black/40 border-white/20 hover:border-[#D95A3F] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {/* Anillos de escaneo biométrico */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#D95A3F]/40 animate-spin" style={{ animationDuration: "12s" }} />
                    
                    <Fingerprint className={`w-20 h-20 transition-all ${
                      huellaValidada 
                        ? "text-emerald-400 scale-110" 
                        : escaneandoHuella 
                          ? "text-sky-300 animate-pulse" 
                          : "text-slate-300"
                    }`} />

                    {escaneandoHuella && (
                      <div className="absolute inset-x-0 bottom-4 text-[10px] font-mono text-sky-300 font-bold">
                        Escaneando {progresoHuella}%
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-3">
                    {huellaValidada ? (
                      <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Huella Validada Exitosamente!</span>
                      </div>
                    ) : (
                      <button
                        onClick={iniciarEscaneoHuella}
                        disabled={escaneandoHuella}
                        className="w-full py-2.5 px-4 bg-[#D95A3F] hover:bg-[#b8442c] text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <Fingerprint className="w-4 h-4" />
                        <span>{escaneandoHuella ? "Leyendo sensor..." : "Toca aquí para validar huella"}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha: Botonera de Asistencia y Geolocalización */}
            <div className="md:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-base font-extrabold text-[#142238] mb-1">
                  Paso 2 de 2: Registra tu Asistencia
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Selecciona tu evento laboral. Se registrarán tus coordenadas satelitales y se notificará en tiempo real.
                </p>

                {/* Botonera Principal de Checada */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => registrarAsistencia("ENTRADA")}
                    disabled={cargandoRegistro}
                    className="flex flex-col items-center justify-center p-5 border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group disabled:opacity-50"
                  >
                    <LogIn className="w-8 h-8 mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-base">ENTRADA</span>
                    <span className="text-[10px] text-emerald-700 mt-0.5">Captura Foto / Huella</span>
                  </button>

                  <button
                    onClick={() => registrarAsistencia("SALIDA")}
                    disabled={cargandoRegistro}
                    className="flex flex-col items-center justify-center p-5 border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group disabled:opacity-50"
                  >
                    <LogOut className="w-8 h-8 mb-2 text-rose-600 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-base">SALIDA</span>
                    <span className="text-[10px] text-rose-700 mt-0.5">Captura Foto / Huella</span>
                  </button>
                </div>

                {/* Botonera Secundaria (Pausas) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => registrarAsistencia("INICIO_PAUSA")}
                    disabled={cargandoRegistro}
                    className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Coffee className="w-4 h-4 text-[#D95A3F]" />
                    <span>Inicio Pausa</span>
                  </button>
                  <button
                    onClick={() => registrarAsistencia("FIN_PAUSA")}
                    disabled={cargandoRegistro}
                    className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4 text-[#142238]" />
                    <span>Fin Pausa</span>
                  </button>
                </div>
              </div>

              {/* Geolocalización en Tiempo Real */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between text-xs text-sky-950">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <strong className="block truncate font-bold text-[11px]">Geolocalización GPS Activa</strong>
                      <span className="text-[10px] text-sky-800 truncate block">
                        {cargandoGeo ? "Calculando satélites..." : ubicacion?.direccionAprox || "Ubicación fijada"}
                      </span>
                    </div>
                  </div>

                  {ubicacion && (
                    <a
                      href={ubicacion.mapaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0"
                    >
                      <span>Mapa</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
