/**
 * Security middleware composer
 * Combines all security measures into reusable middleware functions
 */
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, apiRateLimit, mutationRateLimit, authRateLimit } from '@/lib/middleware/rate-limit'
import { authenticateRequest, requireAuth, optionalAuth, type AuthSession } from '@/lib/middleware/auth'
import { withErrorHandling, type ErrorResponse } from '@/lib/middleware/error-handler'
import { validateRequest, parseAndValidate, validateSearchParams } from '@/lib/validation/schemas'
import { sanitizeObject, sanitizeMongoQuery } from '@/lib/security/sanitization'
import { z } from 'zod'

// Security configuration for different endpoint types
export interface SecurityConfig {
  rateLimit?: {
    type: 'api' | 'mutation' | 'auth' | 'custom'
    windowMs?: number
    maxRequests?: number
  }
  auth?: {
    required?: boolean
    roles?: string[]
    verified?: boolean
  }
  validation?: {
    body?: z.ZodSchema<any>
    query?: z.ZodSchema<any>
  }
  sanitization?: {
    sanitizeBody?: boolean
    sanitizeQuery?: boolean
    allowedFields?: string[]
  }
  logging?: {
    logRequests?: boolean
    logResponses?: boolean
  }
}

// Security result interface
export interface SecurityContext {
  session: AuthSession | null
  validatedBody?: any
  validatedQuery?: any
  sanitizedBody?: any
  sanitizedQuery?: any
}

/**
 * Comprehensive security middleware that applies all security measures
 */
export function withSecurity<T extends any[]>(
  handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>,
  config: SecurityConfig = {}
) {
  return withErrorHandling(async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const context: SecurityContext = {
      session: null,
      validatedBody: undefined,
      validatedQuery: undefined,
      sanitizedBody: undefined,
      sanitizedQuery: undefined
    }

    // Step 1: Apply rate limiting
    if (config.rateLimit !== undefined) {
      const rateLimitResult = await applyRateLimit(request, config.rateLimit)
      if (rateLimitResult) {
        return rateLimitResult
      }
    }

    // Step 2: Apply authentication
    if (config.auth !== undefined) {
      const authResult = await applyAuthentication(request, config.auth)
      if (authResult.error) {
        return authResult.error
      }
      context.session = authResult.session
    }

    // Step 3: Validate request body
    if (config.validation?.body) {
      const bodyResult = await validateRequestBody(request, config.validation.body)
      if (bodyResult.error) {
        return bodyResult.error
      }
      context.validatedBody = bodyResult.data
    }

    // Step 4: Validate query parameters
    if (config.validation?.query) {
      const queryResult = await validateQueryParams(request, config.validation.query)
      if (queryResult.error) {
        return queryResult.error
      }
      context.validatedQuery = queryResult.data
    }

    // Step 5: Sanitize inputs
    if (config.sanitization) {
      const sanitizationResult = await applySanitization(request, context, config.sanitization)
      context.sanitizedBody = sanitizationResult.sanitizedBody
      context.sanitizedQuery = sanitizationResult.sanitizedQuery
    }

    // Step 6: Execute the actual handler
    return await handler(request, context, ...args)
  }, {
    context: { securityConfig: config },
    logRequests: config.logging?.logRequests
  })
}

/**
 * Apply rate limiting based on configuration
 */
async function applyRateLimit(
  request: NextRequest, 
  rateLimitConfig?: SecurityConfig['rateLimit']
): Promise<NextResponse | null> {
  if (!rateLimitConfig) {
    // Default API rate limiting
    return await apiRateLimit()(request)
  }

  switch (rateLimitConfig.type) {
    case 'api':
      return await apiRateLimit()(request)
    case 'mutation':
      return await mutationRateLimit()(request)
    case 'auth':
      return await authRateLimit()(request)
    case 'custom':
      return await rateLimit({
        windowMs: rateLimitConfig.windowMs || 60000,
        maxRequests: rateLimitConfig.maxRequests || 100
      })(request)
    default:
      return await apiRateLimit()(request)
  }
}

/**
 * Apply authentication based on configuration
 */
async function applyAuthentication(
  request: NextRequest,
  authConfig?: SecurityConfig['auth']
): Promise<{ session: AuthSession | null; error?: NextResponse }> {
  const required = authConfig?.required !== false // Default to required
  const roles = authConfig?.roles
  const verified = authConfig?.verified

  const authResult = await authenticateRequest(request, {
    required,
    roles,
    verified
  })

  if (!authResult.success) {
    return { session: null, error: authResult.error }
  }

  return { session: authResult.session }
}

