'use client'

import React from 'react'
import type { WeeklyHabitTrends } from '@/types/analytics'

interface WeeklyTrendsChartProps {
  trends: WeeklyHabitTrends[]
  className?: string
}

export function WeeklyTrendsChart({
  trends,
  className = '',
}: WeeklyTrendsChartProps) {
  if (!trends || trends.length === 0) {
    return (
      <div
        className={`h-64 flex items-center justify-center text-gray-400 ${className}`}
      >
        <p>No data available</p>
      </div>
    )
  }

  const maxRate = Math.max(...trends.map(t => t.completionRate), 100)

  return (
    <div className={`h-64 ${className}`}>
      <div className="h-full flex items-end justify-between gap-2 sm:gap-4 px-2">
        {trends.map((trend, index) => {
          const height =
            maxRate > 0 ? (trend.completionRate / maxRate) * 100 : 0
          const isCurrentWeek = index === trends.length - 1
          const isLowPerformance = trend.completionRate < 60

          return (
            <div
              key={trend.week}
              className="flex flex-col items-center flex-1 group"
            >
              {/* Bar */}
              <div
                className={`w-full max-w-8 rounded-t-md mb-2 transition-all duration-500 group-hover:opacity-80 ${
                  isLowPerformance
                    ? 'bg-orange-500'
                    : isCurrentWeek
                      ? 'bg-blue-500'
                      : 'bg-blue-600'
                }`}
                style={{ height: `${height}%` }}
                title={`Week ${trend.week}: ${trend.completionRate}% (${trend.completedHabits}/${trend.totalHabits} habits)`}
              />

              {/* Week label */}
              <span className="text-xs text-gray-400 mb-1">{trend.week}</span>

              {/* Percentage */}
              <span
                className={`text-xs font-medium ${
                  isLowPerformance
                    ? 'text-orange-400'
                    : trend.completionRate >= 80
                      ? 'text-green-400'
                      : 'text-blue-400'
                }`}
              >
                {trend.completionRate}%
              </span>

              {/* Hover tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded p-2 mt-8 z-10 pointer-events-none transition-opacity">
                <p className="font-semibold">{trend.week}</p>
                <p>
                  {trend.completedHabits}/{trend.totalHabits} habits
                </p>
                <p>{trend.completionRate}% completion</p>
                <p className="text-gray-400 text-xs">
                  {new Date(trend.dateRange.start).toLocaleDateString()} -{' '}
                  {new Date(trend.dateRange.end).toLocaleDateString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-8">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  )
}

interface CompletionRateIndicatorProps {
  rate: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function CompletionRateIndicator({
  rate,
  size = 'md',
  showLabel = true,
}: CompletionRateIndicatorProps) {
  const sizeClasses = {
    sm: 'w-16 h-2',
    md: 'w-24 h-3',
    lg: 'w-32 h-4',
  }

  const getColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-blue-500'
    if (rate >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${getColor(rate)} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={`font-medium ${
            rate >= 80
              ? 'text-green-400'
              : rate >= 60
                ? 'text-blue-400'
                : rate >= 40
                  ? 'text-yellow-400'
                  : 'text-red-400'
          }`}
        >
          {rate}%
        </span>
      )}
    </div>
  )
}

interface MiniBarChartProps {
  data: { label: string; value: number; maxValue?: number }[]
  height?: number
  className?: string
}

export function MiniBarChart({
  data,
  height = 40,
  className = '',
}: MiniBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.maxValue || d.value))

  return (
    <div className={`flex items-end gap-1 ${className}`} style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-blue-600 rounded-t-sm min-w-2"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`${item.label}: ${item.value}`}
          />
        </div>
      ))}
    </div>
  )
}
