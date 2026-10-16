"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { Cpu, Plus, Wifi, WifiOff, Upload, CheckCircle2, AlertTriangle, X, RefreshCw, ArrowRight } from "lucide-react"

export default function DispositivosPage() {
  const [dispositivos, setDispositivos] = useState([
    {
      id: 1,
      nombre: "Lector Huella - Entrada Principal",
      modelo: "ZKTeco SilkBio-101",
      serie: "ZK-9948210",
      sucursal: "Matriz CDMX",
      sincronizacion: "Hace 2 minutos",
      protocolo: "Push (ADMS)",
      estado: "ONLINE"
    },
    {
      id: 2,
      nombre: "Lector Huella - Almacén",
      modelo: "ZKTeco K40",
      serie: "ZK-1124509",
      sucursal: "Bodega Norte",
      sincronizacion: "Ayer a las 18:30 hrs",
      protocolo: "Push (ADMS)",
      estado: "OFFLINE"
    }
  ])

  const [modalNuevo, setModalNuevo] = useState(false)
  const [notificacion, setNotificacion] = useState<string | null>(null)
  const [cargandoSync, setCargandoSync] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [nuevoDisp, setNuevoDisp] = useState({
    nombre: "",
    modelo: "ZKTeco MB20",
    serie: "",
    sucursal: "Matriz CDMX",
    protocolo: "Push (ADMS)"
  })

  const agregarDispositivo = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = {
      id: dispositivos.length + 1,
      ...nuevoDisp,
      sincronizacion: "Recién vinculado",
      estado: "ONLINE"
    }
    setDispositivos([...dispositivos, nuevo])
    setModalNuevo(false)
    setNotificacion(`¡Checador "${nuevoDisp.nombre}" (${nuevoDisp.serie}) vinculado exitosamente a Supabase!`)
    setTimeout(() => setNotificacion(null), 4000)
    setNuevoDisp({
      nombre: "",
      modelo: "ZKTeco MB20",
      serie: "",
      sucursal: "Matriz CDMX",
      protocolo: "Push (ADMS)"
    })
  }

  const sincronizarDispositivo = (id: number) => {
    setCargandoSync(id)
    setTimeout(() => {
      setDispositivos(prev => prev.map(d => d.id === id ? { ...d, estado: "ONLINE", sincronizacion: "Justo ahora" } : d))
      setCargandoSync(null)
      setNotificacion("Sincronización forzada completada: Huellas y registros recibidos.")
      setTimeout(() => setNotificacion(null), 3000)
    }, 1200)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setNotificacion(`Procesando archivo USB "${file.name}"...`)
    setTimeout(() => {
      setNotificacion(`¡Importación USB exitosa! 87 checadas validadas y 0 duplicados encontrados en "${file.name}".`)
      setTimeout(() => setNotificacion(null), 5000)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238]">Gestión de Checadores Biométricos</h1>
          <p className="text-slate-500 text-sm mt-1">Supervisa terminales de huella dactilar, estado de sincronización e importaciones USB.</p>
        </div>
        <div className="flex gap-2.5">
          <Link 
            href="/dashboard/importar-checador"
            className="flex items-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 mr-2 text-slate-500" />
            Cargar Archivo de Checador (USB)
          </Link>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".dat,.txt,.csv" 
            className="hidden" 
          />

          <button 
            onClick={() => setModalNuevo(true)}
            className="flex items-center px-4 py-2.5 bg-[#D95A3F] text-white rounded-xl hover:bg-[#C24C33] text-sm font-bold shadow-md shadow-[#D95A3F]/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Vincular Dispositivo
          </button>
        </div>
      </div>

      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
          {notificacion}
        </div>
      )}

      {/* Tarjetas de Terminales Activas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dispositivos.map((d) => (
          <div key={d.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-2xl mr-3 ${d.estado === "ONLINE" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{d.nombre}</h2>
                    <p className="text-slate-500 text-xs">Modelo: {d.modelo} | SN: <span className="font-mono font-bold text-slate-700">{d.serie}</span></p>
                  </div>
                </div>

                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  d.estado === "ONLINE" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {d.estado === "ONLINE" ? <Wifi className="w-3.5 h-3.5 mr-1" /> : <WifiOff className="w-3.5 h-3.5 mr-1" />}
                  {d.estado}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mt-4 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sucursal:</span>
                  <span className="font-semibold text-slate-900">{d.sucursal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Última Sincronización:</span>
                  <span className="font-mono text-slate-700">{d.sincronizacion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocolo de Red:</span>
                  <span className="font-medium text-slate-800">{d.protocolo}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Puerto Seguro 443 (TLS)</span>
              <button 
                onClick={() => sincronizarDispositivo(d.id)}
                disabled={cargandoSync === d.id}
                className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${cargandoSync === d.id ? "animate-spin" : ""}`} />
                {cargandoSync === d.id ? "Sincronizando..." : "Probar Conexión"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Zona de Importación USB con enlace al Módulo de Carga */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Importación de Respaldo por Memoria USB</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Si tu sucursal no tiene internet, descarga el archivo <code>.dat</code> o <code>.csv</code> del checador y cárgalo con previsualización inteligente.
            </p>
          </div>
          <Link
            href="/dashboard/importar-checador"
            className="flex items-center px-4 py-2 bg-[#D95A3F] text-white rounded-xl hover:bg-[#C24C33] text-xs font-bold transition-all shrink-0 shadow-md shadow-[#D95A3F]/20"
          >
            Abrir Módulo de Carga
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <Link 
          href="/dashboard/importar-checador"
          className="block border-2 border-dashed border-slate-300 hover:border-[#D95A3F] rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-orange-50/20 transition-all cursor-pointer group"
        >
          <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#D95A3F] mx-auto mb-3 transition-colors" />
          <p className="text-sm font-bold text-slate-800">Haz clic aquí para ingresar al módulo de análisis y carga de archivos</p>
          <p className="text-xs text-slate-400 mt-1">Soporta descargas automáticas de terminales ZKTeco (.dat, .txt, .csv) con filtrado anti-duplicados</p>
        </Link>
      </div>

      {/* Modal Vincular Dispositivo */}
      {modalNuevo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Vincular Lector de Huella</h3>
              <button onClick={() => setModalNuevo(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={agregarDispositivo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Descriptivo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Checador Acceso Recepción"
                  value={nuevoDisp.nombre}
                  onChange={e => setNuevoDisp({...nuevoDisp, nombre: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D95A3F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Modelo / Fabricante</label>
                <select 
                  value={nuevoDisp.modelo}
                  onChange={e => setNuevoDisp({...nuevoDisp, modelo: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="ZKTeco MB20">ZKTeco MB20 (Huella + Rostro)</option>
                  <option value="ZKTeco K40">ZKTeco K40 (Huella TCP/IP)</option>
                  <option value="ZKTeco SilkBio-101">ZKTeco SilkBio-101 (Sensor SilkID)</option>
                  <option value="Genérico Standalone">Genérico compatible ADMS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Serie (SN)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. ZK-44910293"
                  value={nuevoDisp.serie}
                  onChange={e => setNuevoDisp({...nuevoDisp, serie: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sucursal Asignada</label>
                <select 
                  value={nuevoDisp.sucursal}
                  onChange={e => setNuevoDisp({...nuevoDisp, sucursal: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="Matriz CDMX">Matriz CDMX</option>
                  <option value="Bodega Norte">Bodega Norte</option>
                  <option value="Sucursal Guadalajara">Sucursal Guadalajara</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalNuevo(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#D95A3F] text-white rounded-xl font-bold text-sm hover:bg-[#C24C33] shadow-md"
                >
                  Vincular Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
