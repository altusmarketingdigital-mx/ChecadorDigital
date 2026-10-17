import { NextResponse } from "next/server"
import {
  guardarSuscripcion,
  obtenerTotalSuscripciones,
  VAPID_PUBLIC_KEY,
  enviarPushATodos,
} from "@/lib/pushSender"

export async function GET() {
  return NextResponse.json({
    success: true,
    vapidPublicKey: VAPID_PUBLIC_KEY,
    totalSuscripciones: obtenerTotalSuscripciones(),
  })
}

export async function POST(request: Request) {
  try {
    const subscription = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: "Objeto de suscripción inválido" },
        { status: 400 }
      )
    }

    guardarSuscripcion(subscription)

    // Enviar notificación de bienvenida y prueba para confirmar que el dispositivo recibe push cerrado
    try {
      await enviarPushATodos({
        title: "🔔 ALTUS: Push en Segundo Plano Conectado",
        body: "¡Listo! Recibirás notificaciones de cada entrada y salida incluso con la app cerrada.",
        url: "/dashboard",
      })
    } catch (pushErr) {
      console.log("No se pudo enviar push inicial de prueba:", pushErr)
    }

    return NextResponse.json({
      success: true,
      mensaje: "Dispositivo suscrito exitosamente a notificaciones push en segundo plano.",
      totalActivas: obtenerTotalSuscripciones(),
    })
  } catch (error) {
    console.error("Error al procesar suscripción push:", error)
    return NextResponse.json(
      { success: false, error: "Error al guardar la suscripción push" },
      { status: 500 }
    )
  }
}
