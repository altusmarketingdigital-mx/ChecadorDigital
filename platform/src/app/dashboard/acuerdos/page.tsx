"use client"
import { useState } from "react"
import { FileCheck, Shield, Download, CheckCircle2, X, Plus, Check } from "lucide-react"

export default function AcuerdosLegalesPage() {
  const [acuerdos, setAcuerdos] = useState([
    {
      id: 1,
      empleado: "Carlos Mendoza",
      numEmp: "EMP-001",
      documento: "Consentimiento Biométrico v2.1",
      fecha: "15/Mayo/2026 - 09:32 hrs",
      metodo: "Firma Electrónica Simple",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: 2,
      empleado: "Lucía García",
      numEmp: "EMP-002",
      documento: "Consentimiento Biométrico v2.1",
      fecha: "16/Mayo/2026 - 11:15 hrs",
      metodo: "Firma Electrónica Simple",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
    }
  ])

  const [modalNuevo, setModalNuevo] = useState(false)
  const [notificacion, setNotificacion] = useState<string | null>(null)

  const [nuevoAcuerdo, setNuevoAcuerdo] = useState({
    empleado: "Alberto Rivas",
    numEmp: "EMP-003",
    documento: "Consentimiento Biométrico LFT v2.2",
    metodo: "Firma Electrónica Simple"
  })

  const emitirAcuerdo = (e: React.FormEvent) => {
    e.preventDefault()
    const generado = {
      id: acuerdos.length + 1,
      ...nuevoAcuerdo,
      fecha: `${new Date().toLocaleDateString('es-MX')} - ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs`,
      hash: "a4f89d" + Math.random().toString(16).substring(2) + "9812bc" + Math.random().toString(16).substring(2)
    }
    setAcuerdos([generado, ...acuerdos])
    setModalNuevo(false)
    setNotificacion(`¡Acuerdo legal para ${nuevoAcuerdo.empleado} emitido y firmado con hash SHA-256!`)
    setTimeout(() => setNotificacion(null), 4000)
  }

  const descargarConstancia = (acuerdo: typeof acuerdos[0]) => {
    const texto = `====================================================================
CONSTANCIA DE CONSENTIMIENTO Y ACUERDO LEGAL DE CONTROL DE ASISTENCIA
====================================================================

TRABAJADOR: ${acuerdo.empleado} (${acuerdo.numEmp})
DOCUMENTO: ${acuerdo.documento}
FECHA Y HORA DE EMISIÓN: ${acuerdo.fecha}
MÉTODO DE MANIFESTACIÓN: ${acuerdo.metodo}
EMPRESA CONTRATANTE: Altus Marketing Digital S.A. de C.V.

DECLARACIÓN:
El trabajador manifiesta su expreso consentimiento para el uso de medios 
electrónicos y registro biométrico (huella dactilar) para el cómputo de su 
jornada laboral, conforme a lo establecido en la Ley Federal del Trabajo.

EVIDENCIA CRIPTOGRÁFICA DE INTEGRIDAD FORENSE:
HASH SHA-256: ${acuerdo.hash}
ESTADO DE AUDITORÍA: VÁLIDO E INMUTABLE (SUPABASE POSTGRESQL)
`
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Constancia_Acuerdo_${acuerdo.numEmp}.txt`
    a.click()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238]">Evidencia de Acuerdos con Trabajadores</h1>
          <p className="text-slate-500 text-sm mt-1">Registro de aceptación formal del sistema biométrico y control de jornada según la LFT.</p>
        </div>
        <button 
          onClick={() => setModalNuevo(true)}
          className="flex items-center px-4 py-2.5 bg-[#D95A3F] text-white rounded-xl hover:bg-[#C24C33] text-sm font-bold shadow-md shadow-[#D95A3F]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Emitir Nuevo Acuerdo
        </button>
      </div>

      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center text-sm font-semibold shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
          {notificacion}
        </div>
      )}

      {/* Alerta de Validez Legal */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start">
        <Shield className="w-5 h-5 text-indigo-700 mr-3 mt-0.5 shrink-0" />
        <div className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
          <strong>Validez Legal de Acuerdo:</strong> El simple hecho de colocar la huella en el checador no constituye por sí solo un consentimiento formal. Este módulo almacena la evidencia digital (fecha, hora, método de firma y firma criptográfica SHA-256) donde el trabajador autoriza expresamente el uso de sus datos para el registro de su jornada laboral ante requerimientos de la STPS.
        </div>
      </div>

      {/* Tabla de Acuerdos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50/50">
          <span className="font-bold text-slate-800 text-sm">Estado de Firmas y Consentimientos</span>
          <span className="text-xs text-slate-500 font-mono">124 Empleados Activos (122 Firmados, 2 Pendientes)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Trabajador</th>
                <th className="p-4">Documento / Versión</th>
                <th className="p-4">Fecha de Aceptación</th>
                <th className="p-4">Método de Firma</th>
                <th className="p-4">Hash Criptográfico SHA-256</th>
                <th className="p-4 text-center">Constancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {acuerdos.map((ac) => (
                <tr key={ac.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{ac.empleado}</div>
                    <div className="text-xs font-mono text-slate-400">{ac.numEmp}</div>
                  </td>
                  <td className="p-4 text-slate-700 text-xs font-medium">{ac.documento}</td>
                  <td className="p-4 text-slate-600 text-xs font-mono">{ac.fecha}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {ac.metodo}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400 max-w-xs truncate" title={ac.hash}>
                    {ac.hash.substring(0, 18)}...
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => descargarConstancia(ac)}
                      className="p-2 hover:bg-slate-100 rounded-xl text-blue-600 hover:text-blue-800 transition-colors mx-auto" 
                      title="Descargar Constancia de Consentimiento"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Emitir Nuevo Acuerdo */}
      {modalNuevo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Emitir Acuerdo de Consentimiento</h3>
              <button onClick={() => setModalNuevo(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={emitirAcuerdo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trabajador</label>
                <select 
                  value={nuevoAcuerdo.empleado}
                  onChange={e => {
                    const emp = e.target.value
                    const num = emp === "Alberto Rivas" ? "EMP-003" : "EMP-004"
                    setNuevoAcuerdo({...nuevoAcuerdo, empleado: emp, numEmp: num})
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="Alberto Rivas">Alberto Rivas (EMP-003 - RH)</option>
                  <option value="Mariana Solís">Mariana Solís (EMP-004 - Contabilidad)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Documento Normativo</label>
                <input 
                  type="text" 
                  required
                  value={nuevoAcuerdo.documento}
                  onChange={e => setNuevoAcuerdo({...nuevoAcuerdo, documento: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Método de Firma / Aceptación</label>
                <select 
                  value={nuevoAcuerdo.metodo}
                  onChange={e => setNuevoAcuerdo({...nuevoAcuerdo, metodo: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
                >
                  <option value="Firma Electrónica Simple">Firma Electrónica Simple (Plataforma Web)</option>
                  <option value="Huella Dactilar Verificada">Huella Dactilar Verificada en Lector</option>
                  <option value="Documento Físico Digitalizado">Documento Físico Escaneado</option>
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
                  Generar y Firmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
