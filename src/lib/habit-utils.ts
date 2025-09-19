import { HabitModel, HabitLogModel } from './models/habit'
import type { Habit, HabitLog, HabitProgress, HabitStreak, HabitSummary } from '../types/habit'

/**
 * Formats a date to YYYY-MM-DD string in user's timezone
 */
export function formatDateToString(date: Date, timezone: string = 'UTC'): string {
  return date.toLocaleDateString('en-CA', { timeZone: timezone })
}

/**
 * Gets today's date string in user's timezone
 */
export function getTodayString(timezone: string = 'UTC'): string {
  return formatDateToString(new Date(), timezone)
}

/**
 * Checks if a habit should be active on a given date
 */
export function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
  
  switch (habit.frequency.type) {
    case 'daily':
      return true
    case 'weekly':
    case 'custom':
      return habit.frequency.daysOfWeek?.includes(dayOfWeek) || false
    default:
      return false
  }
}

/**
 * Generates date strings for a date range
 */
export function generateDateRange(startDate: Date, endDate: Date, timezone: string = 'UTC'): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    dates.push(formatDateToString(current, timezone))
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

/**
 * Calculates streak information for a habit
 */
export function calculateHabitStreak(habit: Habit, logs: HabitLog[], timezone: string = 'UTC'): HabitStreak {
  // Sort logs by date (newest first)
  const sortedLogs = logs
    .filter(log => log.completed)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (sortedLogs.length === 0) {
    return {
      habitId: habit._id!,
      currentStreak: 0,
      longestStreak: 0
    }
  }

  const today = getTodayString(timezone)
  const yesterday = formatDateToString(new Date(Date.now() - 24 * 60 * 60 * 1000), timezone)

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
    const lastCompletedDate = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date

  // Calculate current streak
  const latestLog = sortedLogs[0]
  if (latestLog && (latestLog.date === today || latestLog.date === yesterday)) {
    const currentDate = new Date()
    if (latestLog.date === yesterday) {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Count backwards from the latest completion
    for (let i = 0; i < sortedLogs.length; i++) {
      const expectedDate = formatDateToString(currentDate, timezone)
      const log = sortedLogs.find(l => l.date === expectedDate)

      if (log && log.completed && isHabitScheduledForDate(habit, currentDate)) {
        currentStreak++
        // Move to previous scheduled day
        do {
          currentDate.setDate(currentDate.getDate() - 1)
        } while (!isHabitScheduledForDate(habit, currentDate) && currentDate > new Date('2020-01-01'))
      } else if (isHabitScheduledForDate(habit, currentDate)) {
        break // Streak broken
      } else {
        // Skip days that aren't scheduled
        currentDate.setDate(currentDate.getDate() - 1)
      }
    }
  }

  // Calculate longest streak
  let streakStart: Date | null = null
  
  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i]
    const logDate = new Date(log.date + 'T00:00:00')
    
    if (isHabitScheduledForDate(habit, logDate)) {
      if (streakStart === null) {
        streakStart = logDate
        tempStreak = 1
      } else {
        // Check if this log continues the streak
        const expectedDate: Date = new Date(streakStart)
        expectedDate.setDate(expectedDate.getDate() - 1)
        
        // Find next scheduled day
        while (!isHabitScheduledForDate(habit, expectedDate) && expectedDate > new Date('2020-01-01')) {
          expectedDate.setDate(expectedDate.getDate() - 1)
        }
        
        if (formatDateToString(expectedDate, timezone) === log.date) {
          tempStreak++
          streakStart = expectedDate
        } else {
          // Streak broken, start new one
          longestStreak = Math.max(longestStreak, tempStreak)
          streakStart = logDate
          tempStreak = 1
        }
      }
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak)

  return {
    habitId: habit._id!,
    currentStreak,
    longestStreak,
    lastCompletedDate
  }
}

/**
 * Calculates weekly progress for a habit
 */
