import React from 'react'
import { cn } from '@/lib/utils'

export interface ResponsiveColumns {
  mobile?: number
  tablet?: number
  desktop?: number
  xl?: number
}

export interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: ResponsiveColumns
  gap?: string
  className?: string
}

/**
 * ResponsiveGrid - A utility component for creating responsive grid layouts
 *
 * @component
 * @example
 * ```tsx
 * <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 5 }}>
 *   <Widget />
 *   <Widget />
 *   <Widget />
 * </ResponsiveGrid>
 * ```
 *
 * @param {ResponsiveGridProps} props - Component props
 * @param {React.ReactNode} props.children - Grid items to render
 * @param {ResponsiveColumns} props.columns - Column configuration per breakpoint
 * @param {string} props.gap - Tailwind gap class (default: 'gap-6')
 * @param {string} props.className - Additional CSS classes
 *
 * @breakpoints
 * - mobile: < 640px (sm)
 * - tablet: 640px - 1024px (sm to lg)
 * - desktop: 1024px - 1280px (lg to xl)
 * - xl: ≥ 1280px (xl)
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, xl: 5 },
  gap = 'gap-6',
  className,
}: ResponsiveGridProps) {
  // Build dynamic grid column classes based on breakpoints
  const gridClasses: string[] = ['grid']

  // Mobile (base, < 640px)
  if (columns.mobile !== undefined) {
    gridClasses.push(`grid-cols-${columns.mobile}`)
  }

  // Tablet (640px - 1024px)
  if (columns.tablet !== undefined) {
    gridClasses.push(`sm:grid-cols-${columns.tablet}`)
  }

  // Desktop (1024px - 1280px)
  if (columns.desktop !== undefined) {
    gridClasses.push(`lg:grid-cols-${columns.desktop}`)
  }

  // XL (≥ 1280px)
  if (columns.xl !== undefined) {
    gridClasses.push(`xl:grid-cols-${columns.xl}`)
  }

  // Add gap
  gridClasses.push(gap)

  return (
    <div className={cn(...gridClasses, className)} role="list">
      {React.Children.map(children, (child, index) => (
        <div key={index} role="listitem">
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * Preset responsive grid configurations for common layouts
 */
export const GridPresets = {
  /** Single column on all breakpoints */
  singleColumn: { mobile: 1, tablet: 1, desktop: 1, xl: 1 },

  /** 1 → 2 columns (mobile → tablet+) */
  twoColumn: { mobile: 1, tablet: 2, desktop: 2, xl: 2 },

  /** 1 → 2 → 3 columns (mobile → tablet → desktop) */
  threeColumn: { mobile: 1, tablet: 2, desktop: 3, xl: 3 },

  /** 1 → 2 → 3 → 4 columns (progressive scaling) */
  fourColumn: { mobile: 1, tablet: 2, desktop: 3, xl: 4 },

  /** 1 → 2 → 4 columns (dashboard habit cards) */
  habitCards: { mobile: 1, tablet: 2, desktop: 4, xl: 4 },

  /** 1 → 2 → 3 → 5 columns (default dashboard grid) */
  dashboard: { mobile: 1, tablet: 2, desktop: 3, xl: 5 },

  /** 2 → 4 → 6 columns (dense grid) */
  dense: { mobile: 2, tablet: 4, desktop: 6, xl: 6 },
} as const
