"use client"
import { useState } from "react"
import { AlertCircle, CheckCircle2, XCircle, Clock, FileText, Filter, Plus } from "lucide-react"

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      empleado: "Carlos Mendoza",
      numEmp: "EMP-001",
      depto: "Tecnología",
      fecha: "09/Oct/2026",
      tipo: "Omisión de Salida",
      motivo: "El lector de huella no emitía sonido al salir a las 17:05 hrs.",
      estado: "PENDIENTE",
      resolucion: null as string | null
    },
    {
      id: 2,
      empleado: "Lucía García",
      numEmp: "EMP-002",
      depto: "Operaciones",
      fecha: "08/Oct/2026",
      tipo: "Permiso Médico (IMSS)",
      motivo: "justificante_imss.pdf",
      estado: "APROBADA",
      resolucion: "Aprobado por RH (María S.)"
    }
  ])

  const resolverIncidencia = (id: number, nuevoEstado: "APROBADA" | "RECHAZADA") => {
    setIncidencias(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          estado: nuevoEstado,
          resolucion: nuevoEstado === "APROBADA" 
            ? "Aprobada por Superadmin (Enmienda Inmutable Generada)" 
            : "Rechazada por Superadmin"
        }
      }
      return inc
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo de Incidencias y Aclaraciones</h1>
          <p className="text-slate-500 text-sm">Gestiona solicitudes de corrección de asistencia y justificaciones laborales con trazabilidad.</p>
        </div>
        <button 
          onClick={() => alert("Formulario para que un trabajador reporte una omisión o permiso. Está vinculado a la tabla incidencias_solicitudes en Supabase.")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Incidencia
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <strong>Inmutabilidad Legal STPS:</strong> Al presionar aprobar (<CheckCircle2 className="w-4 h-4 inline text-emerald-600" />), el sistema crea una enmienda complementaria. La huella original nunca se sobrescribe.
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Trabajador</th>
                <th className="p-4">Fecha Evento</th>
                <th className="p-4">Tipo de Solicitud</th>
                <th className="p-4">Motivo / Evidencia</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones / Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidencias.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{inc.empleado}</div>
                    <div className="text-slate-500 text-xs">{inc.numEmp} | {inc.depto}</div>
                  </td>
                  <td className="p-4 text-slate-600">{inc.fecha}</td>
                  <td className="p-4 font-medium text-slate-900">{inc.tipo}</td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">
                    {inc.motivo.endsWith(".pdf") ? (
                      <span className="text-blue-600 hover:underline cursor-pointer flex items-center font-medium">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {inc.motivo}
                      </span>
                    ) : (
                      `"${inc.motivo}"`
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inc.estado === "PENDIENTE" 
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : inc.estado === "APROBADA"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {inc.estado === "PENDIENTE" && <Clock className="w-3 h-3 mr-1" />}
                      {inc.estado === "APROBADA" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {inc.estado === "RECHAZADA" && <XCircle className="w-3 h-3 mr-1" />}
                      {inc.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {inc.estado === "PENDIENTE" ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => resolverIncidencia(inc.id, "APROBADA")}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium text-xs flex items-center border border-emerald-200 transition-colors"
                          title="Aprobar e insertar enmienda"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Aprobar
                        </button>
                        <button 
                          onClick={() => resolverIncidencia(inc.id, "RECHAZADA")}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-medium text-xs flex items-center border border-rose-200 transition-colors"
                          title="Rechazar solicitud"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">
                        {inc.resolucion}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
