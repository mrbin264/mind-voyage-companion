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
    
    if (!token) {
      return null
    }

    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
    const decoded = verify(token, secret) as AuthUser
    
    return decoded
  } catch (error) {
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = getCurrentUser(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}