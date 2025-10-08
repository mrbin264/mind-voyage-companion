/**
 * Validation Schemas Template
 *
 * Using Zod for runtime type checking and input sanitization.
 * Add your own validation schemas here as needed.
 *
 * Examples: Product validation, Order validation, User profile, etc.
 */

import { z } from 'zod'

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
}

/**
 * Sanitize text input
 */
export const sanitizeText = z
  .string()
  .transform(sanitizeHtml)
  .refine(val => val.length > 0, {
    message: 'Text cannot be empty after sanitization',
  })

// ============================================================================
// Common Field Validators
// ============================================================================

export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .toLowerCase()
  .trim()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  )

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .transform(sanitizeHtml)

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL too long')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)')
  .optional()

export const dateStringSchema = z
  .string()
  .datetime('Invalid ISO 8601 datetime')
  .or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  )

// ============================================================================
// Authentication Schemas
// ============================================================================

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const passwordResetSchema = z.object({
  email: emailSchema,
})

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// ============================================================================
// Sample Entity Schemas (Template - Modify for your needs)
// ============================================================================

export const createSampleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const updateSampleSchema = createSampleSchema.partial()

export const sampleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ============================================================================
// API Request Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  ...paginationSchema.shape,
})

export const idParamSchema = z.object({
  id: mongoIdSchema,
})

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate and parse request body
 *
 * @example
 * ```ts
 * const result = validateBody(loginSchema, requestBody)
 * if (!result.success) {
 *   return NextResponse.json({ error: result.error }, { status: 400 })
 * }
 * const { email, password } = result.data
 * ```
 */
export function validateBody<T extends z.ZodType>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  try {
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(
        err => `${err.path.join('.')}: ${err.message}`
      )
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Validation failed' }
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(
        err => `${err.path.join('.')}: ${err.message}`
      )
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// ============================================================================
// Type Exports (for use in components and API routes)
// ============================================================================

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateSampleInput = z.infer<typeof createSampleSchema>
export type UpdateSampleInput = z.infer<typeof updateSampleSchema>
export type SampleQueryParams = z.infer<typeof sampleQuerySchema>

// ============================================================================
// Example Usage:
// ============================================================================

/*
// In an API route:
import { NextRequest, NextResponse } from 'next/server'
import { createSampleSchema, validateBody } from '@/lib/validation/schemas'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Validate request body
  const validation = validateBody(createSampleSchema, body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    )
  }
  
  const { name, description, status } = validation.data
  
  // validation.data is fully typed and sanitized
  // Continue with business logic...
  
  return NextResponse.json({ success: true })
}

// In a Server Action:
'use server'

import { createSampleSchema } from '@/lib/validation/schemas'

export async function createSample(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    status: formData.get('status'),
  }
  
  const result = createSampleSchema.safeParse(rawData)
  
  if (!result.success) {
    return { error: result.error.flatten() }
  }
  
  // result.data is validated and typed
  // Save to database...
  
  return { success: true }
}
*/
