"use client"
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, Users, Clock, Settings2, ShieldAlert, Cpu, 
  FileSpreadsheet, Scale, FileCheck, LogOut 
} from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  const menuItems = [
    { name: "Panel Principal", href: "/dashboard", icon: Home },
    { name: "Empleados", href: "/dashboard/empleados", icon: Users },
    { name: "Kiosco Asistencia", href: "/dashboard/asistencia", icon: Clock },
    { name: "Jornadas y Horarios", href: "/dashboard/jornadas", icon: Settings2 },
    { name: "Lectores de Huella", href: "/dashboard/dispositivos", icon: Cpu },
    { name: "Incidencias LFT", href: "/dashboard/incidencias", icon: ShieldAlert },
    { name: "Centro de Reportes", href: "/dashboard/reportes", icon: FileSpreadsheet },
    { name: "Marco Normativo", href: "/dashboard/normativa", icon: Scale },
    { name: "Acuerdos Legales", href: "/dashboard/acuerdos", icon: FileCheck },
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Checador SaaS
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Cerrar Sesión */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Cabecera Móvil */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 md:hidden">
          <span className="text-xl font-bold text-blue-600">Checador SaaS</span>
          <button onClick={handleLogout} className="text-xs text-rose-600 font-semibold">Salir</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
