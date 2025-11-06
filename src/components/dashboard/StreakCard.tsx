'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import { Award, TrendingUp } from 'lucide-react'
import type { EmptyStateConfig } from '@/types/ui'

export interface HabitStreak {
  habitId: string
  habitTitle: string
  currentStreak: number
  longestStreak: number
  emoji?: string
}

export interface StreakCardProps {
  /** Array of habit streak data */
  streaks: HabitStreak[]
  /** Loading state for fetching streaks */
  loading?: boolean
  /** Error message if fetch failed */
  error?: Error | null
  /** Maximum number of streaks to display (default: 5) */
  maxStreaks?: number
  /** Custom className for the widget */
  className?: string
  /** Widget title (default: "Top Streaks") */
  title?: string
  /** Widget icon (default: Award) */
  icon?: React.ReactNode
}

export function StreakCard({
  streaks,
  loading = false,
  error = null,
  maxStreaks = 5,
  className = '',
  title = 'Top Streaks',
  icon = <Award className="w-5 h-5 text-yellow-400" />,
}: StreakCardProps) {
  // Sort by current streak (descending) and limit
  const topStreaks = streaks
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, maxStreaks)

  // Empty state configuration
  const emptyConfig: EmptyStateConfig = {
    icon: <TrendingUp className="w-12 h-12 text-gray-400" />,
    message: 'No active streaks yet',
    description: 'Complete habits to start building streaks!',
    variant: 'compact',
  }

  return (
    <WidgetCard
      title={title}
      icon={icon}
      loading={loading}
      error={error}
      empty={streaks.length === 0}
      emptyConfig={emptyConfig}
      className={className}
    >
      <div className="space-y-4">
        {topStreaks.map(streak => (
          <StreakItem key={streak.habitId} streak={streak} />
        ))}
      </div>
    </WidgetCard>
  )
}

/** Individual Streak Item Component */
interface StreakItemProps {
  streak: HabitStreak
}

function StreakItem({ streak }: StreakItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-white/5 rounded-lg p-2 -mx-2">
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate text-sm sm:text-base">
          {streak.emoji && <span className="mr-2">{streak.emoji}</span>}
          {streak.habitTitle}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">
          Best: {streak.longestStreak} days
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 font-bold text-lg sm:text-xl">
            {streak.currentStreak}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
            days
          </span>
        </div>
        {streak.currentStreak === streak.longestStreak &&
          streak.currentStreak > 0 && (
            <span
              className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full"
              title="Personal best!"
            >
              🏆
            </span>
          )}
      </div>
    </div>
  )
}
