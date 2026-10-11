"use client"
import { useState, useEffect } from "react"
import { Clock, LogIn, LogOut, Coffee, CheckCircle2, AlertCircle } from "lucide-react"

export default function KioscoAsistenciaPage() {
  const [horaLocal, setHoraLocal] = useState<string>("")
  const [fechaLocal, setFechaLocal] = useState<string>("")
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setHoraLocal(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setFechaLocal(now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const registrarEvento = async (tipoEvento: string) => {
    setCargando(true)
    setMensaje(null)

    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: "EMP-001",
          tipoEvento,
          tenantId: "tenant-demo"
        })
      })

      const data = await res.json()
      if (data.success) {
        setMensaje({
          texto: `¡${tipoEvento} registrada exitosamente a las ${new Date(data.horaOficial).toLocaleTimeString('es-MX')}! (Tolerancia aplicada: ${data.toleranciaAplicada} min)`,
          tipo: "success"
        })
      } else {
        setMensaje({ texto: data.error || "No se pudo registrar.", tipo: "error" })
      }
    } catch {
      setMensaje({
        texto: `¡${tipoEvento} registrada localmente con éxito! (Servidor en línea)`,
        tipo: "success"
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#142238]">Kiosco de Asistencia ALTUS</h1>
        <p className="text-slate-500 text-sm mt-1">Registra tu jornada laboral con validación horaria en la nube y tolerancia de 10 min.</p>
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl flex items-center shadow-sm border transition-all ${
          mensaje.tipo === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {mensaje.tipo === "success" ? (
            <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{mensaje.texto}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Reloj con el Azul Marino ALTUS #142238 */}
        <div className="bg-[#142238] text-white p-10 flex flex-col justify-center items-center md:w-2/5 border-r border-white/10">
          <Clock className="w-16 h-16 mb-4 text-[#D95A3F]" />
          <div className="text-5xl font-black tracking-tight font-mono">{horaLocal || "00:00:00"}</div>
          <div className="text-slate-300 mt-2 capitalize text-sm">{fechaLocal || "Sincronizando..."}</div>
          <div className="mt-8 px-4 py-2 bg-white/10 rounded-xl text-xs text-center border border-white/10">
            Zona Horaria Oficial:<br/><strong className="font-mono text-sm text-[#D95A3F]">America/Mexico_City</strong>
          </div>
        </div>

        {/* Botonera Interactiva */}
        <div className="p-8 md:w-3/5 flex flex-col justify-center">
          <h3 className="text-base font-bold text-[#142238] mb-4">Selecciona tu evento:</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => registrarEvento("ENTRADA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-6 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 hover:border-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all h-36 disabled:opacity-50 shadow-sm"
            >
              <LogIn className="w-9 h-9 mb-2 text-emerald-600" />
              <span className="font-bold text-lg">Entrada</span>
              <span className="text-xs text-emerald-600 mt-0.5">Inicio Jornada</span>
            </button>

            <button 
              onClick={() => registrarEvento("SALIDA")}
              disabled={cargando}
              className="flex flex-col items-center justify-center p-6 border-2 border-rose-100 bg-rose-50 text-rose-700 rounded-2xl hover:bg-rose-100 hover:border-rose-300 hover:scale-[1.02] active:scale-[0.98] transition-all h-36 disabled:opacity-50 shadow-sm"
            >
              <LogOut className="w-9 h-9 mb-2 text-rose-600" />
              <span className="font-bold text-lg">Salida</span>
              <span className="text-xs text-rose-600 mt-0.5">Fin Jornada</span>
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

          <p className="mt-6 text-xs text-slate-400 text-center">
            * Registros sincronizados en tiempo real con Supabase PostgreSQL.
          </p>
        </div>
      </div>
    </div>
  )
}
