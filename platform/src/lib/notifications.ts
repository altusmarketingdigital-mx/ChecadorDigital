// Almacén en memoria global para Notificaciones de Asistencia en Tiempo Real
export interface UbicacionRegistro {
  lat: number
  lng: number
  precision?: number
  mapaUrl: string
  direccionAprox?: string
}

export interface NotificacionAsistencia {
  id: string
  nomina: string
  nombre: string
  tipoRegistro: "ENTRADA" | "SALIDA" | "INICIO_PAUSA" | "FIN_PAUSA" | string
  hora: string
  fecha: string
  timestamp: number
  leido: boolean
  foto?: string // Fotografía capturada al momento del registro (Base64 JPEG)
  ubicacion?: UbicacionRegistro // Geolocalización satelital (GPS + Google Maps)
}

// Inicializamos con checadas recientes de ejemplo con fotos y ubicación de muestra
const notificacionesIniciales: NotificacionAsistencia[] = [
  {
    id: "notif-init-1",
    nomina: "EMP-001",
    nombre: "Carlos Mendoza",
    tipoRegistro: "ENTRADA",
    hora: "08:02:14 a. m.",
    fecha: new Date().toLocaleDateString("es-MX"),
    timestamp: Date.now() - 1000 * 60 * 15, // Hace 15 minutos
    leido: false,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    ubicacion: {
      lat: 19.4326,
      lng: -99.1332,
      precision: 12,
      mapaUrl: "https://www.google.com/maps?q=19.4326,-99.1332",
      direccionAprox: "Paseo de la Reforma / CDMX"
    }
  },
  {
    id: "notif-init-2",
    nomina: "EMP-002",
    nombre: "Lucía García",
    tipoRegistro: "ENTRADA",
    hora: "08:14:30 a. m.",
    fecha: new Date().toLocaleDateString("es-MX"),
    timestamp: Date.now() - 1000 * 60 * 5, // Hace 5 minutos
    leido: false,
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    ubicacion: {
      lat: 19.4270,
      lng: -99.1677,
      precision: 8,
      mapaUrl: "https://www.google.com/maps?q=19.4270,-99.1677",
      direccionAprox: "Zona Corporativa Insurgentes Sur"
    }
  },
]

// Usamos globalThis para persistir entre recargas del runtime de Next.js en el servidor
const globalStore = globalThis as unknown as {
  __altus_notificaciones__?: NotificacionAsistencia[]
}

if (!globalStore.__altus_notificaciones__) {
  globalStore.__altus_notificaciones__ = notificacionesIniciales
}

export function obtenerNotificaciones(): NotificacionAsistencia[] {
  return globalStore.__altus_notificaciones__ || []
}

export function agregarNotificacion(datos: {
  nomina: string
  nombre: string
  tipoRegistro: string
  hora?: string
  fecha?: string
  foto?: string
  ubicacion?: UbicacionRegistro
}): NotificacionAsistencia {
  const now = new Date()
  const horaFormateada =
    datos.hora ||
    now.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  const fechaFormateada = datos.fecha || now.toLocaleDateString("es-MX")

  const nueva: NotificacionAsistencia = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nomina: datos.nomina || "EMP-000",
    nombre: datos.nombre || "Empleado",
    tipoRegistro: datos.tipoRegistro,
    hora: horaFormateada,
    fecha: fechaFormateada,
    timestamp: now.getTime(),
    leido: false,
    foto: datos.foto,
    ubicacion: datos.ubicacion,
  }

  if (!globalStore.__altus_notificaciones__) {
    globalStore.__altus_notificaciones__ = []
  }

  // Insertar al inicio de la lista (más reciente primero) y limitar a las últimas 100
  globalStore.__altus_notificaciones__.unshift(nueva)
  if (globalStore.__altus_notificaciones__.length > 100) {
    globalStore.__altus_notificaciones__ = globalStore.__altus_notificaciones__.slice(0, 100)
  }

  return nueva
}

export function marcarTodasComoLeidas(): void {
  if (globalStore.__altus_notificaciones__) {
    globalStore.__altus_notificaciones__.forEach((n) => {
      n.leido = true
    })
  }
}

export function limpiarNotificaciones(): void {
  if (globalStore.__altus_notificaciones__) {
    globalStore.__altus_notificaciones__ = []
  }
}
