import { Settings2, Clock, AlertTriangle, Plus } from "lucide-react"

export default function ConfiguracionJornadasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Jornadas y Horarios</h1>
          <p className="text-gray-500 text-sm">Administra las reglas laborales para el cálculo de asistencia, retardos y horas extra según la LFT.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Regla
        </button>
      </div>

      {/* Reglas Activas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Jornada Diurna */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">DIURNA</span>
          </div>
          <div className="flex items-center mb-4">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-lg font-bold text-gray-900">Horario Administrativo</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Días Laborales:</span>
              <span className="font-medium text-gray-900">Lunes a Viernes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Horario:</span>
              <span className="font-medium text-gray-900">08:00 - 17:00 (8 hrs)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pausa Comida:</span>
              <span className="font-medium text-gray-900">60 Minutos (14:00)</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-amber-600 font-medium">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Tolerancia de retardo: 10 Minutos
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-blue-600 text-sm font-medium hover:underline">Editar Reglas</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-600 text-sm font-medium hover:underline">Ver 45 Empleados Asignados</button>
          </div>
        </div>

        {/* Card Jornada Nocturna */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800">NOCTURNA</span>
          </div>
          <div className="flex items-center mb-4">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-lg font-bold text-gray-900">Turno de Seguridad</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Días Laborales:</span>
              <span className="font-medium text-gray-900">Lunes a Sábado</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Horario:</span>
              <span className="font-medium text-gray-900">20:00 - 04:00 (7 hrs)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pausa Descanso:</span>
              <span className="font-medium text-gray-900">30 Minutos</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-amber-600 font-medium">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Tolerancia de retardo: 15 Minutos
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-blue-600 text-sm font-medium hover:underline">Editar Reglas</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-600 text-sm font-medium hover:underline">Ver 12 Empleados Asignados</button>
          </div>
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
        <Settings2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Aviso de Configuración:</strong> El motor de cálculo verificará automáticamente los límites legales de 48 hrs (Diurna), 42 hrs (Nocturna) y 45 hrs (Mixta) por semana. Cualquier exceso se registrará como incidencia pendiente de autorización de horas extra, no de manera automática, tal y como lo requiere la STPS.
        </div>
      </div>
    </div>
  )
}
