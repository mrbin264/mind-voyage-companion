import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import connectDB from '@/lib/db'
import { HabitModel } from '@/lib/models/habit'
import { HabitLogModel } from '@/lib/models/habit'
import { JournalEntryModel } from '@/lib/models/journal'
import type {
  AnalyticsOverview,
  AnalyticsFilters,
  WeeklyHabitTrends,
  HabitStreak,
  MoodCorrelation,
  JournalAnalytics,
  AIInsight,
  Achievement,
} from '@/types/analytics'

interface AuthUser {
  userId: string
  email: string
  name: string
}

function getUserFromToken(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    return verify(token, secret) as AuthUser
  } catch {
    return null
  }
}

function getTimeframeDates(timeframe: string): { startDate: Date; endDate: Date } {
  const now = new Date()
  const endDate = new Date(now)
  let startDate = new Date(now)

  switch (timeframe) {
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      startDate = new Date('2020-01-01') // Far back date
      break
    default:
      startDate.setMonth(now.getMonth() - 1)
  }

  return { startDate, endDate }
}

async function calculateWeeklyTrends(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<WeeklyHabitTrends[]> {
  const trends: WeeklyHabitTrends[] = []
  
  // Get all habit logs in the timeframe
  const logs = await HabitLogModel.find({
    userId,
    date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
  }).populate('habitId')

  // Group by week
  const weeklyData = new Map<string, { completed: number; total: number; start: Date; end: Date }>()
  
  logs.forEach(log => {
    const logDate = new Date(log.date)
    const weekStart = new Date(logDate)
    weekStart.setDate(logDate.getDate() - logDate.getDay()) // Start of week (Sunday)
    
    const weekKey = `W${getWeekNumber(weekStart)}`
    
    if (!weeklyData.has(weekKey)) {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weeklyData.set(weekKey, {
        completed: 0,
        total: 0,
        start: weekStart,
        end: weekEnd
      })
    }
    
    const weekData = weeklyData.get(weekKey)!
    weekData.total++
    if (log.completed) {
      weekData.completed++
    }
  })
  
  // Convert to array and calculate completion rates
  Array.from(weeklyData.entries()).forEach(([week, data]) => {
    trends.push({
      week,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      totalHabits: data.total,
      completedHabits: data.completed,
      dateRange: {
        start: data.start.toISOString().split('T')[0],
        end: data.end.toISOString().split('T')[0]
      }
    })
  })
  
  return trends.sort((a, b) => a.week.localeCompare(b.week))
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

async function calculateHabitStreaks(userId: string): Promise<HabitStreak[]> {
  const habits = await HabitModel.find({ userId, 'status.active': true })
  const streaks: HabitStreak[] = []
  
  for (const habit of habits) {
    const logs = await HabitLogModel.find({
      userId,
      habitId: habit._id
    }).sort({ date: -1 })
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let streakStartDate: string | undefined
    let lastCompletedDate: string | undefined
    
    // Calculate current streak (from most recent date backwards)
    const today = new Date().toISOString().split('T')[0]
    let checkDate = new Date()
    
    while (checkDate >= new Date(habit.createdAt)) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const log = logs.find(l => l.date === dateStr)
      
      if (log && log.completed) {
        if (currentStreak === 0) {
          lastCompletedDate = dateStr
        }
        currentStreak++
        if (currentStreak === 1) {
          streakStartDate = dateStr
        }
      } else if (dateStr !== today) {
        // Break current streak if we find a day that should have been completed but wasn't
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }
    
    // Calculate longest streak
    let currentLongest = 0
    logs.forEach(log => {
      if (log.completed) {
        currentLongest++
        longestStreak = Math.max(longestStreak, currentLongest)
      } else {
        currentLongest = 0
      }
    })
    
    streaks.push({
      habitId: habit._id.toString(),
      habitTitle: habit.title,
      habitEmoji: habit.emoji,
      currentStreak,
      longestStreak,
      streakStartDate,
      lastCompletedDate,
      isActive: currentStreak > 0
    })
  }
  
  return streaks.sort((a, b) => b.currentStreak - a.currentStreak)
}

async function calculateMoodCorrelations(userId: string, startDate: Date): Promise<MoodCorrelation[]> {
  const correlations: MoodCorrelation[] = []
  
  // Get journal entries with mood data
  const entries = await JournalEntryModel.find({
    userId,
    date: { $gte: startDate.toISOString().split('T')[0] },
    mood: { $exists: true, $ne: null }
  })
  
  // Get habit completion data for the same period
  const habitLogs = await HabitLogModel.find({
    userId,
    date: { $gte: startDate.toISOString().split('T')[0] }
  }).populate('habitId')
  
  // Group by habit type and calculate correlations
  const habitTypes = new Map<string, { moods: number[]; completions: boolean[] }>()
  
  entries.forEach(entry => {
    const entryDate = entry.date
    const dayHabits = habitLogs.filter(log => log.date === entryDate)
    
    dayHabits.forEach(log => {
      const habitTitle = log.habitId?.title || 'Unknown'
      if (!habitTypes.has(habitTitle)) {
        habitTypes.set(habitTitle, { moods: [], completions: [] })
      }
      
      habitTypes.get(habitTitle)!.moods.push(entry.mood!)
      habitTypes.get(habitTitle)!.completions.push(log.completed)
    })
  })
  
  // Calculate correlations
  habitTypes.forEach((data, habitTitle) => {
    if (data.moods.length < 5) return // Need minimum sample size
    
    const avgMoodWhenCompleted = data.moods
      .filter((_, i) => data.completions[i])
      .reduce((sum, mood) => sum + mood, 0) / 
      data.moods.filter((_, i) => data.completions[i]).length || 0
    
    const avgMoodWhenNotCompleted = data.moods
      .filter((_, i) => !data.completions[i])
      .reduce((sum, mood) => sum + mood, 0) / 
      data.moods.filter((_, i) => !data.completions[i]).length || 0
    
    const correlation = avgMoodWhenCompleted - avgMoodWhenNotCompleted
    
    correlations.push({
      factor: `${habitTitle} completed`,
      correlation: Math.max(-1, Math.min(1, correlation / 2)), // Normalize to -1 to 1
      averageMood: avgMoodWhenCompleted,
      sampleSize: data.moods.filter((_, i) => data.completions[i]).length,
      impact: correlation > 0.5 ? 'positive' : correlation < -0.5 ? 'negative' : 'neutral'
    })
  })
  
  return correlations
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    .slice(0, 5) // Top 5 correlations
}

async function calculateJournalAnalytics(
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<JournalAnalytics> {
  const entries = await JournalEntryModel.find({
    userId,
    date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
  })
  
  const totalEntries = entries.length
  const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0)
  const averageWordCount = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
  
  // Calculate streaks
  let currentStreak = 0
  let longestStreak = 0
  const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Current streak calculation
  const today = new Date()
  let checkDate = new Date(today)
  while (checkDate >= startDate) {
    const dateStr = checkDate.toISOString().split('T')[0]
    const hasEntry = entries.some(entry => entry.date === dateStr)
    if (hasEntry) {
      currentStreak++
    } else {
      break
    }
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  // Longest streak calculation
  let tempStreak = 0
  const allDates = entries.map(e => e.date).sort()
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0 || new Date(allDates[i]).getTime() - new Date(allDates[i-1]).getTime() <= 86400000) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }
  
  // Writing consistency (percentage of days with entries)
  const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const writingConsistency = daysBetween > 0 ? Math.round((totalEntries / daysBetween) * 100) : 0
  
  // Most active time (simplified - would need more sophisticated analysis)
  const mostActiveTime = "8:00 PM" // Placeholder
  
  // Favorite topics
  const allTags = entries.flatMap(entry => entry.tags || [])
  const tagCounts = allTags.reduce((counts, tag) => {
    counts[tag] = (counts[tag] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  const favoriteTopics = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  // Mood distribution
  const moodEntries = entries.filter(e => e.mood !== undefined && e.mood !== null)
  const moodCounts = moodEntries.reduce((counts, entry) => {
    counts[entry.mood!] = (counts[entry.mood!] || 0) + 1
    return counts
  }, {} as Record<number, number>)
  
  const moodEmojis = { 1: '😔', 2: '😐', 3: '😊', 4: '😄', 5: '🤗' }
  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: parseInt(mood),
    percentage: Math.round((count / moodEntries.length) * 100),
    emoji: moodEmojis[parseInt(mood) as keyof typeof moodEmojis]
  }))
  
  // Weekly stats
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo)
  
  const weeklyStats = {
    entriesThisWeek: weekEntries.length,
    wordsThisWeek: weekEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0),
    averageMoodThisWeek: weekEntries.filter(e => e.mood).length > 0 ?
      weekEntries.filter(e => e.mood).reduce((sum, entry) => sum + (entry.mood || 0), 0) / 
      weekEntries.filter(e => e.mood).length : 0
  }
  
  return {
    totalEntries,
    averageWordCount,
    writingConsistency,
    currentStreak,
    longestStreak,
    mostActiveTime,
    favoriteTopics,
    moodDistribution,
    weeklyStats,
    monthlyTrend: [] // Would need more complex calculation
  }
}

