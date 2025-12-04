'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import { BarChart3, Target } from 'lucide-react'
import type { HabitProgress } from '@/types/habit'
import type { EmptyStateConfig } from '@/types/ui'

export interface WeeklyProgressItem {
  habitId: string
  habitTitle: string
  emoji?: string
  percentage: number
  completedDays: number
  totalDays: number
}

export interface WeeklyProgressChartProps {
  /** Array of habit progress data for the week */
  habits: HabitProgress[]
  /** Loading state for fetching progress data */
  loading?: boolean
  /** Error message if fetch failed */
  error?: Error | null
  /** Maximum number of habits to display (default: 4) */
  maxHabits?: number
  /** Custom className for the widget */
  className?: string
  /** Widget title (default: "📊 Weekly Progress") */
  title?: string
  /** Show achievements section (default: true) */
  showAchievements?: boolean
}

export function WeeklyProgressChart({
  habits,
  loading = false,
  error = null,
  maxHabits = 4,
  className = '',
  title = '📊 Weekly Progress',
  showAchievements = true,
}: WeeklyProgressChartProps) {
  // Limit habits to display
  const displayHabits = habits.slice(0, maxHabits)

  // Empty state configuration
  const emptyConfig: EmptyStateConfig = {
    icon: <BarChart3 className="w-12 h-12 text-gray-400" />,
    message: 'No habits to display',
    description: 'Create habits to see your weekly progress',
    variant: 'compact',
  }

  return (
    <WidgetCard
      title={title}
      loading={loading}
      error={error}
      empty={habits.length === 0}
      emptyConfig={emptyConfig}
      className={className}
    >
      <div className="space-y-3 text-sm">
        {displayHabits.map(habitProgress => (
          <ProgressBar
            key={habitProgress.habit._id}
            habitTitle={habitProgress.habit.title}
            percentage={habitProgress.weeklyProgress.percentage}
          />
        ))}
      </div>

      {showAchievements && habits.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h4 className="font-semibold text-sm sm:text-base text-gray-200 mb-2 flex items-center gap-2">
            <span>🎖️</span>
            <span>Achievements This Week:</span>
          </h4>
          <AchievementsList habits={habits} />
        </div>
      )}
    </WidgetCard>
  )
}

/** Individual Progress Bar Component */
interface ProgressBarProps {
  habitTitle: string
  percentage: number
}

function ProgressBar({ habitTitle, percentage }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1 gap-2">
        <span className="text-gray-300 text-xs sm:text-sm truncate flex-1">
          {habitTitle}
        </span>
        <span className="font-semibold text-gray-200 text-xs sm:text-sm whitespace-nowrap">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full origin-left transition-transform duration-300"
          style={{ transform: `scaleX(${Math.min(percentage, 100) / 100})` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${habitTitle} progress: ${percentage}%`}
        />
      </div>
    </div>
  )
}

/** Achievements List Component */
interface AchievementsListProps {
  habits: HabitProgress[]
}

function AchievementsList({ habits }: AchievementsListProps) {
  // Calculate achievements based on habit data
  const achievements: string[] = []

  // Find longest current streak
  const longestStreak = Math.max(...habits.map(h => h.currentStreak), 0)

  // Count habits with high weekly completion rate
  const highPerformers = habits.filter(
    h => h.weeklyProgress.percentage >= 80
  ).length

  // Add achievement strings
  if (longestStreak >= 7) {
    achievements.push(`✓ ${longestStreak}-day streak maintained`)
  }

  if (highPerformers > 0) {
    achievements.push(
      `✓ ${highPerformers} habit${highPerformers > 1 ? 's' : ''} above 80%`
    )
  }

  const perfectHabits = habits.filter(
    h => h.weeklyProgress.percentage === 100
  ).length
  if (perfectHabits > 0) {
    achievements.push(
      `⭐ ${perfectHabits} perfect week${perfectHabits > 1 ? 's' : ''}!`
    )
  }

  // Default message if no achievements
  if (achievements.length === 0) {
    achievements.push('Complete habits to earn achievements')
  }

  return (
    <ul className="space-y-1 text-xs sm:text-sm text-gray-400">
      {achievements.map((achievement, index) => (
        <li
          key={index}
          className={achievement.startsWith('⭐') ? 'text-yellow-400' : ''}
        >
          {achievement}
        </li>
      ))}
    </ul>
  )
}
