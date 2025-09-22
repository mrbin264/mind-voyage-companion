'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HabitSummaryCards } from './HabitSummary'
import { HabitList } from './HabitList'
import { HabitForm } from './HabitForm'
import { useHabits } from '@/hooks/useHabits'
import type { HabitFilters, CreateHabitRequest } from '@/types/habit'
import { Plus, Settings } from 'lucide-react'

interface AuthUser {
  userId: string
  email: string
  name: string
}

interface HabitsPageContentProps {
  user: AuthUser
}

export function HabitsPageContent({ user }: HabitsPageContentProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    habits,
    summary,
    loading,
    summaryLoading,
    actionLoading,
    error,
    filters,
    setFilters,
    createHabit,
    completeHabit,
    skipHabit,
    fetchHabits,
    fetchSummary,
  } = useHabits({ status: 'all' })

  const handleCompleteHabit = async (habitId: string, value?: number) => {
    const success = await completeHabit(habitId, value)
    if (success) {
      // Data will be refreshed automatically by the hook
      console.log('Habit completed successfully')
    }
  }

  const handleSkipHabit = async (habitId: string) => {
    const reason = prompt('Why are you skipping this habit today? (optional)')
    const success = await skipHabit(habitId, reason || undefined)
    if (success) {
      console.log('Habit skipped successfully')
    }
  }

  const handleFiltersChange = (newFilters: HabitFilters) => {
    setFilters(newFilters)
  }

  const handleAddHabit = () => {
    setShowCreateForm(true)
  }

  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    const success = await createHabit(habitData)
    if (success) {
      setShowCreateForm(false)
    }
  }

  const handleEditHabit = (habitId: string) => {
    // TODO: Open edit modal/form
    console.log('Edit habit:', habitId)
  }

  const handleViewHabitDetails = (habitId: string) => {
    // TODO: Navigate to habit details page or open details modal
    console.log('View habit details:', habitId)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Card className="p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">Error loading habits: {error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 text-center sm:text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Today&apos;s Progress</p>
            <p className="text-xl font-semibold text-white">
              {summary
                ? `${summary.completedToday}/${summary.totalCompletedToday} habits completed (${Math.round((summary.completedToday / summary.totalCompletedToday) * 100) || 0}%)`
                : 'Loading...'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Longest Streak</p>
            <p className="text-xl font-semibold text-white">
              {summary && summary.longestCurrentStreak.streakCount > 0
                ? `🔥 ${summary.longestCurrentStreak.streakCount} days (${summary.longestCurrentStreak.habitTitle})`
                : '🔥 0 days'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              This Week&apos;s Completions
            </p>
            <p className="text-xl font-semibold text-white">
              {summary
                ? `📊 ${summary.weeklyCompletions}/${summary.weeklyTotal} total`
                : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Habit List */}
      <HabitList
        habits={habits}
        loading={loading}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onAddHabit={handleAddHabit}
        onCompleteHabit={handleCompleteHabit}
        onSkipHabit={handleSkipHabit}
        onEditHabit={handleEditHabit}
        onViewHabitDetails={handleViewHabitDetails}
        compact={false}
        showFilters={true}
        emptyMessage={
          filters.status === 'all'
            ? 'No habits found. Create your first habit to get started!'
            : `No ${filters.status} habits found. Try adjusting your filters.`
        }
      />

      {/* Create Habit Form Modal */}
      {showCreateForm && (
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowCreateForm(false)}
          loading={actionLoading}
        />
      )}
    </div>
  )
}
