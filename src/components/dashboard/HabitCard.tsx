import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { HabitProgress, Habit, HabitLog } from '@/types/habit'
import {
  getHabitDisplayStatus,
  getHabitProgressPercentage,
} from '@/lib/habit-utils'
import {
  Clock,
  Target,
  Calendar,
  Flame,
  MoreVertical,
  Play,
  Pause,
  CheckCircle,
  Circle,
  SkipForward,
} from 'lucide-react'

interface HabitCardProps {
  habitProgress: HabitProgress
  onComplete?: (habitId: string, value?: number) => void
  onSkip?: (habitId: string) => void
  onEdit?: (habitId: string) => void
  onDelete?: (habitId: string) => void
  compact?: boolean
  timezone?: string
}

const getHabitStatusInfo = (status: string, streak: number = 0) => {
  switch (status) {
    case 'completed':
      return {
        badge: `${streak > 0 ? `🔥 ${streak} day streak` : 'Completed'}`,
        badgeClass:
          'bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded-full',
      }
    case 'in-progress':
      return {
        badge: 'In Progress',
        badgeClass:
          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full',
      }
    case 'paused':
      return {
        badge: 'Paused',
        badgeClass:
          'bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold px-3 py-1 rounded-full',
      }
    default:
      return {
        badge: 'Not Started',
        badgeClass:
          'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-semibold px-3 py-1 rounded-full',
      }
  }
}

const formatTarget = (habit: Habit) => {
  switch (habit.target.type) {
    case 'boolean':
      return 'Complete'
    case 'count':
      return `${habit.target.value} ${habit.target.unit || 'times'}`
    case 'duration':
      return `${habit.target.value} ${habit.target.unit || 'minutes'}`
    case 'amount':
      return `${habit.target.value} ${habit.target.unit || 'units'}`
    default:
      return 'Complete'
  }
}

const formatProgress = (habit: Habit, todayLog?: HabitLog) => {
  if (habit.target.type === 'boolean') {
    return todayLog?.completed ? 'Completed' : 'Not started'
  }

  const current = todayLog?.value || 0
  const target = habit.target.value || 1
  return `${current}/${target} ${habit.target.unit || 'units'}`
}

const formatScheduleInfo = (habit: Habit, todayLog?: HabitLog) => {
  const frequency =
    habit.frequency.type === 'daily'
      ? 'Every day'
      : habit.frequency.type === 'weekly'
        ? `${habit.frequency.daysOfWeek?.join(', ')}`
        : 'Custom schedule'

  let statusInfo = ''
  if (todayLog?.completed) {
    statusInfo = `Last completed: Today at ${new Date(todayLog.completedAt!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  } else if (todayLog?.value && todayLog.value > 0) {
    statusInfo = `Current: ${todayLog.value}/${habit.target.value} ${habit.target.unit || 'units'} • Goal: ${habit.target.value} ${habit.target.unit || 'units'}`
  } else {
    statusInfo = `Next scheduled: Today at ${habit.reminderTime || '6:00 PM'}`
  }

  return `${frequency} • ${statusInfo}`
}

export function HabitCard({
  habitProgress,
  onComplete,
  onSkip,
  onEdit,
  onDelete,
  compact = false,
}: HabitCardProps) {
  const { habit, todayLog, currentStreak, weeklyProgress } = habitProgress
  const status = getHabitDisplayStatus(habit, todayLog)
  const progressPercentage = getHabitProgressPercentage(habit, todayLog)

  const isCompleted = status === 'completed'
  const isPaused = habit.status.pausedAt !== undefined
  const isArchived = habit.status.archived
  const isInProgress = status === 'in-progress'
  const statusInfo = getHabitStatusInfo(
    isCompleted
      ? 'completed'
      : isPaused
        ? 'paused'
        : isInProgress
          ? 'in-progress'
          : 'not-started',
    currentStreak
  )

  const handleComplete = () => {
    if (habit.target.type === 'boolean') {
      onComplete?.(habit._id!, 1)
    } else {
      const value = prompt(`Enter value for ${habit.title}:`)
      if (value && !isNaN(Number(value))) {
        onComplete?.(habit._id!, Number(value))
      }
    }
  }

  const handleAddProgress = () => {
    if (habit.target.type === 'count' || habit.target.type === 'amount') {
      const current = todayLog?.value || 0
      onComplete?.(habit._id!, current + 1)
    } else {
      handleComplete()
    }
  }

  // Light/dark theme habit card
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm ${isPaused ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {isCompleted && '✅'} {habit.emoji || '📋'} {habit.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
            {habit.description}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
            {formatScheduleInfo(habit, todayLog)}
          </p>
        </div>

        {/* Status Badge or Progress */}
        {isCompleted ? (
          <div className={statusInfo.badgeClass}>{statusInfo.badge}</div>
        ) : isInProgress && habit.target.type !== 'boolean' ? (
          <div className="text-right">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Progress
            </p>
            <div className="w-24 mt-1 bg-slate-200 dark:bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
              {formatProgress(habit, todayLog)}
            </p>
          </div>
        ) : (
          <div className={statusInfo.badgeClass}>{statusInfo.badge}</div>
        )}
      </div>

      {/* Footer with Weekly Progress and Actions */}
      <div className="mt-4 border-t border-slate-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center text-sm">
          {/* Weekly Progress */}
          <span className="text-slate-600 dark:text-gray-400">
            Weekly Progress: {'●'.repeat(weeklyProgress.completed)}
            {'○'.repeat(weeklyProgress.total - weeklyProgress.completed)}{' '}
            {weeklyProgress.percentage}% ({weeklyProgress.completed}/
            {weeklyProgress.total}){isPaused && ' - Paused'}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap justify-end">
            {isCompleted ? (
              <>
                <button
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:underline"
                  onClick={() => onEdit?.(habit._id!)}
                >
                  Edit Habit
                </button>
                <button
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  onClick={() => onDelete?.(habit._id!)}
                >
                  Delete
                </button>
              </>
            ) : isInProgress ? (
              <>
                {habit.target.type !== 'boolean' && (
                  <button
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md"
                    onClick={handleAddProgress}
                  >
                    {habit.target.type === 'amount'
                      ? 'Add Glass'
                      : 'Add Progress'}
                  </button>
                )}
                <button
                  className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-md"
                  onClick={handleComplete}
                >
                  {habit.target.type === 'duration'
                    ? 'Continue Timer'
                    : 'Complete'}
                </button>
                <button
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:underline"
                  onClick={() => onEdit?.(habit._id!)}
                >
                  Edit
                </button>
                <button
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  onClick={() => onDelete?.(habit._id!)}
                >
                  Delete
                </button>
              </>
            ) : isPaused ? (
              <>
                <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 rounded-md">
                  Resume Habit
                </button>
                <button
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:underline"
                  onClick={() => onEdit?.(habit._id!)}
                >
                  Edit
                </button>
                <button
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  onClick={() => onDelete?.(habit._id!)}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md"
                  onClick={handleComplete}
                >
                  {habit.target.type === 'duration'
                    ? `Start ${habit.title.includes('Walk') ? 'Walk' : 'Timer'}`
                    : 'Start'}
                </button>
                <button
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:underline"
                  onClick={() => onSkip?.(habit._id!)}
                >
                  Skip Today
                </button>
                <button
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:underline"
                  onClick={() => onEdit?.(habit._id!)}
                >
                  Edit
                </button>
                <button
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  onClick={() => onDelete?.(habit._id!)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
