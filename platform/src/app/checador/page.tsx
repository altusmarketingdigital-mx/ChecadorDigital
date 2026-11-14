import { Metadata } from "next"
import Link from "next/link"
import { AltusLogo } from "@/components/AltusLogo"
import { PortalColaboradorAsistencia } from "@/components/PortalColaboradorAsistencia"
import { ShieldCheck, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Portal de Asistencia para Colaboradores | ALTUS Checador",
  description: "Registro de entrada y salida con usuario, contraseña y verificación biométrica por rostro o huella.",
}

export default function ChecadorPublicoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1626] via-[#142238] to-[#1e3252] text-slate-100 flex flex-col justify-between p-3 sm:p-6 lg:p-8">
      {/* Barra Superior con Logotipo y Enlace a Admin */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#142238] border border-white/20 p-1 flex items-center justify-center shadow-lg">
            <AltusLogo className="w-full h-full" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white">ALTUS</span>
            <span className="block text-[10px] text-[#D95A3F] font-bold tracking-widest uppercase">
              Terminal de Asistencia
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Acceso Administrador</span>
        </Link>
      </header>

      {/* Núcleo del Checador */}
      <div className="w-full flex-1 flex flex-col justify-center">
        <PortalColaboradorAsistencia modoKiosco={true} />
      </div>

      {/* Pie de Página de Cumplimiento Legal */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cumplimiento Oficial STPS y Ley Federal del Trabajo • Registros con Validez Jurídica</span>
        </div>
        <div className="text-slate-500 font-mono">
          ALTUS Digital v2.4 • Seguridad Biometric SSL
        </div>
      </footer>
    </main>
  )
}
