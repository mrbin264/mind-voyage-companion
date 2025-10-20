'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import { ResponsiveGrid } from '@/components/ui/responsive-grid'
import { Target, TrendingUp, Flame, Award } from 'lucide-react'
import type { EmptyStateConfig } from '@/types/ui'
import type { HabitSummary } from '@/types/habit'

export interface QuickStat {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'yellow'
}

export interface QuickStatsWidgetProps {
  /** Habit summary data */
  summary?: HabitSummary | null
  /** Loading state for fetching stats */
  loading?: boolean
  /** Error message if fetch failed */
  error?: Error | null
  /** Custom stats to display (overrides default summary-based stats) */
  customStats?: QuickStat[]
  /** Custom className for the widget */
  className?: string
  /** Widget title (default: "Quick Stats") */
  title?: string
}

export function QuickStatsWidget({
  summary,
  loading = false,
  error = null,
  customStats,
  className = '',
  title = '📊 Quick Stats',
}: QuickStatsWidgetProps) {
  // Generate stats from summary or use custom stats
  const stats: QuickStat[] = customStats ?? generateStatsFromSummary(summary)

  // Empty state configuration
  const emptyConfig: EmptyStateConfig = {
    icon: <Target className="w-12 h-12 text-gray-400" />,
    message: 'No stats available',
    description: 'Start tracking habits to see your stats',
    variant: 'compact',
  }

  return (
    <WidgetCard
      title={title}
      loading={loading}
      error={error}
      empty={stats.length === 0}
      emptyConfig={emptyConfig}
      className={className}
    >
      <ResponsiveGrid
        columns={{ mobile: 2, tablet: 2, desktop: 4, xl: 4 }}
        gap="gap-3 sm:gap-4"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </ResponsiveGrid>
    </WidgetCard>
  )
}

/** Individual Stat Card Component */
interface StatCardProps {
  stat: QuickStat
}

function StatCard({ stat }: StatCardProps) {
  const colorClasses = getColorClasses(stat.color)

  return (
    <div className="bg-[#18181B] border border-white/10 rounded-lg p-3 sm:p-4 hover:border-white/20 transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        <div className={`${colorClasses.icon}`}>{stat.icon}</div>
        <span className="text-xs sm:text-sm text-gray-400 font-medium">
          {stat.label}
        </span>
      </div>
      <div
        className={`text-xl sm:text-2xl font-bold ${colorClasses.text} mb-1`}
      >
        {stat.value}
      </div>
      {stat.subtitle && (
        <div className="text-xs text-gray-500">{stat.subtitle}</div>
      )}
    </div>
  )
}

/** Generate stats from HabitSummary */
function generateStatsFromSummary(summary?: HabitSummary | null): QuickStat[] {
  if (!summary) return []

  // Calculate weekly completion rate
  const weeklyRate =
    summary.weeklyTotal > 0
      ? Math.round((summary.weeklyCompletions / summary.weeklyTotal) * 100)
      : 0

  return [
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Today',
      value: summary.completedToday || 0,
      subtitle: `of ${summary.totalCompletedToday || 0} habits`,
      color: 'blue',
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'This Week',
      value: `${weeklyRate}%`,
      subtitle: 'completion rate',
      color: 'green',
    },
    {
      icon: <Flame className="w-4 h-4" />,
      label: 'Best Streak',
      value: summary.longestCurrentStreak?.streakCount || 0,
      subtitle: 'days',
      color: 'orange',
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: 'Total Habits',
      value: summary.totalHabits || 0,
      subtitle: `${summary.activeHabits || 0} active`,
      color: 'purple',
    },
  ]
}

/** Get color-specific Tailwind classes */
function getColorClasses(color?: string) {
  switch (color) {
    case 'blue':
      return { icon: 'text-blue-400', text: 'text-blue-300' }
    case 'green':
      return { icon: 'text-green-400', text: 'text-green-300' }
    case 'orange':
      return { icon: 'text-orange-400', text: 'text-orange-300' }
    case 'purple':
      return { icon: 'text-purple-400', text: 'text-purple-300' }
    case 'yellow':
      return { icon: 'text-yellow-400', text: 'text-yellow-300' }
    default:
      return { icon: 'text-gray-400', text: 'text-gray-300' }
  }
}
