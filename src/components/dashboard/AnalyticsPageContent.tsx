'use client'

import React, { useState } from 'react'
import { BarChart3, Download, RefreshCw, Filter, Calendar } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsFilters, AnalyticsTimeframe } from '@/types/analytics'
import {
  OverviewWidget,
  StreakWidget,
  WeeklyTrendsWidget,
  MoodCorrelationWidget,
  AIInsightsWidget,
  WeeklyTrendsChart,
} from '@/components/dashboard/analytics'

const timeframeOptions = [
  { label: 'Last 7 Days', value: 'week' },
  { label: 'Last Month', value: 'month' },
  { label: 'Last 3 Months', value: 'quarter' },
  { label: 'Last 6 Months', value: 'half-year' },
  { label: 'Last Year', value: 'year' },
  { label: 'All Time', value: 'all-time' },
]

interface AnalyticsPageContentProps {
  user: {
    userId: string
    email: string
    name: string
  }
}

export function AnalyticsPageContent({ user }: AnalyticsPageContentProps) {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeframe: { type: 'month' },
    includeArchived: false,
    includeJournal: true,
  })

  const { overview, loading, error, refreshData, exportAnalytics } =
    useAnalytics(filters)

  const handleExport = async () => {
    try {
      await exportAnalytics('pdf')
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleTimeframeChange = (newTimeframe: AnalyticsTimeframe['type']) => {
    setFilters({
      ...filters,
      timeframe: { type: newTimeframe },
    })
  }

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <h2 className="text-red-400 text-lg font-semibold mb-2">
              Failed to Load Analytics
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              No Analytics Data Available
            </h2>
            <p className="text-gray-500">
              Complete some habits and journal entries to see your analytics
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Track your progress and discover insights
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
            {/* Timeframe Filter */}
            <div className="relative flex-shrink-0">
              <select
                value={filters.timeframe.type}
                onChange={e =>
                  handleTimeframeChange(
                    e.target.value as AnalyticsTimeframe['type']
                  )
                }
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 sm:px-4 py-2 pr-8 sm:pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm touch-manipulation"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm touch-manipulation"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewWidget overview={overview} />

        {/* Weekly Trends Chart - Mobile Responsive */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Weekly Progress Trends
            </h3>
          </div>
          <WeeklyTrendsChart trends={overview.weeklyTrends} />
        </div>

        {/* Analytics Widgets Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Streaks Widget */}
          <StreakWidget streaks={overview.activeStreaks} />

          {/* Weekly Trends Summary */}
          <WeeklyTrendsWidget trends={overview.weeklyTrends} />

          {/* Mood Correlations */}
          <MoodCorrelationWidget correlations={overview.moodCorrelations} />
        </div>

        {/* AI Insights (Pro Feature) */}
        {overview.aiInsights && overview.aiInsights.length > 0 && (
          <AIInsightsWidget insights={overview.aiInsights} />
        )}

        {/* Performance Highlights - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Best Performance */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Best Performance
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-300">Best Day</span>
                <span className="text-green-400 font-semibold">
                  {overview.bestPerformingDay}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-300">Best Month</span>
                <span className="text-green-400 font-semibold">
                  {overview.bestMonth.month} (
                  {overview.bestMonth.completionRate}%)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-300">Longest Streak</span>
                <span className="text-yellow-400 font-semibent">
                  {overview.longestStreak} days
                </span>
              </div>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Areas for Improvement
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-300">Challenging Day</span>
                <span className="text-orange-400 font-semibold">
                  {overview.challengingDay}
                </span>
              </div>
              {overview.overallCompletionRate < 80 && (
                <div className="p-2 sm:p-3 bg-yellow-900/20 border border-yellow-800 rounded">
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    Consider reducing your habit load or adjusting difficulty to
                    maintain consistency
                  </p>
                </div>
              )}
              {overview.activeStreaks.length === 0 && (
                <div className="p-2 sm:p-3 bg-blue-900/20 border border-blue-800 rounded">
                  <p className="text-blue-400 text-xs sm:text-sm">
                    Focus on building streaks by completing habits consistently
                    for 3+ days
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
