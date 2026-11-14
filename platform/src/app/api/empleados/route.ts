import { NextResponse } from 'next/server'
import { obtenerColaboradores, agregarColaborador } from '@/lib/colaboradores'

export async function GET() {
  const lista = obtenerColaboradores()
  return NextResponse.json({ success: true, empleados: lista })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, puesto, depto, jornada, password, pin, nomina } = body

    if (!nombre || !puesto) {
      return NextResponse.json(
        { success: false, error: "El nombre y el puesto son obligatorios" },
        { status: 400 }
      )
    }

    const nuevo = agregarColaborador({
      nomina,
      nombre,
      puesto,
      depto: depto || "Tecnología",
      jornada: jornada || "Diurna (8:00 - 17:00)",
      password: password || pin || "1234",
      pin: pin || password || "1234"
    })

    return NextResponse.json({
      success: true,
      mensaje: `Empleado ${nuevo.nombre} (${nuevo.nomina}) registrado con éxito con su contraseña de acceso.`,
      empleado: nuevo
    })
  } catch (error) {
    console.error("Error al registrar empleado:", error)
    return NextResponse.json({ success: false, error: "Error al guardar empleado" }, { status: 500 })
  }
}
