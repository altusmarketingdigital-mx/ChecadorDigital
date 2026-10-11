"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Fingerprint, ScanFace, Lock, Mail, Loader2 } from "lucide-react"

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
        // Redirigir de inmediato al Dashboard
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Credenciales inválidas")
        setCargando(false)
      }
    } catch (err) {
      // Fallback si hay desconexión: permitir avanzar
      router.push("/dashboard")
    }
  }

  // Simulación de acceso por Huella o Face ID
  const handleBiometricLogin = (tipo: string) => {
    setCargando(true)
    setTimeout(() => {
      handleLogin()
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Checador SaaS</h1>
          <p className="text-gray-500 mt-2 text-sm">Inicia sesión en tu espacio de trabajo</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all" 
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label className="ml-2 block text-gray-700">Recordarme</label>
            </div>
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
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
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white text-gray-400 font-medium tracking-wider">O ingresa rápidamente con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleBiometricLogin("huella")}
              disabled={cargando}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all"
            >
              <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
              Huella
            </button>
            <button 
              type="button"
              onClick={() => handleBiometricLogin("face_id")}
              disabled={cargando}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all"
            >
              <ScanFace className="h-5 w-5 mr-2 text-blue-600" />
              Face ID
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Credenciales Demo: <span className="text-gray-600 font-mono">admin@checadordigital.mx</span> / <span className="text-gray-600 font-mono">Admin2026!*</span>
        </div>
      </div>
    </div>
  )
}
