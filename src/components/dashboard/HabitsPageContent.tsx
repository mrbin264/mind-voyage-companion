'use client'

import React, { useState, lazy, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'
import { HabitForm } from './HabitForm'
import { useHabits } from '@/hooks/useHabits'
import type { HabitFilters, CreateHabitRequest } from '@/types/habit'
import { Plus, Settings } from 'lucide-react'

// Lazy load heavy components for better initial page load
const HabitList = lazy(() =>
  import('./HabitList').then(m => ({ default: m.HabitList }))
)

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
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)

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
    updateHabit,
    deleteHabit,
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
    setEditingHabitId(habitId)
    setShowEditForm(true)
  }

  const handleUpdateHabit = async (habitData: any) => {
    if (!editingHabitId) return
    const success = await updateHabit(editingHabitId, habitData)
    if (success) {
      setShowEditForm(false)
      setEditingHabitId(null)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this habit? This action cannot be undone.'
      )
    ) {
      const success = await deleteHabit(habitId)
      if (success) {
        console.log('Habit deleted successfully')
      }
    }
  }

  const handleViewHabitDetails = (habitId: string) => {
    // TODO: Navigate to habit details page or open details modal
    console.log('View habit details:', habitId)
  }

  // Find the habit being edited
  const editingHabit = editingHabitId
    ? habits.find(h => h.habit._id === editingHabitId)?.habit
    : null

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
    <div className="space-y-6 sm:space-y-8">
      {/* Summary Card */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
          📊 Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#18181B] border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Today&apos;s Progress
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white break-words">
              {summary
                ? `${summary.completedToday}/${summary.totalCompletedToday} habits completed`
                : 'Loading...'}
            </p>
            {summary && summary.totalCompletedToday > 0 && (
              <p className="text-sm text-blue-400 mt-1">
                {Math.round(
                  (summary.completedToday / summary.totalCompletedToday) * 100
                )}
                % complete
              </p>
            )}
          </div>
          <div className="bg-[#18181B] border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Current Longest Streak
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white break-words">
              {summary && summary.longestCurrentStreak.streakCount > 0
                ? `🔥 ${summary.longestCurrentStreak.streakCount} days`
                : '🔥 0 days'}
            </p>
            {summary && summary.longestCurrentStreak.streakCount > 0 && (
              <p className="text-sm text-orange-400 mt-1 truncate">
                {summary.longestCurrentStreak.habitTitle}
              </p>
            )}
          </div>
          <div className="bg-[#18181B] border border-white/10 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              This Week&apos;s Completions
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white">
              {summary
                ? `📊 ${summary.weeklyCompletions}/${summary.weeklyTotal} total`
                : 'Loading...'}
            </p>
            {summary && summary.weeklyTotal > 0 && (
              <p className="text-sm text-green-400 mt-1">
                {Math.round(
                  (summary.weeklyCompletions / summary.weeklyTotal) * 100
                )}
                % completion rate
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Habit List - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="space-y-4">
            <SkeletonLoader variant="habit-card" count={3} />
          </div>
        }
      >
        <HabitList
          habits={habits}
          loading={loading}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onAddHabit={handleAddHabit}
          onCompleteHabit={handleCompleteHabit}
          onSkipHabit={handleSkipHabit}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onViewHabitDetails={handleViewHabitDetails}
          compact={false}
          showFilters={true}
          emptyMessage={
            filters.status === 'all'
              ? 'No habits found. Create your first habit to get started!'
              : `No ${filters.status} habits found. Try adjusting your filters.`
          }
        />
      </Suspense>

      {/* Create Habit Form Modal */}
      {showCreateForm && (
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowCreateForm(false)}
          loading={actionLoading}
        />
      )}

      {/* Edit Habit Form Modal */}
      {showEditForm && editingHabit && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleUpdateHabit}
          onCancel={() => {
            setShowEditForm(false)
            setEditingHabitId(null)
          }}
          loading={actionLoading}
        />
      )}
    </div>
  )
}