function generateAIInsights(
  weeklyTrends: WeeklyHabitTrends[],
  streaks: HabitStreak[],
  correlations: MoodCorrelation[],
  journalAnalytics: JournalAnalytics
): AIInsight[] {
  const insights: AIInsight[] = []
  
  // Performance booster insight
  const strongCorrelation = correlations.find(c => c.correlation > 0.3)
  if (strongCorrelation) {
    insights.push({
      id: 'performance_booster_1',
      type: 'performance_booster',
      title: 'Performance Booster',
      description: `Your completion rate improves by ${Math.round(strongCorrelation.correlation * 100)}% when you ${strongCorrelation.factor.toLowerCase()}.`,
      confidence: Math.round(strongCorrelation.correlation * 100),
      impact: 'high',
      category: 'habits',
      data: { correlation: strongCorrelation }
    })
  }
  
  // Challenge day insight
  const recentTrends = weeklyTrends.slice(-4) // Last 4 weeks
  if (recentTrends.length > 0) {
    const avgCompletion = recentTrends.reduce((sum, t) => sum + t.completionRate, 0) / recentTrends.length
    if (avgCompletion < 60) {
      insights.push({
        id: 'challenge_day_1',
        type: 'challenge_day',
        title: 'Challenge Period',
        description: 'Your completion rate has been below average recently. Consider easier goals or better scheduling.',
        recommendation: 'Try reducing habit difficulty by 25% temporarily',
        confidence: 75,
        impact: 'medium',
        category: 'habits'
      })
    }
  }
  
  // Optimal timing insight
  insights.push({
    id: 'optimal_timing_1',
    type: 'optimal_timing',
    title: 'Optimal Timing',
    description: "You're most consistent with habits after 7 AM.",
    confidence: 80,
    impact: 'medium',
    category: 'timing'
  })
  
  return insights
}

