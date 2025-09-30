import { useState, useEffect, useCallback } from 'react'
import type {
  Habit,
  HabitProgress,
  HabitSummary,
  CreateHabitRequest,
  UpdateHabitRequest,
  LogHabitRequest,
  HabitFilters,
} from '@/types/habit'

interface UseHabitsReturn {
  // Data
  habits: HabitProgress[]
  summary: HabitSummary | null

  // Loading states
  loading: boolean
  summaryLoading: boolean
  actionLoading: boolean

  // Error state
  error: string | null

  // Actions
  fetchHabits: (filters?: HabitFilters) => Promise<void>
  fetchSummary: () => Promise<void>
  createHabit: (habit: CreateHabitRequest) => Promise<Habit | null>
  updateHabit: (
    id: string,
    updates: UpdateHabitRequest
  ) => Promise<Habit | null>
  deleteHabit: (id: string) => Promise<boolean>
  logHabit: (id: string, log: LogHabitRequest) => Promise<boolean>
  completeHabit: (id: string, value?: number) => Promise<boolean>
  skipHabit: (id: string, reason?: string) => Promise<boolean>

  // Filters
  filters: HabitFilters
  setFilters: (filters: HabitFilters) => void
}

export function useHabits(
  initialFilters: HabitFilters = { status: 'active' }
): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitProgress[]>([])
  const [summary, setSummary] = useState<HabitSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<HabitFilters>(initialFilters)

  const handleError = (err: any, fallbackMessage: string) => {
    const message = err?.message || fallbackMessage
    setError(message)
    console.error(fallbackMessage, err)
  }

  const fetchHabits = useCallback(
    async (customFilters?: HabitFilters) => {
      try {
        setLoading(true)
        setError(null)

        const queryFilters = customFilters || filters
        const params = new URLSearchParams({
          include_progress: 'true',
          ...Object.entries(queryFilters).reduce(
            (acc, [key, value]) => {
              if (value) acc[key] = String(value)
              return acc
            },
            {} as Record<string, string>
          ),
        })

        const response = await fetch(`/api/habits?${params}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch habits: ${response.statusText}`)
        }

        const data = await response.json()
        setHabits(data.data || [])
      } catch (err) {
        handleError(err, 'Failed to fetch habits')
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true)
      setError(null)

      const response = await fetch('/api/habits/summary')
      if (!response.ok) {
        throw new Error(`Failed to fetch summary: ${response.statusText}`)
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      handleError(err, 'Failed to fetch habit summary')
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  const createHabit = useCallback(
    async (habit: CreateHabitRequest): Promise<Habit | null> => {
      try {
        setActionLoading(true)
        setError(null)

        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(habit),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create habit')
        }

        const data = await response.json()

        // Refresh habits and summary
        await Promise.all([fetchHabits(), fetchSummary()])

        return data.data
      } catch (err) {
        handleError(err, 'Failed to create habit')
        return null
      } finally {
        setActionLoading(false)
      }
    },
    [fetchHabits, fetchSummary]
  )

  const updateHabit = useCallback(
    async (id: string, updates: UpdateHabitRequest): Promise<Habit | null> => {
      try {
        setActionLoading(true)
        setError(null)

        const response = await fetch(`/api/habits/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update habit')
        }

        const data = await response.json()

        // Refresh habits
        await fetchHabits()

        return data.data
      } catch (err) {
        handleError(err, 'Failed to update habit')
        return null
      } finally {
        setActionLoading(false)
      }
    },
    [fetchHabits]
  )

  const deleteHabit = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(true)
        setError(null)

        const response = await fetch(`/api/habits/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete habit')
        }

        // Refresh habits and summary
        await Promise.all([fetchHabits(), fetchSummary()])

        return true
      } catch (err) {
        handleError(err, 'Failed to delete habit')
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [fetchHabits, fetchSummary]
  )

  const logHabit = useCallback(
    async (id: string, log: LogHabitRequest): Promise<boolean> => {
      try {
        setActionLoading(true)
        setError(null)

        const response = await fetch(`/api/habits/${id}/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(log),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to log habit')
        }

        // Refresh habits and summary
        await Promise.all([fetchHabits(), fetchSummary()])

        return true
      } catch (err) {
        handleError(err, 'Failed to log habit')
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [fetchHabits, fetchSummary]
  )

  const completeHabit = useCallback(
    async (id: string, value?: number): Promise<boolean> => {
      return logHabit(id, {
        completed: true,
        value: value,
      })
    },
    [logHabit]
  )

  const skipHabit = useCallback(
    async (id: string, reason?: string): Promise<boolean> => {
      return logHabit(id, {
        completed: false,
        skipped: true,
        skipReason: reason,
      })
    },
    [logHabit]
  )

  // Auto-fetch habits when filters change
  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  // Auto-fetch summary on mount
  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
    // Data
    habits,
    summary,

    // Loading states
    loading,
    summaryLoading,
    actionLoading,

    // Error state
    error,

    // Actions
    fetchHabits,
    fetchSummary,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    completeHabit,
    skipHabit,

    // Filters
    filters,
    setFilters: (newFilters: HabitFilters) => {
      setFilters(newFilters)
    },
  }
}
