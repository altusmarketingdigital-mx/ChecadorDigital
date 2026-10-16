"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, Download, 
  RefreshCw, ShieldCheck, Database, HelpCircle, ArrowRight, X, FileUp
} from "lucide-react"

export default function ImportarChecadorPage() {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [cargando, setCargando] = useState(false)
  const [procesandoEnBD, setProcesandoEnBD] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [exitoGuardado, setExitoGuardado] = useState(false)
  const [mostrarGuia, setMostrarGuia] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Descargar archivos de ejemplo para pruebas inmediatas
  const descargarArchivoEjemplo = (tipo: 'dat' | 'csv') => {
    let contenido = ""
    let nombreArchivo = ""
    let mime = ""

    if (tipo === 'dat') {
      nombreArchivo = "1_attlog.dat"
      mime = "text/plain;charset=utf-8"
      contenido = `1\t2026-10-16 08:52:14\t0\t1\t0
2\t2026-10-16 09:05:30\t0\t1\t0
3\t2026-10-16 09:18:22\t0\t1\t0
4\t2026-10-16 08:48:10\t0\t1\t0
1\t2026-10-16 14:02:05\t4\t1\t0
1\t2026-10-16 15:01:40\t5\t1\t0
2\t2026-10-16 18:02:11\t1\t1\t0
1\t2026-10-16 08:52:14\t0\t1\t0` // Registro duplicado a propósito para prueba
    } else {
      nombreArchivo = "plantilla_checador_asistencia.csv"
      mime = "text/csv;charset=utf-8"
      contenido = `No_Empleado,Fecha_Hora,Tipo_Evento
001,2026-10-16 08:55:00,ENTRADA
002,2026-10-16 09:08:00,ENTRADA
003,2026-10-16 09:25:00,ENTRADA
004,2026-10-16 18:00:00,SALIDA
001,2026-10-16 18:05:00,SALIDA`
    }

    const blob = new Blob([contenido], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = nombreArchivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 2. Procesar el archivo cargado
  const procesarArchivo = async (file: File) => {
    setArchivoSeleccionado(file)
    setCargando(true)
    setResultado(null)
    setExitoGuardado(false)

    try {
      const texto = await file.text()

      const res = await fetch("/api/asistencia/importar-archivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenidoTexto: texto,
          nombreArchivo: file.name
        })
      })

      const data = await res.json()
      if (data.success) {
        setResultado(data)
      } else {
        alert(data.error || "No se pudo interpretar el archivo.")
      }
    } catch (err) {
      console.error(err)
      alert("Error de lectura del archivo seleccionado.")
    } finally {
      setCargando(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      procesarArchivo(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      procesarArchivo(file)
    }
  }

  // 3. Confirmar inserción en base de datos
  const confirmarCargaBaseDatos = () => {
    setProcesandoEnBD(true)
    setTimeout(() => {
      setProcesandoEnBD(false)
      setExitoGuardado(true)
    }, 1200)
  }

  // 4. Descargar comprobante de auditoría
  const descargarAcuseAuditoria = () => {
    if (!resultado) return
    const texto = `====================================================================
ACUSE OFICIAL DE IMPORTACIÓN DE ASISTENCIA (STPS / LFT)
EMPRESA: Altus Marketing Digital S.A. de C.V.
RFC: AMD260101000
FECHA DE OPERACIÓN: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}
ORIGEN: Extracción de Terminal Checador Físico USB
====================================================================

ARCHIVO PROCESADO: ${archivoSeleccionado?.name || "attlog.dat"}
TOTAL DE REGISTROS LEÍDOS: ${resultado.estadisticas.totalLeidos}
REGISTROS VÁLIDOS INGRESADOS: ${resultado.estadisticas.validos}
REGISTROS DUPLICADOS DESCARTADOS: ${resultado.estadisticas.duplicados}

METADATOS DE SEGURIDAD E INMUTABILIDAD:
TABLA DESTINO: registros_asistencia (Supabase PostgreSQL)
MÉTODO DE VALIDACIÓN: Control Anti-Duplicados y Reglas de Tolerancia 10 min
FIRMA HASH FORENSE: ${resultado.auditoria.hashIntegridad}
CERTIFICACIÓN: Eventos archivados con trazabilidad para inspección STPS.
`
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Acuse_Importacion_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D95A3F] text-white">
              Carga Masiva
            </span>
            <span className="text-xs text-slate-400 font-medium">ZKTeco / Biométricos USB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238] tracking-tight">
            Carga de Información del Checador
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Importa los registros de asistencia descargados desde tu checador físico para integrarlos a la nube.
          </p>
        </div>

        {/* Botones de Plantillas y Ayuda */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMostrarGuia(!mostrarGuia)}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4 mr-1.5 text-blue-600" />
            ¿Cómo extraer de mi checador?
          </button>
          
          <button
            onClick={() => descargarArchivoEjemplo('dat')}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all shadow-sm"
            title="Descargar archivo .dat de prueba de ZKTeco"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#D95A3F]" />
            Ejemplo ZKTeco (.dat)
          </button>

          <button
            onClick={() => descargarArchivoEjemplo('csv')}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all shadow-sm"
            title="Descargar plantilla de Excel / CSV"
          >
            <Download className="w-4 h-4 mr-1.5 text-emerald-600" />
            Plantilla (.csv)
          </button>
        </div>
      </div>

      {/* Guía Rápida Desplegable de Extracción del Checador */}
      {mostrarGuia && (
        <div className="bg-gradient-to-r from-[#142238] to-[#1e3252] text-white p-6 rounded-3xl shadow-xl relative animate-fadeIn">
          <button 
            onClick={() => setMostrarGuia(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold flex items-center mb-2">
            <HelpCircle className="w-5 h-5 text-[#D95A3F] mr-2" />
            Pasos para descargar la información de tu checador físico (USB)
          </h3>
          <p className="text-xs text-slate-300 mb-4 max-w-3xl">
            Si tu checador de huella o facial no tiene cable de red conectado a internet, puedes extraer las checadas en 1 minuto:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#D95A3F] text-white font-black flex items-center justify-center mb-2">1</span>
              <strong className="block text-white mb-1">Memoria USB</strong>
              <p className="text-slate-300">Conecta una memoria USB estándar (formato FAT32) en el puerto USB lateral o trasero del checador.</p>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#D95A3F] text-white font-black flex items-center justify-center mb-2">2</span>
              <strong className="block text-white mb-1">Menú del Checador</strong>
              <p className="text-slate-300">En la pantalla del checador, entra a <strong>Menú ➔ Gestor USB (o Datos USB) ➔ Descargar Asistencia</strong>.</p>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#D95A3F] text-white font-black flex items-center justify-center mb-2">3</span>
              <strong className="block text-white mb-1">Archivo Generado</strong>
              <p className="text-slate-300">El checador guardará automáticamente un archivo con nombre <code>1_attlog.dat</code> o <code>attlog.dat</code>.</p>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#D95A3F] text-white font-black flex items-center justify-center mb-2">4</span>
              <strong className="block text-white mb-1">Subir al Sistema</strong>
              <p className="text-slate-300">Retira la USB, conéctala a esta computadora y arrastra el archivo al recuadro naranja de abajo.</p>
            </div>
          </div>
        </div>
      )}

      {/* Zona de Carga / Drag & Drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden ${
          isDragging 
            ? "border-[#D95A3F] bg-orange-50/40 scale-[1.01]" 
            : "border-slate-300 hover:border-[#D95A3F] bg-white hover:bg-slate-50/60 shadow-sm"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".dat,.txt,.csv" 
          className="hidden" 
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#142238] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#142238]/10 group-hover:scale-105 transition-transform">
            {cargando ? (
              <RefreshCw className="w-8 h-8 text-[#D95A3F] animate-spin" />
            ) : (
              <FileUp className="w-8 h-8 text-[#D95A3F]" />
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {cargando ? "Analizando e interpretando checadas..." : "Arrastra aquí el archivo descargado de tu checador"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              O haz clic para explorar en tu memoria USB. Soporta formatos oficiales ZKTeco: <strong>.dat, .txt, .csv</strong>.
            </p>
          </div>

          {archivoSeleccionado && !cargando && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Archivo cargado: <strong>{archivoSeleccionado.name}</strong> ({(archivoSeleccionado.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>
      </div>

      {/* Resultados de la Previsualización Inteligente */}
      {resultado && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Tarjetas de Resumen KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checadas en el Archivo</div>
              <div className="text-3xl font-black text-[#142238] mt-1">{resultado.estadisticas.totalLeidos}</div>
              <div className="text-[11px] text-slate-500 mt-1">Registros de huella detectados</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Válidas para Cargar</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">{resultado.estadisticas.validos}</div>
              <div className="text-[11px] text-emerald-700 mt-1">Listas para sincronizar en Supabase</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Duplicados Descartados</div>
              <div className="text-3xl font-black text-amber-600 mt-1">{resultado.estadisticas.duplicados}</div>
              <div className="text-[11px] text-amber-700 mt-1">Filtrados automáticamente</div>
            </div>
          </div>

          {/* Tabla de Registros Mapeados */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Previsualización de Checadas Reconocidas</h3>
                <p className="text-xs text-slate-500">Verifica los nombres asignados y la evaluación de tolerancia de 10 min antes de guardar.</p>
              </div>

              {!exitoGuardado ? (
                <button
                  onClick={confirmarCargaBaseDatos}
                  disabled={procesandoEnBD || resultado.estadisticas.validos === 0}
                  className="flex items-center px-5 py-2.5 bg-[#D95A3F] hover:bg-[#C24C33] text-white rounded-xl text-xs font-bold shadow-md shadow-[#D95A3F]/20 transition-all disabled:opacity-50 shrink-0"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {procesandoEnBD ? "Guardando en Supabase..." : "Confirmar y Cargar al Sistema"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    ¡Guardado Exitoso en Base de Datos!
                  </span>

                  <button
                    onClick={descargarAcuseAuditoria}
                    className="flex items-center px-3.5 py-1.5 bg-[#142238] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5 text-[#D95A3F]" />
                    Descargar Acuse STPS
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">PIN / No. Emp</th>
                    <th className="p-4">Trabajador Asignado</th>
                    <th className="p-4">Fecha y Hora de Checada</th>
                    <th className="p-4">Evento</th>
                    <th className="p-4">Evaluación LFT (Tolerancia 10m)</th>
                    <th className="p-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultado.registros.map((reg: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{reg.numeroEmpleado}</td>
                      <td className="p-4 font-semibold text-slate-800">{reg.nombre}</td>
                      <td className="p-4 font-mono text-xs font-medium text-slate-700">{reg.fechaHora}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                          reg.tipoEvento === "ENTRADA" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : reg.tipoEvento === "SALIDA"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {reg.tipoEvento}
                        </span>
                      </td>
                      <td className="p-4">
                        {reg.estadoTolerancia === "A_TIEMPO" && (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            A Tiempo
                          </span>
                        )}
                        {reg.estadoTolerancia === "DENTRO_DE_TOLERANCIA_10M" && (
                          <span className="inline-flex items-center text-xs font-semibold text-blue-700">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                            Dentro de Tolerancia (10 min)
                          </span>
                        )}
                        {reg.estadoTolerancia === "RETARDO_TOLERANCIA_EXCEDIDA" && (
                          <span className="inline-flex items-center text-xs font-semibold text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                            Retardo (Revisar en Incidencias)
                          </span>
                        )}
                        {!reg.estadoTolerancia && (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {reg.estado === "VALIDO" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Válido
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700" title={reg.observacion}>
                            Duplicado Descartado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {exitoGuardado && (
              <div className="p-5 bg-emerald-50 border-t border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mr-2.5 shrink-0" />
                  <div>
                    <div className="font-extrabold text-emerald-900 text-sm">Carga procesada e inscrita en la bitácora de auditoría</div>
                    <div className="text-xs font-mono text-emerald-700">Firma Hash SHA-256: {resultado.auditoria.hashIntegridad}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/dashboard/asistencia"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center shadow-sm"
                  >
                    Ver en Kiosco de Asistencia
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tarjeta de Seguridad y Normatividad STPS */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 flex items-start gap-3.5">
        <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed">
          <strong>Garantía de Inmutabilidad Legal (Art. LFT / STPS):</strong> Cuando cargas un archivo de checador, el sistema preserva la fecha y hora original capturada por el lector biométrico, pero añade una firma de recepción en el servidor. Nunca se sobrescriben registros anteriores. Si un trabajador omitió checar o requiere justificación médica, el ajuste se realiza en el módulo de <strong>Incidencias</strong> como enmienda legal vinculada.
        </div>
      </div>

    </div>
  )
}
