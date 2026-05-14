import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
    if (token.role !== 'ADMIN') return NextResponse.redirect(new URL('/catalogo', request.url))
  }

  if (pathname.startsWith('/catalogo') || pathname.startsWith('/pedidos')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
    if (token.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (pathname === '/login' && token) {
    if (token.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
    return NextResponse.redirect(new URL('/catalogo', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/catalogo/:path*', '/pedidos/:path*', '/login'],
}
