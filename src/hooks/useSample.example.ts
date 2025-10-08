/**
 * Sample Custom Hook Template
 *
 * This is an example of a custom React hook for data fetching and state management.
 * Copy this template and modify it for your specific use case.
 *
 * Example: useProducts, useCart, useOrders, etc.
 */

import { useState, useEffect } from 'react'

// Define your data type
interface SampleData {
  id: string
  name: string
  description: string
  createdAt: Date
}

// Hook options interface
interface UseSampleOptions {
  userId?: string
  autoFetch?: boolean
}

// Hook return type
interface UseSampleReturn {
  data: SampleData[]
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
  createItem: (item: Omit<SampleData, 'id' | 'createdAt'>) => Promise<void>
  updateItem: (id: string, updates: Partial<SampleData>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

/**
 * Custom hook for managing sample data
 *
 * @example
 * ```tsx
 * const { data, loading, error, fetchData, createItem } = useSample({
 *   userId: 'user123',
 *   autoFetch: true
 * })
 * ```
 */
export function useSample(options: UseSampleOptions = {}): UseSampleReturn {
  const { userId, autoFetch = true } = options

  const [data, setData] = useState<SampleData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/sample${userId ? `?userId=${userId}` : ''}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new item
  const createItem = async (item: Omit<SampleData, 'id' | 'createdAt'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error('Failed to create item')
      }

      // Refresh data after creation
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating item:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update existing item
  const updateItem = async (id: string, updates: Partial<SampleData>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/sample/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      // Optimistic update
      setData(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating item:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/sample/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      // Optimistic update
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting item:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, autoFetch])

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  }
}

/**
 * Example usage in a component:
 *
 * ```tsx
 * 'use client'
 *
 * import { useSample } from '@/hooks/useSample'
 *
 * export function MyComponent() {
 *   const { data, loading, error, createItem } = useSample({
 *     userId: 'user123'
 *   })
 *
 *   if (loading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error}</div>
 *
 *   return (
 *     <div>
 *       {data.map(item => (
 *         <div key={item.id}>{item.name}</div>
 *       ))}
 *       <button onClick={() => createItem({ name: 'New Item', description: 'Test' })}>
 *         Add Item
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
