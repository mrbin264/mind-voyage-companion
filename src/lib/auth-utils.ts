import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export interface AuthUser {
  userId: string
  email: string
  name: string
}

export function getCurrentUser(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    console.log(
      '🍪 Auth token present:',
      !!token,
      token ? token.substring(0, 20) + '...' : 'none'
    )

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = verify(token, secret) as AuthUser
    console.log('✅ Token verified for user:', decoded.email)

    return decoded
  } catch (error) {
    console.log(
      '❌ Token verification failed:',
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  console.log('🔐 RequireAuth called for:', request.url)
  const user = getCurrentUser(request)

  if (!user) {
    console.log('❌ RequireAuth failed: No authenticated user')
    throw new Error('Authentication required')
  }

  console.log('✅ RequireAuth succeeded for user:', user.email)
  return user
}
