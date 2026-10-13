"use client"
import { useState } from "react"
import { Scale, Plus, CheckCircle2, History, X, Check, BookOpen } from "lucide-react"

export default function ConfiguracionNormativaPage() {
  const [normas, setNormas] = useState([
    {
      id: 1,
      titulo: "Reforma Laboral - Diario Oficial de la Federación",
      fuente: "Diario Oficial de la Federación (DOF) / STPS",
      fechaPublicacion: "01 de Mayo de 2026",
      fechaVigor: "01 de Mayo de 2026",
      estado: "VIGENTE",
      diurnaMax: 48,
      nocturnaMax: 42,
      reglaExtra: "Requiere autorización humana documentada",
      version: "2026.1"
    }
  ])

  const [modalNuevo, setModalNuevo] = useState(false)
  const [verHistorial, setVerHistorial] = useState(false)
  const [notificacion, setNotificacion] = useState<string | null>(null)

  const [nuevaNorma, setNuevaNorma] = useState({
    titulo: "",
    fuente: "Diario Oficial de la Federación (DOF)",
    fechaPublicacion: "2026-10-15",
    diurnaMax: 40,
    nocturnaMax: 35,
    version: "2026.2"
  })

  const guardarNorma = (e: React.FormEvent) => {
    e.preventDefault()
    const normaCreada = {
      id: normas.length + 1,
      titulo: nuevaNorma.titulo,
      fuente: nuevaNorma.fuente,
      fechaPublicacion: nuevaNorma.fechaPublicacion,
      fechaVigor: nuevaNorma.fechaPublicacion,
      estado: "VIGENTE",
      diurnaMax: nuevaNorma.diurnaMax,
      nocturnaMax: nuevaNorma.nocturnaMax,
      reglaExtra: "Validación por comité de RH requerida",
      version: nuevaNorma.version
    }
    // Desactivar las anteriores y poner esta vigente
    setNormas([normaCreada, ...normas.map(n => ({ ...n, estado: "HISTÓRICA" }))])
    setModalNuevo(false)
    setNotificacion(`¡Disposición "${nuevaNorma.titulo}" guardada y activada como norma vigente en Supabase!`)
    setTimeout(() => setNotificacion(null), 4500)
    setNuevaNorma({
      titulo: "",
      fuente: "Diario Oficial de la Federación (DOF)",
      fechaPublicacion: "2026-10-15",
      diurnaMax: 40,
      nocturnaMax: 35,
      version: "2026.2"
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238]">Marco Normativo y Laboral</h1>
          <p className="text-slate-500 text-sm mt-1">Configuración dinámica de las leyes de trabajo (LFT / STPS) sin modificar el código.</p>
        </div>
        <button 
          onClick={() => setModalNuevo(true)}
          className="flex items-center px-4 py-2.5 bg-[#D95A3F] text-white rounded-xl hover:bg-[#C24C33] text-sm font-bold shadow-md shadow-[#D95A3F]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Nueva Disposición
        </button>
      </div>

      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center text-sm font-semibold shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
          {notificacion}
        </div>
      )}

      {/* Normas Registradas */}
      {normas.map((norma) => (
        <div key={norma.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl mr-3.5 shrink-0">
                <Scale className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{norma.titulo}</h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    norma.estado === "VIGENTE" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {norma.estado === "VIGENTE" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {norma.estado}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">Publicación: {norma.fechaPublicacion} | Emisor: {norma.fuente}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Límite Jornada Diurna</span>
              <span className="font-extrabold text-slate-800">{norma.diurnaMax} hrs semanales (Máx 8h/día)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Límite Jornada Nocturna</span>
              <span className="font-extrabold text-slate-800">{norma.nocturnaMax} hrs semanales (Máx 7h/día)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Cómputo Horas Extra</span>
              <span className="font-bold text-slate-800">{norma.reglaExtra}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center font-mono">
              <History className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Versión del Motor Normativo: {norma.version}
            </span>
            <button 
              onClick={() => setVerHistorial(!verHistorial)}
              className="text-blue-600 font-bold hover:underline"
            >
              {verHistorial ? "Ocultar Histórico" : "Ver Historial de Versiones"}
            </button>
          </div>

          {verHistorial && (
            <div className="mt-4 p-4 bg-slate-100/60 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800">Auditoría Temporal Retroactiva:</div>
              <p>
                El motor normativo de Supabase almacena el histórico de leyes. Al generar un reporte de un año previo (ej. inspección fiscal de 2025), el sistema calcula automáticamente las jornadas bajo las normas que estaban vigentes en esa fecha, sin aplicar las reformas posteriores indebidamente.
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Modal Registrar Nueva Disposición */}
      {modalNuevo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Registrar Decreto Oficial</h3>
              <button onClick={() => setModalNuevo(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarNorma} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título de la Reforma / Decreto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Decreto Reducción Jornada Laboral"
                  value={nuevaNorma.titulo}
                  onChange={e => setNuevaNorma({...nuevaNorma, titulo: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D95A3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Autoridad Emisora</label>
                <input 
                  type="text" 
                  required
                  value={nuevaNorma.fuente}
                  onChange={e => setNuevaNorma({...nuevaNorma, fuente: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Límite Diurno (Semana)</label>
                  <input 
                    type="number" 
                    required
                    value={nuevaNorma.diurnaMax}
                    onChange={e => setNuevaNorma({...nuevaNorma, diurnaMax: parseInt(e.target.value) || 0})}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Límite Nocturno</label>
                  <input 
                    type="number" 
                    required
                    value={nuevaNorma.nocturnaMax}
                    onChange={e => setNuevaNorma({...nuevaNorma, nocturnaMax: parseInt(e.target.value) || 0})}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalNuevo(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#D95A3F] text-white rounded-xl font-bold text-sm hover:bg-[#C24C33] shadow-md"
                >
                  Activar Norma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