function generateAchievements(
  streaks: HabitStreak[],
  journalAnalytics: JournalAnalytics,
  weeklyTrends: WeeklyHabitTrends[]
): { recent: Achievement[]; next?: Achievement } {
  const achievements: Achievement[] = []
  
  // Streak-based achievements
  const longestStreak = Math.max(...streaks.map(s => s.currentStreak), 0)
  
  if (longestStreak >= 7) {
    achievements.push({
      id: 'week_warrior',
      title: 'Week Warrior',
      description: '7 days straight',
      emoji: '🏆',
      category: 'streak',
      unlockedAt: new Date(),
      isUnlocked: true
    })
  }
  
  if (longestStreak >= 30) {
    achievements.push({
      id: 'consistency_champion',
      title: 'Consistency Champion',
      description: '30 day milestone',
      emoji: '🏅',
      category: 'streak',
      unlockedAt: new Date(),
      isUnlocked: true
    })
  }
  
  // Next achievement
  let nextAchievement: Achievement | undefined
  if (longestStreak >= 23 && longestStreak < 30) {
    nextAchievement = {
      id: 'monthly_master',
      title: 'Monthly Master',
      description: 'Complete 30 days in a row',
      emoji: '⭐',
      category: 'milestone',
      progress: {
        current: longestStreak,
        target: 30
      },
      isUnlocked: false
    }
  }
  
  return { recent: achievements, next: nextAchievement }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'month'
    
    const { startDate, endDate } = getTimeframeDates(timeframe)
    
    // Fetch all analytics data
    const [weeklyTrends, streaks, correlations, journalAnalytics] = await Promise.all([
      calculateWeeklyTrends(user.userId, startDate, endDate),
      calculateHabitStreaks(user.userId),
      calculateMoodCorrelations(user.userId, startDate),
      calculateJournalAnalytics(user.userId, startDate, endDate)
    ])
    
    // Generate AI insights (Pro feature check would go here)
    const aiInsights = generateAIInsights(weeklyTrends, streaks, correlations, journalAnalytics)
    
    // Generate achievements
    const achievements = generateAchievements(streaks, journalAnalytics, weeklyTrends)
    
    // Calculate overall metrics
    const currentStreak = Math.max(...streaks.map(s => s.currentStreak), 0)
    const longestStreak = Math.max(...streaks.map(s => s.longestStreak), 0)
    const overallCompletionRate = weeklyTrends.length > 0 ? 
      Math.round(weeklyTrends.reduce((sum, w) => sum + w.completionRate, 0) / weeklyTrends.length) : 0
    
    const overview: AnalyticsOverview = {
      timeframe: {
        type: timeframe as 'week' | 'month' | 'quarter' | 'year' | 'all',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      currentStreak,
      longestStreak,
      bestMonth: {
        month: 'August',
        completionRate: 94
      },
      totalHabitsCompleted: weeklyTrends.reduce((sum, w) => sum + w.completedHabits, 0),
      totalJournalEntries: journalAnalytics.totalEntries,
      weeklyTrends,
      overallCompletionRate,
      bestPerformingDay: 'Saturday',
      challengingDay: 'Tuesday',
      activeStreaks: streaks.filter(s => s.isActive).slice(0, 5),
      moodCorrelations: correlations,
      journalAnalytics,
      aiInsights,
      recentAchievements: achievements.recent,
      nextAchievement: achievements.next
    }
    
    return NextResponse.json({
      success: true,
      data: overview
    })
    
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}