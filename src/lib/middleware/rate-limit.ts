/**
 * Enhanced rate limiting middleware for API endpoints
 * Supports per-endpoint limits, user-based limits, and IP-based limits
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Rate limit configuration per endpoint type
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: NextRequest) => Promise<string> // Custom key generator
  skipSuccessfulRequests?: boolean // Only count failed requests
  skipFailedRequests?: boolean // Only count successful requests
  message?: string // Custom error message
}

// Default rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints (stricter limits)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message:
      'Too many authentication attempts. Please try again in 15 minutes.',
  },

  // General API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many requests. Please slow down.',
  },

  // Create/Update operations (more restrictive)
  mutation: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: 'Too many modification requests. Please slow down.',
  },

  // File upload/heavy operations
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    message: 'Too many upload requests. Please wait before uploading again.',
  },

  // Public endpoints (most restrictive)
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 requests per minute
    message: 'Rate limit exceeded. Please try again later.',
  },
} as const

// In-memory rate limit store (use Redis in production)
interface RateLimitEntry {
  count: number
  resetTime: number
  requests: Array<{
    timestamp: number
    success: boolean
    method: string
    path: string
  }>
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup()
      },
      5 * 60 * 1000
    )
  }

  private cleanup() {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.store.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.store.delete(key))
  }

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key)
    if (entry && Date.now() > entry.resetTime) {
      this.store.delete(key)
      return undefined
    }
    return entry
  }

  set(key: string, entry: RateLimitEntry) {
    this.store.set(key, entry)
  }

  delete(key: string) {
    this.store.delete(key)
  }

  getStats() {
    const entries: Array<{
      key: string
      count: number
      resetTime: string
      requestsInWindow: number
    }> = []

    this.store.forEach((entry, key) => {
      entries.push({
        key,
        count: entry.count,
        resetTime: new Date(entry.resetTime).toISOString(),
        requestsInWindow: entry.requests.length,
      })
    })

    return {
      totalKeys: this.store.size,
      entries,
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

const rateLimitStore = new RateLimitStore()

// Default key generators
export const keyGenerators = {
  // IP-based rate limiting
  ip: async (req: NextRequest): Promise<string> => {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded
      ? forwarded.split(',')[0]
      : req.headers.get('x-real-ip') || '127.0.0.1'
    return `ip:${ip}`
  },

  // User-based rate limiting (authenticated users)
  user: async (req: NextRequest): Promise<string> => {
    try {
      const session = await auth()
      if (session?.user?.id) {
        return `user:${session.user.id}`
      }
    } catch (error) {
      console.warn('Failed to get session for rate limiting:', error)
    }
    // Fallback to IP for unauthenticated users
    return keyGenerators.ip(req)
  },

  // Combined IP + User rate limiting
  combined: async (req: NextRequest): Promise<string> => {
    const ipKey = await keyGenerators.ip(req)
    try {
      const session = await auth()
      if (session?.user?.id) {
        return `combined:${session.user.id}:${ipKey.split(':')[1]}`
      }
    } catch (error) {
      console.warn('Failed to get session for combined rate limiting:', error)
    }
    return `combined:anonymous:${ipKey.split(':')[1]}`
  },
}

// Rate limiting middleware factory
export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    try {
      // Generate rate limiting key
      const keyGenerator = config.keyGenerator || keyGenerators.user
      const key = await keyGenerator(req)

      const now = Date.now()
      const windowMs = config.windowMs
      const maxRequests = config.maxRequests

      // Get or create rate limit entry
      let entry = rateLimitStore.get(key)

      if (!entry) {
        entry = {
          count: 0,
          resetTime: now + windowMs,
          requests: [],
        }
      }

      // Clean old requests from the window
      entry.requests = entry.requests.filter(
        req => req.timestamp > now - windowMs
      )

      // Count current requests in the window
      const currentCount = entry.requests.length

      // Check if rate limit exceeded
      if (currentCount >= maxRequests) {
        const resetTimeSeconds = Math.ceil((entry.resetTime - now) / 1000)

        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: config.message || 'Too many requests',
            retryAfter: resetTimeSeconds,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': entry.resetTime.toString(),
              'Retry-After': resetTimeSeconds.toString(),
            },
          }
        )
      }

      // Add current request
      entry.requests.push({
        timestamp: now,
        success: true, // Will be updated after response
        method: req.method || 'GET',
        path: new URL(req.url).pathname,
      })

      entry.count = entry.requests.length
      rateLimitStore.set(key, entry)

      // Add rate limit headers to successful requests
      const remaining = maxRequests - currentCount - 1
      const response = NextResponse.next()

      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())

      return null // Continue to next middleware
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Don't block requests if rate limiting fails
      return null
    }
  }
}

// Convenience functions for common rate limiting scenarios
export const authRateLimit = () =>
  rateLimit({
    ...RATE_LIMIT_CONFIGS.auth,
    keyGenerator: keyGenerators.ip, // Use IP for auth to prevent lockout
  })

export const apiRateLimit = () =>
  rateLimit({
    ...RATE_LIMIT_CONFIGS.api,
    keyGenerator: keyGenerators.user,
  })

export const mutationRateLimit = () =>
  rateLimit({
    ...RATE_LIMIT_CONFIGS.mutation,
    keyGenerator: keyGenerators.user,
  })

export const publicRateLimit = () =>
  rateLimit({
    ...RATE_LIMIT_CONFIGS.public,
    keyGenerator: keyGenerators.ip,
  })

// Utility to get rate limit stats (for debugging/monitoring)
export function getRateLimitStats() {
  return rateLimitStore.getStats()
}

// Utility to reset rate limit for a specific key (admin function)
export function resetRateLimit(key: string) {
  rateLimitStore.delete(key)
}

export default rateLimitStore
