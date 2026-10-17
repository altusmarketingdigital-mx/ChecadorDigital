"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { 
  Bell, BellRing, LogIn, LogOut, Check, Trash2, X, 
  Smartphone, Volume2, Sparkles, Clock, User, ShieldCheck 
} from "lucide-react"

export interface NotificacionAsistencia {
  id: string
  nomina: string
  nombre: string
  tipoRegistro: string
  hora: string
  fecha: string
  timestamp: number
  leido: boolean
}

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BE25dPXFzn5rbcCwKf-x3rbGj7IybFTD6OSM-X2br-58XRP5qPSSLBPNkqfOFT7YRNhsbQbtt55T8nDlpM0o3dM"

// Función para convertir VAPID public key base64 a Uint8Array requerido por PushManager
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Reproductor de sonido nativo mediante Web Audio API (Chime estilo iOS)
function reproducirChimeNotificacion() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()

    // Nota 1
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(587.33, now) // D5
    gain1.gain.setValueAtTime(0.12, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.3)

    // Nota 2
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()

    osc2.type = "sine"
    osc2.frequency.setValueAtTime(880, now + 0.12) // A5
    gain2.gain.setValueAtTime(0.15, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.12)
    osc2.stop(now + 0.45)
  } catch (e) {
    console.log("Audio not supported or permitted yet", e)
  }
}

