import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

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
