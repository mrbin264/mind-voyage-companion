import React from 'react'
import { HabitCard } from './HabitCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { HabitProgress, HabitFilters } from '@/types/habit'
import { Plus, Filter, Search } from 'lucide-react'

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
  { key: 'all', label: 'All Habits' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'archived', label: 'Archived' },
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
      {/* Header with Add Button */}
      {onAddHabit && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {compact ? "Today's Habits" : "My Habits"}
          </h2>
          <Button onClick={onAddHabit} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
        </div>
      )}

      {/* Filters */}
      {showFilters && !compact && (
        <div className="space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={filters.status === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('status', tab.key)}
                className="flex-1 sm:flex-none"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search and Additional Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search habits..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
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
        <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
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