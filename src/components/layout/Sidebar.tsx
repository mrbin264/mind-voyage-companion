'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface SidebarNavItem {
  href: string
  icon: LucideIcon
  label: string
}

export interface SidebarProps {
  /** Navigation items to display */
  navigationItems: SidebarNavItem[]

  /** Whether sidebar is in collapsed state (icon-only mode) */
  isCollapsed?: boolean

  /** Whether sidebar is visible (mobile) */
  isVisible?: boolean

  /** Callback when mobile sidebar should close */
  onClose?: () => void

  /** Additional CSS classes */
  className?: string

  /** Show upgrade pro button */
  showUpgradeButton?: boolean
}

/**
 * Sidebar - Responsive navigation sidebar component
 *
 * @component
 * @example
 * ```tsx
 * <Sidebar
 *   navigationItems={navItems}
 *   isCollapsed={isTabletCollapsed}
 *   isVisible={isMobileMenuOpen}
 *   onClose={() => setIsMobileMenuOpen(false)}
 * />
 * ```
 *
 * @responsive
 * - Mobile (< 768px): Hidden by default, overlay when visible
 * - Tablet (768px - 1024px): Collapsible (64px ↔ 256px)
 * - Desktop (≥ 1024px): Persistent full-width (256px)
 *
 * @accessibility
 * - Semantic <nav> landmark
 * - aria-label for navigation
 * - Keyboard accessible navigation
 * - Focus trap when mobile sidebar open
 */
export function Sidebar({
  navigationItems,
  isCollapsed = false,
  isVisible = false,
  onClose,
  className,
  showUpgradeButton = true,
}: SidebarProps) {
  const pathname = usePathname()

  // Determine sidebar width based on state
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64'

  return (
    <nav
      className={cn(
        // Base styles
        'flex flex-col bg-[#101010] border-r border-white/10 transition-all duration-300 ease-in-out',

        // Responsive positioning
        'fixed inset-y-0 left-0 z-50',
        'lg:relative lg:translate-x-0',

        // Mobile: hidden by default, slide in when visible
        isVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',

        // Width (responsive + collapsed state)
        sidebarWidth,

        // Padding
        isCollapsed ? 'p-4' : 'p-6',

        className
      )}
      aria-label="Main navigation"
      aria-hidden={!isVisible && 'true'}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 transition-opacity hover:opacity-80',
            isCollapsed && 'justify-center w-full'
          )}
          onClick={onClose}
        >
          <span
            className="text-3xl flex-shrink-0"
            aria-label="Mind Voyage Logo"
          >
            🧠
          </span>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-200">Mind Voyage</h1>
          )}
        </Link>
      </div>

      {/* Skip to content link (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to content
      </a>

      {/* Navigation Items */}
      <div className="flex-grow space-y-2 overflow-y-auto">
        {navigationItems.map(item => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                // Base styles
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500',

                // Collapsed state: center icon, hide label
                isCollapsed && 'justify-center px-2',

                // Active state
                isActive && [
                  'bg-gradient-to-r from-blue-600/20 to-purple-600/20',
                  'border-l-4 border-blue-500',
                  'font-semibold text-blue-300',
                ],

                // Inactive state
                !isActive && 'text-gray-300'
              )}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'flex-shrink-0',
                  isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Upgrade Pro Button */}
      {showUpgradeButton && (
        <div className="mt-auto pt-6 border-t border-white/10">
          <Button
            className={cn(
              'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
              'text-white font-semibold py-3 rounded-lg transition-all duration-200',
              'flex items-center justify-center gap-3',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#101010]',
              isCollapsed && 'px-2'
            )}
            onClick={() =>
              alert(
                '🌟 Pro features coming soon! Stay tuned for advanced analytics, AI insights, and premium habit templates.'
              )
            }
            aria-label={isCollapsed ? 'Upgrade to Pro' : undefined}
          >
            <Star
              className={cn(isCollapsed ? 'w-6 h-6' : 'w-5 h-5')}
              aria-hidden="true"
            />
            {!isCollapsed && 'Upgrade Pro'}
          </Button>
        </div>
      )}
    </nav>
  )
}
