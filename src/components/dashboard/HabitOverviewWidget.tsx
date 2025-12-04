'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { ResponsiveGrid } from '@/components/ui/responsive-grid'
import { Plus, Target } from 'lucide-react'
import type { HabitProgress } from '@/types/habit'
import type { EmptyStateConfig } from '@/types/ui'

export interface HabitOverviewWidgetProps {
  /** Array of habit progress data for today */
  habits: HabitProgress[]
  /** Loading state for fetching habits */
  loading?: boolean
  /** Error message if fetch failed */
  error?: Error | null
  /** Callback when "Add New Habit" is clicked */
  onAddHabit?: () => void
  /** Callback when "Complete" button is clicked */
  onCompleteHabit?: (habitId: string, value?: number) => Promise<void>
  /** Whether any action is currently loading */
  actionLoading?: boolean
  /** Maximum number of habits to display (default: 4) */
  maxHabits?: number
  /** Custom className for the widget */
  className?: string
}

export function HabitOverviewWidget({
  habits,
  loading = false,
  error = null,
  onAddHabit,
  onCompleteHabit,
  actionLoading = false,
  maxHabits = 4,
  className = '',
}: HabitOverviewWidgetProps) {
  // Limit habits to display
  const displayHabits = habits.slice(0, maxHabits)

  // Empty state configuration
  const emptyConfig: EmptyStateConfig = {
    icon: <Target className="w-12 h-12 text-gray-400" />,
    message: 'No habits for today',
    description: 'Create your first habit to start tracking your progress',
    action: onAddHabit
      ? {
          label: 'Create Your First Habit',
          onClick: onAddHabit,
          variant: 'primary' as const,
        }
      : undefined,
  }

  return (
    <WidgetCard
      title="📈 Today's Habits"
      loading={loading}
      error={error}
      empty={habits.length === 0}
      emptyConfig={emptyConfig}
      className={className}
      actions={
        onAddHabit ? (
          <Button
            size="sm"
            onClick={onAddHabit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Habit</span>
            <span className="sm:hidden">Add Habit</span>
          </Button>
        ) : undefined
      }
    >
      <ResponsiveGrid
        columns={{ mobile: 1, tablet: 2, desktop: 4, xl: 4 }}
        gap="gap-3 sm:gap-4"
      >
        {displayHabits.map(habitProgress => (
          <HabitCard
            key={habitProgress.habit._id}
            habitProgress={habitProgress}
            onComplete={onCompleteHabit}
            actionLoading={actionLoading}
          />
        ))}
      </ResponsiveGrid>
    </WidgetCard>
  )
}

/** Individual Habit Card Component */
interface HabitCardProps {
  habitProgress: HabitProgress
  onComplete?: (habitId: string, value?: number) => Promise<void>
  actionLoading?: boolean
}

function HabitCard({
  habitProgress,
  onComplete,
  actionLoading = false,
}: HabitCardProps) {
  const router = useRouter()
  const { habit, todayLog, currentStreak } = habitProgress
  const isCompleted = todayLog?.completed

  const handleComplete = async () => {
    if (onComplete && habit._id) {
      await onComplete(habit._id, 1)
    }
  }

  const handleViewDetails = () => {
    console.log('🔍 View Details clicked:', {
      habitId: habit._id,
      habitTitle: habit.title,
      targetUrl: `/dashboard/habits/${habit._id}`,
    })

    if (!habit._id) {
      console.error('❌ No habit._id available:', habit)
      alert('Error: Habit ID is missing. Please refresh the page.')
      return
    }

    try {
      router.push(`/dashboard/habits/${habit._id}` as any)
      console.log('✅ Navigation initiated')
    } catch (error) {
      console.error('❌ Navigation error:', error)
      alert('Failed to navigate. Please try again.')
    }
  }

  return (
    <WidgetCard
      className={`p-3 sm:p-4 border-l-4 ${
        isCompleted ? 'border-green-500' : 'border-gray-500'
      }`}
      noPadding
    >
      <h4
        className="font-bold text-sm sm:text-base text-gray-100 mb-2 truncate px-3 pt-3 sm:px-4 sm:pt-4"
        title={habit.title}
      >
        {habit.emoji || '📋'} {habit.title}
      </h4>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        {isCompleted ? (
          <>
            <p className="text-sm text-green-400 mb-2">✓ Completed</p>
            <p className="text-xs text-gray-400 mb-3">
              🔥 {currentStreak}-day streak
            </p>
            <button
              className="text-xs font-semibold text-blue-400 hover:underline"
              onClick={handleViewDetails}
            >
              View Details
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-2">○ Not started</p>
            <p className="text-xs text-gray-400 mb-3">🎯 Planned</p>
            <Button
              size="sm"
              className="text-xs sm:text-sm bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:px-3 w-full sm:w-auto"
              onClick={handleComplete}
              disabled={actionLoading}
            >
              Complete
            </Button>
          </>
        )}
      </div>
    </WidgetCard>
  )
}
