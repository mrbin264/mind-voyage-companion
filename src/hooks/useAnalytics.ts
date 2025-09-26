import { useState, useEffect, useCallback } from 'react'
import type {
  AnalyticsOverview,
  AnalyticsFilters,
  HabitAnalytics,
  AnalyticsTimeframe,
} from '@/types/analytics'

interface UseAnalyticsReturn {
  // Data
  overview: AnalyticsOverview | null
  habitAnalytics: HabitAnalytics | null

  // Loading states
  loading: boolean
  habitLoading: boolean
  exportLoading: boolean

  // Error state
  error: string | null

  // Actions
  fetchOverview: (filters?: AnalyticsFilters) => Promise<void>
  fetchHabitAnalytics: (habitId: string) => Promise<void>
  exportAnalytics: (format: 'json' | 'csv' | 'pdf') => Promise<void>
  refreshData: () => Promise<void>

  // Filters
  filters: AnalyticsFilters
  setFilters: (filters: AnalyticsFilters) => void
  setTimeframe: (timeframe: AnalyticsTimeframe) => void
}

const defaultFilters: AnalyticsFilters = {
  timeframe: {
    type: 'month',
  },
  includeArchived: false,
  includeJournal: true,
}

export function useAnalytics(
  initialFilters: AnalyticsFilters = defaultFilters
): UseAnalyticsReturn {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [habitAnalytics, setHabitAnalytics] = useState<HabitAnalytics | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [habitLoading, setHabitLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters)

  const fetchOverview = useCallback(
    async (customFilters?: AnalyticsFilters) => {
      setLoading(true)
      setError(null)

      try {
        const activeFilters = customFilters || filters
        const searchParams = new URLSearchParams({
          timeframe: activeFilters.timeframe.type,
          ...(activeFilters.timeframe.startDate && {
            startDate: activeFilters.timeframe.startDate,
          }),
          ...(activeFilters.timeframe.endDate && {
            endDate: activeFilters.timeframe.endDate,
          }),
          ...(activeFilters.habitIds && {
            habitIds: activeFilters.habitIds.join(','),
          }),
          ...(activeFilters.includeArchived !== undefined && {
            includeArchived: String(activeFilters.includeArchived),
          }),
          ...(activeFilters.includeJournal !== undefined && {
            includeJournal: String(activeFilters.includeJournal),
          }),
        })

        const response = await fetch(
          `/api/analytics?${searchParams.toString()}`
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch analytics')
        }

        setOverview(data.data)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  const fetchHabitAnalytics = useCallback(
    async (habitId: string) => {
      setHabitLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams({
          timeframe: filters.timeframe.type,
          ...(filters.timeframe.startDate && {
            startDate: filters.timeframe.startDate,
          }),
          ...(filters.timeframe.endDate && {
            endDate: filters.timeframe.endDate,
          }),
        })

        const response = await fetch(
          `/api/analytics/habits/${habitId}?${searchParams.toString()}`
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch habit analytics')
        }

        setHabitAnalytics(data.data)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Habit analytics fetch error:', err)
      } finally {
        setHabitLoading(false)
      }
    },
    [filters]
  )

  const exportAnalytics = useCallback(
    async (format: 'json' | 'csv' | 'pdf') => {
      setExportLoading(true)
      setError(null)

      try {
        const exportData = {
          timeframe: filters.timeframe,
          format,
          includeCharts: format === 'pdf',
          sections: [
            'habits',
            'journal',
            'mood',
            'streaks',
            'achievements',
          ] as const,
        }

        const response = await fetch('/api/analytics/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(exportData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          )
        }

        // Handle file download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        const filename = `analytics-${filters.timeframe.type}-${new Date().toISOString().split('T')[0]}.${format}`
        link.download = filename

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Export failed'
        setError(errorMessage)
        console.error('Analytics export error:', err)
      } finally {
        setExportLoading(false)
      }
    },
    [filters]
  )

  const refreshData = useCallback(async () => {
    await fetchOverview()
  }, [fetchOverview])

  const setTimeframe = useCallback((timeframe: AnalyticsTimeframe) => {
    setFilters(prev => ({
      ...prev,
      timeframe,
    }))
  }, [])

  const updateFilters = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(newFilters)
  }, [])

  // Auto-fetch when filters change
  useEffect(() => {
    fetchOverview()
  }, [filters.timeframe.type]) // Only refetch when timeframe type changes

  // Initial data fetch
  useEffect(() => {
    fetchOverview()
  }, []) // Empty dependency array for initial fetch only

  return {
    // Data
    overview,
    habitAnalytics,

    // Loading states
    loading,
    habitLoading,
    exportLoading,

    // Error state
    error,

    // Actions
    fetchOverview,
    fetchHabitAnalytics,
    exportAnalytics,
    refreshData,

    // Filters
    filters,
    setFilters: updateFilters,
    setTimeframe,
  }
}

// Helper hooks for specific analytics data
export function useHabitStreaks() {
  const { overview, loading, error } = useAnalytics()

  return {
    streaks: overview?.activeStreaks || [],
    loading,
    error,
  }
}

export function useWeeklyTrends() {
  const { overview, loading, error } = useAnalytics()

  return {
    trends: overview?.weeklyTrends || [],
    loading,
    error,
  }
}

export function useMoodCorrelations() {
  const { overview, loading, error } = useAnalytics()

  return {
    correlations: overview?.moodCorrelations || [],
    loading,
    error,
  }
}

export function useJournalAnalytics() {
  const { overview, loading, error } = useAnalytics()

  return {
    analytics: overview?.journalAnalytics || null,
    loading,
    error,
  }
}

export function useAIInsights() {
  const { overview, loading, error } = useAnalytics()

  return {
    insights: overview?.aiInsights || [],
    loading,
    error,
  }
}

export function useAchievements() {
  const { overview, loading, error } = useAnalytics()

  return {
    recentAchievements: overview?.recentAchievements || [],
    nextAchievement: overview?.nextAchievement || null,
    loading,
    error,
  }
}
