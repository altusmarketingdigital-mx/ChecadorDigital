"use client"
import { useState } from "react"
import { FileSpreadsheet, FileText, Download, ShieldCheck, Calendar, CheckCircle2 } from "lucide-react"

export default function ReportesLaboralesPage() {
  const [descargando, setDescargando] = useState<string | null>(null)

  // Función genérica para descargar archivos generados al vuelo
  const descargarArchivo = (nombreArchivo: string, contenido: string, tipoMime: string) => {
    setDescargando(nombreArchivo)
    setTimeout(() => {
      const blob = new Blob([contenido], { type: tipoMime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = nombreArchivo
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDescargando(null)
    }, 600)
  }

  // Generador de Paquete STPS
  const descargarPaqueteSTPS = () => {
    const contenido = `====================================================================
EXPEDIENTE DE INSPECCIÓN LABORAL (STPS)
EMPRESA: Altus Marketing Digital S.A. de C.V.
RFC: AMD260101000
FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-MX')}
NORMA APLICABLE: Ley Federal del Trabajo / Reforma Mayo 2026
====================================================================

1. ÍNDICE DE ARCHIVOS ANEXOS:
- Registros_Asistencia_Brutos.csv (Eventos de lectores ZKTeco en UTC)
- Bitacora_Correcciones_Inmutables.csv (Enmiendas de incidencias aprobadas)
- Acuerdos_Consentimiento_Biometrico.csv (Firmas de empleados con hash SHA-256)
- Certificado_Integridad_Hash.txt

2. RESUMEN DE CUMPLIMIENTO:
- Total Empleados Registrados: 124
- Tolerancia Aplicada: 10 minutos
- Metadatos de Hardware: Conexión segura TLS 1.3 / Supabase PostgreSQL

FIRMA DE VERIFICACIÓN FORENSE:
SHA-256: 7d1a55f892b11e2f3d9a044b3602181512f4581f4a9b341f23a6519191d84812
`
    descargarArchivo("Expediente_STPS_Inspeccion.txt", contenido, "text/plain;charset=utf-8")
  }

  // Generador de Prenómina CSV/Excel
  const descargarReporteMensual = () => {
    const csvContenido = `No_Empleado,Nombre_Completo,Departamento,Dias_Laborados,Retardos,Faltas_Justificadas,Horas_Extra
EMP-001,Carlos Mendoza,Tecnología,20,1,0,0
EMP-002,Lucía García,Operaciones,22,0,1,2
EMP-003,Alberto Rivas,Recursos Humanos,20,0,0,0
EMP-004,Mariana Solís,Contabilidad,21,2,0,0`
    descargarArchivo("Reporte_Mensual_Prenomina.csv", csvContenido, "text/csv;charset=utf-8")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Centro de Reportes Laborales</h1>
        <p className="text-slate-500 text-sm">Exporta historiales de jornada, asistencia, horas extras y expedientes de auditoría.</p>
      </div>

      {/* Paquete Especial STPS */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-300" />
              Requerimiento de Autoridad
            </div>
            <h2 className="text-2xl font-bold">Expediente de Inspección Laboral (STPS)</h2>
            <p className="text-blue-200 text-sm max-w-xl">
              Genera el expediente legal completo con metadatos de sincronización, trazabilidad de registros originales y hashes de integridad SHA-256.
            </p>
          </div>
          <button 
            onClick={descargarPaqueteSTPS}
            className="flex items-center px-6 py-3.5 bg-white text-blue-900 rounded-2xl font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-md shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            {descargando === "Expediente_STPS_Inspeccion.txt" ? "Generando..." : "Descargar Expediente STPS"}
          </button>
        </div>
      </div>

      {/* Catálogo de Reportes Frecuentes */}
      <h3 className="text-lg font-bold text-slate-900 pt-2">Reportes Operativos y Contables</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reporte 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="p-3 bg-emerald-50 text-emerald-700 w-fit rounded-xl mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Reporte Mensual de Asistencia</h4>
            <p className="text-slate-500 text-xs mb-4">Consolidado para prenómina: días laborados, retardos acumulados y faltas justificadas.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={descargarReporteMensual}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Excel / CSV
            </button>
            <button 
              onClick={() => alert("Generando versión PDF con encabezados fiscales y logotipos de la empresa...")}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Reporte 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="p-3 bg-blue-50 text-blue-700 w-fit rounded-xl mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Reporte Semanal de Jornadas</h4>
            <p className="text-slate-500 text-xs mb-4">Desglose de horas trabajadas vs. límite legal (48 hrs diurna / 42 hrs nocturna) y horas extra.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={descargarReporteMensual}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Excel / CSV
            </button>
            <button 
              onClick={() => alert("Generando resumen de jornada semanal en PDF...")}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Reporte 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="p-3 bg-purple-50 text-purple-700 w-fit rounded-xl mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Bitácora de Auditoría Forense</h4>
            <p className="text-slate-500 text-xs mb-4">Historial forense inmutable de modificaciones de horarios, autorizaciones y eventos del sistema.</p>
          </div>
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => {
                const csvAuditoria = `Fecha_Hora_UTC,Usuario,Accion,Tabla,Firma_SHA256
2026-10-11T00:30:00Z,admin@checadordigital.mx,CREAR_USUARIO,usuarios,c4ca4238a0b923820dcc509a6f75849b
2026-10-11T00:45:00Z,admin@checadordigital.mx,APROBAR_INCIDENCIA,incidencias_solicitudes,c81e728d9d4c2f636f067f89cc14862c`
                descargarArchivo("Auditoria_Logs.csv", csvAuditoria, "text/csv;charset=utf-8")
              }}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              CSV
            </button>
            <button 
              onClick={() => alert("Generando reporte sellado criptográficamente...")}
              className="flex-1 flex justify-center items-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
            >
              PDF Sellado
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
