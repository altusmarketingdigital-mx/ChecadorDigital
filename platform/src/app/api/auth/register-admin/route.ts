import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombreCompleto, email, password, empresa, rfc, rol } = body

    if (!email || !password || !empresa) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Aquí en producción se ejecuta:
    // 1. const tenant = await prisma.tenant.create({ data: { razonSocial: empresa, rfc, nombreComercial: empresa } })
    // 2. const passwordHash = await hash(password, 12)
    // 3. const user = await prisma.usuario.create({ data: { tenantId: tenant.id, email, passwordHash, rol: "SUPERADMIN" } })

    console.log(`[Admin Provisioning] Nueva cuenta creada: ${email} (${rol}) para empresa ${empresa}`);

    return NextResponse.json({
      success: true,
      mensaje: "Cuenta de administrador aprovisionada correctamente",
      usuario: {
        email,
        rol: rol || "SUPERADMIN",
        empresa
      }
    })

  } catch (error) {
    console.error("Error aprovisionando cuenta admin:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
