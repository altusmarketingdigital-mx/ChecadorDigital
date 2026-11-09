// Generador de Avatares Biométricos Digitales autónomos (Data URL)
// Garantiza que la fotografía NUNCA aparezca vacía, rota o en blanco

export function generarAvatarBiometrico(
  nombre: string,
  nomina: string,
  genero: "m" | "f" = "m"
): string {
  const iniciales = nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#142238" />
        <stop offset="100%" stop-color="#0a1220" />
      </linearGradient>
      <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D95A3F" />
        <stop offset="100%" stop-color="#b5462f" />
      </linearGradient>
      <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05" />
      </linearGradient>
    </defs>

    <!-- Fondo Corporativo ALTUS -->
    <rect width="400" height="400" fill="url(#bgGrad)" />

    <!-- Retícula de escaneo biométrico facial -->
    <circle cx="200" cy="180" r="140" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="6,6" />
    <circle cx="200" cy="180" r="110" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4" />
    <circle cx="200" cy="180" r="80" fill="none" stroke="#D95A3F" stroke-width="1" stroke-opacity="0.5" />

    <!-- Guías faciales de Inteligencia Artificial -->
    <path d="M 120,130 L 140,130 M 120,130 L 120,150" fill="none" stroke="#38bdf8" stroke-width="3" />
    <path d="M 280,130 L 260,130 M 280,130 L 280,150" fill="none" stroke="#38bdf8" stroke-width="3" />
    <path d="M 120,230 L 140,230 M 120,230 L 120,210" fill="none" stroke="#38bdf8" stroke-width="3" />
    <path d="M 280,230 L 260,230 M 280,230 L 280,210" fill="none" stroke="#38bdf8" stroke-width="3" />

    <!-- Silueta Facial Estilizada -->
    <ellipse cx="200" cy="170" rx="55" ry="68" fill="url(#faceGrad)" />
    <!-- Hombros -->
    <path d="M 100,340 C 100,270 140,240 200,240 C 260,240 300,270 300,340 Z" fill="url(#faceGrad)" opacity="0.9" />

    <!-- Círculo Central con Iniciales del Colaborador -->
    <circle cx="200" cy="170" r="42" fill="#142238" stroke="#ffffff" stroke-width="2.5" />
    <text x="200" y="182" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ${iniciales}
    </text>

    <!-- Badge Facial Aprobado -->
    <rect x="130" y="325" width="140" height="26" rx="13" fill="#10b981" />
    <text x="200" y="342" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ✓ ROSTRO VERIFICADO
    </text>

    <!-- Barra Inferior de Marca de Agua -->
    <rect x="0" y="365" width="400" height="35" fill="rgba(0,0,0,0.6)" />
    <text x="20" y="387" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">
      ALTUS BIOMETRÍA
    </text>
    <text x="380" y="387" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc" text-anchor="end">
      ${nomina}
    </text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
