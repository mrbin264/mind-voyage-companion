'use client'

import React from 'react'
import { SkeletonLoader } from './skeleton-loader'
import { EmptyState } from './empty-state'
import { ErrorBoundary } from './error-boundary'
import { cn } from '@/lib/utils'
import type { WidgetCardProps } from '@/types/ui'

/**
 * Enhanced Widget Card Component
 *
 * Displays dashboard widgets with consistent dark theme styling and state management.
 * Implements FR-004 (responsive padding), FR-007 (loading states), FR-008 (empty states),
 * and FR-009 (error states).
 *
 * @component
 * @example
 * ```tsx
 * <WidgetCard
 *   title="Recent Habits"
 *   subtitle="Last 7 days"
 *   icon={<Activity className="w-5 h-5" />}
 *   loading={isLoading}
 *   error={error}
 *   empty={habits.length === 0}
 *   emptyConfig={{
 *     icon: <Inbox className="w-12 h-12" />,
 *     message: 'No habits yet',
 *     description: 'Create your first habit to get started',
 *     action: { label: 'Add Habit', onClick: handleAddHabit }
 *   }}
 * >
 *   {habits.map(habit => <HabitCard key={habit.id} habit={habit} />)}
 * </WidgetCard>
 * ```
 */
export function WidgetCard({
  title,
  subtitle,
  icon,
  children,
  loading = false,
  error = null,
  empty = false,
  emptyConfig,
  actions,
  fullWidth = false,
  noPadding = false,
  className = '',
}: WidgetCardProps) {
  // State management: loading → error → empty → normal
  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader variant="dashboard-widget" />
    }

    if (error) {
      return (
        <ErrorBoundary
          error={error}
          context="widget"
          retry={() => window.location.reload()}
        />
      )
    }

    if (empty && emptyConfig) {
      return <EmptyState {...emptyConfig} />
    }

    return children
  }

  // Title section (only if title or actions exist)
  const renderHeader = () => {
    if (!title && !actions) return null

    return (
      <div className="flex items-start justify-between mb-4">
        {title && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
              <div className="text-zinc-400 flex-shrink-0" aria-hidden="true">
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-base font-semibold text-zinc-100 truncate"
                title={title.length > 60 ? title : undefined}
              >
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-zinc-400 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-background-card border border-border-subtle rounded-xl',
        'transition-all duration-200',
        'hover:shadow-lg hover:shadow-black/20',
        !noPadding && 'p-4 md:p-6',
        !fullWidth && 'max-w-full',
        className
      )}
    >
      {renderHeader()}
      <div className={cn(noPadding && 'p-0')}>{renderContent()}</div>
    </div>
  )
}
