/**
 * Authentication middleware for API routes using NextAuth
 * Provides flexible authentication checking with session validation
 * Uses NextAuth's built-in JWT handling instead of custom JWT implementation
 */
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { auth } from '@/lib/auth'

// Types for authentication results
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    verified?: boolean
    role?: string
  }
  expires: string
}

export type AuthResult =
  | {
      success: true
      session: AuthSession
    }
  | {
      success: false
      error: NextResponse
    }

// Configuration for different authentication levels
export interface AuthConfig {
  required?: boolean // If false, sets session but doesn't block unauthenticated requests
  roles?: string[] // Required roles (admin, user, etc.)
  verified?: boolean // Require verified email
  rateLimit?: boolean // Apply rate limiting
}

/**
 * Main authentication middleware
 * Validates JWT tokens and user sessions
 */
export async function authenticateRequest(
  request: NextRequest,
  config: AuthConfig = { required: true }
): Promise<AuthResult> {
  try {
    // Try to get session using NextAuth
    const session = await auth()

    if (session?.user?.id) {
      const authSession: AuthSession = {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.name || '',
          verified: (session.user as any).verified || false,
          role: (session.user as any).role || 'user',
        },
        expires:
          session.expires ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      // Validate session requirements
      const validationResult = validateSession(authSession, config)
      if (!validationResult.success) {
        return validationResult
      }

      return {
        success: true,
        session: authSession,
      }
    }

    // Try to get JWT from next-auth token
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (nextAuthToken) {
      const tokenSession: AuthSession = {
        user: {
          id: nextAuthToken.sub || '',
          email: nextAuthToken.email || '',
          name: nextAuthToken.name || '',
          verified: (nextAuthToken as any).verified || false,
          role: (nextAuthToken as any).role || 'user',
        },
        expires: new Date(nextAuthToken.exp! * 1000).toISOString(),
      }

      const validationResult = validateSession(tokenSession, config)
      if (!validationResult.success) {
        return validationResult
      }

      return {
        success: true,
        session: tokenSession,
      }
    }

    // No valid authentication found
    if (!config.required) {
      // For optional authentication, return a guest session
      return {
        success: true,
        session: {
          user: {
            id: '',
            email: '',
            name: 'Guest',
            verified: false,
            role: 'guest',
          },
          expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        },
      }
    }

    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Please log in to access this resource',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="API"',
          },
        }
      ),
    }
  } catch (error) {
    console.error('Authentication error:', error)

    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Authentication failed',
          message: 'Invalid or expired session',
        },
        { status: 401 }
      ),
    }
  }
}

/**
 * Validate session against configuration requirements
 */
function validateSession(
  session: AuthSession,
  config: AuthConfig
):
  | { success: true; session: AuthSession }
  | { success: false; error: NextResponse } {
  // Check if user ID exists
  if (!session.user.id) {
    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Invalid session',
          message: 'User session is incomplete',
        },
        { status: 401 }
      ),
    }
  }

  // Check email verification requirement
  if (config.verified && !session.user.verified) {
    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Email verification required',
          message: 'Please verify your email address to access this resource',
        },
        { status: 403 }
      ),
    }
  }

  // Check role requirements
  if (config.roles && config.roles.length > 0) {
    const userRole = session.user.role || 'user'
    if (!config.roles.includes(userRole)) {
      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: 'Insufficient permissions',
            message: 'You do not have permission to access this resource',
          },
          { status: 403 }
        ),
      }
    }
  }

  // Check token expiration
  const now = new Date()
  const expires = new Date(session.expires)
  if (now >= expires) {
    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Session expired',
          message: 'Please log in again',
        },
        { status: 401 }
      ),
    }
  }

  return {
    success: true,
    session,
  }
}

/**
 * Convenience middleware functions for common scenarios
 */

// Require authentication
export const requireAuth =
  (config: Omit<AuthConfig, 'required'> = {}) =>
  (request: NextRequest) =>
    authenticateRequest(request, { ...config, required: true })

// Optional authentication (sets session if available)
export const optionalAuth =
  (config: Omit<AuthConfig, 'required'> = {}) =>
  (request: NextRequest) =>
    authenticateRequest(request, { ...config, required: false })

// Admin only
export const requireAdmin =
  (config: Omit<AuthConfig, 'roles'> = {}) =>
  (request: NextRequest) =>
    authenticateRequest(request, {
      ...config,
      required: true,
      roles: ['admin', 'superuser'],
    })

// Verified users only
export const requireVerified =
  (config: Omit<AuthConfig, 'verified'> = {}) =>
  (request: NextRequest) =>
    authenticateRequest(request, {
      ...config,
      required: true,
      verified: true,
    })

/**
 * Higher-order function to wrap API route handlers with authentication
 */
export function withAuth<T extends any[]>(
  handler: (
    request: NextRequest,
    session: AuthSession,
    ...args: T
  ) => Promise<NextResponse>,
  config: AuthConfig = { required: true }
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request, config)

    if (!authResult.success) {
      return authResult.error
    }

    // Add session to request context (if supported by your setup)
    try {
      return await handler(request, authResult.session, ...args)
    } catch (error) {
      console.error('Handler error:', error)

      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          message:
            process.env.NODE_ENV === 'development'
              ? (error as Error).message
              : 'An unexpected error occurred',
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Utility to extract user ID from request (for use in other middleware)
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const authResult = await authenticateRequest(request, { required: false })
  return authResult.success ? authResult.session.user.id : null
}

/**
 * Create a simple API key authentication (for server-to-server communication)
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key')
  const validApiKeys = process.env.API_KEYS?.split(',') || []

  return apiKey ? validApiKeys.includes(apiKey) : false
}

export default {
  authenticateRequest,
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireVerified,
  withAuth,
  getUserId,
  validateApiKey,
}
