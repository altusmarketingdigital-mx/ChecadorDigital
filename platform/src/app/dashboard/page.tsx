export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Resumen de Asistencia</h1>
      
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Empleados Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Presentes Hoy</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">118</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Retardos / Incidencias</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">6</p>
        </div>
      </div>

      {/* Tabla Reciente simulada */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Últimos Registros</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm">El módulo de conexión con checadores biométricos se implementará en la Fase 4.</p>
        </div>
      </div>
    </div>
  )
}
