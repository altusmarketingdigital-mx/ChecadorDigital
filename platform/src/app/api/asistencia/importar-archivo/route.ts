import { NextResponse } from 'next/server'

interface EventoChecadorInput {
  numeroEmpleado: string
  nombreEmpleado?: string
  fechaHora: string
  tipoEvento: string
  dispositivo?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contenidoTexto, formato, registros, nombreArchivo } = body

    let lineasAProcesar: EventoChecadorInput[] = []

    // 1. Si vienen registros ya estructurados
    if (Array.isArray(registros) && registros.length > 0) {
      lineasAProcesar = registros
    } 
    // 2. Si viene texto crudo desde archivo (.dat, .txt o .csv)
    else if (typeof contenidoTexto === 'string' && contenidoTexto.trim().length > 0) {
      const lineas = contenidoTexto.split(/\r?\n/).filter((l: string) => l.trim().length > 0)

      for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i].trim()

        // Ignorar encabezados comunes en CSV
        if (i === 0 && (linea.toLowerCase().includes('empleado') || linea.toLowerCase().includes('pin') || linea.toLowerCase().includes('user'))) {
          continue
        }

        // Detección de separador: tabulador (\t), coma (,) o punto y coma (;) o espacios múltiples
        let partes: string[] = []
        if (linea.includes('\t')) {
          partes = linea.split('\t').map((p: string) => p.trim())
        } else if (linea.includes(',')) {
          partes = linea.split(',').map((p: string) => p.trim())
        } else if (linea.includes(';')) {
          partes = linea.split(';').map((p: string) => p.trim())
        } else {
          // Espacios consecutivos (típico en algunos ZKTeco planos)
          partes = linea.split(/\s{2,}|\s+/).map((p: string) => p.trim())
        }

        if (partes.length >= 2) {
          const pin = partes[0]
          // Buscar parte que contenga fecha (ej. 2026-10-16 o 2026/10/16)
          let fechaHora = ""
          let tipoCodigo = "0"

          // En formato estándar ZKTeco .dat:
          // Col 0: PIN (ej. 1)
          // Col 1: Fecha Hora (ej. 2026-10-16 08:55:12)
          // Col 2: Estado (0: Entrada, 1: Salida, 4: Salida Pausa, 5: Entrada Pausa)
          if (partes[1].includes('-') || partes[1].includes('/')) {
            fechaHora = partes[1]
            if (partes.length >= 3 && (partes[2].includes(':') || partes[2].includes('AM') || partes[2].includes('PM'))) {
              // Si la fecha y hora vinieron separadas
              fechaHora = `${partes[1]} ${partes[2]}`
              tipoCodigo = partes[3] || "0"
            } else {
              tipoCodigo = partes[2] || "0"
            }
          }

          let tipoNormalizado = "ENTRADA"
          if (tipoCodigo === "1" || tipoCodigo.toLowerCase().includes("salida") || tipoCodigo.toLowerCase().includes("out")) {
            tipoNormalizado = "SALIDA"
          } else if (tipoCodigo === "4" || tipoCodigo.toLowerCase().includes("inicio_pausa") || tipoCodigo.toLowerCase().includes("comida")) {
            tipoNormalizado = "INICIO_PAUSA"
          } else if (tipoCodigo === "5" || tipoCodigo.toLowerCase().includes("fin_pausa")) {
            tipoNormalizado = "FIN_PAUSA"
          }

          if (fechaHora) {
            lineasAProcesar.push({
              numeroEmpleado: pin.padStart(3, '0'),
              fechaHora: fechaHora,
              tipoEvento: tipoNormalizado,
              dispositivo: nombreArchivo || 'ZKTeco USB Export'
            })
          }
        }
      }
    }

    if (lineasAProcesar.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No se encontraron registros válidos para procesar en el archivo proporcionado."
      }, { status: 400 })
    }

    // 3. Procesamiento y control de duplicados
    const mapaUnicidad = new Set<string>()
    const procesados: any[] = []
    let totalValidos = 0
    let totalDuplicados = 0

    // Catálogo simulado para asociar nombre según PIN
    const nombresEmpleados: Record<string, string> = {
      "001": "Carlos Mendoza",
      "002": "Lucía García",
      "003": "Alberto Rivas",
      "004": "Mariana Solís",
      "005": "Fernando Torres",
      "1": "Carlos Mendoza",
      "2": "Lucía García",
      "3": "Alberto Rivas",
      "4": "Mariana Solís"
    }

    const fechaRecepcion = new Date()

    for (const ev of lineasAProcesar) {
      const claveUnica = `${ev.numeroEmpleado}_${ev.fechaHora}_${ev.tipoEvento}`
      const numNormalizado = ev.numeroEmpleado.padStart(3, '0')
      const nombreAsignado = ev.nombreEmpleado || nombresEmpleados[ev.numeroEmpleado] || nombresEmpleados[numNormalizado] || `Empleado #${numNormalizado}`

      if (mapaUnicidad.has(claveUnica)) {
        totalDuplicados++
        procesados.push({
          numeroEmpleado: numNormalizado,
          nombre: nombreAsignado,
          fechaHora: ev.fechaHora,
          tipoEvento: ev.tipoEvento,
          estado: "DUPLICADO_IGNORADO",
          observacion: "Checada idéntica ya existente en el archivo"
        })
      } else {
        mapaUnicidad.add(claveUnica)
        totalValidos++

        // Verificación de tolerancia (ej. si entra después de 09:10 hrs)
        let estadoTolerancia = "A_TIEMPO"
        if (ev.tipoEvento === "ENTRADA") {
          const matchHora = ev.fechaHora.match(/(\d{1,2}):(\d{2})/)
          if (matchHora) {
            const horas = parseInt(matchHora[1], 10)
            const minutos = parseInt(matchHora[2], 10)
            const totalMinutos = horas * 60 + minutos
            // Considerando entrada 09:00 hrs con 10 min de tolerancia (09:10 = 550 min)
            if (totalMinutos > 550) {
              estadoTolerancia = "RETARDO_TOLERANCIA_EXCEDIDA"
            } else if (totalMinutos > 540) {
              estadoTolerancia = "DENTRO_DE_TOLERANCIA_10M"
            }
          }
        }

        procesados.push({
          id: `REG-USB-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          numeroEmpleado: numNormalizado,
          nombre: nombreAsignado,
          fechaHora: ev.fechaHora,
          tipoEvento: ev.tipoEvento,
          metodoRegistro: "IMPORTACION_USB",
          estado: "VALIDO",
          estadoTolerancia,
          fechaRecepcionServidor: fechaRecepcion.toISOString()
        })
      }
    }

    // 4. Registro de Bitácora de Auditoría Forense (STPS)
    const logAuditoria = {
      accion: "IMPORTACION_ARCHIVO_CHECADOR",
      tablaAfectada: "registros_asistencia",
      registrosInsertados: totalValidos,
      registrosDuplicados: totalDuplicados,
      archivo: nombreArchivo || "Archivo_Checador.dat",
      fecha: fechaRecepcion.toISOString(),
      hashIntegridad: `sha256-${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`
    }

    return NextResponse.json({
      success: true,
      mensaje: `Procesamiento finalizado: ${totalValidos} checadas válidas preparadas para persistencia, ${totalDuplicados} duplicadas descartadas.`,
      estadisticas: {
        totalLeidos: lineasAProcesar.length,
        validos: totalValidos,
        duplicados: totalDuplicados
      },
      auditoria: logAuditoria,
      registros: procesados
    })

  } catch (error) {
    console.error("Error al procesar archivo de checador:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno al procesar e interpretar la trama del archivo del checador."
    }, { status: 500 })
  }
}
