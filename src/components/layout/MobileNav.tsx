'use client'

import React from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MobileNavProps {
  /** Whether mobile menu is open */
  isOpen: boolean

  /** Callback to toggle mobile menu */
  onToggle: () => void

  /** Additional CSS classes */
  className?: string
}

/**
 * MobileNav - Hamburger menu button for mobile navigation
 *
 * @component
 * @example
 * ```tsx
 * <MobileNav
 *   isOpen={isMobileMenuOpen}
 *   onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
 * />
 * ```
 *
 * @responsive
 * - Visible only on mobile/tablet (< 1024px)
 * - Hidden on desktop (≥ 1024px)
 *
 * @accessibility
 * - aria-label describes button purpose
 * - aria-expanded indicates open/closed state
 * - aria-controls links to sidebar element
 * - Keyboard accessible
 */
export function MobileNav({ isOpen, onToggle, className }: MobileNavProps) {
  return (
    <button
      className={cn(
        // Base styles
        'lg:hidden', // Hidden on desktop
        'p-2 rounded-lg',
        'text-gray-400 hover:text-white',
        'hover:bg-gray-700/50',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'touch-manipulation active:scale-95',

        // Positioning (when used in header)
        'relative z-50',

        className
      )}
      onClick={onToggle}
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      aria-controls="sidebar-navigation"
      type="button"
    >
      {/* Animated icon transition */}
      <div className="relative w-6 h-6">
        {/* Menu icon (3 lines) */}
        <Menu
          className={cn(
            'w-6 h-6 absolute inset-0 transition-all duration-300',
            isOpen
              ? 'opacity-0 rotate-180 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          )}
          aria-hidden="true"
        />

        {/* Close icon (X) */}
        <X
          className={cn(
            'w-6 h-6 absolute inset-0 transition-all duration-300',
            isOpen
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-0'
          )}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}

/**
 * MobileMenuOverlay - Backdrop overlay for mobile menu
 *
 * @component
 * @example
 * ```tsx
 * <MobileMenuOverlay
 *   isOpen={isMobileMenuOpen}
 *   onClose={() => setIsMobileMenuOpen(false)}
 * />
 * ```
 */
export function MobileMenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/50 z-40 lg:hidden',
        'backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  )
}
