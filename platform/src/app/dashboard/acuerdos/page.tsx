import { FileCheck, Shield, Download, CheckCircle2, Search } from "lucide-react"

export default function AcuerdosLegalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evidencia de Acuerdos con Trabajadores</h1>
          <p className="text-gray-500 text-sm">Registro de aceptación del sistema biométrico y control de jornada según la LFT.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <FileCheck className="w-4 h-4 mr-2" />
          Emitir Nuevo Documento de Aceptación
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start">
        <Shield className="w-5 h-5 text-indigo-700 mr-3 mt-0.5" />
        <div className="text-sm text-indigo-900">
          <strong>Validez Legal de Acuerdo:</strong> El simple hecho de colocar la huella en el checador no constituye un consentimiento formal. Este módulo almacena la evidencia digital (fecha, hora, método de firma y firma criptográfica SHA-256) donde el trabajador autoriza expresamente el uso de sus datos para el registro de su jornada.
        </div>
      </div>

      {/* Tabla de Acuerdos */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <span className="font-semibold text-gray-800 text-sm">Estado de Firmas por Empleado</span>
          <span className="text-xs text-gray-500">124 Empleados Activos (122 Firmados, 2 Pendientes)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-500 font-medium">
                <th className="p-4">Trabajador</th>
                <th className="p-4">Documento / Versión</th>
                <th className="p-4">Fecha y Hora de Aceptación</th>
                <th className="p-4">Método de Firma</th>
                <th className="p-4">Hash Criptográfico (Evidencia)</th>
                <th className="p-4 text-center">Constancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">Carlos Mendoza (EMP-001)</td>
                <td className="p-4 text-gray-600">Consentimiento Biométrico v2.1</td>
                <td className="p-4 text-gray-600">15/Mayo/2026 - 09:32 hrs</td>
                <td className="p-4">
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Firma Electrónica Simple
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-gray-400">
                  e3b0c44298fc1c149afb...
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800" title="Descargar Evidencia PDF">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">Lucía García (EMP-002)</td>
                <td className="p-4 text-gray-600">Consentimiento Biométrico v2.1</td>
                <td className="p-4 text-gray-600">16/Mayo/2026 - 11:15 hrs</td>
                <td className="p-4">
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Firma Electrónica Simple
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-gray-400">
                  8f434346648f6b96df89...
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800" title="Descargar Evidencia PDF">
                    <Download className="w-4 h-4 mx-auto" />
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
