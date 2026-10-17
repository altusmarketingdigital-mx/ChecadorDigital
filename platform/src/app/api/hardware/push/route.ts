import { NextResponse } from 'next/server'
import { agregarNotificacion } from '@/lib/notifications'
import { enviarPushATodos } from '@/lib/pushSender'

const nombresHardware: Record<string, string> = {
  "1": "Carlos Mendoza",
  "2": "Lucía García",
  "3": "Alberto Rivas",
  "4": "Mariana Solís",
  "105": "Fernando Torres"
}

// Simulación de nuestro adaptador para checadores de huella (Ej. Protocolo Push / ADMS)
export async function POST(request: Request) {
  try {
    // 1. Validar la procedencia de la petición
    const url = new URL(request.url)
    const numeroSerie = url.searchParams.get('SN') // El lector de huella envía su Serial Number
    
    if (!numeroSerie) {
      return NextResponse.json({ error: "Dispositivo no identificado" }, { status: 401 })
    }

    // 2. Extraer el bloque de datos que envía el lector
    const body = await request.text()
    
    // El protocolo push suele enviar datos en texto plano delimitado por tabulaciones o JSON
    // Ej: "105    2026-10-10 08:55:00    1" (ID Empleado, Fecha/Hora del lector, Tipo)
    const lineas = body.split('\n').filter(linea => linea.trim() !== '')

    let registrosProcesados = 0;
    const eventosPendientes = [];

    // 3. Procesar cada huella capturada por el lector
    for (const linea of lineas) {
      const [empleadoId, fechaHoraDispositivo, tipoEventoFisico] = linea.split('\t')
      const empIdTrim = (empleadoId || "").trim()

      // Identificar si es sincronización retrasada (el dispositivo perdió internet)
      const fechaLector = new Date(fechaHoraDispositivo || new Date())
      const fechaServidor = new Date()
      
      const diferenciaHoras = Math.abs(fechaServidor.getTime() - fechaLector.getTime()) / 36e5
      const esOffline = diferenciaHoras > 1 // Si tiene más de 1 hora de diferencia, estaba offline
      const tipoEvento = tipoEventoFisico === '1' ? 'ENTRADA' : 'SALIDA'

      // Generar notificación para el administrador
      const nombreEmp = nombresHardware[empIdTrim] || `Colaborador #${empIdTrim}`
      const horaStr = fechaLector.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      const nominaStr = `EMP-${empIdTrim.padStart(3, '0')}`

      agregarNotificacion({
        nomina: nominaStr,
        nombre: nombreEmp,
        tipoRegistro: tipoEvento,
        hora: horaStr,
        fecha: fechaLector.toLocaleDateString('es-MX')
      })

      // Notificación push con la app cerrada
      enviarPushATodos({
        title: `🔔 Checada Biimétrica: ${tipoEvento} - ${nominaStr}`,
        body: `${nombreEmp} | Nómina: ${nominaStr}\n${tipoEvento} a las ${horaStr}`,
        nomina: nominaStr,
        nombre: nombreEmp,
        tipoRegistro: tipoEvento,
        hora: horaStr,
        url: "/dashboard"
      }).catch(() => {})

      // Armar el evento estandarizado para nuestra Base de Datos
      eventosPendientes.push({
        numeroSerieDispositivo: numeroSerie,
        empleadoId: empIdTrim,
        fechaHoraEvento: fechaLector, // Respetamos la hora en la que puso la huella
        fechaRecepcionServidor: fechaServidor, // Registramos la hora real en que llegó a la nube
        tipoEvento,
        metodoRegistro: 'BIOMETRICO',
        // Si estaba offline, generamos una alerta de validación para RH
        estadoValidacion: esOffline ? 'PENDIENTE_REVISION' : 'VALIDO' 
      })

      registrosProcesados++;
    }

    // 4. Inserción a la Base de Datos (Manejo de duplicados)
    // En producción, este bloque se enviaría a una COLA (Redis) para no colapsar la DB
    /*
      for(let evento of eventosPendientes) {
        const existe = await prisma.registroAsistencia.findFirst({
          where: { empleadoId: evento.empleadoId, fechaHoraEvento: evento.fechaHoraEvento }
        })
        if(!existe) {
          await prisma.registroAsistencia.create({ data: evento })
        }
      }
    */

    console.log(`[Hardware Adapter] ${registrosProcesados} huellas procesadas del dispositivo ${numeroSerie}`);

    // 5. Responder al Lector de Huella en su protocolo nativo para que borre los registros locales
    return new NextResponse("OK", { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' } 
    })

  } catch (error) {
    console.error("Error en Adaptador de Hardware", error)
    return NextResponse.json({ error: "Fallo en procesamiento de trama" }, { status: 500 })
  }
}
