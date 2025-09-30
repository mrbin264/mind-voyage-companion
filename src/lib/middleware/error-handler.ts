/**
 * Standardized error handling middleware for API routes
 * Provides security-conscious error responses and comprehensive logging
 */
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

// Standard error response structure
export interface ErrorResponse {
  success: false
  error: string
  message: string
  code?: string
  details?: any
  timestamp: string
  requestId?: string
  retryAfter?: number
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories for better handling
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  DATABASE = 'database',
  EXTERNAL_API = 'external_api',
  SERVER = 'server',
  CLIENT = 'client',
}

// Custom error class for API errors
export class APIError extends Error {
  public readonly statusCode: number
  public readonly category: ErrorCategory
  public readonly severity: ErrorSeverity
  public readonly details?: any
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    category: ErrorCategory = ErrorCategory.SERVER,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: any
  ) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.category = category
    this.severity = severity
    this.details = details
    this.isOperational = true

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error classes
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, ErrorCategory.VALIDATION, ErrorSeverity.LOW, details)
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, ErrorCategory.AUTHENTICATION, ErrorSeverity.MEDIUM)
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, ErrorCategory.AUTHORIZATION, ErrorSeverity.MEDIUM)
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(
      `${resource} not found`,
      404,
      ErrorCategory.NOT_FOUND,
      ErrorSeverity.LOW
    )
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, ErrorCategory.RATE_LIMIT, ErrorSeverity.MEDIUM, {
      retryAfter,
    })
  }
}

export class DatabaseError extends APIError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 503, ErrorCategory.DATABASE, ErrorSeverity.HIGH, details)
  }
}

// Error logging utility
export class ErrorLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development'

  static log(
    error: Error | APIError,
    request?: NextRequest,
    context?: Record<string, any>
  ): void {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
      statusCode: (error as APIError).statusCode || 500,
      category: (error as APIError).category || ErrorCategory.SERVER,
      severity: (error as APIError).severity || ErrorSeverity.MEDIUM,
      details: (error as APIError).details,
      request: request
        ? {
            method: request.method,
            url: request.url,
            headers: this.sanitizeHeaders(
              Object.fromEntries(request.headers.entries())
            ),
            userAgent: request.headers.get('user-agent'),
          }
        : undefined,
      context,
    }

    // Log based on severity
    const severity = (error as APIError).severity || ErrorSeverity.MEDIUM

    switch (severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', errorInfo)
        // In production, you'd send this to error tracking service
        break
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH SEVERITY ERROR:', errorInfo)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ MEDIUM SEVERITY ERROR:', errorInfo)
        break
      case ErrorSeverity.LOW:
        console.log('ℹ️ LOW SEVERITY ERROR:', errorInfo)
        break
    }
  }

  private static sanitizeHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
    ]
    const sanitized: Record<string, string> = {}

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }
}

// Main error handler function
export function handleError(
  error: unknown,
  request?: NextRequest,
  context?: Record<string, any>
): NextResponse {
  const requestId = generateRequestId()
  const isDevelopment = process.env.NODE_ENV === 'development'

  let apiError: APIError

  // Convert different error types to APIError
  if (error instanceof APIError) {
    apiError = error
  } else if (error instanceof ZodError) {
    apiError = new ValidationError('Invalid input data', {
      issues: isDevelopment ? error.issues : 'Multiple validation errors',
      fieldErrors: error.issues.reduce(
        (acc, issue) => {
          const field = issue.path.join('.')
          acc[field] = issue.message
          return acc
        },
        {} as Record<string, string>
      ),
    })
  } else if (error instanceof mongoose.Error.ValidationError) {
    const validationErrors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
    }))

    apiError = new ValidationError('Database validation failed', {
      errors: isDevelopment ? validationErrors : 'Invalid data format',
    })
  } else if (error instanceof mongoose.Error.CastError) {
    apiError = new ValidationError('Invalid data format', {
      field: error.path,
      value: isDevelopment ? error.value : '[REDACTED]',
    })
  } else if (error instanceof mongoose.Error) {
    apiError = new DatabaseError('Database connection error')
  } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    apiError = new ValidationError('Invalid JSON format')
  } else {
    // Generic server error
    apiError = new APIError(
      isDevelopment ? (error as Error).message : 'An unexpected error occurred',
      500,
      ErrorCategory.SERVER,
      ErrorSeverity.HIGH
    )
  }

  // Log the error
  ErrorLogger.log(apiError, request, context)

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: apiError.category,
    message: apiError.message,
    code: `${apiError.category.toUpperCase()}_ERROR`,
    timestamp: new Date().toISOString(),
    requestId,
  }

  // Add details only in development or for certain error types
  if (isDevelopment || apiError.category === ErrorCategory.VALIDATION) {
    errorResponse.details = apiError.details
  }

  // Add retry-after for rate limiting
  if (apiError instanceof RateLimitError && apiError.details?.retryAfter) {
    errorResponse.retryAfter = apiError.details.retryAfter
  }

  // Set appropriate headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
  }

  if (apiError instanceof RateLimitError && apiError.details?.retryAfter) {
    headers['Retry-After'] = String(apiError.details.retryAfter)
  }

  return NextResponse.json(errorResponse, {
    status: apiError.statusCode,
    headers,
  })
}

// Generate unique request ID for tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Async error wrapper for API route handlers
export function asyncHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const request = args[0] as NextRequest
      return handleError(error, request, { handler: handler.name })
    }
  }
}

// Higher-order function to wrap API routes with comprehensive error handling
export function withErrorHandling<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  options?: {
    context?: Record<string, any>
    logRequests?: boolean
  }
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now()
    const requestId = generateRequestId()

    try {
      // Log request if enabled
      if (options?.logRequests) {
        console.log(
          `📨 [${requestId}] ${request.method} ${new URL(request.url).pathname}`
        )
      }

      const response = await handler(request, ...args)

      // Log successful response time
      const duration = Date.now() - startTime
      if (options?.logRequests) {
        console.log(`✅ [${requestId}] Completed in ${duration}ms`)
      }

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId)

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      console.log(`❌ [${requestId}] Failed after ${duration}ms`)

      return handleError(error, request, {
        ...options?.context,
        requestId,
        duration,
        handler: handler.name,
      })
    }
  }
}

// Utility functions for common error scenarios
export const throwValidationError = (message: string, details?: any): never => {
  throw new ValidationError(message, details)
}

export const throwNotFoundError = (resource?: string): never => {
  throw new NotFoundError(resource)
}

export const throwAuthError = (message?: string): never => {
  throw new AuthenticationError(message)
}

export const throwForbiddenError = (message?: string): never => {
  throw new AuthorizationError(message)
}

export const throwRateLimitError = (retryAfter?: number): never => {
  throw new RateLimitError(undefined, retryAfter)
}

export const throwDatabaseError = (message?: string, details?: any): never => {
  throw new DatabaseError(message, details)
}

// Export everything
export default {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  DatabaseError,
  ErrorLogger,
  ErrorCategory,
  ErrorSeverity,
  handleError,
  asyncHandler,
  withErrorHandling,
  throwValidationError,
  throwNotFoundError,
  throwAuthError,
  throwForbiddenError,
  throwRateLimitError,
  throwDatabaseError,
}
