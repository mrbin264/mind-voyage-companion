import React from 'react'
import { HabitCard } from './HabitCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { HabitProgress, HabitFilters } from '@/types/habit'
import { Plus, Filter, Search, Settings } from 'lucide-react'

interface HabitListProps {
  habits: HabitProgress[]
  loading?: boolean
  filters?: HabitFilters
  onFiltersChange?: (filters: HabitFilters) => void
  onAddHabit?: () => void
  onCompleteHabit?: (habitId: string, value?: number) => void
  onSkipHabit?: (habitId: string) => void
  onEditHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
  compact?: boolean
  showFilters?: boolean
  emptyMessage?: string
}

export function HabitList({
  habits,
  loading = false,
  filters = { status: 'all' },
  onFiltersChange,
  onAddHabit,
  onCompleteHabit,
  onSkipHabit,
  onEditHabit,
  onDeleteHabit,
  compact = false,
  showFilters = true,
  emptyMessage = 'No habits found. Create your first habit to get started!',
}: HabitListProps) {
  // Calculate dynamic counts based on actual habits data
  const habitCounts = React.useMemo(() => {
    const counts = {
      all: habits.length,
      active: 0,
      paused: 0,
      archived: 0,
    }

    habits.forEach(habitProgress => {
      const habit = habitProgress.habit
      if (habit.status.archived) {
        counts.archived++
      } else if (habit.status.pausedAt) {
        counts.paused++
      } else if (habit.status.active) {
        counts.active++
      }
    })

    return counts
  }, [habits])

  // Filter habits for display based on current filter
  const displayedHabits = React.useMemo(() => {
    if (!filters.status || filters.status === 'all') {
      return habits
    }

    return habits.filter(habitProgress => {
      const habit = habitProgress.habit
      switch (filters.status) {
        case 'active':
          return habit.status.active && !habit.status.archived
        case 'paused':
          return habit.status.pausedAt && !habit.status.archived
        case 'archived':
          return habit.status.archived
        default:
          return true
      }
    })
  }, [habits, filters.status])

  const filterTabs = [
    { key: 'all', label: 'All Habits', count: habitCounts.all },
    { key: 'active', label: 'Active', count: habitCounts.active },
    { key: 'paused', label: 'Paused', count: habitCounts.paused },
    { key: 'archived', label: 'Archive', count: habitCounts.archived },
  ]

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange?.({ ...filters, [key]: value })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div>
                  <div className="w-32 h-4 bg-muted rounded mb-2"></div>
                  <div className="w-48 h-3 bg-muted rounded"></div>
                </div>
              </div>
              <div className="w-16 h-6 bg-muted rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Page Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gray-100">
            📈 My Habits
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onAddHabit && (
            <Button
              onClick={onAddHabit}
              className="flex-1 sm:flex-none text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Habit</span>
              <span className="sm:hidden">Add Habit</span>
            </Button>
          )}
          <Button
            variant="secondary"
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center gap-2 touch-manipulation"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && !compact && (
        <div className="space-y-4">
          {/* Filter Tabs - Responsive grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                className={`font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-colors text-sm sm:text-base touch-manipulation active:scale-95 ${
                  filters.status === tab.key
                    ? 'bg-blue-600/20 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleFilterChange('status', tab.key)}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-75">
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Habit Cards */}
      {displayedHabits.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-5xl sm:text-6xl mb-4">🎯</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No habits yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {emptyMessage}
            </p>
            {onAddHabit && (
              <Button onClick={onAddHabit} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {displayedHabits.map(habitProgress => (
            <HabitCard
              key={habitProgress.habit._id}
              habitProgress={habitProgress}
              onComplete={onCompleteHabit}
              onSkip={onSkipHabit}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}