/**
 * Validate request body
 */
async function validateRequestBody(
  request: NextRequest,
  schema: z.ZodSchema<any>
): Promise<{ data?: any; error?: NextResponse }> {
  try {
    const result = await parseAndValidate(request, schema)
    
    if (!result.success) {
      return {
        error: NextResponse.json({
          success: false,
          error: 'validation',
          message: 'Request body validation failed',
          details: result.errors.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code
          }))
        }, { status: 400 })
      }
    }

    return { data: result.data }
  } catch (error) {
    return {
      error: NextResponse.json({
        success: false,
        error: 'validation',
        message: 'Invalid request body format'
      }, { status: 400 })
    }
  }
}

/**
 * Validate query parameters
 */
async function validateQueryParams(
  request: NextRequest,
  schema: z.ZodSchema<any>
): Promise<{ data?: any; error?: NextResponse }> {
  const { searchParams } = new URL(request.url)
  const result = validateSearchParams(schema, searchParams)
  
  if (!result.success) {
    return {
      error: NextResponse.json({
        success: false,
        error: 'validation',
        message: 'Query parameter validation failed',
        details: result.errors.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      }, { status: 400 })
    }
  }

  return { data: result.data }
}

/**
 * Apply sanitization to request data
 */
async function applySanitization(
  request: NextRequest,
  context: SecurityContext,
  sanitizationConfig: SecurityConfig['sanitization']
): Promise<{ sanitizedBody?: any; sanitizedQuery?: any }> {
  const result: { sanitizedBody?: any; sanitizedQuery?: any } = {}

  if (sanitizationConfig?.sanitizeBody && context.validatedBody) {
    result.sanitizedBody = sanitizeObject(context.validatedBody)
    
    // Apply MongoDB query sanitization if it looks like a query
    if (typeof result.sanitizedBody === 'object') {
      result.sanitizedBody = sanitizeMongoQuery(result.sanitizedBody)
    }
  }

  if (sanitizationConfig?.sanitizeQuery && context.validatedQuery) {
    result.sanitizedQuery = sanitizeObject(context.validatedQuery)
    result.sanitizedQuery = sanitizeMongoQuery(result.sanitizedQuery)
  }

  return result
}

/**
 * Predefined security configurations for common scenarios
 */
export const SecurityPresets = {
  // Public endpoints (no auth required)
  public: {
    rateLimit: { type: 'api' as const, maxRequests: 20 },
    auth: { required: false },
    sanitization: { sanitizeQuery: true },
    logging: { logRequests: true }
  },

  // Standard API endpoints (auth required)
  api: {
    rateLimit: { type: 'api' as const },
    auth: { required: true },
    sanitization: { sanitizeBody: true, sanitizeQuery: true },
    logging: { logRequests: true }
  },

  // Data modification endpoints
  mutation: {
    rateLimit: { type: 'mutation' as const },
    auth: { required: true },
    sanitization: { sanitizeBody: true, sanitizeQuery: true },
    logging: { logRequests: true, logResponses: true }
  },

  // Authentication endpoints
  auth: {
    rateLimit: { type: 'auth' as const },
    auth: { required: false },
    sanitization: { sanitizeBody: true },
    logging: { logRequests: true }
  },

  // Admin endpoints
  admin: {
    rateLimit: { type: 'mutation' as const },
    auth: { required: true, roles: ['admin'] as string[], verified: true },
    sanitization: { sanitizeBody: true, sanitizeQuery: true },
    logging: { logRequests: true, logResponses: true }
  }
} as const

/**
 * Convenience functions for common security configurations
 */
export const secureEndpoint = {
  public: <T extends any[]>(handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>) =>
    withSecurity(handler, SecurityPresets.public),

  api: <T extends any[]>(handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>) =>
    withSecurity(handler, SecurityPresets.api),

  mutation: <T extends any[]>(handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>) =>
    withSecurity(handler, SecurityPresets.mutation),

  auth: <T extends any[]>(handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>) =>
    withSecurity(handler, SecurityPresets.auth),

  admin: <T extends any[]>(handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>) =>
    withSecurity(handler, SecurityPresets.admin),

  custom: <T extends any[]>(
    handler: (request: NextRequest, context: SecurityContext, ...args: T) => Promise<NextResponse>,
    config: SecurityConfig
  ) => withSecurity(handler, config)
}

export default {
  withSecurity,
  SecurityPresets,
  secureEndpoint
}