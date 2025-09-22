'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Upload, Settings } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import JournalEntryList from '@/components/journal/JournalEntryList'
import type { JournalEntry, JournalSearchResult, JournalStats } from '@/types/journal'

// Filter types
type FilterType = 'all' | 'month' | 'favorites' | 'tags'

interface JournalHistoryPageProps {
  className?: string
}

export default function JournalHistoryPage({ className = '' }: JournalHistoryPageProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState<JournalStats | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Mock user for now - in real app this would come from auth context
  const user = { name: 'User', email: 'user@example.com' }

  // Fetch journal statistics
  useEffect(() => {
    fetchStats()
  }, [])

  // Fetch entries when filter or search changes
  useEffect(() => {
    fetchEntries(true) // Reset pagination
  }, [activeFilter, searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/journal/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const result = await response.json()
      setStats(result.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchEntries = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const page = reset ? 1 : currentPage
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'date',
        sortOrder: 'desc'
      })

      // Apply filters
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim())
      }

      if (activeFilter === 'month') {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        params.set('dateFrom', startOfMonth)
        params.set('dateTo', endOfMonth)
      } else if (activeFilter === 'favorites') {
        params.set('favorite', 'true')
      }

      const response = await fetch(`/api/journal?${params}`)
      if (!response.ok) throw new Error('Failed to fetch entries')

      const result: { success: boolean; data: JournalSearchResult } = await response.json()
      
      if (reset) {
        setEntries(result.data.entries)
        setCurrentPage(1)
      } else {
        setEntries(prev => [...prev, ...result.data.entries])
      }

      setHasMore(result.data.pagination.page < result.data.pagination.totalPages)
      setCurrentPage(result.data.pagination.page)
    } catch (error) {
      console.error('Error fetching entries:', error)
      setError('Failed to load journal entries')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
      fetchEntries()
    }
  }

  const handleToggleFavorite = async (entry: JournalEntry) => {
    try {
      const response = await fetch(`/api/journal/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !entry.favorite })
      })

      if (!response.ok) throw new Error('Failed to update favorite')

      // Update local state
      setEntries(prev => 
        prev.map(e => 
          e._id === entry._id ? { ...e, favorite: !e.favorite } : e
        )
      )

      // Refresh stats
      fetchStats()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleView = (entry: JournalEntry) => {
    // Navigate to full entry view (could be a modal or separate page)
    console.log('View entry:', entry)
  }

  const handleEdit = (entry: JournalEntry) => {
    // Navigate to edit page
    window.location.href = `/journal/edit/${entry._id}`
  }

  const handleShare = (entry: JournalEntry) => {
    // Share functionality
    console.log('Share entry:', entry)
  }

  const handleNewEntry = () => {
    window.location.href = '/journal/new'
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Entries' },
    { key: 'month', label: 'This Month' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'tags', label: 'Tags' }
  ]

  return (
    <DashboardLayout user={user} showDefaultHeader={false}>
      <div className={`max-w-6xl mx-auto ${className}`}>
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">📖 Journal History</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewEntry}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
            <button className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Entries
            </button>
            <button className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Export
            </button>
            <button className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </header>

        {/* Overview Widget */}
        {stats && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg mb-2">📊 Journal Overview</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 text-sm">
              <span>
                Total entries: <span className="font-semibold text-gray-200">{stats.totalEntries}</span>
              </span>
              <span>
                Current streak: <span className="font-semibold text-gray-200">🔥 {stats.currentStreak} days</span>
              </span>
              <span>
                Average words: <span className="font-semibold text-gray-200">{stats.averageWordCount}</span>
              </span>
              {stats.mostActiveTime && (
                <span>
                  Most active: <span className="font-semibold text-gray-200 capitalize">{stats.mostActiveTime}s</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your journal entries..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                activeFilter === filter.key
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Entry List */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">Error loading entries</div>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => fetchEntries(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <JournalEntryList
            entries={entries}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            onView={handleView}
            onShare={handleShare}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        )}
      </div>
    </DashboardLayout>
  )
}