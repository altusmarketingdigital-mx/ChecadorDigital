import { NextResponse } from 'next/server'
import { agregarNotificacion } from '@/lib/notifications'
import { enviarPushATodos } from '@/lib/pushSender'

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
    const { empleadoId, tipoEvento, tenantId, nombre, foto, ubicacion } = data
    
    // 1. Obtener la hora oficial del servidor (Seguridad: No confiar en la hora del navegador)
    const fechaHoraEvento = new Date()
    const zonaHorariaEvento = "America/Mexico_City"

    // Tolerancia global de 10 minutos
    const toleranciaMinutos = 10
    let estadoValidacion = "VALIDO"

    // Resolver nombre del empleado si no viene explícito
    const nominaNormalizada = (empleadoId || "EMP-001").trim()
    const nombreFinal = nombre || catalogoNombres[nominaNormalizada] || catalogoNombres[nominaNormalizada.replace(/^EMP-0*/, '')] || `Empleado ${nominaNormalizada}`

    // 2. Formatear datos de geolocalización satelital (si se proporcionaron)
    let ubicacionNormalizada = undefined
    if (ubicacion && typeof ubicacion.lat === "number" && typeof ubicacion.lng === "number") {
      const mapaUrl = ubicacion.mapaUrl || `https://www.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}`
      ubicacionNormalizada = {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        precision: ubicacion.precision || 10,
        mapaUrl,
        direccionAprox: ubicacion.direccionAprox || `Lat: ${ubicacion.lat.toFixed(5)}, Lng: ${ubicacion.lng.toFixed(5)}`
      }
    }

    // 3. Notificación en tiempo real para el Administrador del Sistema
    // Incluye nómina, nombre, tipo de registro, hora, fotografía capturada y enlace satelital de GPS
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
      fecha: fechaFormateada,
      foto: typeof foto === "string" && foto.length > 10 ? foto : undefined,
      ubicacion: ubicacionNormalizada
    })

    // 4. Despacho Web Push a través de Apple APNs y Google FCM (Llega con App CERRADA)
    let pushBody = `${nombreFinal} | Nómina: ${nominaNormalizada}\n${tipoEvento} a las ${horaFormateada}`
    if (ubicacionNormalizada) {
      pushBody += `\n📍 Ubicación: Lat ${ubicacionNormalizada.lat.toFixed(4)}, Lng ${ubicacionNormalizada.lng.toFixed(4)}`
    }
    if (foto) {
      pushBody += `\n📸 Fotografía facial adjunta`
    }

    enviarPushATodos({
      title: `🔔 Checada: ${tipoEvento} - ${nominaNormalizada}`,
      body: pushBody,
      nomina: nominaNormalizada,
      nombre: nombreFinal,
      tipoRegistro: tipoEvento,
      hora: horaFormateada,
      foto: typeof foto === "string" && foto.startsWith("http") ? foto : undefined,
      mapaUrl: ubicacionNormalizada?.mapaUrl || "/dashboard",
      lat: ubicacionNormalizada?.lat,
      lng: ubicacionNormalizada?.lng,
      url: "/dashboard"
    }).catch((pushErr) => {
      console.log("Error silencioso en Web Push:", pushErr)
    })

    return NextResponse.json({ 
      success: true, 
      mensaje: `Registro de ${tipoEvento} guardado exitosamente con fotografía y geolocalización.`,
      horaOficial: fechaHoraEvento,
      toleranciaAplicada: toleranciaMinutos,
      notificacion: notificacionCreada
    })

  } catch (error) {
    console.error("Error al registrar asistencia:", error)
    return NextResponse.json({ success: false, error: "Error procesando el registro" }, { status: 500 })
  }
}
