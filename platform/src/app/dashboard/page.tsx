"use client"
import { useState } from "react"
import Link from "next/link"
import { 
  Users, UserCheck, Clock, AlertTriangle, ArrowUpRight, 
  Cpu, ShieldAlert, Calendar, Building, Filter, CheckCircle2 
} from "lucide-react"

export default function DashboardPage() {
  const [sucursal, setSucursal] = useState("Todas")
  const [departamento, setDepartamento] = useState("Todos")

  const ultimosRegistros = [
    { id: 1, emp: "Carlos Mendoza", num: "EMP-001", depto: "Tecnología", evento: "ENTRADA", hora: "08:52 hrs", metodo: "Huella Digital", estado: "A Tiempo" },
    { id: 2, emp: "Lucía García", num: "EMP-002", depto: "Operaciones", evento: "ENTRADA", hora: "09:08 hrs", metodo: "Lector ZKTeco", estado: "Tolerancia (10m)" },
    { id: 3, emp: "Alberto Rivas", num: "EMP-003", depto: "RH", evento: "SALIDA", hora: "14:02 hrs", metodo: "Kiosco Web", estado: "Pausa Comida" },
    { id: 4, emp: "Mariana Solís", num: "EMP-004", depto: "Contabilidad", evento: "ENTRADA", hora: "08:45 hrs", metodo: "Huella Digital", estado: "A Tiempo" },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. TÍTULO Y FILTROS POR FECHA / SUCURSAL / DEPARTAMENTO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238] tracking-tight">Panel de Control General</h1>
          <p className="text-slate-500 text-sm mt-1">Supervisión en tiempo real de asistencia, incidencias y dispositivos conectados.</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={sucursal} 
              onChange={(e) => setSucursal(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="Todas">Todas las Sucursales</option>
              <option value="CDMX">Matriz CDMX</option>
              <option value="Norte">Bodega Norte</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={departamento} 
              onChange={(e) => setDepartamento(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="Todos">Todos los Deptos</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Operaciones">Operaciones</option>
              <option value="RH">Recursos Humanos</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#D95A3F]" />
            <span>Hoy: {new Date().toLocaleDateString('es-MX')}</span>
          </div>
        </div>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS PRINCIPALES ENLAZADAS (CLICKEABLES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Tarjeta 1: Empleados Activos -> enlace a /dashboard/empleados */}
        <Link 
          href="/dashboard/empleados" 
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#142238] transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-[#142238] group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#D95A3F] transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-[#142238]">124</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Empleados Activos</div>
          <div className="text-[11px] text-blue-600 mt-2 font-medium">Ver Directorio de Personal →</div>
        </Link>

        {/* Tarjeta 2: Personal Presente -> enlace a /dashboard/asistencia */}
        <Link 
          href="/dashboard/asistencia" 
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">118</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Presentes Hoy (95.1%)</div>
          <div className="text-[11px] text-emerald-700 mt-2 font-medium">Ir al Kiosco de Asistencia →</div>
        </Link>

        {/* Tarjeta 3: Retardos e Incidencias -> enlace a /dashboard/incidencias */}
        <Link 
          href="/dashboard/incidencias" 
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D95A3F] transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-50 text-[#D95A3F] rounded-xl group-hover:bg-[#D95A3F] group-hover:text-white transition-colors">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#D95A3F] transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-[#D95A3F]">6</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Retardos / Incidencias LFT</div>
          <div className="text-[11px] text-[#D95A3F] mt-2 font-medium">Revisar y Autorizar →</div>
        </Link>

        {/* Tarjeta 4: Dispositivos Biométricos -> enlace a /dashboard/dispositivos */}
        <Link 
          href="/dashboard/dispositivos" 
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl group-hover:bg-indigo-700 group-hover:text-white transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-[#142238]">2 / 2</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Lectores Sincronizados</div>
          <div className="text-[11px] text-indigo-700 mt-2 font-medium">Monitorear Conexión →</div>
        </Link>

      </div>

      {/* 3. ALERTA DE INTEGRIDAD Y REFORMA MAYO 2026 */}
      <div className="bg-gradient-to-r from-[#142238] to-[#1e3252] rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D95A3F] text-white uppercase tracking-wider">
              Vigencia STPS
            </span>
            <span className="text-xs text-slate-300">Cumplimiento LFT Reformas 2026</span>
          </div>
          <h3 className="text-lg font-bold text-white">Motor Normativo Activo: 48h Diurna / 42h Nocturna / Tolerancia 10 min</h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Todos los eventos de huella digital y kiosco web son registrados de forma inmutable con sellado de tiempo UTC en Supabase.
          </p>
        </div>
        <Link 
          href="/dashboard/normativa"
          className="px-4 py-2 bg-white text-[#142238] hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shrink-0"
        >
          Configuración Normativa →
        </Link>
      </div>

      {/* 4. TABLA DE ÚLTIMOS REGISTROS EN VIVO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-[#142238]">Últimas Checadas Registradas</h2>
            <p className="text-xs text-slate-500">Transmisión de eventos de checadores biométricos y Kiosco Web.</p>
          </div>
          <Link 
            href="/dashboard/reportes" 
            className="text-xs font-bold text-[#D95A3F] hover:underline flex items-center"
          >
            Ver Reporte Completo →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Empleado</th>
                <th className="p-4">Departamento</th>
                <th className="p-4">Evento</th>
                <th className="p-4">Hora Oficial</th>
                <th className="p-4">Método Origen</th>
                <th className="p-4">Validación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ultimosRegistros.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{reg.emp}</div>
                    <div className="text-xs font-mono text-slate-400">{reg.num}</div>
                  </td>
                  <td className="p-4 text-slate-600 text-xs">{reg.depto}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                      reg.evento === "ENTRADA" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {reg.evento}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold text-slate-800">{reg.hora}</td>
                  <td className="p-4 text-xs text-slate-500">{reg.metodo}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {reg.estado}
                    </span>
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
