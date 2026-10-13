"use client"
import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, Users, Clock, Settings2, ShieldAlert, Cpu, 
  FileSpreadsheet, Scale, FileCheck, LogOut, Menu, X 
} from "lucide-react"
import { AltusLogo } from "@/components/AltusLogo"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

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
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR DE ESCRITORIO (md y superior) */}
      <aside className="w-64 bg-[#142238] text-white border-r border-[#1e3252] flex flex-col hidden md:flex shrink-0 shadow-2xl z-20">
        
        {/* Cabecera con Logotipo ALTUS */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-[#142238] border border-white/20 shrink-0 p-1">
            <AltusLogo className="w-full h-full" />
          </div>
          <div>
            <div className="text-xl font-black tracking-wider text-white leading-none">ALTUS</div>
            <div className="text-[10px] text-[#D95A3F] font-bold tracking-widest uppercase mt-1">Checador Digital</div>
          </div>
        </div>

        {/* Navegación de Escritorio */}
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

        {/* Cerrar Sesión */}
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

      {/* 2. MENÚ MÓVIL (DRAWER DESPLEGABLE) */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Fondo oscuro traslúcido */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMenuMovilAbierto(false)} 
          />
          
          {/* Panel Lateral Móvil */}
          <div className="relative w-4/5 max-w-xs bg-[#142238] text-white h-full flex flex-col shadow-2xl z-10">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#142238] border border-white/20 p-0.5">
                  <AltusLogo className="w-full h-full" />
                </div>
                <span className="font-extrabold text-base tracking-wider text-white">ALTUS Checador</span>
              </div>
              <button 
                onClick={() => setMenuMovilAbierto(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lista de menús en móvil */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuMovilAbierto(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#D95A3F] text-white font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 text-white" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Botón Salir en menú móvil */}
            <div className="p-4 border-t border-white/10 bg-[#0e192a]">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-rose-400 rounded-xl hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Cabecera Móvil y Tablet (con Botón de Menú Hamburguesa) */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#142238] text-white border-b border-white/10 md:hidden shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            {/* BOTÓN HAMBURGUESA PARA ABRIR MENÚ */}
            <button 
              onClick={() => setMenuMovilAbierto(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white focus:outline-none active:scale-95 transition-all"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#142238] border border-white/20 p-0.5">
                <AltusLogo className="w-full h-full" />
              </div>
              <span className="font-bold tracking-wider text-sm sm:text-base">ALTUS Checador</span>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-colors"
          >
            Salir
          </button>
        </header>

        {/* Área scrolleable de las vistas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
