import webpush from "web-push"

// Claves VAPID oficiales para el estándar RFC 8292 / Apple APNs Web Push
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BE25dPXFzn5rbcCwKf-x3rbGj7IybFTD6OSM-X2br-58XRP5qPSSLBPNkqfOFT7YRNhsbQbtt55T8nDlpM0o3dM"

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "L-hgihc8CuwHXQPD11Qs39KnylF6OL-TkLoa2dpGQ9s"

export const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:soporte@checadordigital.mx"

// Configurar webpush globalmente
try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
} catch (e) {
  console.log("Error inicializando VAPID en webpush:", e)
}

export interface PushPayload {
  title: string
  body: string
  nomina?: string
  nombre?: string
  tipoRegistro?: string
  hora?: string
  url?: string
}

// Almacén en memoria global para suscripciones de administradores
const globalStore = globalThis as unknown as {
  __altus_push_subscriptions__?: webpush.PushSubscription[]
}

if (!globalStore.__altus_push_subscriptions__) {
  globalStore.__altus_push_subscriptions__ = []
}

export function guardarSuscripcion(sub: webpush.PushSubscription): boolean {
  if (!globalStore.__altus_push_subscriptions__) {
    globalStore.__altus_push_subscriptions__ = []
  }

  // Evitar duplicados por endpoint
  const existe = globalStore.__altus_push_subscriptions__.some(
    (s) => s.endpoint === sub.endpoint
  )

  if (!existe) {
    globalStore.__altus_push_subscriptions__.push(sub)
    console.log(
      `[Push] Nueva suscripción guardada. Total activas: ${globalStore.__altus_push_subscriptions__.length}`
    )
    return true
  }

  return false
}

export function obtenerTotalSuscripciones(): number {
  return globalStore.__altus_push_subscriptions__?.length || 0
}

export async function enviarPushATodos(
  payload: PushPayload
): Promise<{ exitosos: number; fallidos: number; total: number }> {
  const suscripciones = globalStore.__altus_push_subscriptions__ || []
  if (suscripciones.length === 0) {
    console.log("[Push] No hay dispositivos administradores suscritos para push.")
    return { exitosos: 0, fallidos: 0, total: 0 }
  }

  const payloadString = JSON.stringify({
    title: payload.title || "ALTUS Checador",
    body: payload.body,
    nomina: payload.nomina,
    nombre: payload.nombre,
    tipoRegistro: payload.tipoRegistro,
    hora: payload.hora,
    url: payload.url || "/dashboard",
  })

  let exitosos = 0
  let fallidos = 0
  const suscripcionesValidas: webpush.PushSubscription[] = []

  for (const sub of suscripciones) {
    try {
      await webpush.sendNotification(sub, payloadString, {
        TTL: 60 * 60 * 24, // 24 horas de vigencia en los servidores de Apple/Google
        urgency: "high",
      })
      exitosos++
      suscripcionesValidas.push(sub)
    } catch (err: unknown) {
      fallidos++
      const statusCode = (err as { statusCode?: number })?.statusCode
      console.log(`[Push] Error enviando a ${sub.endpoint.slice(0, 40)}... Status: ${statusCode}`)
      
      // Si el código es 410 (Gone) o 404 (Not Found), el usuario desinstaló la app o revocó permiso
      if (statusCode !== 410 && statusCode !== 404) {
        // Conservar si es un error temporal
        suscripcionesValidas.push(sub)
      }
    }
  }

  // Actualizar lista eliminando tokens muertos
  globalStore.__altus_push_subscriptions__ = suscripcionesValidas

  console.log(`[Push] Envío finalizado. Éxito: ${exitosos}, Fallos: ${fallidos}`)
  return { exitosos, fallidos, total: suscripciones.length }
}
