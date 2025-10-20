'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Upload, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import JournalEntryList from '@/components/journal/JournalEntryList'
import type {
  JournalEntry,
  JournalSearchResult,
  JournalStats,
} from '@/types/journal'

// Filter types
type FilterType = 'all' | 'month' | 'favorites' | 'tags'

export default function JournalHistoryPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState<JournalStats | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Get user session
  const { data: session } = useSession()

  // Create user object for DashboardLayout
  const user = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || 'user@example.com',
  }

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
        sortOrder: 'desc',
      })

      // Apply filters
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim())
      }

      if (activeFilter === 'month') {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split('T')[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split('T')[0]
        params.set('dateFrom', startOfMonth)
        params.set('dateTo', endOfMonth)
      } else if (activeFilter === 'favorites') {
        params.set('favorite', 'true')
      }

      const response = await fetch(`/api/journal?${params}`)
      if (!response.ok) throw new Error('Failed to fetch entries')

      const result: { success: boolean; data: JournalSearchResult } =
        await response.json()

      if (reset) {
        setEntries(result.data.entries)
        setCurrentPage(1)
      } else {
        setEntries(prev => [...prev, ...result.data.entries])
      }

      setHasMore(
        result.data.pagination.page < result.data.pagination.totalPages
      )
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
        body: JSON.stringify({ favorite: !entry.favorite }),
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
    { key: 'tags', label: 'Tags' },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto">
        {/* Page Header - Mobile Responsive */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
              📖 Journal History
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={handleNewEntry}
              className="flex-shrink-0 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center gap-2 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
              <span className="sm:hidden">New</span>
            </button>
            <button className="flex-shrink-0 text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center gap-2 touch-manipulation">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search Entries</span>
              <span className="lg:hidden">Search</span>
            </button>
            <button className="flex-shrink-0 text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center gap-2 touch-manipulation">
              <Upload className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
            <button className="flex-shrink-0 text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center gap-2 touch-manipulation">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </button>
          </div>
        </header>

        {/* Overview Widget - Mobile Responsive */}
        {stats && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              📊 Journal Overview
            </h2>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-2 text-gray-400 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <span>Total entries:</span>
                <span className="font-semibold text-gray-200">
                  {stats.totalEntries}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <span>Current streak:</span>
                <span className="font-semibold text-gray-200">
                  🔥 {stats.currentStreak} days
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <span>Average words:</span>
                <span className="font-semibold text-gray-200">
                  {stats.averageWordCount}
                </span>
              </div>
              {stats.mostActiveTime && (
                <div className="flex flex-col sm:flex-row sm:gap-1">
                  <span>Most active:</span>
                  <span className="font-semibold text-gray-200 capitalize">
                    {stats.mostActiveTime}s
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar - Mobile Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your journal entries..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-zinc-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filters - Mobile Responsive */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-shrink-0 text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors touch-manipulation active:scale-95 ${
                activeFilter === filter.key
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Entry List - Mobile Responsive */}
        {error ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-500 text-base sm:text-lg mb-4">
              Error loading entries
            </div>
            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 px-4">
              {error}
            </p>
            <button
              onClick={() => fetchEntries(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors touch-manipulation"
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
