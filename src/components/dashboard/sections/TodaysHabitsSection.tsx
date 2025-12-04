'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { Plus, Target } from 'lucide-react'
import type { HabitProgress } from '@/types/habit'

interface TodaysHabitsSectionProps {
  habits: HabitProgress[]
  actionLoading: boolean
  onCompleteHabit: (habitId: string, value?: number) => Promise<void>
  onShowCreateForm: () => void
}

export default function TodaysHabitsSection({
  habits,
  actionLoading,
  onCompleteHabit,
  onShowCreateForm,
}: TodaysHabitsSectionProps) {
  const router = useRouter()
  const todaysHabits = habits.slice(0, 4)

  const handleViewDetails = (habitId: string) => {
    console.log('🔍 TodaysHabitsSection: Navigating to habit details:', habitId)
    const targetUrl = `/dashboard/habits/${habitId}`
    console.log('🎯 Target URL:', targetUrl)

    // Use window.location for reliable navigation in lazy components
    window.location.href = targetUrl
  }

  return (
    <div className="xl:col-span-3">
      <WidgetCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-100">
            📈 Today&apos;s Habits
          </h3>
          <Button
            size="sm"
            onClick={onShowCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Habit</span>
            <span className="sm:hidden">Add Habit</span>
          </Button>
        </div>

        {todaysHabits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {todaysHabits.map(habitProgress => (
              <WidgetCard
                key={habitProgress.habit._id}
                className={`p-3 sm:p-4 border-l-4 ${
                  habitProgress.todayLog?.completed
                    ? 'border-green-500'
                    : 'border-gray-500'
                }`}
              >
                <h4
                  className="font-bold text-sm sm:text-base text-gray-100 mb-2 truncate"
                  title={habitProgress.habit.title}
                >
                  {habitProgress.habit.emoji || '📋'}{' '}
                  {habitProgress.habit.title}
                </h4>
                {habitProgress.todayLog?.completed ? (
                  <div>
                    <p className="text-sm text-green-400 mb-2">✓ Completed</p>
                    <p className="text-xs text-gray-400 mb-3">
                      🔥 {habitProgress.currentStreak}-day streak
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">○ Not started</p>
                    <p className="text-xs text-gray-400 mb-3">🎯 Planned</p>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:px-3 w-full sm:w-auto"
                      onClick={() =>
                        onCompleteHabit(habitProgress.habit._id!, 1)
                      }
                      disabled={actionLoading}
                    >
                      Complete
                    </Button>
                  </div>
                )}
              </WidgetCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl mb-4">🎯</div>
            <h4 className="font-semibold text-sm sm:text-base mb-2 text-gray-100">
              No habits for today
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 px-4">
              Create your first habit to start tracking your progress
            </p>
            <Button
              onClick={onShowCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
            >
              <Target className="h-4 w-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        )}
      </WidgetCard>
    </div>
  )
}
