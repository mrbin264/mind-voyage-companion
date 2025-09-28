import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  // Get session using NextAuth
  const session = await auth()

  // Define protected and auth routes
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/login', '/register', '/auth/signin']

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
