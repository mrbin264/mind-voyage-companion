import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cn } from '../utils'
import { getJWTSecret } from '../auth-utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    })

    it('should handle undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('should handle Tailwind class conflicts', () => {
      expect(cn('px-4 px-6')).toBe('px-6')
    })
  })
})

/**
 * Security tests for JWT environment validation
 * Tests the fixes for Phase 1, Task 1.1 - Remove Hardcoded JWT Fallback Secret
 */
describe('JWT Security Environment Validation', () => {
  const originalEnv = process.env.JWT_SECRET

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.JWT_SECRET = originalEnv
    } else {
      delete process.env.JWT_SECRET
    }
  })

  describe('getJWTSecret()', () => {
    it('should throw error when JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET

      expect(() => getJWTSecret()).toThrow(
        'JWT_SECRET environment variable is required for authentication'
      )
    })

    it('should throw error when JWT_SECRET is too short', () => {
      process.env.JWT_SECRET = 'short'

      expect(() => getJWTSecret()).toThrow(
        'JWT_SECRET must be at least 32 characters long for security'
      )
    })

    it('should return valid JWT secret when properly configured', () => {
      const validSecret = 'a-very-secure-jwt-secret-with-sufficient-length-for-production-use'
      process.env.JWT_SECRET = validSecret

      const result = getJWTSecret()
      expect(result).toBe(validSecret)
    })

    it('should never fall back to hardcoded secrets - CRITICAL SECURITY TEST', () => {
      delete process.env.JWT_SECRET

      // This should throw an error, NOT return a fallback value
      expect(() => getJWTSecret()).toThrow()
      
      try {
        const result = getJWTSecret()
        // If we reach here, the function didn't throw - that's a security vulnerability
        expect.fail('getJWTSecret() should have thrown an error when JWT_SECRET is missing, but returned: ' + result)
      } catch (error: any) {
        // Expected - function should throw when JWT_SECRET is missing
        expect(error.message).toContain('JWT_SECRET environment variable is required')
      }
    })
  })
})
