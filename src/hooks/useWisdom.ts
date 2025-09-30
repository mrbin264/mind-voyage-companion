'use client'

import { useState, useEffect, useCallback } from 'react'

interface Quote {
  id: string
  text: string
  author: string
  category: string
  tags?: string[]
}

interface Category {
  id: string
  name: string
  emoji: string
  description: string
  count: number
}

interface WisdomStats {
  quotesViewed: number
  favoritesSaved: number
  dailyStreak: number
  mostViewedCategory: string
  wisdomScore: string
  totalLoginDays: number
  categoryDistribution: Record<string, number>
}

interface FavoriteQuote {
  quoteId: string
  text: string
  author: string
  category: string
  addedAt: string
}

export function useWisdom() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([])
  const [stats, setStats] = useState<WisdomStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch wisdom statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/wisdom/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Failed to fetch wisdom stats:', error)
    }
  }, [])

  // Fetch daily quote
  const fetchDailyQuote = useCallback(async () => {
    try {
      const response = await fetch('/api/wisdom/quotes', {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentQuote(data.quote)

        // Track daily visit for streak
        await trackActivity('daily_visit')
      }
    } catch (error) {
      console.error('Failed to fetch daily quote:', error)
      setError('Failed to load daily quote')
    }
  }, [])

  // Fetch random quote
  const fetchRandomQuote = useCallback(async (category?: string) => {
    try {
      const params = new URLSearchParams({ random: 'true' })
      if (category) params.append('category', category)

      const response = await fetch(`/api/wisdom/quotes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCurrentQuote(data.quote)

        // Track quote view
        await trackActivity('view_quote', data.quote.category)
      }
    } catch (error) {
      console.error('Failed to fetch random quote:', error)
      setError('Failed to load new quote')
    }
  }, [])

  // Fetch quotes and categories
  const fetchQuotes = useCallback(
    async (searchQuery?: string, category?: string) => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (category) params.append('category', category)

        const response = await fetch(`/api/wisdom/quotes?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
          return data.quotes || []
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error)
        setError('Failed to search quotes')
      }
      return []
    },
    []
  )

  // Add quote to favorites
  const addToFavorites = useCallback(
    async (quote: Quote) => {
      try {
        const response = await fetch('/api/wisdom/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteId: quote.id,
            text: quote.text,
            author: quote.author,
            category: quote.category,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites || [])
          await fetchStats() // Refresh stats
          return true
        }
      } catch (error) {
        console.error('Failed to add to favorites:', error)
        setError('Failed to add to favorites')
      }
      return false
    },
    [fetchStats]
  )

  // Remove quote from favorites
  const removeFromFavorites = useCallback(
    async (quoteId: string) => {
      try {
        const response = await fetch('/api/wisdom/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quoteId }),
        })

        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites || [])
          await fetchStats() // Refresh stats
          return true
        }
      } catch (error) {
        console.error('Failed to remove from favorites:', error)
        setError('Failed to remove from favorites')
      }
      return false
    },
    [fetchStats]
  )

  // Check if quote is favorited
  const isFavorited = useCallback(
    (quoteId: string) => {
      return favorites.some(fav => fav.quoteId === quoteId)
    },
    [favorites]
  )

  // Track user activity
  const trackActivity = useCallback(
    async (action: string, category?: string) => {
      try {
        await fetch('/api/wisdom/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, category }),
        })
      } catch (error) {
        console.error('Failed to track activity:', error)
      }
    },
    []
  )

  // Initialize wisdom data
  useEffect(() => {
    const initializeWisdom = async () => {
      try {
        setLoading(true)
        await Promise.all([
          fetchDailyQuote(),
          fetchStats(),
          fetchQuotes(), // This will also fetch categories
        ])
      } catch (error) {
        console.error('Failed to initialize wisdom data:', error)
        setError('Failed to load wisdom data')
      } finally {
        setLoading(false)
      }
    }

    initializeWisdom()
  }, [fetchDailyQuote, fetchStats, fetchQuotes])

  return {
    // Data
    currentQuote,
    favorites,
    stats,
    categories,
    loading,
    error,

    // Actions
    fetchRandomQuote,
    fetchQuotes,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    trackActivity,

    // Utilities
    refreshStats: fetchStats,
  }
}
