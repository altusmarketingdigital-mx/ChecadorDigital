// Catálogo y Manejador de Autenticación de Colaboradores
// Permite que el trabajador ingrese con usuario y contraseña o PIN asignado

export interface ColaboradorCredencial {
  nomina: string
  nombre: string
  usuario: string
  password: string // Contraseña o PIN asignado por el Administrador
  pin: string
  puesto: string
  depto: string
  jornada?: string
  genero: "m" | "f"
  huellaRegistrada: boolean
  rostroRegistrado: boolean
  estado?: string
}

export const CATALOGO_COLABORADORES_INICIAL: ColaboradorCredencial[] = [
  {
    nomina: "EMP-001",
    nombre: "Carlos Mendoza",
    usuario: "carlos.mendoza",
    password: "1234",
    pin: "1234",
    puesto: "Desarrollador Senior",
    depto: "Tecnología",
    jornada: "Diurna (8:00 - 17:00)",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  },
  {
    nomina: "EMP-002",
    nombre: "Lucía García",
    usuario: "lucia.garcia",
    password: "1234",
    pin: "1234",
    puesto: "Guardia de Seguridad",
    depto: "Operaciones",
    jornada: "Nocturna (20:00 - 04:00)",
    genero: "f",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  },
  {
    nomina: "EMP-003",
    nombre: "Alberto Rivas",
    usuario: "alberto.rivas",
    password: "1234",
    pin: "1234",
    puesto: "Coordinador de Finanzas",
    depto: "Administración",
    jornada: "Diurna (8:00 - 17:00)",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  },
  {
    nomina: "EMP-004",
    nombre: "Mariana Solís",
    usuario: "mariana.solis",
    password: "1234",
    pin: "1234",
    puesto: "Generalista de RRHH",
    depto: "Recursos Humanos",
    jornada: "Diurna (8:00 - 17:00)",
    genero: "f",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  },
  {
    nomina: "EMP-005",
    nombre: "Fernando Torres",
    usuario: "fernando.torres",
    password: "1234",
    pin: "1234",
    puesto: "Ejecutivo de Ventas",
    depto: "Comercial",
    jornada: "Mixta (14:00 - 21:30)",
    genero: "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  },
]

export const CATALOGO_COLABORADORES = CATALOGO_COLABORADORES_INICIAL

// Usamos globalThis para persistencia entre requests en el runtime de Next.js
const globalStore = globalThis as unknown as {
  __altus_colaboradores__?: ColaboradorCredencial[]
}

if (!globalStore.__altus_colaboradores__) {
  globalStore.__altus_colaboradores__ = [...CATALOGO_COLABORADORES_INICIAL]
}

export function obtenerColaboradores(): ColaboradorCredencial[] {
  if (!globalStore.__altus_colaboradores__ || globalStore.__altus_colaboradores__.length === 0) {
    globalStore.__altus_colaboradores__ = [...CATALOGO_COLABORADORES_INICIAL]
  }
  return globalStore.__altus_colaboradores__
}

export function agregarColaborador(datos: {
  nomina?: string
  nombre: string
  puesto: string
  depto: string
  jornada?: string
  password?: string
  pin?: string
  genero?: "m" | "f"
}): ColaboradorCredencial {
  const lista = obtenerColaboradores()
  
  // Generar nómina si no se especifica
  let nominaFinal = (datos.nomina || "").trim().toUpperCase()
  if (!nominaFinal) {
    nominaFinal = `EMP-00${lista.length + 1}`
  }

  const passwordFinal = (datos.password || datos.pin || "1234").trim()

  const nuevo: ColaboradorCredencial = {
    nomina: nominaFinal,
    nombre: datos.nombre.trim(),
    usuario: nominaFinal.toLowerCase(),
    password: passwordFinal,
    pin: passwordFinal,
    puesto: datos.puesto.trim(),
    depto: datos.depto.trim(),
    jornada: datos.jornada || "Diurna (8:00 - 17:00)",
    genero: datos.genero || "m",
    huellaRegistrada: true,
    rostroRegistrado: true,
    estado: "Activo"
  }

  // Si ya existía con la misma nómina, actualizarlo
  const idx = lista.findIndex(c => c.nomina.toUpperCase() === nominaFinal)
  if (idx >= 0) {
    lista[idx] = nuevo
  } else {
    lista.push(nuevo)
  }

  return nuevo
}

export function autenticarColaborador(usuarioONomina: string, passwordOPin: string): ColaboradorCredencial | null {
  const query = (usuarioONomina || "").trim().toLowerCase()
  const pass = (passwordOPin || "").trim()

  if (!query || !pass) return null

  const lista = obtenerColaboradores()

  // 1. Buscar en colaboradores registrados y validar contraseña/PIN exacto
  const encontrado = lista.find((colab) => {
    const coincideUsuario =
      colab.nomina.toLowerCase() === query ||
      colab.usuario.toLowerCase() === query ||
      colab.nomina.toLowerCase().replace(/[^0-9]/g, "") === query.replace(/[^0-9]/g, "")

    const coincidePass = colab.password === pass || colab.pin === pass

    return coincideUsuario && coincidePass
  })

  if (encontrado) return encontrado

  // 2. Soporte para nómina de prueba o acceso con contraseña universal
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
