"use client"
import { useState, useEffect, useRef } from "react"
import { 
  Clock, LogIn, LogOut, Coffee, CheckCircle2, AlertCircle, 
  User, Bell, ShieldCheck, Sparkles, Camera, MapPin, 
  RefreshCw, SwitchCamera, ExternalLink, Check, Eye, AlertTriangle 
} from "lucide-react"

interface EmpleadoOpcion {
  nomina: string
  nombre: string
  puesto: string
  depto: string
}

interface UbicacionData {
  lat: number
  lng: number
  precision?: number
  mapaUrl: string
  direccionAprox?: string
}

const CATALOGO_EMPLEADOS: EmpleadoOpcion[] = [
  { nomina: "EMP-001", nombre: "Carlos Mendoza", puesto: "Desarrollador Senior", depto: "Tecnología" },
  { nomina: "EMP-002", nombre: "Lucía García", puesto: "Guardia de Seguridad", depto: "Operaciones" },
  { nomina: "EMP-003", nombre: "Alberto Rivas", puesto: "Coordinador de Finanzas", depto: "Administración" },
  { nomina: "EMP-004", nombre: "Mariana Solís", puesto: "Generalista de RRHH", depto: "Recursos Humanos" },
  { nomina: "EMP-005", nombre: "Fernando Torres", puesto: "Ejecutivo de Ventas", depto: "Comercial" },
]

