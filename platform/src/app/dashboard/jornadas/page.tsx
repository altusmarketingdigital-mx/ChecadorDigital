"use client"
import { useState } from "react"
import { Settings2, Clock, AlertTriangle, Plus, X, Users, Check, Edit2 } from "lucide-react"

export default function ConfiguracionJornadasPage() {
  const [jornadas, setJornadas] = useState([
    {
      id: 1,
      nombre: "Horario Administrativo",
      tipo: "DIURNA",
      dias: "Lunes a Viernes",
      horario: "08:00 - 17:00 (8 hrs)",
      pausa: "60 Minutos (14:00)",
      tolerancia: 10,
      empleados: 45
    },
    {
      id: 2,
      nombre: "Turno de Seguridad",
      tipo: "NOCTURNA",
      dias: "Lunes a Sábado",
      horario: "20:00 - 04:00 (7 hrs)",
      pausa: "30 Minutos",
      tolerancia: 15,
      empleados: 12
    },
    {
      id: 3,
      nombre: "Turno Vespertino Mixto",
      tipo: "MIXTA",
      dias: "Lunes a Viernes",
      horario: "14:00 - 21:30 (7.5 hrs)",
      pausa: "30 Minutos",
      tolerancia: 10,
      empleados: 18
    }
  ])

  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalEmpleados, setModalEmpleados] = useState<string | null>(null)
  const [notificacion, setNotificacion] = useState<string | null>(null)

  const [nuevaJornada, setNuevaJornada] = useState({
    nombre: "",
    tipo: "DIURNA",
    dias: "Lunes a Viernes",
    horario: "09:00 - 18:00",
    pausa: "60 Minutos",
    tolerancia: 10
  })

  const guardarJornada = (e: React.FormEvent) => {
    e.preventDefault()
    const nueva = {
      id: jornadas.length + 1,
      ...nuevaJornada,
      empleados: 0
    }
    setJornadas([...jornadas, nueva])
    setModalAbierto(false)
    setNotificacion(`¡Regla de jornada "${nuevaJornada.nombre}" registrada correctamente!`)
    setTimeout(() => setNotificacion(null), 4000)
    setNuevaJornada({
      nombre: "",
      tipo: "DIURNA",
      dias: "Lunes a Viernes",
      horario: "09:00 - 18:00",
      pausa: "60 Minutos",
      tolerancia: 10
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238]">Configuración de Jornadas y Horarios</h1>
          <p className="text-slate-500 text-sm mt-1">Administra los turnos de trabajo, tolerancias y descansos conforme a la LFT.</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="flex items-center px-4 py-2.5 bg-[#D95A3F] text-white rounded-xl hover:bg-[#C24C33] text-sm font-bold shadow-md shadow-[#D95A3F]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Regla
        </button>
      </div>

      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center text-sm font-semibold shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
          {notificacion}
        </div>
      )}

      {/* Tarjetas de Jornadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jornadas.map((jornada) => (
          <div key={jornada.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                jornada.tipo === "DIURNA" 
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : jornada.tipo === "NOCTURNA"
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {jornada.tipo}
              </span>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Clock className="w-7 h-7 text-[#142238] mr-3" />
                <h2 className="text-lg font-bold text-slate-900 pr-16">{jornada.nombre}</h2>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Días Laborales:</span>
                  <span className="font-semibold text-slate-800">{jornada.dias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario:</span>
                  <span className="font-mono font-bold text-slate-900">{jornada.horario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pausa / Comida:</span>
                  <span className="font-medium text-slate-800">{jornada.pausa}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center text-xs font-bold text-[#D95A3F]">
                  <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                  Tolerancia de retardo: {jornada.tolerancia} minutos
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button 
                onClick={() => alert(`Configuración de regla "${jornada.nombre}": Puedes actualizar la tolerancia y ventana horaria en la base de datos.`)}
                className="text-blue-600 font-bold hover:underline flex items-center"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Editar Regla
              </button>
              <button 
                onClick={() => setModalEmpleados(jornada.nombre)}
                className="text-slate-600 font-medium hover:text-[#142238] hover:underline flex items-center"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                {jornada.empleados} Empleados
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Regla */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Crear Regla de Jornada (LFT)</h3>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarJornada} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de la Regla</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Turno Almacén Matutino"
                  value={nuevaJornada.nombre}
                  onChange={e => setNuevaJornada({...nuevaJornada, nombre: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D95A3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Jornada</label>
                  <select 
                    value={nuevaJornada.tipo}
                    onChange={e => setNuevaJornada({...nuevaJornada, tipo: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option value="DIURNA">Diurna (Máx 8h/día - 48h/sem)</option>
                    <option value="NOCTURNA">Nocturna (Máx 7h/día - 42h/sem)</option>
                    <option value="MIXTA">Mixta (Máx 7.5h/día - 45h/sem)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tolerancia Retardo</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    max={60}
                    value={nuevaJornada.tolerancia}
                    onChange={e => setNuevaJornada({...nuevaJornada, tolerancia: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none font-bold text-[#D95A3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Horario Entrada / Salida</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. 08:30 - 17:30"
                  value={nuevaJornada.horario}
                  onChange={e => setNuevaJornada({...nuevaJornada, horario: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Días Laborales</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Lunes a Viernes"
                  value={nuevaJornada.dias}
                  onChange={e => setNuevaJornada({...nuevaJornada, dias: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#D95A3F] text-white rounded-xl font-bold text-sm hover:bg-[#C24C33] shadow-md"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Empleados Asignados */}
      {modalEmpleados && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Personal en {modalEmpleados}</h3>
              <button onClick={() => setModalEmpleados(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Lista de trabajadores con esta regla asignada en la nómina.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-slate-800">Carlos Mendoza</span>
                <span className="font-mono text-slate-500">EMP-001 (Tecnología)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-slate-800">Mariana Solís</span>
                <span className="font-mono text-slate-500">EMP-004 (Contabilidad)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-slate-800">Alberto Rivas</span>
                <span className="font-mono text-slate-500">EMP-003 (RH)</span>
              </div>
            </div>
            <button 
              onClick={() => setModalEmpleados(null)}
              className="w-full mt-5 py-2.5 bg-[#142238] text-white rounded-xl font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Nota Legal STPS */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start">
        <Settings2 className="w-5 h-5 text-blue-700 mr-3 mt-0.5 shrink-0" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Aviso de Configuración LFT:</strong> Las reglas salvan en Supabase y rigen el Kiosco y los Checadores ZKTeco. Cualquier exceso sobre el límite de jornada semanal generará una alerta de revisión humana en el módulo de Incidencias antes de computar tiempo extraordinario.
        </div>
      </div>
    </div>
  )
}
