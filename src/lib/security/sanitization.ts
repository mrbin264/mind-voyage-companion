/**
 * Input sanitization utilities for security
 * Prevents XSS, injection attacks, and other security vulnerabilities
 */

// HTML/XSS sanitization
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other dangerous tags
    .replace(/<(iframe|object|embed|link|style|meta)[^>]*>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    // Remove HTML tags but keep content (basic approach)
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace
    .trim()
}

// Sanitize text for safe display (more permissive than HTML sanitization)
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    // Remove null bytes and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Trim and limit consecutive whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// SQL injection prevention for MongoDB queries
export function sanitizeMongoQuery(query: any): any {
  if (query === null || query === undefined) return query
  
  if (typeof query === 'string') {
    // Remove potential MongoDB operators from strings
    return query.replace(/^\$/, '_')
  }
  
  if (Array.isArray(query)) {
    return query.map(sanitizeMongoQuery)
  }
  
  if (typeof query === 'object') {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(query)) {
      // Skip MongoDB operators that could be injection attempts
      if (key.startsWith('$') && !isAllowedOperator(key)) {
        continue
      }
      
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeMongoQuery(value)
    }
    
    return sanitized
  }
  
  return query
}

// Allowed MongoDB operators (whitelist approach)
const ALLOWED_MONGO_OPERATORS = new Set([
  '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
  '$in', '$nin', '$exists', '$type', '$regex',
  '$and', '$or', '$nor', '$not',
  '$all', '$elemMatch', '$size',
  '$slice', '$sort', '$limit', '$skip'
])

function isAllowedOperator(operator: string): boolean {
  return ALLOWED_MONGO_OPERATORS.has(operator)
}

// Regex input sanitization (prevent ReDoS attacks)
export function sanitizeRegexInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    // Escape special regex characters
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Limit length to prevent performance issues
    .slice(0, 100)
}

// Safe regex builder for search functionality
export function createSafeRegex(input: string, flags: string = 'i'): RegExp | null {
  try {
    const sanitized = sanitizeRegexInput(input)
    if (!sanitized) return null
    
    // Additional safety: limit complexity
    if (sanitized.length > 50 || /[*+{].*[*+{]/.test(sanitized)) {
      return null // Too complex, reject
    }
    
    return new RegExp(sanitized, flags)
  } catch (error) {
    console.warn('Invalid regex pattern:', input, error)
    return null
  }
}

// Email sanitization and validation helper
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  
  return email
    .toLowerCase()
    .trim()
    // Remove potential malicious characters
    .replace(/[<>'"&]/g, '')
    // Basic format check (more thorough validation should use Zod schema)
    .slice(0, 254) // RFC 5321 limit
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return ''
  
  try {
    const parsed = new URL(url.trim())
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:']
    if (!allowedProtocols.includes(parsed.protocol)) {
      return ''
    }
    
    return parsed.toString()
  } catch (error) {
    return '' // Invalid URL
  }
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  
  // Remove all non-numeric characters except + at the beginning
  return phone
    .trim()
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '') // Remove + except at the beginning
    .slice(0, 20) // Reasonable length limit
}

// File name sanitization
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return ''
  
  return filename
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    // Remove dangerous characters
    .replace(/[<>:"|?*\x00-\x1f]/g, '')
    // Limit length
    .slice(0, 255)
    .trim()
}

// JSON sanitization (for safe parsing of user input)
export function sanitizeJsonString(jsonStr: string): any {
  if (!jsonStr || typeof jsonStr !== 'string') return null
  
  try {
    // Limit size to prevent memory exhaustion
    if (jsonStr.length > 1024 * 1024) { // 1MB limit
      throw new Error('JSON too large')
    }
    
    const parsed = JSON.parse(jsonStr)
    
    // Recursively sanitize the parsed object
    return sanitizeObject(parsed)
  } catch (error) {
    console.warn('Invalid JSON:', error)
    return null
  }
}

// Deep object sanitization
export function sanitizeObject(obj: any, maxDepth: number = 10): any {
  if (maxDepth <= 0) return null // Prevent infinite recursion
  
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'string') {
    return sanitizeText(obj)
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    // Limit array size
    if (obj.length > 1000) return obj.slice(0, 1000)
    
    return obj.map(item => sanitizeObject(item, maxDepth - 1))
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {}
    let keyCount = 0
    
    for (const [key, value] of Object.entries(obj)) {
      // Limit number of keys
      if (keyCount >= 100) break
      
      // Sanitize key name
      const cleanKey = sanitizeText(key).slice(0, 100)
      if (!cleanKey) continue
      
      // Skip problematic keys
      if (cleanKey.startsWith('__') || cleanKey.includes('prototype')) {
        continue
      }
      
      sanitized[cleanKey] = sanitizeObject(value, maxDepth - 1)
      keyCount++
    }
    
    return sanitized
  }
  
  return null // Unknown type, reject
}

// Request header sanitization
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(headers)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9\-]/g, '')
    const cleanValue = sanitizeText(value).slice(0, 1000)
    
    if (cleanKey && cleanValue) {
      sanitized[cleanKey] = cleanValue
    }
  }
  
  return sanitized
}

// IP address validation and sanitization
export function sanitizeIp(ip: string): string {
  if (!ip || typeof ip !== 'string') return ''
  
  const cleaned = ip.trim()
  
  // IPv4 pattern
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6 pattern (simplified)
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  if (ipv4Pattern.test(cleaned) || ipv6Pattern.test(cleaned)) {
    return cleaned
  }
  
  return ''
}

// Rate limiting key sanitization
export function sanitizeRateLimitKey(key: string): string {
  if (!key || typeof key !== 'string') return 'anonymous'
  
  return key
    .replace(/[^a-zA-Z0-9\-_.:]/g, '')
    .slice(0, 100)
    .toLowerCase() || 'anonymous'
}

// Export a comprehensive sanitizer function
export function sanitizeInput(input: any, type: 'html' | 'text' | 'email' | 'url' | 'phone' | 'filename' | 'json' | 'regex'): any {
  switch (type) {
    case 'html':
      return sanitizeHtml(String(input))
    case 'text':
      return sanitizeText(String(input))
    case 'email':
      return sanitizeEmail(String(input))
    case 'url':
      return sanitizeUrl(String(input))
    case 'phone':
      return sanitizePhone(String(input))
    case 'filename':
      return sanitizeFilename(String(input))
    case 'json':
      return sanitizeJsonString(String(input))
    case 'regex':
      return sanitizeRegexInput(String(input))
    default:
      return sanitizeText(String(input))
  }
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeMongoQuery,
  sanitizeRegexInput,
  sanitizeEmail,
  sanitizeUrl,
  sanitizePhone,
  sanitizeFilename,
  sanitizeJsonString,
  sanitizeObject,
  sanitizeHeaders,
  sanitizeIp,
  sanitizeRateLimitKey,
  sanitizeInput,
  createSafeRegex
}