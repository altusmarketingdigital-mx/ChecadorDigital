import Link from "next/link"
import { Metadata } from "next"
import { PortalColaboradorAsistencia } from "@/components/PortalColaboradorAsistencia"
import { ExternalLink, KeyRound, Fingerprint, ScanFace, Info, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Portal de Asistencia para Colaboradores | ALTUS",
  description: "Módulo especial para registro de entrada y salida con usuario, contraseña y verificación biométrica.",
}

export default function ChecadorColaboradorDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Encabezado y Botón Kiosco Pantalla Completa */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D95A3F]/10 text-[#D95A3F] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Módulo del Trabajador
            </span>
            <span className="text-xs text-slate-400">• Acceso con Credenciales + Biometría</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#142238] mt-1">
            Portal de Asistencia del Colaborador
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            El trabajador ingresa con su usuario y contraseña/PIN, y confirma su registro con reconocimiento facial o huella digital.
          </p>
        </div>

        <Link
          href="/checador"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 bg-[#D95A3F] hover:bg-[#b8442c] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-[#D95A3F]/25 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <span>Abrir Kiosco en Pantalla Completa</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Tarjeta de Instrucciones para el Administrador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#D95A3F] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">1. Usuario y Contraseña</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              El trabajador ingresa su nómina (ej. <strong>EMP-001</strong>) y contraseña o PIN (por defecto <strong>1234</strong>).
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">2. Rostro o Huella</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Valida su identidad mediante la cámara en vivo o el sensor dactilar digital para evitar suplantaciones.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">3. Entrada / Salida + Alerta</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Al checar, se toma la geolocalización GPS y se emite la notificación push al celular del administrador.
            </p>
          </div>
        </div>
      </div>

      {/* Vista Previa Interactiva del Módulo */}
      <div className="pt-2">
        <PortalColaboradorAsistencia modoKiosco={false} />
      </div>
    </div>
  )
}
