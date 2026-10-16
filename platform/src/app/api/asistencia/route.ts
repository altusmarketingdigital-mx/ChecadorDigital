import { NextResponse } from 'next/server'
import { agregarNotificacion } from '@/lib/notifications'

const catalogoNombres: Record<string, string> = {
  "EMP-001": "Carlos Mendoza",
  "EMP-002": "Lucía García",
  "EMP-003": "Alberto Rivas",
  "EMP-004": "Mariana Solís",
  "EMP-005": "Fernando Torres",
  "1": "Carlos Mendoza",
  "2": "Lucía García",
  "3": "Alberto Rivas",
  "4": "Mariana Solís",
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { empleadoId, tipoEvento, tenantId, nombre } = data
    
    // 1. Obtener la hora oficial del servidor (Seguridad: No confiar en la hora del navegador)
    const fechaHoraEvento = new Date()
    const zonaHorariaEvento = "America/Mexico_City"

    // Tolerancia global de 10 minutos
    const toleranciaMinutos = 10
    let estadoValidacion = "VALIDO"

    // Resolver nombre del empleado si no viene explícito
    const nominaNormalizada = (empleadoId || "EMP-001").trim()
    const nombreFinal = nombre || catalogoNombres[nominaNormalizada] || catalogoNombres[nominaNormalizada.replace(/^EMP-0*/, '')] || `Empleado ${nominaNormalizada}`

    // 2. Notificación en tiempo real para el Administrador del Sistema
    // Indica nómina, nombre, tipo de registro y hora
    const horaFormateada = fechaHoraEvento.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    const fechaFormateada = fechaHoraEvento.toLocaleDateString('es-MX')

    const notificacionCreada = agregarNotificacion({
      nomina: nominaNormalizada,
      nombre: nombreFinal,
      tipoRegistro: tipoEvento,
      hora: horaFormateada,
      fecha: fechaFormateada
    })

    return NextResponse.json({ 
      success: true, 
      mensaje: `Registro de ${tipoEvento} guardado exitosamente.`,
      horaOficial: fechaHoraEvento,
      toleranciaAplicada: toleranciaMinutos,
      notificacion: notificacionCreada
    })

  } catch (error) {
    console.error("Error al registrar asistencia:", error)
    return NextResponse.json({ success: false, error: "Error procesando el registro" }, { status: 500 })
  }
}
