# Notificaciones de Asistencia en Tiempo Real para el Administrador

Este documento describe la arquitectura y funcionamiento del sistema de **notificaciones automáticas para el Administrador del Sistema** en **ALTUS Checador Digital**. Cada vez que un trabajador o usuario registra su **Entrada** o **Salida**, el administrador recibe de inmediato una notificación con los cuatro datos requeridos:
1. **Nómina** (Número de Empleado, ej. `EMP-001`)
2. **Nombre Completo** (ej. `Carlos Mendoza`)
3. **Tipo de Registro** (`ENTRADA` o `SALIDA`)
4. **Hora Oficial del Servidor** (ej. `08:35:10 a. m.`)

---

## 1. Canales de Notificación Integrados

El sistema cuenta con tres canales complementarios para garantizar que el Administrador nunca se pierda un chequeo:

### A. Campana de Notificaciones en la Barra Superior (Header Desktop y Móvil)
- **Ubicación:** Visible en todo momento en la cabecera superior derecha tanto en computadoras de escritorio como en iPhone y iPad.
- **Contador Dinámico:** Badge en color Terracota (`#D95A3F`) que indica la cantidad de checadas no leídas.
- **Centro de Alertas Desplegable:** Al pulsar la campana, se abre un panel con el listado detallado de registros en tiempo real con badges de colores:
  - 🟢 **ENTRADA** (Verde Esmeralda)
  - 🔴 **SALIDA** (Rojo / Terracota)
- **Acciones:** "Marcar leídas", "Limpiar historial" y botones de prueba rápida "+ Entrada" / "+ Salida".

### B. Alerta Emergente Flotante (Toast en Pantalla con Chime Sonoro)
- En cuanto cualquier empleado registra su asistencia (desde el kiosco web, lector de huella o importación), se proyecta una tarjeta flotante en la esquina superior de la pantalla.
- **Sonido Chime Nativo:** Generado mediante la Web Audio API (dos notas armónicas de 587 Hz y 880 Hz estilo iOS) sin depender de archivos de audio externos.
- **Respuesta Háptica:** Vibración en dispositivos móviles compatibles.

### C. Notificaciones del Sistema Operativo (Web Push / iOS PWA / Mac / PC)
- Compatible con **iPhone y iPad (iOS 16.4+)** cuando el checador está agregado a la pantalla de inicio.
- Al pulsar el botón *"Activar"* en el centro de notificaciones, el navegador solicita los permisos del sistema.
- Cuando un trabajador checa, el sistema emite una notificación nativa de iOS / Android / Windows con el logo de ALTUS y el resumen de la checada, incluso con la app en segundo plano.

---

## 2. Puntos de Emisión Automática

Las notificaciones al Administrador se disparan automáticamente desde cualquier canal de captura:
1. **Kiosco de Asistencia Web (`/dashboard/asistencia`):**
   - El trabajador selecciona su nómina o ingresa su número manual y pulsa "Entrada" o "Salida".
   - El endpoint `/api/asistencia` recibe la petición, calcula la tolerancia de 10 min y genera la notificación para el administrador.
2. **Checadores de Huella Digital PUSH (`/api/hardware/push`):**
   - Cuando el biométrico físico envía la trama por red, cada huella procesada genera su respectiva notificación.
3. **Importación de Archivos de Checador (`/dashboard/importar-checador`):**
   - Al cargar archivos `.dat` o `.csv` de ZKTeco, los registros válidos de entrada y salida se notifican en el panel.

---

## 3. Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/notificaciones` | Devuelve la lista de notificaciones recientes y el conteo de no leídas |
| `POST` | `/api/notificaciones` | Registra una nueva notificación manualmente (`nomina`, `nombre`, `tipoRegistro`, `hora`) |
| `PATCH` | `/api/notificaciones` | Acciones: `marcar_todas_leidas` o `limpiar` |
| `POST` | `/api/asistencia` | Registra la asistencia y genera automáticamente la notificación al administrador |

---

*ALTUS Checador Digital — Sistema de Control de Asistencia SaaS*
