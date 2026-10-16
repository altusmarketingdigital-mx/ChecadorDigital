import { NextResponse } from "next/server"
import {
  obtenerNotificaciones,
  agregarNotificacion,
  marcarTodasComoLeidas,
  limpiarNotificaciones,
} from "@/lib/notifications"

export async function GET() {
  try {
    const notificaciones = obtenerNotificaciones()
    const totalNoLeidas = notificaciones.filter((n) => !n.leido).length

    return NextResponse.json({
      success: true,
      totalNoLeidas,
      notificaciones,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al consultar notificaciones" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nomina, nombre, tipoRegistro, hora, fecha } = body

    if (!tipoRegistro) {
      return NextResponse.json(
        { success: false, error: "El tipo de registro es requerido (ENTRADA o SALIDA)." },
        { status: 400 }
      )
    }

    const nueva = agregarNotificacion({
      nomina: nomina || "EMP-001",
      nombre: nombre || "Empleado General",
      tipoRegistro,
      hora,
      fecha,
    })

    return NextResponse.json({
      success: true,
      mensaje: "Notificación registrada con éxito",
      notificacion: nueva,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al registrar la notificación" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { accion } = body

    if (accion === "marcar_todas_leidas") {
      marcarTodasComoLeidas()
      return NextResponse.json({ success: true, mensaje: "Notificaciones marcadas como leídas" })
    }

    if (accion === "limpiar") {
      limpiarNotificaciones()
      return NextResponse.json({ success: true, mensaje: "Historial de notificaciones limpiado" })
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al actualizar notificaciones" },
      { status: 500 }
    )
  }
}
