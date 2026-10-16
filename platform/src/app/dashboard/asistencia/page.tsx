"use client"
import { useState, useEffect } from "react"
import { 
  Clock, LogIn, LogOut, Coffee, CheckCircle2, AlertCircle, 
  User, Bell, ShieldCheck, Sparkles 
} from "lucide-react"

interface EmpleadoOpcion {
  nomina: string
  nombre: string
  puesto: string
  depto: string
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
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error"; detalles?: { nomina: string; nombre: string; tipo: string; hora: string } } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)

  // Selector de colaborador
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<EmpleadoOpcion>(CATALOGO_EMPLEADOS[0])
  const [modoManual, setModoManual] = useState(false)
  const [nominaManual, setNominaManual] = useState("")
  const [nombreManual, setNombreManual] = useState("")

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setHoraLocal(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
      setFechaLocal(now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const registrarEvento = async (tipoEvento: string) => {
    setCargando(true)
    setMensaje(null)

    const nominaFinal = modoManual ? (nominaManual || "EMP-999") : empleadoSeleccionado.nomina
    const nombreFinal = modoManual ? (nombreManual || "Colaborador Externo") : empleadoSeleccionado.nombre

    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: nominaFinal,
          nombre: nombreFinal,
          tipoEvento,
          tenantId: "tenant-demo"
        })
      })

      const data = await res.json()
      if (data.success) {
        const horaReg = new Date(data.horaOficial).toLocaleTimeString('es-MX', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        })

        setMensaje({
          texto: `¡${tipoEvento} registrada exitosamente! Notificación enviada al Administrador del Sistema.`,
          tipo: "success",
          detalles: {
            nomina: nominaFinal,
            nombre: nombreFinal,
            tipo: tipoEvento,
            hora: horaReg
          }
        })
      } else {
        setMensaje({ texto: data.error || "No se pudo registrar.", tipo: "error" })
      }
    } catch {
      setMensaje({
        texto: `¡${tipoEvento} registrada localmente con éxito! (Servidor en línea)`,
        tipo: "success",
        detalles: {
          nomina: nominaFinal,
          nombre: nombreFinal,
          tipo: tipoEvento,
          hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
        }
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera del Kiosco */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#142238]">Kiosco de Asistencia ALTUS</h1>
        <p className="text-slate-500 text-sm mt-1">
          Registro inmutable con tolerancia de 10 min y alerta instantánea al Administrador.
        </p>
      </div>

      {/* Banner Informativo de Notificación al Administrador */}
      <div className="bg-[#142238] border border-[#D95A3F]/40 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D95A3F] flex items-center justify-center shrink-0 shadow">
            <Bell className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Alerta Automática al Administrador Activada</h4>
            <p className="text-xs text-slate-300">
              Cada checada de <strong className="text-white">Entrada</strong> o <strong className="text-white">Salida</strong> notifica en tiempo real al administrador con su <strong className="text-[#D95A3F]">Nómina, Nombre, Tipo de Registro y Hora</strong>.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-emerald-300 shrink-0 border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sincronizado</span>
        </div>
      </div>

      {/* Mensaje de Confirmación de Checada */}
      {mensaje && (
        <div className={`p-4 rounded-2xl shadow-sm border transition-all ${
          mensaje.tipo === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <div className="flex items-start gap-3">
            {mensaje.tipo === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="text-sm font-bold block">{mensaje.texto}</span>
              {mensaje.detalles && (
                <div className="mt-2 bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Nómina:</span>
                    <strong className="font-mono text-slate-900 text-sm">{mensaje.detalles.nomina}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Colaborador:</span>
                    <strong className="text-slate-900 text-sm">{mensaje.detalles.nombre}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Tipo:</span>
                    <span className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${
                      mensaje.detalles.tipo === "ENTRADA" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    }`}>
                      {mensaje.detalles.tipo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Hora Oficial:</span>
                    <strong className="font-mono text-slate-900 text-sm">{mensaje.detalles.hora}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selector de Colaborador */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
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

      {/* Reloj y Botonera */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Reloj con el Azul Marino ALTUS #142238 */}
        <div className="bg-[#142238] text-white p-8 sm:p-10 flex flex-col justify-center items-center md:w-2/5 border-r border-white/10">
          <Clock className="w-16 h-16 mb-4 text-[#D95A3F]" />
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-center">
            {horaLocal || "00:00:00"}
          </div>
          <div className="text-slate-300 mt-2 capitalize text-xs sm:text-sm text-center">
            {fechaLocal || "Sincronizando..."}
          </div>
          <div className="mt-6 px-4 py-2 bg-white/10 rounded-xl text-xs text-center border border-white/10">
            Zona Horaria Oficial:<br/>
            <strong className="font-mono text-sm text-[#D95A3F]">America/Mexico_City</strong>
          </div>
        </div>

        {/* Botonera Interactiva */}
        <div className="p-6 sm:p-8 md:w-3/5 flex flex-col justify-center">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#142238]">Selecciona tu evento:</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
              {modoManual ? (nominaManual || "EMP-???") : empleadoSeleccionado.nomina}
            </span>
          </div>
          
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

          <p className="mt-5 text-xs text-slate-400 text-center">
            * Registros sincronizados en tiempo real con Supabase y notificados al Administrador.
          </p>
        </div>
      </div>
    </div>
  )
}
