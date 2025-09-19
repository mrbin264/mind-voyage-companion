import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requireAuth, AuthUser } from '@/lib/auth-utils'

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser
}

/**
 * Middleware factory for protecting API routes
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    required?: boolean
    roles?: string[]
  }
) {
  const { required = true, roles = [] } = options || {}

  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = getCurrentUser(req)

      // Check if authentication is required
      if (required && !user) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Authentication required',
            error: 'UNAUTHORIZED'
          },
          { status: 401 }
        )
      }

      // Check roles if specified (future enhancement)
      if (user && roles.length > 0) {
        // TODO: Implement role-based access control
        // const userRoles = await getUserRoles(user.userId)
        // const hasRequiredRole = roles.some(role => userRoles.includes(role))
        // if (!hasRequiredRole) {
        //   return NextResponse.json(
        //     { 
        //       success: false,
        //       message: 'Insufficient permissions',
        //       error: 'FORBIDDEN'
        //     },
        //     { status: 403 }
        //   )
        // }
      }

      // Add user to request object
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = user || undefined

      return await handler(authenticatedReq)

    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { 
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware for optional authentication
 */
export function withOptionalAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { required: false })
}

/**
 * Rate limiting middleware (basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    maxRequests?: number
    windowMs?: number
  }
) {
  const { maxRequests = 10, windowMs = 60 * 1000 } = options || {} // 10 requests per minute by default

  return async (req: NextRequest): Promise<NextResponse> => {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous'
    const now = Date.now()
    
    const clientData = rateLimitMap.get(clientIp)
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize the counter
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs })
      return await handler(req)
    }
    
    if (clientData.count >= maxRequests) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      )
    }
    
    // Increment the counter
    clientData.count += 1
    
    return await handler(req)
  }
}

/**
 * Combined middleware for authentication and rate limiting
 */
export function withAuthAndRateLimit(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  authOptions?: { required?: boolean; roles?: string[] },
  rateLimitOptions?: { maxRequests?: number; windowMs?: number }
) {
  return withRateLimit(
    withAuth(handler, authOptions),
    rateLimitOptions
  )
}

/**
 * Validation middleware factory
 */
export function withValidation<T>(
  handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>,
  schema: { safeParse: (data: any) => { success: boolean; data?: T; error?: any } }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const data = await req.json()
      const parsed = schema.safeParse(data)

      if (!parsed.success) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Validation failed',
            errors: parsed.error?.flatten?.().fieldErrors || parsed.error
          },
          { status: 400 }
        )
      }

      return await handler(req, parsed.data!)

    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Invalid JSON',
            error: 'INVALID_JSON'
          },
          { status: 400 }
        )
      }

      console.error('Validation middleware error:', error)
      return NextResponse.json(
        { 
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

/**
 * CORS middleware
 */
export function withCors(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    origin?: string | string[]
    methods?: string[]
    allowedHeaders?: string[]
  }
) {
  const { 
    origin = '*', 
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization']
  } = options || {}

  return async (req: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': Array.isArray(origin) ? origin.join(', ') : origin,
          'Access-Control-Allow-Methods': methods.join(', '),
          'Access-Control-Allow-Headers': allowedHeaders.join(', '),
        },
      })
    }

    const response = await handler(req)

    // Add CORS headers to all responses
    response.headers.set('Access-Control-Allow-Origin', Array.isArray(origin) ? origin.join(', ') : origin)
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))

    return response
  }
}