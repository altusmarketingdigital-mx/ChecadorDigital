import { FileSpreadsheet, FileText, Download, ShieldCheck, Calendar, Filter } from "lucide-react"

export default function ReportesLaboralesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Reportes Laborales</h1>
        <p className="text-gray-500 text-sm">Exporta historiales de jornada, asistencia, horas extras y expedientes de auditoría.</p>
      </div>

      {/* Paquete Especial STPS */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Requerimiento de Autoridad
            </div>
            <h2 className="text-xl font-bold">Expediente de Inspección Laboral (STPS)</h2>
            <p className="text-blue-200 text-sm max-w-xl">
              Genera un paquete integral con índice de archivos, trazabilidad de registros originales, bitácora de correcciones, evidencias de sincronización y acuerdos legales firmados.
            </p>
          </div>
          <button className="flex items-center px-5 py-3 bg-white text-blue-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" />
            Generar Paquete (.ZIP)
          </button>
        </div>
      </div>

      {/* Catálogo de Reportes Frecuentes */}
      <h3 className="text-lg font-bold text-gray-900 pt-2">Reportes Operativos y Contables</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reporte 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 bg-green-50 text-green-700 w-fit rounded-xl mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Reporte Mensual de Asistencia</h4>
            <p className="text-gray-500 text-xs mb-4">Consolidado para prenómina: días laborados, retardos acumulados y faltas justificadas.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              Excel (.xlsx)
            </button>
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              PDF
            </button>
          </div>
        </div>

        {/* Reporte 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 bg-blue-50 text-blue-700 w-fit rounded-xl mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Reporte Semanal de Jornadas</h4>
            <p className="text-gray-500 text-xs mb-4">Desglose de horas trabajadas vs. límite legal (48 hrs diurna / 42 hrs nocturna) y horas extra.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              Excel (.xlsx)
            </button>
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              PDF
            </button>
          </div>
        </div>

        {/* Reporte 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 bg-purple-50 text-purple-700 w-fit rounded-xl mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Bitácora de Auditoría e Integridad</h4>
            <p className="text-gray-500 text-xs mb-4">Historial forense inmutable de modificaciones de horarios, autorizaciones y eventos del sistema.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              CSV
            </button>
            <button className="flex-1 flex justify-center items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
              PDF Sellado
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
