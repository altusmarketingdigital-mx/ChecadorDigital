import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Rutas públicas que no requieren autenticación
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/setup-admin') ||
    pathname === '/logo-altus.jpg' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // 2. Extracción de Cookie de Sesión
  const token = request.cookies.get('app_session')?.value
  
  // Si no hay sesión, redirigir a Login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/hardware|_next/static|_next/image|favicon.ico|logo-altus.jpg).*)',
  ],
}
