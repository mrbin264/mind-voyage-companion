import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  // Define protected routes
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/login', '/register']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route without valid token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token if it exists
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret-key'
      verify(token, secret)
      
      // If logged in and accessing auth routes, redirect to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Invalid token, clear it
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
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