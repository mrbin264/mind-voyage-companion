'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HabitLog } from '@/types/habit'

interface HabitCalendarHeatmapProps {
  /** Array of all completion logs for the habit */
  completionLogs: HabitLog[]
  /** Optional className for styling */
  className?: string
  /** Number of months to display (default: 3) */
  monthsToShow?: number
}

interface CalendarDay {
  date: Date
  dateString: string
  count: number
  logs: HabitLog[]
  isCurrentMonth: boolean
  isToday: boolean
}

interface MonthData {
  year: number
  month: number
  monthName: string
  weeks: CalendarDay[][]
}

export function HabitCalendarHeatmap({
  completionLogs,
  className = '',
  monthsToShow = 3,
}: HabitCalendarHeatmapProps) {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)

  // Calculate the current month data
  const monthData = useMemo(() => {
    const today = new Date()
    const targetDate = new Date(
      today.getFullYear(),
      today.getMonth() - currentMonthOffset,
      1
    )
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()

    // Get month name
    const monthName = targetDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    // Create a map of date strings to logs
    const logsByDate = new Map<string, HabitLog[]>()
    completionLogs.forEach(log => {
      if (log.completed) {
        const dateStr = log.date
        if (!logsByDate.has(dateStr)) {
          logsByDate.set(dateStr, [])
        }
        logsByDate.get(dateStr)!.push(log)
      }
    })

    // Generate calendar grid
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()

    // Generate all days including padding
    const days: CalendarDay[] = []

    // Add padding days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      const dateString = formatDateString(date)
      const logs = logsByDate.get(dateString) || []
      days.push({
        date,
        dateString,
        count: logs.length,
        logs,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
      })
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = formatDateString(date)
      const logs = logsByDate.get(dateString) || []
      days.push({
        date,
        dateString,
        count: logs.length,
        logs,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
      })
    }

    // Add padding days from next month
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day)
        const dateString = formatDateString(date)
        const logs = logsByDate.get(dateString) || []
        days.push({
          date,
          dateString,
          count: logs.length,
          logs,
          isCurrentMonth: false,
          isToday: isSameDay(date, today),
        })
      }
    }

    // Group days into weeks
    const weeks: CalendarDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return {
      year,
      month,
      monthName,
      weeks,
    }
  }, [completionLogs, currentMonthOffset])

  // Calculate max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(...monthData.weeks.flat().map(day => day.count), 1)
  }, [monthData])

  // Get color intensity based on count
  const getColorClass = (day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      return 'bg-zinc-800/30 text-gray-600'
    }

    if (day.count === 0) {
      return 'bg-zinc-800/50 text-gray-400 hover:bg-zinc-700/50'
    }

    // Calculate intensity (1-4 levels)
    const intensity = Math.ceil((day.count / maxCount) * 4)

    switch (intensity) {
      case 1:
        return 'bg-green-900/40 text-green-200 hover:bg-green-800/60'
      case 2:
        return 'bg-green-700/60 text-green-100 hover:bg-green-700/80'
      case 3:
        return 'bg-green-600/80 text-white hover:bg-green-600'
      case 4:
        return 'bg-green-500 text-white hover:bg-green-400'
      default:
        return 'bg-zinc-800/50 text-gray-400 hover:bg-zinc-700/50'
    }
  }

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonthOffset(prev => prev + 1)
  }

  const goToNextMonth = () => {
    if (currentMonthOffset > 0) {
      setCurrentMonthOffset(prev => prev - 1)
    }
  }

  const goToToday = () => {
    setCurrentMonthOffset(0)
  }

  const canGoNext = currentMonthOffset > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {monthData.monthName}
        </h3>
        <div className="flex items-center gap-2">
          {currentMonthOffset > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={goToToday}
              className="text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-gray-300"
            >
              Today
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={goToPreviousMonth}
            aria-label="chevron-left"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={goToNextMonth}
            aria-label="chevron-right"
            disabled={!canGoNext}
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {monthData.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <CalendarDayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                colorClass={getColorClass(day)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs text-gray-400">Activity</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-zinc-800/50" />
            <div className="w-4 h-4 rounded bg-green-900/40" />
            <div className="w-4 h-4 rounded bg-green-700/60" />
            <div className="w-4 h-4 rounded bg-green-600/80" />
            <div className="w-4 h-4 rounded bg-green-500" />
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </div>
  )
}

/** Individual calendar day cell */
interface CalendarDayCellProps {
  day: CalendarDay
  colorClass: string
}

function CalendarDayCell({ day, colorClass }: CalendarDayCellProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const dayNumber = day.date.getDate()

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          aspect-square flex items-center justify-center rounded-lg
          text-xs font-medium transition-all duration-200 cursor-pointer
          ${colorClass}
          ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900' : ''}
        `}
      >
        {dayNumber}
      </div>

      {/* Tooltip */}
      {showTooltip && day.isCurrentMonth && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl px-3 py-2 text-xs whitespace-nowrap">
            <div className="font-semibold text-white mb-1">
              {formatDisplayDate(day.date)}
            </div>
            {day.count > 0 ? (
              <>
                <div className="text-green-400">
                  ✓ {day.count} completion{day.count > 1 ? 's' : ''}
                </div>
                {day.logs[0]?.notes && (
                  <div className="text-gray-400 mt-1 max-w-[200px] truncate">
                    {day.logs[0].notes}
                  </div>
                )}
                {day.logs[0]?.value && (
                  <div className="text-gray-400 mt-1">
                    Value: {day.logs[0].value}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">No activity</div>
            )}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-zinc-700" />
          </div>
        </div>
      )}
    </div>
  )
}

/** Utility functions */
function formatDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
