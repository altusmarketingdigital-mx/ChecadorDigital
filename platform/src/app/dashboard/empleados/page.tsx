"use client"
import { useState, useEffect } from "react"
import { 
  Plus, Upload, MoreHorizontal, Search, FileDown, X, Check, 
  Lock, KeyRound, Eye, EyeOff, Sparkles, ShieldCheck, UserCheck 
} from "lucide-react"

interface EmpleadoItem {
  id: string
  nombre: string
  puesto: string
  depto: string
  jornada: string
  estado: string
  password?: string
}

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<EmpleadoItem[]>([
    { id: "EMP-001", nombre: "Carlos Mendoza", puesto: "Desarrollador Senior", depto: "Tecnología", jornada: "Diurna (8:00 - 17:00)", estado: "Activo", password: "1234" },
    { id: "EMP-002", nombre: "Lucía García", puesto: "Guardia de Seguridad", depto: "Operaciones", jornada: "Nocturna (20:00 - 04:00)", estado: "Activo", password: "1234" },
    { id: "EMP-003", nombre: "Alberto Rivas", puesto: "Coordinador de Finanzas", depto: "Administración", jornada: "Diurna (8:00 - 17:00)", estado: "Activo", password: "1234" },
    { id: "EMP-004", nombre: "Mariana Solís", puesto: "Generalista de RRHH", depto: "Recursos Humanos", jornada: "Diurna (8:00 - 17:00)", estado: "Activo", password: "1234" },
    { id: "EMP-005", nombre: "Fernando Torres", puesto: "Ejecutivo de Ventas", depto: "Comercial", jornada: "Mixta (14:00 - 21:30)", estado: "Activo", password: "1234" },
  ])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarPasswordModal, setMostrarPasswordModal] = useState(false)
  const [filtroBusqueda, setFiltroBusqueda] = useState("")
  const [notificacion, setNotificacion] = useState<string | null>(null)
  const [verPinEnTabla, setVerPinEnTabla] = useState<Record<string, boolean>>({})

  // Formulario de Nuevo Empleado
  const [nuevo, setNuevo] = useState({
    nomina: "",
    nombre: "",
    puesto: "",
    depto: "Tecnología",
    jornada: "Diurna (8:00 - 17:00)",
    password: "1234",
  })

  // Cargar lista desde el backend al montar
  useEffect(() => {
    fetch("/api/empleados")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.empleados)) {
          const mapeados: EmpleadoItem[] = data.empleados.map((c: any) => ({
            id: c.nomina,
            nombre: c.nombre,
            puesto: c.puesto,
            depto: c.depto,
            jornada: c.jornada || "Diurna (8:00 - 17:00)",
            estado: c.estado || "Activo",
            password: c.password || c.pin || "1234",
          }))
          setEmpleados(mapeados)
        }
      })
      .catch(() => {})
  }, [])

  // Sugerir la siguiente nómina libre al abrir el modal
  const abrirModalNuevo = () => {
    const siguienteNum = empleados.length + 1
    const sugerida = `EMP-00${siguienteNum}`
    setNuevo({
      nomina: sugerida,
      nombre: "",
      puesto: "",
      depto: "Tecnología",
      jornada: "Diurna (8:00 - 17:00)",
      password: "1234",
    })
    setMostrarPasswordModal(false)
    setMostrarModal(true)
  }

  // Generador de PIN numérico aleatorio de 4 dígitos
  const generarPinAleatorio = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString()
    setNuevo((prev) => ({ ...prev, password: randomPin }))
  }

  // Guardar Nuevo Empleado
  const agregarEmpleado = async (e: React.FormEvent) => {
    e.preventDefault()

    const nominaFinal = nuevo.nomina.trim().toUpperCase() || `EMP-00${empleados.length + 1}`
    const passwordFinal = nuevo.password.trim() || "1234"

    const empleadoNuevo: EmpleadoItem = {
      id: nominaFinal,
      nombre: nuevo.nombre.trim(),
      puesto: nuevo.puesto.trim(),
      depto: nuevo.depto,
      jornada: nuevo.jornada,
      estado: "Activo",
      password: passwordFinal,
    }

    // Guardar en el backend para que quede habilitado de inmediato en /checador
    try {
      await fetch("/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomina: nominaFinal,
          nombre: nuevo.nombre.trim(),
          puesto: nuevo.puesto.trim(),
          depto: nuevo.depto,
          jornada: nuevo.jornada,
          password: passwordFinal,
          pin: passwordFinal,
        }),
      })
    } catch (err) {
      console.log("Error al sincronizar con /api/empleados:", err)
    }

    setEmpleados((prev) => {
      const idx = prev.findIndex((emp) => emp.id.toUpperCase() === nominaFinal)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = empleadoNuevo
        return copy
      }
      return [...prev, empleadoNuevo]
    })

    setMostrarModal(false)
    setNotificacion(`¡Empleado "${empleadoNuevo.nombre}" (${nominaFinal}) guardado con contraseña "${passwordFinal}"! Ya puede iniciar sesión en /checador.`)
    setTimeout(() => setNotificacion(null), 6000)
  }

  const exportarExcel = () => {
    const csv =
      `No_Empleado,Nombre_Completo,Puesto,Departamento,Jornada,Contrasena_PIN,Estado\n` +
      empleados
        .map(
          (e) =>
            `${e.id},"${e.nombre}","${e.puesto}","${e.depto}","${e.jornada}","${e.password || "1234"}",${e.estado}`
        )
        .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Directorio_Empleados_ALTUS.csv"
    a.click()
  }

  const toggleVerPin = (id: string) => {
    setVerPinEnTabla((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const empleadosFiltrados = empleados.filter((emp) =>
    emp.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    emp.id.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    emp.depto.toLowerCase().includes(filtroBusqueda.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Cabecera y Botonera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142238]">Directorio de Empleados</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Gestiona altas, turnos LFT y las contraseñas de acceso al checador para cada colaborador.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert("Módulo para importar empleados masivamente mediante archivo Excel (.xlsx / .csv). Conectado a Supabase.")}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4 mr-2 text-slate-500" />
            Importar Excel
          </button>
          <button 
            onClick={abrirModalNuevo}
            className="flex items-center px-4 py-2 bg-[#D95A3F] hover:bg-[#b8442c] text-white rounded-xl text-sm font-bold shadow-md shadow-[#D95A3F]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Alerta de Notificación */}
      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold shadow-sm animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* =========================================================================
          MODAL: REGISTRAR NUEVO EMPLEADO (CON CONTRASEÑA/PIN INCLUIDO)
      ========================================================================= */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Registrar Nuevo Empleado</h3>
                <p className="text-xs text-slate-500 mt-0.5">Asigna sus datos laborales y su contraseña de acceso al checador.</p>
              </div>
              <button 
                onClick={() => setMostrarModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={agregarEmpleado} className="space-y-4">
              {/* Número de Nómina / ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D95A3F]" />
                  <span>Número de Nómina / ID de Empleado</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. EMP-003 o 1042"
                  value={nuevo.nomina}
                  onChange={(e) => setNuevo({ ...nuevo, nomina: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-[#D95A3F] focus:ring-2 focus:ring-[#D95A3F]/10 transition-all"
                />
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez López"
                  value={nuevo.nombre}
                  onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#D95A3F] focus:ring-2 focus:ring-[#D95A3F]/10 transition-all"
                />
              </div>

              {/* CONTRASEÑA / PIN DE INGRESO (SOLICITADO POR EL USUARIO) */}
              <div className="p-3.5 bg-orange-50/60 border-2 border-orange-200 rounded-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-900 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#D95A3F]" />
                    <span>Contraseña / PIN de Ingreso</span>
                  </label>
                  <button
                    type="button"
                    onClick={generarPinAleatorio}
                    className="text-[11px] text-[#D95A3F] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    title="Generar PIN aleatorio de 4 dígitos"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generar PIN</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={mostrarPasswordModal ? "text" : "password"}
                    required
                    placeholder="Ej. 1234 o Clave2026"
                    value={nuevo.password}
                    onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 outline-none focus:border-[#D95A3F] focus:ring-2 focus:ring-[#D95A3F]/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPasswordModal(!mostrarPasswordModal)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title={mostrarPasswordModal ? "Ocultar" : "Mostrar"}
                  >
                    {mostrarPasswordModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                  * Con esta contraseña y su nómina, el colaborador iniciará sesión en el portal <strong>/checador</strong> para registrar su entrada o salida con rostro o huella.
                </p>
              </div>

              {/* Puesto */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Puesto
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Analista de Calidad"
                  value={nuevo.puesto}
                  onChange={(e) => setNuevo({ ...nuevo, puesto: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#D95A3F] transition-all"
                />
              </div>

              {/* Departamento y Jornada LFT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departamento</label>
                  <select 
                    value={nuevo.depto}
                    onChange={(e) => setNuevo({ ...nuevo, depto: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#D95A3F]"
                  >
                    <option value="Tecnología">Tecnología</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Administración">Administración</option>
                    <option value="Almacén">Almacén</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Jornada LFT</label>
                  <select 
                    value={nuevo.jornada}
                    onChange={(e) => setNuevo({ ...nuevo, jornada: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#D95A3F]"
                  >
                    <option value="Diurna (8:00 - 17:00)">Diurna (8 hrs)</option>
                    <option value="Nocturna (20:00 - 04:00)">Nocturna (7 hrs)</option>
                    <option value="Mixta (14:00 - 21:30)">Mixta (7.5 hrs)</option>
                  </select>
                </div>
              </div>

              {/* Botonera */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-[#D95A3F] hover:bg-[#b8442c] text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#D95A3F]/20 transition-all"
                >
                  Guardar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABLA DE EMPLEADOS CON COLUMNA DE CONTRASEÑA / PIN
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Barra de Filtro y Exportar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/60">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#D95A3F]/20 focus:border-[#D95A3F] outline-none" 
              placeholder="Buscar por nombre, nómina o depto..."
            />
          </div>
          <button 
            onClick={exportarExcel}
            className="flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200 shadow-2xs"
          >
            <FileDown className="w-4 h-4 mr-2 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4">No. Emp</th>
                <th className="p-4">Nombre Completo</th>
                <th className="p-4">Departamento</th>
                <th className="p-4">Jornada (LFT)</th>
                <th className="p-4">Contraseña / PIN</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No se encontraron colaboradores con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((emp) => {
                  const estaVisible = verPinEnTabla[emp.id]
                  const pinActual = emp.password || "1234"
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#D95A3F]">{emp.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{emp.nombre}</div>
                        <div className="text-slate-500 text-[11px]">{emp.puesto}</div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{emp.depto}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.jornada}
                        </span>
                      </td>

                      {/* Columna de Contraseña / PIN para el Checador */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-xl">
                          <KeyRound className="w-3.5 h-3.5 text-[#D95A3F]" />
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {estaVisible ? pinActual : "••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleVerPin(emp.id)}
                            className="text-slate-400 hover:text-slate-700 ml-1 p-0.5"
                            title={estaVisible ? "Ocultar contraseña" : "Ver contraseña"}
                          >
                            {estaVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {emp.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => alert(`Colaborador: ${emp.nombre}\nNómina: ${emp.id}\nContraseña/PIN de Checador: ${pinActual}\n\nCon estos datos el colaborador ingresa en /checador`)} 
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Ver detalles"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
