'use client'

import React from 'react'
import {
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react'
import type {
  AnalyticsOverview,
  HabitStreak,
  AIInsight,
  MoodCorrelation,
  WeeklyHabitTrends,
} from '@/types/analytics'
import { CompletionRateIndicator, MiniBarChart } from './Charts'

interface AnalyticsCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  className?: string
}

export function AnalyticsCard({
  title,
  value,
  change,
  icon,
  trend = 'stable',
  className = '',
}: AnalyticsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-700 rounded-lg">{icon}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            <TrendingUp
              className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`}
            />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  )
}

interface OverviewWidgetProps {
  overview: AnalyticsOverview
}

export function OverviewWidget({ overview }: OverviewWidgetProps) {
  const weeklyChange =
    overview.weeklyTrends.length >= 2
      ? overview.weeklyTrends[overview.weeklyTrends.length - 1].completionRate -
        overview.weeklyTrends[overview.weeklyTrends.length - 2].completionRate
      : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        title="Habits Completed"
        value={overview.totalHabitsCompleted}
        icon={<Target className="w-5 h-5 text-blue-400" />}
      />

      <AnalyticsCard
        title="Current Streak"
        value={overview.currentStreak}
        icon={<Zap className="w-5 h-5 text-yellow-400" />}
      />

      <AnalyticsCard
        title="Journal Entries"
        value={overview.totalJournalEntries}
        icon={<BookOpen className="w-5 h-5 text-purple-400" />}
      />

      <AnalyticsCard
        title="Overall Completion"
        value={`${overview.overallCompletionRate}%`}
        change={Math.abs(weeklyChange)}
        trend={weeklyChange > 0 ? 'up' : weeklyChange < 0 ? 'down' : 'stable'}
        icon={<Activity className="w-5 h-5 text-green-400" />}
      />
    </div>
  )
}

interface StreakWidgetProps {
  streaks: HabitStreak[]
  className?: string
}

export function StreakWidget({ streaks, className = '' }: StreakWidgetProps) {
  const topStreaks = streaks
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 5)

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Top Streaks</h3>
      </div>

      <div className="space-y-4">
        {topStreaks.map(streak => (
          <div
            key={streak.habitId}
            className="flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {streak.habitTitle}
              </p>
              <p className="text-gray-400 text-sm">
                Best: {streak.longestStreak} days
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 font-bold text-lg">
                {streak.currentStreak}
              </span>
              <span className="text-gray-400 text-sm">days</span>
            </div>
          </div>
        ))}

        {topStreaks.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No active streaks yet. Complete habits to start building streaks!
          </p>
        )}
      </div>
    </div>
  )
}

interface MoodCorrelationWidgetProps {
  correlations: MoodCorrelation[]
  className?: string
}

export function MoodCorrelationWidget({
  correlations,
  className = '',
}: MoodCorrelationWidgetProps) {
  const strongCorrelations = correlations
    .filter(c => Math.abs(c.correlation) >= 0.3)
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    .slice(0, 3)

  const getCorrelationText = (correlation: number) => {
    if (correlation >= 0.5)
      return { text: 'Strong Positive', color: 'text-green-400' }
    if (correlation >= 0.3)
      return { text: 'Moderate Positive', color: 'text-blue-400' }
    if (correlation <= -0.5)
      return { text: 'Strong Negative', color: 'text-red-400' }
    if (correlation <= -0.3)
      return { text: 'Moderate Negative', color: 'text-orange-400' }
    return { text: 'Weak', color: 'text-gray-400' }
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Mood Correlations</h3>
      </div>

      <div className="space-y-4">
        {strongCorrelations.map(correlation => {
          const { text, color } = getCorrelationText(correlation.correlation)

          return (
            <div key={correlation.factor} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">{correlation.factor}</p>
                <span className={`text-sm font-medium ${color}`}>{text}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      correlation.correlation > 0
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.abs(correlation.correlation) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-gray-400 text-sm min-w-12">
                  {(correlation.correlation * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-gray-400 text-xs">
                Based on {correlation.sampleSize} data points
              </p>
            </div>
          )
        })}

        {strongCorrelations.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-2">
              No strong correlations found yet
            </p>
            <p className="text-gray-500 text-sm">
              Complete more habits and journal entries to discover patterns
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface AIInsightsWidgetProps {
  insights: AIInsight[]
  className?: string
}

export function AIInsightsWidget({
  insights,
  className = '',
}: AIInsightsWidgetProps) {
  const recentInsights = insights.slice(0, 3) // Just get first 3 since we don't have generatedAt

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="w-4 h-4" />
      case 'improvement':
        return <Target className="w-4 h-4" />
      case 'streak':
        return <Zap className="w-4 h-4" />
      case 'mood':
        return <Activity className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'text-purple-400'
      case 'improvement':
        return 'text-blue-400'
      case 'streak':
        return 'text-yellow-400'
      case 'mood':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      <div className="space-y-4">
        {recentInsights.map(insight => (
          <div
            key={insight.id}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className={getInsightColor(insight.type)}>
                {getInsightIcon(insight.type)}
              </span>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">
                  {insight.title}
                </h4>
                <p className="text-gray-300 text-sm mt-1">
                  {insight.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  insight.confidence >= 0.8
                    ? 'bg-green-900 text-green-400'
                    : insight.confidence >= 0.6
                      ? 'bg-blue-900 text-blue-400'
                      : 'bg-gray-900 text-gray-400'
                }`}
              >
                {Math.round(insight.confidence * 100)}% confidence
              </span>
              <span className="text-gray-500 text-xs">Recent</span>
            </div>
          </div>
        ))}

        {recentInsights.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No insights available yet</p>
            <p className="text-gray-500 text-sm">
              Keep tracking your habits to unlock personalized insights
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface WeeklyTrendsWidgetProps {
  trends: WeeklyHabitTrends[]
  className?: string
}

export function WeeklyTrendsWidget({
  trends,
  className = '',
}: WeeklyTrendsWidgetProps) {
  const recentTrends = trends.slice(-4) // Last 4 weeks
  const averageCompletion =
    trends.length > 0
      ? Math.round(
          trends.reduce((sum, t) => sum + t.completionRate, 0) / trends.length
        )
      : 0

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Weekly Trends</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-400">
            {averageCompletion}%
          </p>
          <p className="text-gray-400 text-sm">Average</p>
        </div>
      </div>

      {recentTrends.length > 0 ? (
        <div className="space-y-4">
          <MiniBarChart
            data={recentTrends.map(t => ({
              label: t.week,
              value: t.completionRate,
            }))}
            height={60}
            className="mb-4"
          />

          <div className="grid grid-cols-2 gap-4">
            {recentTrends.map((trend, index) => (
              <div key={trend.week} className="text-center">
                <p className="text-white font-medium">{trend.week}</p>
                <CompletionRateIndicator
                  rate={trend.completionRate}
                  size="sm"
                  showLabel={false}
                />
                <p className="text-gray-400 text-xs mt-1">
                  {trend.completedHabits}/{trend.totalHabits}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No trend data available</p>
        </div>
      )}
    </div>
  )
}
