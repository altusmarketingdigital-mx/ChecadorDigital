import { ReactNode } from "react"
import Link from "next/link"
import { Home, Users, Clock, Settings, ShieldAlert, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">Checador SaaS</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/dashboard" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5 mr-3 text-gray-500" />
                <span>Panel Principal</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/empleados" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <Users className="w-5 h-5 mr-3 text-gray-500" />
                <span>Empleados</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/asistencia" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>Asistencia y Jornadas</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/incidencias" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <ShieldAlert className="w-5 h-5 mr-3 text-gray-500" />
                <span>Incidencias (LFT)</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 md:hidden">
          <span className="text-xl font-bold text-blue-600">Checador SaaS</span>
          {/* Menu icon for mobile would go here */}
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
