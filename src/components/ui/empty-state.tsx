'use client'

import { cn } from '@/lib/utils'
import type { EmptyStateConfig } from '@/types/ui'

/**
 * Empty state component for widgets with no data
 *
 * Displays user-friendly placeholder with optional call-to-action.
 * Follows specification examples for helpful CTA text.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Icon />}
 *   message="No habits yet"
 *   description="Start tracking your first habit"
 *   action={{
 *     label: "Create Habit",
 *     onClick: () => router.push('/habits/new')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  message,
  description,
  action,
  variant = 'default',
}: EmptyStateConfig) {
  const containerClasses = cn(
    'flex flex-col items-center justify-center text-center',
    variant === 'default' ? 'py-12' : 'py-8'
  )

  return (
    <div role="status" aria-label={message} className={containerClasses}>
      {/* Icon */}
      {icon && <div className="mb-4 text-zinc-500">{icon}</div>}

      {/* Message */}
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{message}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-zinc-400 mb-6 max-w-sm">{description}</p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
            action.variant === 'secondary'
              ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          )}
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
