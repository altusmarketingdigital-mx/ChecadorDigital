import { AlertCircle, CheckCircle2, XCircle, Clock, FileText, Filter } from "lucide-react"

export default function IncidenciasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Incidencias y Aclaraciones</h1>
          <p className="text-gray-500 text-sm">Gestiona solicitudes de corrección de asistencia y justificaciones laborales.</p>
        </div>
      </div>

      {/* Regla de Oro / Auditoría Aviso */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Política de Inmutabilidad Legal:</strong> Toda corrección aprobada genera un <em>registro complementario</em> vinculado al evento original. Los registros de la huella digital nunca se eliminan ni se sobrescriben, garantizando la trazabilidad ante inspecciones laborales de la STPS.
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar por Estado: Pendientes
        </button>
      </div>

      {/* Tabla de Incidencias */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <th className="p-4">Trabajador</th>
                <th className="p-4">Fecha Evento</th>
                <th className="p-4">Tipo de Solicitud</th>
                <th className="p-4">Motivo / Evidencia</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Resolución (RRHH)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {/* Solicitud 1 */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">Carlos Mendoza</div>
                  <div className="text-gray-500 text-xs">EMP-001 | Tecnología</div>
                </td>
                <td className="p-4 text-gray-600">09/Oct/2026</td>
                <td className="p-4">
                  <span className="font-medium text-gray-900">Omisión de Salida</span>
                </td>
                <td className="p-4 text-gray-600 max-w-xs truncate">
                  "El lector de huella no emitía sonido al salir a las 17:05 hrs."
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors" title="Aprobar corrección">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors" title="Rechazar">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Solicitud 2 */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">Lucía García</div>
                  <div className="text-gray-500 text-xs">EMP-002 | Operaciones</div>
                </td>
                <td className="p-4 text-gray-600">08/Oct/2026</td>
                <td className="p-4">
                  <span className="font-medium text-gray-900">Permiso Médico (IMSS)</span>
                </td>
                <td className="p-4 text-gray-600">
                  <span className="text-blue-600 hover:underline cursor-pointer flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    justificante_imss.pdf
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Aprobada
                  </span>
                </td>
                <td className="p-4 text-center text-xs text-gray-500">
                  Aprobado por RH (María S.)
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
