"use client"
import { useState, useEffect } from "react"
import { Clock, LogIn, LogOut, Coffee } from "lucide-react"

export default function KioscoAsistenciaPage() {
  const [horaLocal, setHoraLocal] = useState<string>("")
  const [fechaLocal, setFechaLocal] = useState<string>("")

  // Simulación del reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setHoraLocal(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setFechaLocal(now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-3xl font-bold text-gray-900">Registro Web de Asistencia</h1>
        <p className="text-gray-500 mt-2">Registra tu jornada laboral autorizada mediante la plataforma web.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Reloj */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center items-center md:w-2/5">
          <Clock className="w-16 h-16 mb-4 opacity-80" />
          <div className="text-5xl font-bold tracking-tight">{horaLocal || "00:00:00"}</div>
          <div className="text-blue-100 mt-2 capitalize">{fechaLocal || "Cargando..."}</div>
          <div className="mt-8 px-4 py-2 bg-blue-700/50 rounded-lg text-sm text-center">
            Zona Horaria:<br/><strong>America/Mexico_City</strong>
          </div>
        </div>

        {/* Botonera de Eventos */}
        <div className="p-10 md:w-3/5">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Selecciona el tipo de registro:</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 border-2 border-green-100 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 hover:border-green-200 transition-colors h-40">
              <LogIn className="w-10 h-10 mb-3" />
              <span className="font-bold text-lg">Entrada</span>
              <span className="text-xs text-green-600 mt-1">Inicio de Jornada</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 border-2 border-red-100 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 hover:border-red-200 transition-colors h-40">
              <LogOut className="w-10 h-10 mb-3" />
              <span className="font-bold text-lg">Salida</span>
              <span className="text-xs text-red-600 mt-1">Fin de Jornada</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors col-span-2 sm:col-span-1">
              <Coffee className="w-8 h-8 mb-2 text-amber-500" />
              <span className="font-semibold">Inicio de Pausa</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors col-span-2 sm:col-span-1">
              <LogIn className="w-8 h-8 mb-2 text-blue-500" />
              <span className="font-semibold">Fin de Pausa</span>
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500 text-center">
            * Tus registros conservan la integridad criptográfica y no pueden ser alterados.
          </div>
        </div>
      </div>
    </div>
  )
}
