// Catálogo y Manejador de Autenticación de Colaboradores
// Permite que el trabajador ingrese con usuario y contraseña o PIN

export interface ColaboradorCredencial {
  nomina: string
  nombre: string
  usuario: string
  password: string // Contraseña o PIN
  pin: string
  puesto: string
  depto: string
  genero: "m" | "f"
  huellaRegistrada: boolean
  rostroRegistrado: boolean
}

export const CATALOGO_COLABORADORES: ColaboradorCredencial[] = [
  {
    nomina: "EMP-001",
    nombre: "Carlos Mendoza",
    usuario: "carlos.mendoza",
    password: "1234",
    pin: "1234",
    puesto: "Desarrollador Senior",
    depto: "Tecnología",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
  },
  {
    nomina: "EMP-002",
    nombre: "Lucía García",
    usuario: "lucia.garcia",
    password: "1234",
    pin: "1234",
    puesto: "Guardia de Seguridad",
    depto: "Operaciones",
    genero: "f",
    huellaRegistrada: true,
    rostroRegistrado: true,
  },
  {
    nomina: "EMP-003",
    nombre: "Alberto Rivas",
    usuario: "alberto.rivas",
    password: "1234",
    pin: "1234",
    puesto: "Coordinador de Finanzas",
    depto: "Administración",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
  },
  {
    nomina: "EMP-004",
    nombre: "Mariana Solís",
    usuario: "mariana.solis",
    password: "1234",
    pin: "1234",
    puesto: "Generalista de RRHH",
    depto: "Recursos Humanos",
    genero: "f",
    huellaRegistrada: true,
    rostroRegistrado: true,
  },
  {
    nomina: "EMP-005",
    nombre: "Fernando Torres",
    usuario: "fernando.torres",
    password: "1234",
    pin: "1234",
    puesto: "Ejecutivo de Ventas",
    depto: "Comercial",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
  },
]

export function autenticarColaborador(usuarioONomina: string, passwordOPin: string): ColaboradorCredencial | null {
  const query = (usuarioONomina || "").trim().toLowerCase()
  const pass = (passwordOPin || "").trim()

  if (!query || !pass) return null

  // 1. Buscar en catálogo predeterminado
  const encontrado = CATALOGO_COLABORADORES.find((colab) => {
    const coincideUsuario =
      colab.nomina.toLowerCase() === query ||
      colab.usuario.toLowerCase() === query ||
      colab.nomina.toLowerCase().replace(/[^0-9]/g, "") === query.replace(/[^0-9]/g, "")

    const coincidePass = colab.password === pass || colab.pin === pass

    return coincideUsuario && coincidePass
  })

  if (encontrado) return encontrado

  // 2. Si el usuario ingresa una nómina personalizada (ej. "EMP-010" o "104") y la contraseña universal o pin "1234"
  if (query.length >= 2 && (pass === "1234" || pass === "0000" || pass === "admin")) {
    const nominaFormateada = query.startsWith("emp-") ? query.toUpperCase() : `EMP-${query.toUpperCase()}`
    return {
      nomina: nominaFormateada,
      nombre: `Colaborador ${nominaFormateada}`,
      usuario: query,
      password: pass,
      pin: pass,
      puesto: "Colaborador Operativo",
      depto: "Operaciones Generales",
      genero: "m",
      huellaRegistrada: true,
      rostroRegistrado: true,
    }
  }

  return null
}