export function NotificationCenter() {
  const [notificaciones, setNotificaciones] = useState<NotificacionAsistencia[]>([])
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [alertaActiva, setAlertaActiva] = useState<NotificacionAsistencia | null>(null)
  const [permisoPush, setPermisoPush] = useState<NotificationPermission>("default")
  const [estaSuscritoPush, setEstaSuscritoPush] = useState(false)
  const [suscripcionEnProgreso, setSuscripcionEnProgreso] = useState(false)

  const idUltimaNotifConocida = useRef<string | null>(null)
  const esPrimeraCarga = useRef(true)

  // 1. Consultar estado del permiso y de la suscripción Web Push en el dispositivo
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && "Notification" in window && window.Notification) {
        setPermisoPush(window.Notification.permission || "default")
      }
    } catch {
      // Ignorar restricciones en WebKit
    }

    async function verificarEstadoPush() {
      if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
        try {
          const reg = await navigator.serviceWorker.ready
          const sub = await reg.pushManager.getSubscription()
          if (sub) {
            setEstaSuscritoPush(true)
            // Sincronizar suscripción con el servidor
            fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sub),
            }).catch(() => {})
          }
        } catch (e) {
          console.log("Error verificando suscripción push existente:", e)
        }
      }
    }

    verificarEstadoPush()
  }, [])

  // 2. Función para disparar notificación en primer plano si la app está visible
  const dispararNotificacionSistema = useCallback((notif: NotificacionAsistencia) => {
    try {
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        window.Notification &&
        window.Notification.permission === "granted"
      ) {
        const titulo = `🔔 Checada: ${notif.tipoRegistro} (${notif.nomina})`
        const opciones: NotificationOptions = {
          body: `${notif.nombre} | Nómina: ${notif.nomina}\n${notif.tipoRegistro} a las ${notif.hora}`,
          icon: "/logo-altus.jpg",
          badge: "/logo-altus.jpg",
          tag: notif.id,
        }

        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready
            .then((reg) => {
              reg.showNotification(titulo, opciones)
            })
            .catch(() => {})
        }
      }
    } catch {
      // Ignorar fallo de notificación
    }
  }, [])

  // 3. Consultar las notificaciones del servidor
  const cargarNotificaciones = useCallback(async () => {
    try {
      const res = await fetch("/api/notificaciones")
      const data = await res.json()
      if (data.success && Array.isArray(data.notificaciones)) {
        const lista: NotificacionAsistencia[] = data.notificaciones
        setNotificaciones(lista)

        if (lista.length > 0) {
          const masReciente = lista[0]

          // Si detectamos un nuevo registro que no habíamos visto mientras la app está abierta
          if (
            !esPrimeraCarga.current &&
            idUltimaNotifConocida.current &&
            idUltimaNotifConocida.current !== masReciente.id
          ) {
            reproducirChimeNotificacion()
            setAlertaActiva(masReciente)
            dispararNotificacionSistema(masReciente)

            // Auto-ocultar toast después de 6 segundos
            setTimeout(() => {
              setAlertaActiva((curr) => (curr?.id === masReciente.id ? null : curr))
            }, 6000)
          }

          idUltimaNotifConocida.current = masReciente.id
        }
        esPrimeraCarga.current = false
      }
    } catch {
      // Manejador silencioso en caso de desconexión momentánea
    }
  }, [dispararNotificacionSistema])

  // Polling cada 4 segundos mientras la app esté abierta
  useEffect(() => {
    cargarNotificaciones()
    const timer = setInterval(cargarNotificaciones, 4000)
    return () => clearInterval(timer)
  }, [cargarNotificaciones])

  // 4. Activar suscripción Web Push oficial (Llega incluso con la App CERRADA)
  const activarPushEnSegundoPlano = async () => {
    if (typeof window === "undefined") return

    setSuscripcionEnProgreso(true)
    try {
      // Paso A: Solicitar permiso al usuario
      let permiso = Notification.permission
      if (permiso !== "granted") {
        permiso = await Notification.requestPermission()
        setPermisoPush(permiso)
      }

      if (permiso !== "granted") {
        alert(
          "Para recibir notificaciones con la app cerrada, por favor permite las notificaciones en la configuración de Safari / iPhone."
        )
        setSuscripcionEnProgreso(false)
        return
      }

      // Paso B: Verificar Service Worker y PushManager
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert(
          "Para activar notificaciones con la app cerrada en iPhone, asegúrate de haber agregado la aplicación a la pantalla de inicio desde Safari (iOS 16.4+)."
        )
        setSuscripcionEnProgreso(false)
        return
      }

      const reg = await navigator.serviceWorker.ready

      // Paso C: Crear la suscripción con la clave pública VAPID
      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        })
      }

      // Paso D: Enviar suscripción a nuestro backend
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      })

      const data = await res.json()
      if (data.success) {
        setEstaSuscritoPush(true)
        reproducirChimeNotificacion()
        alert(
          "¡Notificaciones en Segundo Plano Activadas! Ahora recibirás las checadas incluso con la app cerrada o el iPhone bloqueado."
        )
      }
    } catch (err) {
      console.error("Error al suscribir a push:", err)
      alert(
        "Nota: En iPhone, Apple requiere que la aplicación esté agregada a la Pantalla de Inicio (PWA) para habilitar notificaciones push con la app cerrada."
      )
    } finally {
      setSuscripcionEnProgreso(false)
    }
  }

  // Marcar todas como leídas
  const handleMarcarLeidas = async () => {
    try {
      await fetch("/api/notificaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "marcar_todas_leidas" }),
      })
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })))
    } catch (e) {
      console.error(e)
    }
  }

  // Limpiar historial
  const handleLimpiar = async () => {
    try {
      await fetch("/api/notificaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "limpiar" }),
      })
      setNotificaciones([])
    } catch (e) {
      console.error(e)
    }
  }

  // Simular una checada de prueba
  const handleSimularChecada = async (tipo: "ENTRADA" | "SALIDA") => {
    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: "EMP-001",
          nombre: "Carlos Mendoza",
          tipoEvento: tipo,
          tenantId: "tenant-demo",
        }),
      })
      const data = await res.json()
      if (data.success) {
        cargarNotificaciones()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Enviar prueba con retardo de 4 segundos para que el usuario pueda cerrar la app y comprobar
  const handleTestPushCerrada = async () => {
    alert(
      "En 4 segundos se emitirá la notificación. ¡Cierra la app o bloquea tu iPhone AHORA para verificar que llega!"
    )
    setTimeout(async () => {
      try {
        await fetch("/api/asistencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empleadoId: "EMP-001",
            nombre: "Carlos Mendoza",
            tipoEvento: "ENTRADA",
            tenantId: "tenant-demo",
          }),
        })
      } catch (e) {
        console.error(e)
      }
    }, 4000)
  }

  const noLeidas = notificaciones.filter((n) => !n.leido).length

  return (
    <>
      {/* 1. BOTÓN DE LA CAMPANA (Para la barra superior) */}
      <div className="relative">
        <button
          onClick={() => {
            setPanelAbierto(!panelAbierto)
            if (!panelAbierto && noLeidas > 0) {
              handleMarcarLeidas()
            }
          }}
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all focus:outline-none"
          title="Notificaciones de Asistencia en Tiempo Real"
          aria-label="Notificaciones"
        >
          {noLeidas > 0 ? (
            <BellRing className="w-5 h-5 text-[#D95A3F] animate-pulse" />
          ) : (
            <Bell className="w-5 h-5 text-slate-300" />
          )}

          {noLeidas > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D95A3F] text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#142238] shadow-md animate-bounce">
              {noLeidas > 9 ? "9+" : noLeidas}
            </span>
          )}
        </button>

        {/* 2. PANEL DESPLEGABLE DE NOTIFICACIONES */}
        {panelAbierto && (
          <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera del Panel */}
            <div className="bg-[#142238] text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#D95A3F]" />
                <h3 className="font-bold text-sm">Alertas de Checador</h3>
                {noLeidas > 0 && (
                  <span className="bg-[#D95A3F] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {noLeidas} nuevas
                  </span>
                )}
              </div>
              <button
                onClick={() => setPanelAbierto(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Estado de Notificaciones con la APP CERRADA */}
            {estaSuscritoPush ? (
              <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <strong className="text-emerald-950 font-bold block">
                      Push Activo (App Abierta o Cerrada)
                    </strong>
                    <span className="text-[11px] text-emerald-700">
                      Recibirás avisos en pantalla bloqueada / iPhone.
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleTestPushCerrada}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg text-[10px] shrink-0 transition-colors shadow-sm"
                  title="Probar notificación en segundo plano"
                >
                  Probar
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 p-3 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-900">
                  <Smartphone className="w-4 h-4 text-[#D95A3F] shrink-0" />
                  <div>
                    <strong className="text-slate-900 font-bold block">
                      ¿Recibir con la APP CERRADA?
                    </strong>
                    <span className="text-[11px] text-slate-600">
                      Activa el Push de Apple / APNs para tu pantalla.
                    </span>
                  </div>
                </div>
                <button
                  onClick={activarPushEnSegundoPlano}
                  disabled={suscripcionEnProgreso}
                  className="bg-[#D95A3F] hover:bg-[#b8442c] text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 transition-colors shadow-md disabled:opacity-50"
                >
                  {suscripcionEnProgreso ? "Conectando..." : "Activar"}
                </button>
              </div>
            )}

            {/* Acciones Rápidas */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Registros en tiempo real</span>
              <div className="flex gap-2">
                <button
                  onClick={handleMarcarLeidas}
                  className="hover:text-slate-800 flex items-center gap-1 transition-colors"
                  title="Marcar todas como leídas"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leídas</span>
                </button>
                <button
                  onClick={handleLimpiar}
                  className="hover:text-rose-600 flex items-center gap-1 transition-colors"
                  title="Limpiar lista"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notificaciones.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                  <p className="text-xs">No hay registros de asistencia recientes.</p>
                </div>
              ) : (
                notificaciones.map((notif) => {
                  const esEntrada = notif.tipoRegistro.toUpperCase().includes("ENTRADA")
                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                        !notif.leido ? "bg-amber-50/50" : ""
                      }`}
                    >
                      {/* Ícono de Entrada / Salida */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          esEntrada
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {esEntrada ? (
                          <LogIn className="w-4 h-4" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                      </div>

                      {/* Detalles del Registro: Nómina, Nombre, Tipo y Hora */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              esEntrada
                                ? "bg-emerald-600 text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {notif.tipoRegistro}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {notif.hora}
                          </span>
                        </div>

                        <div className="mt-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {notif.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">
                              Nómina: <strong className="font-mono text-[#D95A3F]">{notif.nomina}</strong>
                            </span>
                            <span>•</span>
                            <span>{notif.fecha}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pie de Panel con Botón para Simular Prueba */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Prueba instantánea:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSimularChecada("ENTRADA")}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
                >
                  + Entrada
                </button>
                <button
                  onClick={() => handleSimularChecada("SALIDA")}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
                >
                  + Salida
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. ALERTA FLOTANTE EN TIEMPO REAL (TOAST EN PANTALLA CON SONIDO) */}
      {alertaActiva && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="bg-[#142238] border-2 border-[#D95A3F] text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3.5 backdrop-blur-md">
            {/* Ícono animado */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                alertaActiva.tipoRegistro.toUpperCase().includes("ENTRADA")
                  ? "bg-emerald-500 text-white"
                  : "bg-[#D95A3F] text-white"
              }`}
            >
              {alertaActiva.tipoRegistro.toUpperCase().includes("ENTRADA") ? (
                <LogIn className="w-6 h-6 animate-pulse" />
              ) : (
                <LogOut className="w-6 h-6 animate-pulse" />
              )}
            </div>

            {/* Información requerida: Nómina, Nombre, Tipo de Registro y Hora */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-white/20 text-white font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  ¡Nuevo Registro de {alertaActiva.tipoRegistro}!
                </span>
                <button
                  onClick={() => setAlertaActiva(null)}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-extrabold text-sm text-white mt-1 truncate">
                {alertaActiva.nombre}
              </h4>

              <div className="mt-1 text-xs text-slate-300 space-y-0.5">
                <div>
                  Nómina: <strong className="text-[#D95A3F] font-mono font-bold">{alertaActiva.nomina}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Hora: <strong className="text-white font-mono">{alertaActiva.hora}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
