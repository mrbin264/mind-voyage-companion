'use client'

import React, { useState } from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import { Button } from '@/components/ui/button'
import {
  RefreshCw,
  Star,
  Heart,
  Share2,
  Search,
  BarChart2,
  BookOpen,
  Brain,
  Loader2
} from 'lucide-react'
import { useWisdom } from '@/hooks/useWisdom'

export function WisdomContent() {
  const {
    currentQuote,
    favorites,
    stats,
    categories,
    loading,
    error,
    fetchRandomQuote,
    addToFavorites,
    removeFromFavorites,
    isFavorited
  } = useWisdom()

  const [selectedFilter, setSelectedFilter] = useState('Daily Quotes')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Create filters with proper counts from API categories
  const filters = [
    { name: 'Daily Quotes', id: 'all', count: null },
    { 
      name: 'Stoic', 
      id: 'stoic', 
      count: categories.find(c => c.id === 'stoic')?.count || 0 
    },
    { 
      name: 'Buddhist', 
      id: 'buddhist', 
      count: categories.find(c => c.id === 'buddhist')?.count || 0 
    },
    { 
      name: 'Modern', 
      id: 'modern', 
      count: categories.find(c => c.id === 'modern')?.count || 0 
    },
    { 
      name: 'Ancient', 
      id: 'ancient', 
      count: categories.find(c => c.id === 'ancient')?.count || 0 
    }
  ]

  const popularTags = ['#courage', '#wisdom', '#love', '#success', '#growth']

  const handleNewQuote = async () => {
    setActionLoading('new-quote')
    try {
      const selectedFilterData = filters.find(f => f.name === selectedFilter)
      const categoryId = selectedFilterData?.id === 'all' ? undefined : selectedFilterData?.id
      await fetchRandomQuote(categoryId)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleFavorite = async () => {
    if (!currentQuote) return

    setActionLoading('favorite')
    try {
      const isCurrentlyFavorited = isFavorited(currentQuote.id)
      if (isCurrentlyFavorited) {
        await removeFromFavorites(currentQuote.id)
      } else {
        await addToFavorites(currentQuote)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleShare = async () => {
    if (!currentQuote) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Wisdom Quote',
          text: `"${currentQuote.text}" — ${currentQuote.author}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `"${currentQuote.text}" — ${currentQuote.author}`
        )
        // You could show a toast notification here
        alert('Quote copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  const handleCategoryClick = (category: any) => {
    setSelectedFilter(category.name)
  }

  const handleExploreCategory = async (category: any) => {
    // Set the filter to match this category
    const filterName = getFilterNameFromCategory(category.id)
    setSelectedFilter(filterName)
    
    // Fetch a random quote from this category
    setActionLoading('explore')
    try {
      await fetchRandomQuote(category.id)
    } finally {
      setActionLoading(null)
    }
  }

  // Helper function to map category IDs to filter names
  const getFilterNameFromCategory = (categoryId: string) => {
    const mapping: Record<string, string> = {
      'ancient': 'Ancient',
      'modern': 'Modern', 
      'stoic': 'Stoic',
      'buddhist': 'Buddhist',
      'success': 'Modern', // Map success to modern for now
      'mindfulness': 'Buddhist' // Map mindfulness to buddhist for now
    }
    return mapping[categoryId] || 'Daily Quotes'
  }

  const handleFilterClick = async (filter: any) => {
    setSelectedFilter(filter.name)
    // Optionally fetch new quote when filter changes
    if (currentQuote) {
      await handleNewQuote()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-400">Loading wisdom...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            🏛️ Daily Wisdom
          </h1>
        </div>
      </header>

      {/* Today's Quote */}
      {currentQuote && (
        <WidgetCard className="p-8 text-center">
          <blockquote className="text-2xl lg:text-3xl text-gray-200 italic leading-relaxed mb-4">
            &ldquo;{currentQuote.text}&rdquo;
          </blockquote>
          <cite className="block text-gray-500">— {currentQuote.author}</cite>
          <div className="flex justify-center flex-wrap gap-4 mt-8">
            <Button
              onClick={handleNewQuote}
              disabled={actionLoading === 'new-quote'}
              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border-0"
            >
              {actionLoading === 'new-quote' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              New Quote
            </Button>
            <Button
              onClick={handleToggleFavorite}
              disabled={actionLoading === 'favorite'}
              className={`${
                isFavorited(currentQuote.id)
                  ? 'bg-pink-600/40 text-pink-200'
                  : 'bg-pink-600/20 text-pink-300'
              } hover:bg-pink-600/40 border-0`}
            >
              {actionLoading === 'favorite' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorited(currentQuote.id) ? 'fill-current' : ''}`}
                />
              )}
              {isFavorited(currentQuote.id) ? 'Favorited' : 'Save to Favorites'}
            </Button>
            <Button
              onClick={handleShare}
              className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 border-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Quote
            </Button>
          </div>
        </WidgetCard>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.name}
            onClick={() => handleFilterClick(filter)}
            className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${
              selectedFilter === filter.name
                ? 'bg-blue-700 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {filter.name} {filter.count ? `(${filter.count})` : ''}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Categories */}
          <WidgetCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quote Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <h4 className="font-bold text-gray-200 flex items-center gap-2">
                    <span>{category.emoji}</span>
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                  <p className="text-xs text-gray-500 my-2">
                    {category.count} quotes available
                  </p>
                  <button 
                    className="text-sm font-semibold text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExploreCategory(category)
                    }}
                  >
                    Explore →
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="text-sm font-semibold text-blue-400 hover:underline mt-4"
              onClick={() => alert('Custom categories feature coming soon! 🎯')}
            >
              + Create Custom Category
            </button>
          </WidgetCard>

          {/* Search & Discovery */}
          <WidgetCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Quote Search & Discovery
            </h3>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes by keyword..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">Popular searches:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularTags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-700/50 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-700/70 transition-colors"
                  onClick={() => setSearchQuery(tag.slice(1))}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h4 className="font-semibold text-purple-300 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI-Powered Recommendations (Pro)
              </h4>
              <p className="text-sm text-gray-400 mt-2">
                Based on your habits and mood, we suggest quotes about patience and persistence.
              </p>
              <button 
                className="text-sm font-semibold text-purple-400 hover:underline mt-3"
                onClick={() => alert('✨ Personalized AI recommendations are a Pro feature! Upgrade to unlock smart quote suggestions based on your habits and mood.')}
              >
                ✨ Get Personalized Quotes
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Favorites */}
          <WidgetCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Favorites
            </h3>
            <div className="space-y-4">
              {favorites.length > 0 ? (
                favorites.slice(0, 2).map(quote => (
                  <div key={quote.quoteId} className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-300 text-sm">&ldquo;{quote.text}&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-1">— {quote.author}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No favorites yet</p>
                  <p className="text-xs mt-1">Start saving quotes you love!</p>
                </div>
              )}
            </div>
            <button 
              className="text-xs font-semibold text-blue-400 hover:underline mt-4"
              onClick={() => {
                if (favorites.length === 0) {
                  alert('📚 No favorites yet! Start by clicking the heart icon on quotes you love.')
                } else {
                  alert(`📚 You have ${favorites.length} favorite quote${favorites.length > 1 ? 's' : ''}! Full favorites page coming soon.`)
                }
              }}
            >
              View All Favorites ({favorites.length})
            </button>
          </WidgetCard>

          {/* Wisdom Analytics */}
          <WidgetCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Wisdom Analytics
            </h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex justify-between">
                <span>Quotes viewed:</span>
                <span className="font-semibold text-gray-200">{stats?.quotesViewed || 0}</span>
              </li>
              <li className="flex justify-between">
                <span>Favorites saved:</span>
                <span className="font-semibold text-gray-200">{stats?.favoritesSaved || 0}</span>
              </li>
              <li className="flex justify-between">
                <span>Daily streak:</span>
                <span className="font-semibold text-gray-200">
                  🔥 {stats?.dailyStreak || 0} days
                </span>
              </li>
              <li className="flex justify-between">
                <span>Most viewed:</span>
                <span className="font-semibold text-gray-200">
                  {stats?.mostViewedCategory || 'Ancient Wisdom (43%)'}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Your wisdom score:</span>
                <span className="font-semibold text-green-400">{stats?.wisdomScore || 'Beginner'}</span>
              </li>
            </ul>
            <button 
              className="text-xs font-semibold text-blue-400 hover:underline mt-4"
              onClick={() => {
                const quotesViewed = stats?.quotesViewed || 0
                const favoritesSaved = stats?.favoritesSaved || 0
                const dailyStreak = stats?.dailyStreak || 0
                
                if (quotesViewed === 0 && favoritesSaved === 0) {
                  alert('📊 Start exploring quotes to build your wisdom stats! Generate quotes and add favorites.')
                } else {
                  const categoriesExplored = Object.keys(stats?.categoryDistribution || {}).length
                  const wisdomScore = stats?.wisdomScore || 'Beginner'
                  alert(`📊 Your Wisdom Stats:\n• Quotes Viewed: ${quotesViewed}\n• Favorites Saved: ${favoritesSaved}\n• Daily Streak: ${dailyStreak} days\n• Categories Explored: ${categoriesExplored}\n• Wisdom Level: ${wisdomScore}\n\nDetailed analytics page coming soon!`)
                }
              }}
            >
              View Detailed Stats
            </button>
          </WidgetCard>
        </div>
      </div>
    </div>
  )
}