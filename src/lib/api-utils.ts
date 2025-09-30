/**
 * Centralized API utilities for authentication, validation, and error handling
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import mongoose from 'mongoose'

// Standard API response structure
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    timestamp: string
    version: string
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      ),
      session: null
    }
  }

  return { session, error: null }
}

// Enhanced error handler with security considerations
export function createAPIError(
  error: unknown,
  operation: string,
  statusCode: number = 500
): NextResponse {
  console.error(`API Error [${operation}]:`, error)

  // Security: Never expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Handle specific error types
  if (error instanceof z.ZodError) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: isDevelopment ? error.issues : 'Invalid input data'
    }, { status: 400 })
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json({
      success: false,
      error: 'Database validation error',
      details: isDevelopment ? error.message : 'Invalid data format'
    }, { status: 400 })
  }

  if (error instanceof mongoose.Error || (error as any)?.name?.includes('Mongo')) {
    return NextResponse.json({
      success: false,
      error: 'Database connection error',
      message: 'Please try again later'
    }, { status: 503 })
  }

  // Generic error response
  return NextResponse.json({
    success: false,
    error: 'Internal server error',
    message: isDevelopment ? (error as Error)?.message : 'An unexpected error occurred'
  }, { status: statusCode })
}

// Input sanitization utilities
export function sanitizeRegexInput(input: string): string {
  // Escape regex special characters
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function sanitizeMongoQuery(query: Record<string, any>): Record<string, any> {
  // Remove MongoDB injection attempts
  const sanitized = JSON.parse(JSON.stringify(query))
  
  function cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(cleanObject)
    }
    
    if (obj && typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        // Remove keys starting with $
        if (!key.startsWith('$')) {
          cleaned[key] = cleanObject(value)
        }
      }
      return cleaned
    }
    
    return obj
  }
  
  return cleanObject(sanitized)
}

// Pagination utilities
export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): APIResponse<T[]> {
  const totalPages = Math.ceil(total / pagination.limit)
  
  return {
    success: true,
    data,
    meta: {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages
      },
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  }
}

// Rate limiting (in-memory store for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 100
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  
  // Clean expired entries
  if (rateLimitStore.has(key)) {
    const entry = rateLimitStore.get(key)!
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
  
  // Get or create entry
  const entry = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (entry.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: entry.resetTime 
    }
  }
  
  entry.count++
  rateLimitStore.set(key, entry)
  
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

// Validation schemas for common operations
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
})

export const searchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  category: z.string().max(50).optional(),
  status: z.enum(['active', 'inactive', 'all']).default('all')
})