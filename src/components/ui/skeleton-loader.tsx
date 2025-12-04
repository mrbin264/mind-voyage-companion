'use client'

import { cn } from '@/lib/utils'
import type { SkeletonLoaderProps } from '@/types/ui'

/**
 * Skeleton loader component with multiple variants
 *
 * Displays animated loading placeholders matching target widget dimensions.
 * Maintains layout stability during data fetching (CLS < 0.1).
 *
 * @example
 * ```tsx
 * <SkeletonLoader variant="dashboard-widget" count={3} />
 * ```
 */
export function SkeletonLoader({
  variant = 'dashboard-widget',
  count = 1,
  animate = true,
  className,
}: SkeletonLoaderProps) {
  const baseClasses = cn(
    'bg-zinc-800 rounded-lg',
    animate && 'animate-pulse',
    className
  )

  // Variant-specific dimensions and structure
  const renderSkeleton = () => {
    switch (variant) {
      case 'dashboard-widget':
        return (
          <div className={cn(baseClasses, 'p-6 space-y-4')}>
            <div className="h-6 bg-zinc-700 rounded w-1/3" />
            <div className="h-32 bg-zinc-700 rounded" />
            <div className="h-4 bg-zinc-700 rounded w-2/3" />
          </div>
        )

      case 'habit-card':
        return (
          <div className={cn(baseClasses, 'p-4 space-y-3')}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-zinc-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-700 rounded w-1/2" />
              </div>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full w-full" />
          </div>
        )

      case 'chart':
        return (
          <div className={cn(baseClasses, 'h-64 w-full')}>
            <div className="h-full bg-zinc-700 rounded" />
          </div>
        )

      case 'analytics':
        return (
          <div className={cn(baseClasses, 'p-6 space-y-4')}>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-zinc-700 rounded w-1/4" />
              <div className="h-8 bg-zinc-700 rounded w-16" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-zinc-700 rounded w-3/4" />
                  <div className="h-6 bg-zinc-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )

      case 'list-item':
        return (
          <div className={cn(baseClasses, 'p-3 flex items-center gap-3')}>
            <div className="h-8 w-8 bg-zinc-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-zinc-700 rounded w-3/4" />
              <div className="h-2 bg-zinc-700 rounded w-1/2" />
            </div>
          </div>
        )

      case 'avatar':
        return <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} />

      case 'text-line':
        return <div className={cn(baseClasses, 'h-4 w-full')} />

      default:
        return <div className={cn(baseClasses, 'h-20 w-full')} />
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${variant.replace('-', ' ')}`}
    >
      {[...Array(count)].map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : undefined}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}