export function calculateWeeklyProgress(habit: Habit, logs: HabitLog[], timezone: string = 'UTC') {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Go to Sunday
  
  const weekDates = generateDateRange(startOfWeek, today, timezone)
  
  let total = 0
  let completed = 0
  
  weekDates.forEach(date => {
    const dateObj = new Date(date + 'T00:00:00')
    if (isHabitScheduledForDate(habit, dateObj)) {
      total++
      const log = logs.find(l => l.date === date)
      if (log && log.completed) {
        completed++
      }
    }
  })
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

/**
 * Calculates monthly progress for a habit
 */
export function calculateMonthlyProgress(habit: Habit, logs: HabitLog[], timezone: string = 'UTC') {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const monthDates = generateDateRange(startOfMonth, today, timezone)
  
  let total = 0
  let completed = 0
  
  monthDates.forEach(date => {
    const dateObj = new Date(date + 'T00:00:00')
    if (isHabitScheduledForDate(habit, dateObj)) {
      total++
      const log = logs.find(l => l.date === date)
      if (log && log.completed) {
        completed++
      }
    }
  })
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

/**
 * Calculates comprehensive progress for a habit
 */
export function calculateHabitProgress(
  habit: Habit, 
  logs: HabitLog[], 
  timezone: string = 'UTC'
): HabitProgress {
  const today = getTodayString(timezone)
  const todayLog = logs.find(log => log.date === today)
  const streak = calculateHabitStreak(habit, logs, timezone)
  const weeklyProgress = calculateWeeklyProgress(habit, logs, timezone)
  const monthlyProgress = calculateMonthlyProgress(habit, logs, timezone)

  return {
    habit,
    todayLog,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    weeklyProgress,
    monthlyProgress
  }
}

/**
 * Calculates summary statistics for all user habits
 */
export function calculateHabitSummary(
  habits: Habit[], 
  logs: HabitLog[], 
  timezone: string = 'UTC'
): HabitSummary {
  const today = getTodayString(timezone)
  const activeHabits = habits.filter(h => h.status.active && !h.status.archived)
  
  // Today's completions
  const todayLogs = logs.filter(log => log.date === today)
  const completedToday = todayLogs.filter(log => log.completed).length
  
  // Total habits scheduled for today
  const todayDate = new Date()
  const totalCompletedToday = activeHabits.filter(habit => 
    isHabitScheduledForDate(habit, todayDate)
  ).length

  // Find longest current streak
  let longestCurrentStreak = { habitTitle: '', streakCount: 0 }
  
  activeHabits.forEach(habit => {
    const habitLogs = logs.filter(log => log.habitId === habit._id)
    const streak = calculateHabitStreak(habit, habitLogs, timezone)
    
    if (streak.currentStreak > longestCurrentStreak.streakCount) {
      longestCurrentStreak = {
        habitTitle: habit.title,
        streakCount: streak.currentStreak
      }
    }
  })

  // Weekly completions
  const weeklyProgress = activeHabits.map(habit => {
    const habitLogs = logs.filter(log => log.habitId === habit._id)
    return calculateWeeklyProgress(habit, habitLogs, timezone)
  })
  
  const weeklyCompletions = weeklyProgress.reduce((sum, progress) => sum + progress.completed, 0)
  const weeklyTotal = weeklyProgress.reduce((sum, progress) => sum + progress.total, 0)

  return {
    totalHabits: habits.length,
    activeHabits: activeHabits.length,
    completedToday,
    totalCompletedToday,
    longestCurrentStreak,
    weeklyCompletions,
    weeklyTotal
  }
}

/**
 * Gets the display status for a habit based on today's log
 */
export function getHabitDisplayStatus(habit: Habit, todayLog?: HabitLog) {
  if (todayLog?.completed) {
    return 'completed'
  }
  
  if (todayLog?.skipped) {
    return 'skipped'
  }
  
  if (habit.target.type === 'boolean') {
    return 'pending'
  }
  
  if (todayLog?.value && habit.target.value) {
    const progress = (todayLog.value / habit.target.value) * 100
    if (progress >= 100) return 'completed'
    if (progress > 0) return 'in-progress'
  }
  
  return 'pending'
}

/**
 * Gets the progress percentage for a habit based on today's log
 */
export function getHabitProgressPercentage(habit: Habit, todayLog?: HabitLog): number {
  if (todayLog?.completed) return 100
  if (todayLog?.skipped) return 0
  
  if (habit.target.type === 'boolean') {
    return 0
  }
  
  if (todayLog?.value && habit.target.value) {
    return Math.min((todayLog.value / habit.target.value) * 100, 100)
  }
  
  return 0
}