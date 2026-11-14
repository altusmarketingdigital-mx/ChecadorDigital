import { NextResponse } from 'next/server'
import { autenticarColaborador, CATALOGO_COLABORADORES } from '@/lib/colaboradores'
import { generarAvatarBiometrico } from '@/lib/avatarHelper'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usuario, password } = body

    if (!usuario || !password) {
      return NextResponse.json(
        { success: false, error: "Ingresa tu número de nómina/usuario y contraseña" },
        { status: 400 }
      )
    }

    const colaborador = autenticarColaborador(usuario, password)

    if (!colaborador) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Credenciales incorrectas. Verifica tu nómina/usuario y contraseña (PIN por defecto: 1234)." 
        },
        { status: 401 }
      )
    }

    const fotoBiometrica = generarAvatarBiometrico(colaborador.nombre, colaborador.nomina, colaborador.genero)

    return NextResponse.json({
      success: true,
      mensaje: `¡Bienvenido, ${colaborador.nombre}!`,
      colaborador: {
        nomina: colaborador.nomina,
        nombre: colaborador.nombre,
        puesto: colaborador.puesto,
        depto: colaborador.depto,
        foto: fotoBiometrica,
        huellaRegistrada: colaborador.huellaRegistrada,
        rostroRegistrado: colaborador.rostroRegistrado,
      }
    })
  } catch (error) {
    console.error("Error en auth de colaborador:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor de autenticación" }, { status: 500 })
  }
}

// Endpoint GET para listar colaboradores de ejemplo para acceso rápido en la terminal
export async function GET() {
  const lista = CATALOGO_COLABORADORES.map(c => ({
    nomina: c.nomina,
    nombre: c.nombre,
    usuario: c.usuario,
    puesto: c.puesto,
    depto: c.depto,
    foto: generarAvatarBiometrico(c.nombre, c.nomina, c.genero)
  }))
  return NextResponse.json({ success: true, colaboradores: lista })
}
