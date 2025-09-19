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
  onViewHabitDetails?: (habitId: string) => void
  compact?: boolean
  showFilters?: boolean
  emptyMessage?: string
}

const filterTabs = [
  { key: 'all', label: 'All Habits', count: 0 },
  { key: 'active', label: 'Active', count: 6 },
  { key: 'paused', label: 'Paused', count: 2 },
  { key: 'archived', label: 'Archive', count: 0 },
]

export function HabitList({
  habits,
  loading = false,
  filters = { status: 'all' },
  onFiltersChange,
  onAddHabit,
  onCompleteHabit,
  onSkipHabit,
  onEditHabit,
  onViewHabitDetails,
  compact = false,
  showFilters = true,
  emptyMessage = "No habits found. Create your first habit to get started!"
}: HabitListProps) {
  
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
    <div className="space-y-6">
      {/* Header with Page Title and Add Button */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">📈 My Habits</h2>
        </div>
        <div className="flex items-center gap-2">
          {onAddHabit && (
            <Button 
              onClick={onAddHabit}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Habit
            </Button>
          )}
          <Button 
            variant="secondary"
            className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && !compact && (
        <div className="space-y-4">
          {/* Filter Tabs - Dark theme matching HTML design */}
          <div className="flex flex-wrap gap-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`flex-1 sm:flex-auto font-semibold py-3 px-6 rounded-lg transition-colors ${
                  filters.status === tab.key 
                    ? 'bg-blue-600/20 text-blue-300' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => handleFilterChange('status', tab.key)}
              >
                {tab.label}
                {tab.key !== 'all' && tab.count > 0 && ` (${tab.count})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Habit Cards */}
      {habits.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">
              {emptyMessage}
            </p>
            {onAddHabit && (
              <Button onClick={onAddHabit}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {habits.map((habitProgress) => (
            <HabitCard
              key={habitProgress.habit._id}
              habitProgress={habitProgress}
              onComplete={onCompleteHabit}
              onSkip={onSkipHabit}
              onEdit={onEditHabit}
              onViewDetails={onViewHabitDetails}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}