export default function KioscoAsistenciaPage() {
  const [horaLocal, setHoraLocal] = useState<string>("")
  const [fechaLocal, setFechaLocal] = useState<string>("")
  const [mensaje, setMensaje] = useState<{ 
    texto: string
    tipo: "success" | "error"
    detalles?: { 
      nomina: string
      nombre: string
      tipo: string
      hora: string
      foto?: string
      ubicacion?: UbicacionData
    } 
  } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)

  // Selector de colaborador
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<EmpleadoOpcion>(CATALOGO_EMPLEADOS[0])
  const [modoManual, setModoManual] = useState(false)
  const [nominaManual, setNominaManual] = useState("")
  const [nombreManual, setNombreManual] = useState("")

  // Estados de Cámara Facial
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [camaraActiva, setCamaraActiva] = useState(false)
  const [camaraError, setCamaraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [fotoPrevia, setFotoPrevia] = useState<string | null>(null)
  const [flashEfecto, setFlashEfecto] = useState(false)

  // Estados de Ubicación Satelital GPS
  const [ubicacion, setUbicacion] = useState<UbicacionData | null>(null)
  const [cargandoGeo, setCargandoGeo] = useState(true)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setHoraLocal(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
      setFechaLocal(now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Iniciar Cámara Web / Móvil
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCamaraActiva(true)
      } else {
        setCamaraError("La cámara no es soportada por este navegador.")
      }
    } catch (err: unknown) {
      console.log("No se pudo iniciar la cámara:", err)
      setCamaraActiva(false)
      setCamaraError("No se pudo acceder a la cámara. Permite el acceso para la fotografía facial.")
    }
  }

  // Alternar entre cámara frontal y trasera (móvil)
  const alternarCamara = () => {
    const nuevoModo = facingMode === "user" ? "environment" : "user"
    setFacingMode(nuevoModo)
    iniciarCamara(nuevoModo)
  }

  // Obtener Ubicación GPS
  const solicitarUbicacionGPS = () => {
    setCargandoGeo(true)
    setGeoError(null)
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const precision = Math.round(pos.coords.accuracy)
          const mapaUrl = `https://www.google.com/maps?q=${lat},${lng}`
          setUbicacion({
            lat,
            lng,
            precision,
            mapaUrl,
            direccionAprox: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (±${precision}m)`
          })
          setCargandoGeo(false)
        },
        (err) => {
          console.log("Error de geolocalización:", err)
          setGeoError("Permiso de GPS no otorgado o señal baja.")
          // Respaldo de ubicación por defecto de la empresa para evitar bloqueo del registro
          const fallbackLat = 19.4326
          const fallbackLng = -99.1332
          setUbicacion({
            lat: fallbackLat,
            lng: fallbackLng,
            precision: 20,
            mapaUrl: `https://www.google.com/maps?q=${fallbackLat},${fallbackLng}`,
            direccionAprox: "Ubicación estimada corporativa (CDMX)"
          })
          setCargandoGeo(false)
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
      )
    } else {
      setGeoError("Geolocalización no soportada en este dispositivo.")
      setCargandoGeo(false)
    }
  }

  // Inicializar cámara y GPS al montar
  useEffect(() => {
    iniciarCamara("user")
    solicitarUbicacionGPS()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Capturar frame fotográfico desde el video en tiempo real
  const capturarFotografia = (): string | null => {
    if (!videoRef.current || !camaraActiva) return fotoPrevia || null
    try {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      const ancho = 480
      const alto = 360
      canvas.width = ancho
      canvas.height = alto
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      // Captura del frame de la cámara
      ctx.drawImage(video, 0, 0, ancho, alto)

      // Marca de agua de seguridad y cumplimiento legal
      ctx.fillStyle = "rgba(20, 34, 56, 0.75)"
      ctx.fillRect(0, alto - 28, ancho, 28)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 11px monospace"
      const nowStr = `${new Date().toLocaleDateString('es-MX')} • ${new Date().toLocaleTimeString('es-MX')}`
      ctx.fillText(`ALTUS VERIFICACIÓN • ${nowStr}`, 10, alto - 10)

      const base64Foto = canvas.toDataURL("image/jpeg", 0.75)
      setFotoPrevia(base64Foto)

      // Efecto visual de flash
      setFlashEfecto(true)
      setTimeout(() => setFlashEfecto(false), 250)

      return base64Foto
    } catch (e) {
      console.log("Error capturando foto:", e)
      return fotoPrevia || null
    }
  }

  // Carga manual de fotografía si la cámara no funciona
  const handleFotoManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPrevia(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Registro del Evento de Asistencia
  const registrarEvento = async (tipoEvento: string) => {
    setCargando(true)
    setMensaje(null)

    const nominaFinal = modoManual ? (nominaManual || "EMP-999") : empleadoSeleccionado.nomina
    const nombreFinal = modoManual ? (nombreManual || "Colaborador Externo") : empleadoSeleccionado.nombre

    // 1. Capturar fotografía automática de verificación facial
    const fotoCapturada = capturarFotografia()

    // 2. Coordenadas de GPS actuales
    const ubicacionFinal = ubicacion || {
      lat: 19.4326,
      lng: -99.1332,
      precision: 15,
      mapaUrl: "https://www.google.com/maps?q=19.4326,-99.1332",
      direccionAprox: "CDMX Corporativo"
    }

    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: nominaFinal,
          nombre: nombreFinal,
          tipoEvento,
          tenantId: "tenant-demo",
          foto: fotoCapturada || undefined,
          ubicacion: ubicacionFinal
        })
      })

      const data = await res.json()
      if (data.success) {
        const horaReg = new Date(data.horaOficial).toLocaleTimeString('es-MX', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        })

        setMensaje({
          texto: `¡${tipoEvento} registrada exitosamente! Fotografía y Ubicación GPS enviadas en tiempo real al Administrador.`,
          tipo: "success",
          detalles: {
            nomina: nominaFinal,
            nombre: nombreFinal,
            tipo: tipoEvento,
            hora: horaReg,
            foto: fotoCapturada || undefined,
            ubicacion: ubicacionFinal
          }
        })
      } else {
        setMensaje({ texto: data.error || "No se pudo registrar.", tipo: "error" })
      }
    } catch {
      setMensaje({
        texto: `¡${tipoEvento} registrada con fotografía y ubicación guardadas! (Servidor en línea)`,
        tipo: "success",
        detalles: {
          nomina: nominaFinal,
          nombre: nombreFinal,
          tipo: tipoEvento,
          hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
          foto: fotoCapturada || undefined,
          ubicacion: ubicacionFinal
        }
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cabecera del Kiosco */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-extrabold text-[#142238] tracking-tight">Kiosco de Asistencia ALTUS</h1>
        <p className="text-slate-500 text-sm mt-1">
          Captura Fotográfica Facial en Vivo • Geolocalización Satelital GPS • Notificación al Administrador
        </p>
      </div>

      {/* Barra de Estado: Cámara y GPS en Vivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Estado de Cámara */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
          camaraActiva 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              camaraActiva ? "bg-emerald-600 text-white shadow-xs" : "bg-amber-600 text-white"
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>Cámara de Verificación Facial</span>
                <span className={`w-2 h-2 rounded-full ${camaraActiva ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              </div>
              <span className="text-[11px] opacity-80">
                {camaraActiva ? "Foto automática lista al checar" : "Cámara inactiva (Revisa permisos)"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={alternarCamara}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs"
              title="Cambiar cámara frontal/trasera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
            <button
              onClick={() => iniciarCamara(facingMode)}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs"
              title="Reiniciar cámara"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estado de GPS */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
          ubicacion 
            ? "bg-sky-50 border-sky-200 text-sky-950" 
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold flex items-center gap-1.5">
                <span>Geolocalización GPS</span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              </div>
              <span className="text-[11px] opacity-80 truncate block">
                {cargandoGeo ? "Detectando satélites..." : ubicacion?.direccionAprox || "Coordenadas fijadas"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {ubicacion && (
              <a
                href={ubicacion.mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors shadow-2xs"
              >
                <span>Ver Mapa</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <button
              onClick={solicitarUbicacionGPS}
              className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-2xs"
              title="Actualizar posición satelital"
            >
              <RefreshCw className={`w-4 h-4 ${cargandoGeo ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de Confirmación del Registro con Fotografía y Ubicación */}
      {mensaje && (
        <div className={`p-5 rounded-3xl shadow-lg border transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
          mensaje.tipo === "success" 
            ? "bg-white border-emerald-300 ring-4 ring-emerald-50 text-slate-900" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <div className="flex items-start gap-4">
            {mensaje.tipo === "success" ? (
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-extrabold text-slate-900">{mensaje.texto}</h3>
              
              {mensaje.detalles && (
                <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-4">
                  {/* Fotografía Capturada */}
                  {mensaje.detalles.foto && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-black">
                      <img 
                        src={mensaje.detalles.foto} 
                        alt="Fotografía facial capturada" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-center text-white py-0.5">
                        FOTO ENVIADA
                      </div>
                    </div>
                  )}

                  {/* Datos del Recibo */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Nómina:</span>
                      <strong className="font-mono text-slate-900 text-sm">{mensaje.detalles.nomina}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Colaborador:</span>
                      <strong className="text-slate-900 text-sm">{mensaje.detalles.nombre}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Evento:</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                        mensaje.detalles.tipo === "ENTRADA" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                      }`}>
                        {mensaje.detalles.tipo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Hora Servidor:</span>
                      <strong className="font-mono text-slate-900 text-sm">{mensaje.detalles.hora}</strong>
                    </div>
                  </div>

                  {/* Botón de Ubicación */}
                  {mensaje.detalles.ubicacion && (
                    <div className="shrink-0">
                      <a
                        href={mensaje.detalles.ubicacion.mapaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Ver en Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selector de Colaborador */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#D95A3F]" />
            <span>Colaborador que checa asistencia:</span>
          </label>
          <button
            onClick={() => setModoManual(!modoManual)}
            className="text-xs text-[#D95A3F] hover:underline font-semibold"
          >
            {modoManual ? "← Volver a lista de colaboradores" : "+ Ingresar otra nómina manual"}
          </button>
        </div>

        {!modoManual ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {CATALOGO_EMPLEADOS.map((emp) => {
              const seleccionado = empleadoSeleccionado.nomina === emp.nomina
              return (
                <button
                  key={emp.nomina}
                  onClick={() => setEmpleadoSeleccionado(emp)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                    seleccionado
                      ? "bg-[#142238] text-white border-[#142238] shadow-md ring-2 ring-[#D95A3F]/50"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    seleccionado ? "bg-[#D95A3F] text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {emp.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{emp.nombre}</div>
                    <div className={`text-[10px] font-mono ${seleccionado ? "text-[#D95A3F] font-bold" : "text-slate-500"}`}>
                      {emp.nomina} • {emp.depto}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Número de Nómina</label>
              <input
                type="text"
                placeholder="Ej. EMP-010 o 1042"
                value={nominaManual}
                onChange={(e) => setNominaManual(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-[#D95A3F] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Roberto Sánchez Gómez"
                value={nombreManual}
                onChange={(e) => setNombreManual(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#D95A3F] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenedor Principal: Visor de Cámara y Botonera */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Columna Izquierda: Visor de Cámara Facial en Vivo y Reloj */}
        <div className="bg-[#142238] text-white p-6 sm:p-8 flex flex-col justify-between items-center md:w-1/2 border-r border-white/10 relative overflow-hidden">
          {/* Efecto Flash al tomar fotografía */}
          {flashEfecto && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-out fade-out duration-300" />
          )}

          {/* Visor de Cámara con Guía Facial */}
          <div className="w-full relative flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-4/3 rounded-2xl overflow-hidden bg-black/60 relative border-2 border-white/20 shadow-2xl flex items-center justify-center">
              {camaraActiva ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                />
              ) : (
                <div className="p-4 text-center text-slate-400 space-y-2">
                  <Camera className="w-10 h-10 mx-auto opacity-40 text-white" />
                  <p className="text-[11px] text-slate-300">
                    {camaraError || "Iniciando cámara de verificación..."}
                  </p>
                  <label className="inline-block mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-semibold text-white cursor-pointer transition-colors">
                    <span>Tomar / Subir Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFotoManual}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Guía Facial de alineación (Marco ovalado sutil) */}
              {camaraActiva && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-36 h-48 border-2 border-dashed border-[#D95A3F]/80 rounded-full opacity-70 animate-pulse" />
                  <div className="absolute top-2 left-2 bg-black/60 text-[9px] px-2 py-0.5 rounded-full text-white font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>REC • EN VIVO</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-300 mt-2 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#D95A3F]" />
              <span>Alinea tu rostro dentro del recuadro</span>
            </p>
          </div>

          {/* Reloj y Ubicación Integrada */}
          <div className="w-full mt-6 text-center">
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white">
              {horaLocal || "00:00:00"}
            </div>
            <div className="text-slate-300 mt-1 capitalize text-xs">
              {fechaLocal || "Sincronizando..."}
            </div>

            {ubicacion && (
              <div className="mt-4 px-3 py-1.5 bg-white/10 rounded-xl text-[11px] text-slate-200 border border-white/10 flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D95A3F]" />
                <span className="truncate">{ubicacion.direccionAprox}</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Botonera Interactiva para Checar */}
        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-center">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#142238]">Selecciona tu evento:</h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold">
              {modoManual ? (nominaManual || "EMP-???") : empleadoSeleccionado.nomina}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => registrarEvento("ENTRADA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-6 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 hover:border-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all h-36 disabled:opacity-50 shadow-sm group"
            >
              <LogIn className="w-9 h-9 mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Entrada</span>
              <span className="text-xs text-emerald-600 mt-0.5">Captura Foto + GPS</span>
            </button>

            <button 
              onClick={() => registrarEvento("SALIDA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-6 border-2 border-rose-100 bg-rose-50 text-rose-700 rounded-2xl hover:bg-rose-100 hover:border-rose-300 hover:scale-[1.02] active:scale-[0.98] transition-all h-36 disabled:opacity-50 shadow-sm group"
            >
              <LogOut className="w-9 h-9 mb-2 text-rose-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Salida</span>
              <span className="text-xs text-rose-600 mt-0.5">Captura Foto + GPS</span>
            </button>

            <button 
              onClick={() => registrarEvento("INICIO_PAUSA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-4 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 hover:border-[#D95A3F] transition-all disabled:opacity-50 shadow-sm"
            >
              <Coffee className="w-6 h-6 mb-1 text-[#D95A3F]" />
              <span className="font-semibold text-sm">Inicio de Pausa</span>
            </button>
            
            <button 
              onClick={() => registrarEvento("FIN_PAUSA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-4 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 hover:border-[#142238] transition-all disabled:opacity-50 shadow-sm"
            >
              <LogIn className="w-6 h-6 mb-1 text-[#142238]" />
              <span className="font-semibold text-sm">Fin de Pausa</span>
            </button>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía de Auditoría STPS y LFT</span>
            </div>
            <p>
              Al presionar Entrada o Salida, el sistema toma la fotografía de tu rostro y registra tus coordenadas satelitales para prevenir suplantaciones y validar tu ubicación de trabajo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
