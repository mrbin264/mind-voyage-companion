import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { auth } from '@/lib/auth'
import {
  HabitDetails,
  HabitStatistics,
  HabitInsights,
  DayOfWeek,
} from '@/types/habit-details'

/**
 * GET /api/habits/[id]/details
 *
 * Fetch comprehensive habit details including statistics, completion logs, and insights
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params in Next.js 15
    const { id: habitId } = await context.params
    const userId = session.user.email

    console.log('📡 API: Fetching habit details for:', { habitId, userId })

    // Connect to database
    await dbConnect()

    // Fetch habit
    const habit = await HabitModel.findOne({ _id: habitId, userId })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Fetch all completion logs for this habit
    const allLogs = await HabitLogModel.find({
      habitId,
      userId,
      completed: true,
    }).sort({ completedAt: -1 })

    // Calculate statistics
    const statistics = calculateStatistics(habit, allLogs)

    // Calculate insights
    const insights = calculateInsights(habit, allLogs)

    // Get recent logs for display (limit to 50)
    const completionLogs = allLogs.slice(0, 50)

    const habitDetails: HabitDetails = {
      habit: habit.toObject(),
      statistics,
      completionLogs: completionLogs.map((log: any) => log.toObject()),
      insights,
      totalLogs: allLogs.length,
    }

    return NextResponse.json(habitDetails)
  } catch (error) {
    console.error('Error fetching habit details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habit details' },
      { status: 500 }
    )
  }
}

/**
 * Calculate habit statistics
 */
function calculateStatistics(habit: any, logs: any[]): HabitStatistics {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(logs)

  // Calculate longest streak
  const longestStreak = calculateLongestStreak(logs)

  // Calculate completion rate (last 30 days)
  const logsLast30Days = logs.filter(log => {
    const logDate = log.completedAt || new Date(log.date)
    return logDate >= thirtyDaysAgo
  })

  let expectedCompletions = 0
  if (habit.frequency.type === 'daily') {
    expectedCompletions = 30
  } else if (habit.frequency.type === 'weekly') {
    const daysInFrequency = habit.frequency.daysOfWeek?.length || 1
    expectedCompletions = Math.floor((30 / 7) * daysInFrequency)
  }

  const completionRate =
    expectedCompletions > 0
      ? (logsLast30Days.length / expectedCompletions) * 100
      : 0

  // Calculate total time tracked (if applicable)
  let totalTimeTracked: number | undefined
  let averageCompletionTime: number | undefined

  if (habit.target.type === 'duration') {
    const timeLogs = logs.filter(log => log.value !== undefined)
    if (timeLogs.length > 0) {
      const total = timeLogs.reduce((sum, log) => sum + (log.value || 0), 0)
      totalTimeTracked = total
      averageCompletionTime = total / timeLogs.length
    }
  }

  // Calculate days active
  const createdAt = new Date(habit.createdAt)
  const daysActive = Math.floor(
    (now.getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )

  return {
    currentStreak,
    longestStreak,
    completionRate: Math.min(completionRate, 100),
    totalCompletions: logs.length,
    totalTimeTracked,
    averageCompletionTime,
    daysActive: Math.max(daysActive, 1),
  }
}

/**
 * Calculate current streak (consecutive days)
 */
function calculateCurrentStreak(logs: any[]): number {
  if (logs.length === 0) return 0

  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = a.completedAt || new Date(a.date)
    const dateB = b.completedAt || new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mostRecentLog = sortedLogs[0]
  const mostRecentDate = new Date(
    mostRecentLog.completedAt || mostRecentLog.date
  )
  mostRecentDate.setHours(0, 0, 0, 0)

  // Check if most recent completion is today or yesterday
  const daysSinceLastCompletion = Math.floor(
    (today.getTime() - mostRecentDate.getTime()) / (24 * 60 * 60 * 1000)
  )

  if (daysSinceLastCompletion > 1) {
    return 0 // Streak is broken
  }

  let streak = 1
  let currentDate = mostRecentDate

  for (let i = 1; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].completedAt || sortedLogs[i].date)
    logDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (24 * 60 * 60 * 1000)
    )

    if (daysDiff === 1) {
      streak++
      currentDate = logDate
    } else if (daysDiff > 1) {
      break // Streak is broken
    }
    // If daysDiff === 0, it's the same day, skip it
  }

  return streak
}

/**
 * Calculate longest streak ever
 */
function calculateLongestStreak(logs: any[]): number {
  if (logs.length === 0) return 0

  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = a.completedAt || new Date(a.date)
    const dateB = b.completedAt || new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  let longestStreak = 1
  let currentStreak = 1
  let currentDate = new Date(sortedLogs[0].completedAt || sortedLogs[0].date)
  currentDate.setHours(0, 0, 0, 0)

  for (let i = 1; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].completedAt || sortedLogs[i].date)
    logDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor(
      (logDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)
    )

    if (daysDiff === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else if (daysDiff > 1) {
      currentStreak = 1
    }
    // If daysDiff === 0, same day, keep current streak

    currentDate = logDate
  }

  return longestStreak
}

/**
 * Calculate behavioral insights
 */
function calculateInsights(habit: any, logs: any[]): HabitInsights {
  // Calculate day of week statistics
  const dayStats: { [key: number]: number } = {}

  logs.forEach(log => {
    const logDate = new Date(log.completedAt || log.date)
    const dayOfWeek = logDate.getDay()
    dayStats[dayOfWeek] = (dayStats[dayOfWeek] || 0) + 1
  })

  const dayNames: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  // Find best days (top 3)
  const sortedDays = Object.entries(dayStats)
    .sort(([, a], [, b]) => b - a)
    .map(([day]) => parseInt(day))

  const bestDays = sortedDays.slice(0, 3).map(day => dayNames[day])
  const worstDays = sortedDays.slice(-2).map(day => dayNames[day])

  // Calculate consistency score
  const daysActive = Math.max(
    Math.floor(
      (Date.now() - new Date(habit.createdAt).getTime()) / (24 * 60 * 60 * 1000)
    ),
    1
  )
  const consistencyScore = Math.min((logs.length / daysActive) * 100, 100)

  // Find patterns
  const patterns: string[] = []

  if (logs.length >= 7) {
    const recentLogs = logs.slice(0, 7)
    if (recentLogs.length === 7) {
      patterns.push('Completed every day this week! 🎉')
    }
  }

  if (consistencyScore >= 80) {
    patterns.push('Highly consistent habit - keep it up!')
  } else if (consistencyScore >= 50) {
    patterns.push('Good consistency - room for improvement')
  } else if (consistencyScore < 30) {
    patterns.push('Building consistency - try setting reminders')
  }

  // Generate motivational message
  let motivationalMessage = ''
  const currentStreak = calculateCurrentStreak(logs)

  if (currentStreak >= 30) {
    motivationalMessage = `Amazing! You've maintained a ${currentStreak}-day streak! 🔥`
  } else if (currentStreak >= 7) {
    motivationalMessage = `Great job on your ${currentStreak}-day streak! Keep it going! 💪`
  } else if (currentStreak >= 3) {
    motivationalMessage = `You're building momentum with a ${currentStreak}-day streak! 🚀`
  } else if (logs.length > 0) {
    motivationalMessage = `Every completion counts! You've completed this habit ${logs.length} times. 🌟`
  } else {
    motivationalMessage = `Ready to start building this habit? Complete it today! 💫`
  }

  return {
    bestDays,
    worstDays,
    consistencyScore: Math.round(consistencyScore),
    patterns,
    motivationalMessage,
  }
}
