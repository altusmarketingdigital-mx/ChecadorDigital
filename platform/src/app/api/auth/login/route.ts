import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validación básica de credenciales
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Por favor ingresa correo y contraseña" }, { status: 400 })
    }

    // Respuesta con Cookie de Sesión para el Middleware
    const response = NextResponse.json({
      success: true,
      mensaje: "Inicio de sesión exitoso",
      usuario: { email, rol: "SUPERADMIN" }
    })

    // Inyectar la cookie 'app_session' que desbloquea el middleware hacia /dashboard
    response.cookies.set({
      name: 'app_session',
      value: Buffer.from(JSON.stringify({ email, rol: 'SUPERADMIN', loggedAt: Date.now() })).toString('base64'),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días de sesión activa
    })

    return response

  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
