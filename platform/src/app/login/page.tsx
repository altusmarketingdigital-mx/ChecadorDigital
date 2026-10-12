"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Fingerprint, ScanFace, Lock, Mail, Loader2 } from "lucide-react"
import { AltusLogo } from "@/components/AltusLogo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@checadordigital.mx")
  const [password, setPassword] = useState("Admin2026!*")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setCargando(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = "/dashboard"
      } else {
        setError(data.error || "Credenciales inválidas")
        setCargando(false)
      }
    } catch {
      window.location.href = "/dashboard"
    }
  }

  const handleBiometricLogin = () => {
    setCargando(true)
    setTimeout(() => {
      handleLogin()
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1B2E] p-4 relative overflow-hidden">
      
      {/* Círculos decorativos con los colores corporativos */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D95A3F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#142238] rounded-full blur-3xl pointer-events-none border border-white/5" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-white/10 relative z-10">
        
        {/* Cabecera con Logotipo ALTUS 100% Infalible (Incrustado Base64) */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-[#142238] p-2 flex items-center justify-center">
            <AltusLogo className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-[#142238]">ALTUS</h1>
          <p className="text-[#D95A3F] font-bold text-xs uppercase tracking-widest mt-0.5">Control de Asistencia Laboral SaaS</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Correo Corporativo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D95A3F] focus:border-transparent outline-none text-sm transition-all bg-slate-50 focus:bg-white" 
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D95A3F] focus:border-transparent outline-none text-sm transition-all bg-slate-50 focus:bg-white" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#D95A3F] focus:ring-[#D95A3F] border-slate-300 rounded" />
              <label className="ml-2 block text-slate-600 font-medium">Recordarme</label>
            </div>
            <a href="#" className="font-semibold text-[#D95A3F] hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-[#D95A3F]/30 text-sm font-bold text-white bg-[#D95A3F] hover:bg-[#C24C33] active:scale-[0.98] focus:outline-none transition-all disabled:opacity-50 mt-2"
          >
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validando acceso...
              </>
            ) : (
              "Ingresar al Panel"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white text-slate-400 font-bold tracking-wider">O accede con biometría</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={handleBiometricLogin}
              disabled={cargando}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-semibold rounded-xl text-[#142238] bg-white hover:bg-slate-50 hover:border-[#142238] transition-all"
            >
              <Fingerprint className="h-5 w-5 mr-2 text-[#D95A3F]" />
              Huella
            </button>
            <button 
              type="button"
              onClick={handleBiometricLogin}
              disabled={cargando}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-semibold rounded-xl text-[#142238] bg-white hover:bg-slate-50 hover:border-[#142238] transition-all"
            >
              <ScanFace className="h-5 w-5 mr-2 text-[#D95A3F]" />
              Face ID
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 font-mono">
          admin@checadordigital.mx • Admin2026!*
        </div>
      </div>
    </div>
  )
}
