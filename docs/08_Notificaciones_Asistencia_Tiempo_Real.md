# Notificaciones de Asistencia en Tiempo Real para el Administrador (App Abierta o Cerrada)

Este documento describe la arquitectura y funcionamiento del sistema de **notificaciones automáticas para el Administrador del Sistema** en **ALTUS Checador Digital**. Cada vez que un trabajador o usuario registra su **Entrada** o **Salida**, el administrador recibe de inmediato una notificación con los cuatro datos requeridos:
1. **Nómina** (Número de Empleado, ej. `EMP-001`)
2. **Nombre Completo** (ej. `Carlos Mendoza`)
3. **Tipo de Registro** (`ENTRADA` o `SALIDA`)
4. **Hora Oficial del Servidor** (ej. `08:35:10 a. m.`)

---

## 1. Funcionamiento con la APLICACIÓN CERRADA (Web Push Protocol RFC 8292 & APNs)

Para que las notificaciones lleguen **incluso si la aplicación está cerrada por completo en el iPhone, iPad, Android o PC y el dispositivo está bloqueado en el bolsillo**:
- Se implementó el estándar **Web Push Protocol (RFC 8030 / RFC 8292)** con pares de llaves criptográficas **VAPID**.
- En **iPhone y iPad (iOS 16.4+)**, Apple permite que las PWAs agregadas a la Pantalla de Inicio despierten el dispositivo en segundo plano.
- **Flujo de Ejecución en Segundo Plano:**
  1. Al pulsar **"Activar"** en la campana de notificaciones, el iPhone genera un token de suscripción con la pasarela de Apple (`web.push.apple.com`).
  2. Este token se guarda en `/api/push/subscribe`.
  3. Cuando cualquier checada ocurre (kiosco web, checador biométrico o carga de archivo), el servidor ejecuta `webpush.sendNotification(...)` directamente a los servidores de Apple APNs y Google FCM.
  4. Los servidores de Apple despiertan el hardware del iPhone en segundo plano, hacen sonar el chime del sistema y encienden la pantalla bloqueada con la tarjeta de notificación:
     - **Título:** `🔔 Checada: ENTRADA - EMP-001`
     - **Mensaje:** `Carlos Mendoza | Nómina: EMP-001 | ENTRADA a las 08:35:10 a. m.`
  5. Al pulsar la notificación en la pantalla bloqueada, el iPhone abre directamente la aplicación en el panel principal.

---

## 2. Canales de Notificación Integrados

El sistema cuenta con tres niveles de alerta:

### A. Notificaciones del Sistema Operativo en Segundo Plano (App Cerrada)
- Llega a la pantalla bloqueada del iPhone / iPad / PC mediante Apple APNs / Google FCM.
- No requiere que la pestaña de Safari o la app estén abiertas en memoria.

### B. Campana de Notificaciones en la Barra Superior (Header Desktop y Móvil)
- Visible en todo momento en la cabecera superior derecha.
- Badge animado en color Terracota (`#D95A3F`) indicando el número de checadas nuevas.
- Historial desplegable en tiempo real con badges 🟢 **ENTRADA** y 🔴 **SALIDA**.

### C. Alerta Emergente Flotante (Toast en Pantalla con Chime Sonoro)
- Alerta visual en primer plano cuando el administrador está usando la plataforma.
- Generador de audio nativo con Web Audio API (chime de confirmación armónico de 587 Hz y 880 Hz).

---

## 3. Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/push/subscribe` | Obtiene la clave pública VAPID y el conteo de dispositivos administradores suscritos |
| `POST` | `/api/push/subscribe` | Registra la suscripción push del iPhone/iPad/PC y envía push de confirmación |
| `GET` | `/api/notificaciones` | Devuelve la lista de notificaciones recientes y el conteo de no leídas |
| `POST` | `/api/notificaciones` | Registra una nueva notificación manualmente |
| `PATCH` | `/api/notificaciones` | Acciones: `marcar_todas_leidas` o `limpiar` |
| `POST` | `/api/asistencia` | Registra la asistencia y despacha automáticamente el Web Push a los iPhones/dispositivos suscritos |

---

*ALTUS Checador Digital — Sistema de Control de Asistencia SaaS*
