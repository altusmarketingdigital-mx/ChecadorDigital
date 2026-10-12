"use client"
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, Users, Clock, Settings2, ShieldAlert, Cpu, 
  FileSpreadsheet, Scale, FileCheck, LogOut 
} from "lucide-react"
import { AltusLogo } from "@/components/AltusLogo"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Cerrar sesión instantáneo (0 milisegundos de espera)
  const handleLogout = () => {
    document.cookie = "app_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    window.location.href = "/login"
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
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar Corporativo ALTUS */}
      <aside className="w-64 bg-[#142238] text-white border-r border-[#1e3252] flex flex-col hidden md:flex shrink-0 shadow-2xl">
        
        {/* Cabecera con Logotipo ALTUS Base64 100% visible */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-[#142238] border border-white/20 shrink-0 p-1">
            <AltusLogo className="w-full h-full" />
          </div>
          <div>
            <div className="text-xl font-black tracking-wider text-white leading-none">ALTUS</div>
            <div className="text-[10px] text-[#D95A3F] font-bold tracking-widest uppercase mt-1">Checador Digital</div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#D95A3F] text-white shadow-lg shadow-[#D95A3F]/30 font-bold translate-x-1"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Cerrar Sesión Instantáneo */}
        <div className="p-4 border-t border-white/10 bg-[#0e192a]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-rose-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Cabecera Móvil */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#142238] text-white border-b border-white/10 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#142238] border border-white/20 p-0.5">
              <AltusLogo className="w-full h-full" />
            </div>
            <span className="font-bold tracking-wider">ALTUS Checador</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-rose-400 font-bold">Salir</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
