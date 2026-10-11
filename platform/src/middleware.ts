import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mapeo de accesos permitidos por rol (RBAC)
const ROLE_ACCESS = {
  SUPERADMIN: ['/superadmin', '/dashboard'],
  ADMIN: ['/dashboard', '/configuracion', '/reportes'],
  RRHH: ['/dashboard', '/empleados', '/incidencias', '/reportes'],
  SUPERVISOR: ['/dashboard', '/incidencias'],
  CONTADOR: ['/dashboard', '/reportes'],
  TRABAJADOR: ['/mi-espacio', '/mis-incidencias']
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Rutas públicas que no requieren autenticación
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // 2. Simulación de extracción de Token (En producción vendrá de NextAuth o JWT HTTP-Only)
  const token = request.cookies.get('app_session')?.value
  
  // Si no hay sesión, expulsar al Login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // (Simularemos la lectura del JWT cifrado para el flujo)
  // payload = decrypt(token)
  // const userRole = payload.role; 
  // const tenantId = payload.tenantId;

  // 3. Multi-tenancy: Inyectar el Tenant-ID en los encabezados para que la API filtre los datos
  // En producción real, la API lee este header interno garantizando que el usuario 
  // NUNCA vea datos de otra empresa, sin importar la consulta SQL.
  const response = NextResponse.next()
  // response.headers.set('x-tenant-id', tenantId)
  
  // 4. Verificación de Roles (RBAC)
  // Aquí validaríamos si `userRole` tiene el pathname actual en su array de ROLE_ACCESS
  // Si no tiene permiso, retornamos un 403 o redirigimos a "Acceso Denegado".

  return response
}

// Configurar en qué rutas se debe ejecutar este middleware
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto:
     * - api (algunas apis pueden ser webhooks del checador)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
  ],
}
