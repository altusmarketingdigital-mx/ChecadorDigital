"use client"
import { useEffect, useState } from "react"
import { Share, PlusSquare, X, Smartphone, ArrowDown } from "lucide-react"
import { AltusLogo } from "@/components/AltusLogo"

export function InstallPromptIOS() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    // 1. Registrar Service Worker para PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("ALTUS SW registrado con éxito."))
        .catch((err) => console.log("SW Registro error:", err))
    }

    // 2. Detectar si el usuario está navegando desde un dispositivo iOS o iPadOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOS =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) // iPads modernos con iPadOS reportan MacIntel

    // 3. Detectar si la app YA está corriendo en modo Standalone (App instalada)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true)

    // 4. Verificar si el usuario ya descartó el aviso en esta sesión
    const isDismissed = sessionStorage.getItem("altus_ios_prompt_dismissed")

    if (isIOS) {
      setIsIOSDevice(true)
      if (!isStandalone && !isDismissed) {
        // Mostrar aviso con un pequeño retardo suave para no invadir inmediatamente
        const timer = setTimeout(() => setShowPrompt(true), 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem("altus_ios_prompt_dismissed", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex justify-center animate-in fade-in slide-in-from-bottom duration-300 pointer-events-none">
      <div className="bg-[#142238] border-2 border-[#D95A3F]/50 text-white rounded-2xl shadow-2xl p-5 max-w-md w-full pointer-events-auto backdrop-blur-md">
        
        {/* Cabecera del Banner */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 p-1 border border-white/20 shrink-0 flex items-center justify-center">
              <AltusLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">Instalar ALTUS en tu iPhone / iPad</h4>
                <span className="text-[10px] bg-[#D95A3F] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                  App Híbrida
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Úsalo en pantalla completa como una aplicación nativa.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pasos visuales estilo iOS */}
        <div className="bg-[#0e192a] rounded-xl p-3 text-xs space-y-2 border border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#D95A3F] text-white font-black text-[11px] flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-slate-200">
              Toca el botón <strong className="text-white">Compartir</strong>{" "}
              <Share className="w-3.5 h-3.5 inline text-sky-400 mx-0.5 align-middle" /> en la barra inferior de Safari.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#D95A3F] text-white font-black text-[11px] flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-slate-200">
              Desliza y pulsa <strong className="text-white">"Agregar a inicio"</strong>{" "}
              <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-0.5 align-middle" />.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-slate-200">
              ¡Listo! Se creará el ícono oficial <strong className="text-white">ALTUS</strong> en tu pantalla.
            </span>
          </div>
        </div>

        {/* Botón de confirmación */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-[#D95A3F]" />
            <span>Optimizado para iOS y iPadOS</span>
          </div>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-[#D95A3F] hover:bg-[#b5462f] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Entendido
          </button>
        </div>

        {/* Flecha indicadora apuntando hacia la barra de Safari en móviles */}
        <div className="flex justify-center -mb-5 pt-2">
          <ArrowDown className="w-5 h-5 text-[#D95A3F] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
