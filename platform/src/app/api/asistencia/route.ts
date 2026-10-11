import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { empleadoId, tipoEvento, tenantId } = data
    
    // 1. Obtener la hora oficial del servidor (Seguridad: No confiar en la hora del navegador)
    const fechaHoraEvento = new Date()
    const zonaHorariaEvento = "America/Mexico_City" // Podría venir de la sucursal del empleado

    // 2. Aquí buscaríamos la regla de jornada del empleado en la Base de Datos
    // const empleado = await prisma.empleado.findUnique({
    //   where: { id: empleadoId },
    //   include: { jornada: true }
    // })

    // SIMULACIÓN: Tolerancia global configurada por el usuario
    const toleranciaMinutos = 10; 
    let estadoValidacion = "VALIDO";

    // Lógica para detectar retardo si el evento es "ENTRADA"
    if (tipoEvento === "ENTRADA") {
      // (Pseudocódigo)
      // const horaEntradaOficial = empleado.jornada.horaEntrada; 
      // const diferenciaMinutos = calcularDiferencia(fechaHoraEvento, horaEntradaOficial);
      // if (diferenciaMinutos > toleranciaMinutos) {
      //   Registrar como retardo en otra tabla o marcar el estado
      // }
    }

    // 3. Guardar el registro inmutable en la base de datos
    // const nuevoRegistro = await prisma.registroAsistencia.create({
    //   data: {
    //     tenantId,
    //     empleadoId,
    //     tipoEvento, // ENTRADA, SALIDA, INICIO_PAUSA, FIN_PAUSA
    //     fechaHoraEvento,
    //     zonaHorariaEvento,
    //     metodoRegistro: "WEB",
    //     estadoValidacion,
    //   }
    // })

    return NextResponse.json({ 
      success: true, 
      mensaje: `Registro de ${tipoEvento} guardado exitosamente.`,
      horaOficial: fechaHoraEvento,
      toleranciaAplicada: toleranciaMinutos
    })

  } catch (error) {
    return NextResponse.json({ success: false, error: "Error procesando el registro" }, { status: 500 })
  }
}
