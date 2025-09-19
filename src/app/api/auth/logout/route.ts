import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'

export async function POST(req: NextRequest) {
  try {
    // Get current user (optional - for logging purposes)
    const user = getCurrentUser(req)
    
    if (user) {
      console.log(`User ${user.email} logged out successfully`)
    }

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    })

    // Clear the auth token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, we should still clear the cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return response
  }
}

export async function GET(req: NextRequest) {
  // Allow GET requests for logout as well (for convenience)
  return POST(req)
}
