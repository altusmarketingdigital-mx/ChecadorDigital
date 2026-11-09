# Notificaciones de Asistencia en Tiempo Real con Fotografía y Ubicación GPS

Este documento describe la arquitectura y funcionamiento del sistema de **verificación facial fotográfica y geolocalización satelital en tiempo real** de **ALTUS Checador Digital**, así como su integración con las **notificaciones automáticas para el Administrador del Sistema**.

Cada vez que un colaborador registra su **Entrada** o **Salida**, el sistema captura instantáneamente su fotografía facial, obtiene sus coordenadas satelitales GPS y notifica de inmediato al administrador con los 6 datos clave:
1. **Nómina** (Número de Empleado, ej. `EMP-001`)
2. **Nombre Completo** (ej. `Carlos Mendoza`)
3. **Tipo de Registro** (`ENTRADA` o `SALIDA`)
4. **Hora Oficial del Servidor** (ej. `08:35:10 a. m.`)
5. **Fotografía Facial de Verificación** (capturada en vivo con marca de agua inmutable)
6. **Ubicación GPS Satelital** (coordenadas de latitud/longitud, radio de precisión y botón directo a Google Maps)

---

## 1. Captura Fotográfica Facial en Vivo (Anti-Suplantación)

- **Visor en Vivo:** Al acceder al Kiosco de Asistencia (`/dashboard/asistencia`), el sistema enciende automáticamente la cámara frontal del dispositivo (iPhone, iPad, Android o PC).
- **Guía Facial de Alineación:** Se proyecta una elipse dinámica que asiste al colaborador para encuadrar su rostro.
- **Captura Automática al Checar:** En el momento exacto en que el colaborador pulsa **"Entrada"** o **"Salida"**, el sistema dispara un flash visual y extrae el fotograma del video en formato JPEG comprimido de alta definición (con marca de agua criptográfica de fecha y hora oficial).
- **Soporte Multi-Cámara:** Permite alternar instantáneamente entre cámara frontal y trasera en dispositivos móviles, o subir una fotografía de respaldo si la cámara estuviera temporalmente bloqueada.

---

## 2. Geolocalización Satelital GPS (Google Maps)

- **Detección de Alta Precisión:** Utiliza la API nativa `navigator.geolocation` con `enableHighAccuracy: true` para triangular la posición satelital del trabajador con precisión submétrica (±5 a ±15 metros).
- **Enlace Directo a Google Maps:** Cada registro incluye el enlace `https://www.google.com/maps?q={lat},{lng}` para que el Administrador pueda visualizar en el mapa el punto exacto donde se encontraba el empleado al momento de checar.
- **Auditoría Forense STPS:** Registra la latitud, longitud y precisión dentro de la bitácora de asistencia inmutable.

---

## 3. Experiencia de Notificación para el Administrador

Las fotografías y ubicaciones se presentan de manera limpia y accesible en tres canales:

### A. Campana de Notificaciones (Barra Superior)
- Muestra la miniatura fotográfica facial de cada registro en la lista.
- **Click para Ampliar Foto:** Al pulsar sobre la miniatura, se abre un visor en alta definición con la foto completa, los datos del trabajador y el botón de Google Maps.
- **Botón `[📍 Ver en Google Maps]`**: Abre directamente el mapa en una pestaña nueva con el punto satelital marcado.

### B. Alerta Emergente Flotante (Toast con Sonido)
- Cuando ocurre un registro mientras el Administrador está navegando en el sistema, aparece la tarjeta flotante en la esquina superior con:
  - Miniatura de la selfie recién capturada.
  - Nombre, Nómina, Evento y Hora.
  - Botón directo `[📍 Ver en Google Maps]`.

### C. Notificaciones Push en Segundo Plano (App Cerrada en iPhone / Android / PC)
- Envía una alerta nativa al iPhone bloqueado vía Apple Push Notification service (APNs):
  - **Título:** `🔔 Checada: ENTRADA - EMP-001`
  - **Cuerpo:** `Carlos Mendoza | Nómina: EMP-001\nENTRADA a las 08:35:10 a. m.\n📍 Ubicación: Lat 19.4326, Lng -99.1332\n📸 Fotografía facial adjunta`
  - Al pulsar la notificación en la pantalla de bloqueo, se abre la aplicación directamente para inspeccionar la fotografía y el mapa.

---

## 4. Endpoints de la API

| Método | Endpoint | Parámetros Clave | Descripción |
|---|---|---|---|
| `POST` | `/api/asistencia` | `empleadoId`, `tipoEvento`, `foto`, `ubicacion` | Procesa la checada, adjunta foto y GPS, y despacha notificaciones |
| `GET` | `/api/notificaciones` | — | Devuelve el historial reciente con fotos y coordenadas |
| `POST` | `/api/push/subscribe` | `subscription` | Registra el dispositivo del administrador para recibir push en segundo plano |

---

*ALTUS Checador Digital — Sistema de Control de Asistencia SaaS*
