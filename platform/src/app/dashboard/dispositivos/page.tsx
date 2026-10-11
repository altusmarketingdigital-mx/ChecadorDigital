import { Cpu, Plus, Wifi, WifiOff, Upload, CheckCircle2, AlertTriangle } from "lucide-react"

export default function DispositivosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Checadores Biométricos</h1>
          <p className="text-gray-500 text-sm">Monitorea los lectores de huella y terminales autorizadas.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Upload className="w-4 h-4 mr-2" />
            Importar Registros (USB)
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Vincular Nuevo Dispositivo
          </button>
        </div>
      </div>

      {/* Tarjetas de Terminales Activas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Terminal 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-3">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Lector Huella - Entrada Principal</h2>
                <p className="text-gray-500 text-xs">Modelo: ZKTeco SilkBio-101 | SN: ZK-9948210</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <Wifi className="w-3 h-3 mr-1" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mt-4 border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span>Sucursal:</span>
              <span className="font-medium text-gray-900">Matriz CDMX</span>
            </div>
            <div className="flex justify-between">
              <span>Última Sincronización:</span>
              <span className="font-medium text-gray-900">Hace 2 minutos</span>
            </div>
            <div className="flex justify-between">
              <span>Protocolo:</span>
              <span className="font-medium text-gray-900">Push (ADMS)</span>
            </div>
          </div>
        </div>

        {/* Terminal 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-gray-50 text-gray-500 rounded-xl mr-3">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Lector Huella - Almacén</h2>
                <p className="text-gray-500 text-xs">Modelo: ZKTeco K40 | SN: ZK-1124509</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
              <WifiOff className="w-3 h-3 mr-1" />
              OFFLINE
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mt-4 border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span>Sucursal:</span>
              <span className="font-medium text-gray-900">Bodega Norte</span>
            </div>
            <div className="flex justify-between">
              <span>Última Sincronización:</span>
              <span className="font-medium text-gray-900">Ayer a las 18:30 hrs</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className="font-medium text-amber-600 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Eventos pendientes por subir
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Sección Informativa de Importación USB */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Importación de Respaldo vía USB</h3>
        <p className="text-sm text-gray-500 mb-4">
          Si el lector de huella no tiene acceso a internet por fallos en la sucursal, puedes descargar el archivo <code>.dat</code> o <code>.csv</code> directamente de la terminal mediante una memoria USB e importarlo aquí de forma segura. El sistema validará la autenticidad y descartará los eventos duplicados automáticamente.
        </p>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Arrastra aquí el archivo descargado de tu lector</p>
          <p className="text-xs text-gray-400 mt-1">Soporta formatos ZKTeco (.dat, .txt, .csv)</p>
        </div>
      </div>
    </div>
  )
}
