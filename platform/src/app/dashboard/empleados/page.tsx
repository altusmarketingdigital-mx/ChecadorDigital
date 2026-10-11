import { Plus, Upload, MoreHorizontal, Search, FileDown } from "lucide-react"

export default function EmpleadosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directorio de Empleados</h1>
          <p className="text-gray-500 text-sm">Gestiona altas, bajas y turnos del personal.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Importar Excel
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Buscar por nombre o número..."
            />
          </div>
          <button className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium">
            <FileDown className="w-4 h-4 mr-1.5" />
            Exportar
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4">No. Emp</th>
                <th className="p-4">Nombre Completo</th>
                <th className="p-4">Departamento</th>
                <th className="p-4">Jornada (LFT)</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {/* Ejemplo 1 */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">EMP-001</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">Carlos Mendoza</div>
                  <div className="text-gray-500 text-xs">Desarrollador Senior</div>
                </td>
                <td className="p-4 text-gray-600">Tecnología</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Diurna (8:00 - 17:00)
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Activo
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
              {/* Ejemplo 2 */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">EMP-002</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">Lucía García</div>
                  <div className="text-gray-500 text-xs">Guardia de Seguridad</div>
                </td>
                <td className="p-4 text-gray-600">Operaciones</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    Nocturna (20:00 - 04:00)
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Activo
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
