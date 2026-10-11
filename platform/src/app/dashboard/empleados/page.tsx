"use client"
import { useState } from "react"
import { Plus, Upload, MoreHorizontal, Search, FileDown, X, Check } from "lucide-react"

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([
    { id: "EMP-001", nombre: "Carlos Mendoza", puesto: "Desarrollador Senior", depto: "Tecnología", jornada: "Diurna (8:00 - 17:00)", estado: "Activo" },
    { id: "EMP-002", nombre: "Lucía García", puesto: "Guardia de Seguridad", depto: "Operaciones", jornada: "Nocturna (20:00 - 04:00)", estado: "Activo" },
  ])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [nuevo, setNuevo] = useState({
    nombre: "",
    puesto: "",
    depto: "Tecnología",
    jornada: "Diurna (8:00 - 17:00)",
  })

  const agregarEmpleado = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevoId = `EMP-00${empleados.length + 1}`
    setEmpleados([...empleados, { id: nuevoId, ...nuevo, estado: "Activo" }])
    setMostrarModal(false)
    setNuevo({ nombre: "", puesto: "", depto: "Tecnología", jornada: "Diurna (8:00 - 17:00)" })
  }

  const exportarExcel = () => {
    const csv = `No_Empleado,Nombre_Completo,Puesto,Departamento,Jornada,Estado\n` +
      empleados.map(e => `${e.id},"${e.nombre}","${e.puesto}","${e.depto}","${e.jornada}",${e.estado}`).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Directorio_Empleados.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Directorio de Empleados</h1>
          <p className="text-slate-500 text-sm">Gestiona altas, bajas y turnos del personal en tu empresa.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert("Módulo para importar empleados masivamente mediante archivo Excel (.xlsx / .csv). Conectado a la base de datos Supabase.")}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4 mr-2 text-slate-500" />
            Importar Excel
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-md shadow-blue-500/10 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Modal para Crear Empleado */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Empleado</h3>
              <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={agregarEmpleado} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez López"
                  value={nuevo.nombre}
                  onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Puesto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Analista de Calidad"
                  value={nuevo.puesto}
                  onChange={e => setNuevo({...nuevo, puesto: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Departamento</label>
                  <select 
                    value={nuevo.depto}
                    onChange={e => setNuevo({...nuevo, depto: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option value="Tecnología">Tecnología</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Ventas">Ventas</option>
                    <option value="RH">Recursos Humanos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jornada LFT</label>
                  <select 
                    value={nuevo.jornada}
                    onChange={e => setNuevo({...nuevo, jornada: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option value="Diurna (8:00 - 17:00)">Diurna (8 hrs)</option>
                    <option value="Nocturna (20:00 - 04:00)">Nocturna (7 hrs)</option>
                    <option value="Mixta (14:00 - 21:30)">Mixta (7.5 hrs)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Guardar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla con Filtro y Exportar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
              placeholder="Buscar por nombre..."
            />
          </div>
          <button 
            onClick={exportarExcel}
            className="flex items-center px-3.5 py-2 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors border border-slate-200"
          >
            <FileDown className="w-4 h-4 mr-2 text-slate-500" />
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">No. Emp</th>
                <th className="p-4">Nombre Completo</th>
                <th className="p-4">Departamento</th>
                <th className="p-4">Jornada (LFT)</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{emp.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{emp.nombre}</div>
                    <div className="text-slate-500 text-xs">{emp.puesto}</div>
                  </td>
                  <td className="p-4 text-slate-600">{emp.depto}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {emp.jornada}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {emp.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => alert(`Opciones para el empleado ${emp.nombre}: Editar horario, justificar falta, ver historial de asistencia.`)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
