/**
 * Type definitions for Habit Details feature
 * Extends the base Habit types with detailed statistics and insights
 */

import { Habit, HabitLog } from './habit'

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

/**
 * Aggregated statistics for a single habit
 */
export interface HabitStatistics {
  /** Current active streak in days */
  currentStreak: number

  /** Longest streak ever achieved in days */
  longestStreak: number

  /** Completion rate as percentage (0-100) over last 30 days */
  completionRate: number

  /** Total number of times habit was completed */
  totalCompletions: number

  /** Total time tracked in minutes (if habit tracks time) */
  totalTimeTracked?: number

  /** Average completion time in minutes (if habit tracks time) */
  averageCompletionTime?: number

  /** Number of days habit has been active */
  daysActive: number
}

/**
 * Behavioral insights and patterns for a habit
 */
export interface HabitInsights {
  /** Days of week with highest completion rate */
  bestDays: DayOfWeek[]

  /** Days of week with lowest completion rate */
  worstDays: DayOfWeek[]

  /** Consistency score from 0-100 */
  consistencyScore: number

  /** Average time of day when habit is completed (hour 0-23) */
  averageTime?: number

  /** Peak times for habit completion (hours of day) */
  peakTimes?: number[]

  /** Descriptive patterns found in the data */
  patterns: string[]

  /** Motivational message based on performance */
  motivationalMessage: string
}

/**
 * Complete habit details including all statistics and logs
 */
export interface HabitDetails {
  /** The habit entity */
  habit: Habit

  /** Aggregated statistics */
  statistics: HabitStatistics

  /** Recent completion logs (paginated) */
  completionLogs: HabitLog[]

  /** Behavioral insights */
  insights: HabitInsights

  /** Count of related journal entries mentioning this habit */
  relatedJournalEntries?: number

  /** Total number of completion logs (for pagination) */
  totalLogs: number
}

/**
 * Calendar heatmap data for visualizing habit completion history
 */
export interface CalendarHeatmapData {
  /** Date in YYYY-MM-DD format */
  date: string

  /** Number of completions on this date */
  count: number

  /** Optional notes from completion */
  notes?: string

  /** Completion time if tracked */
  time?: string
}

/**
 * Weekly completion statistics for trend chart
 */
export interface WeeklyStats {
  /** Week number in year (1-52) */
  week: number

  /** Year */
  year: number

  /** Number of completions in this week */
  completions: number

  /** Expected completions based on habit frequency */
  expected: number

  /** Completion rate percentage */
  rate: number
}

/**
 * Query parameters for fetching habit details
 */
export interface HabitDetailsParams {
  /** Habit ID */
  habitId: string

  /** Page number for completion logs (1-based) */
  page?: number

  /** Number of logs per page */
  limit?: number

  /** Include calendar heatmap data */
  includeCalendar?: boolean

  /** Number of months to include in calendar (default: 3) */
  calendarMonths?: number
}
