import { Scale, BookOpen, Calendar, Plus, CheckCircle2, History } from "lucide-react"

export default function ConfiguracionNormativaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración Normativa y Laboral</h1>
          <p className="text-gray-500 text-sm">Gestiona el marco legal aplicable (LFT / STPS) para actualizar reglas sin alterar el código fuente.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Nueva Disposición Oficial
        </button>
      </div>

      {/* Regla Activa Principal */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl mr-3">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Reforma Laboral - Diario Oficial de la Federación</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  VIGENTE
                </span>
              </div>
              <p className="text-gray-500 text-xs">Publicación DOF: 01 de Mayo de 2026 | Emisor: Secretaría del Trabajo y Previsión Social (STPS)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 p-4 bg-gray-50 rounded-xl text-sm">
          <div>
            <span className="text-gray-500 block text-xs">Límite Jornada Diurna:</span>
            <span className="font-bold text-gray-800">48 horas semanales (Máx 8 hrs/día)</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Límite Jornada Nocturna:</span>
            <span className="font-bold text-gray-800">42 horas semanales (Máx 7 hrs/día)</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Regla Horas Extra:</span>
            <span className="font-bold text-gray-800">Requiere aprobación humana (No automática)</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center">
            <History className="w-3.5 h-3.5 mr-1" />
            Versión del Motor Normativo: 2026.1 (Aprobada por Área Legal)
          </span>
          <button className="text-blue-600 font-medium hover:underline">Ver Historial de Versiones</button>
        </div>
      </div>

      {/* Historial o Normas Previas */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Registro Histórico de Disposiciones</h3>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <p>El sistema conserva todas las normas que estuvieron vigentes en periodos pasados. Si una autoridad requiere auditar un periodo anterior (por ejemplo, el año 2025), el motor calculará las jornadas y tolerancias utilizando las reglas vigentes en esa fecha exacta, sin mezclar las reformas recientes.</p>
        </div>
      </div>
    </div>
  )
}
