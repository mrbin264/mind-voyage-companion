import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { JournalEntryModel } from '@/lib/models/journal'
import type { JournalStats } from '@/types/journal'
import { auth } from '@/lib/auth'

// GET /api/journal/stats - Get user's journal statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get all user entries
    const entries = await JournalEntryModel.find({ userId: session.user.id }).sort({
      date: 1,
    })

    if (entries.length === 0) {
      const emptyStats: JournalStats = {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageWordCount: 0,
        averageMood: 0,
        totalWords: 0,
        totalMinutesWritten: 0,
        moodDistribution: {},
        tagFrequency: {},
      }

      return NextResponse.json({
        success: true,
        data: emptyStats,
      })
    }

    // Calculate basic stats
    const totalEntries = entries.length
    const totalWords = entries.reduce(
      (sum, entry) => sum + (entry.wordCount || 0),
      0
    )
    const totalMinutesWritten = entries.reduce(
      (sum, entry) => sum + (entry.readingTime || 0),
      0
    )
    const averageWordCount = Math.round(totalWords / totalEntries)

    // Calculate mood stats
    const moodEntries = entries.filter(entry => entry.mood !== undefined)
    const averageMood =
      moodEntries.length > 0
        ? Math.round(
            (moodEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) /
              moodEntries.length) *
              10
          ) / 10
        : 0

    // Mood distribution
    const moodDistribution: { [mood: number]: number } = {}
    moodEntries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1
      }
    })

    // Tag frequency
    const tagFrequency: { [tag: string]: number } = {}
    entries.forEach(entry => {
      entry.tags?.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    })

    // Calculate streaks
    const sortedDates = entries.map(entry => entry.date).sort()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Convert dates to Date objects for easier manipulation
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // Check if there's an entry for today or yesterday to start current streak
    const hasRecentEntry =
      sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)

    if (hasRecentEntry) {
      // Calculate current streak working backwards from today
      const checkDate = new Date(today)
      while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0]
        if (sortedDates.includes(checkDateStr)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i])
      const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null

      if (
        !prevDate ||
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) ===
          1
      ) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    // Determine most active time (simplified - based on creation time hour)
    const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    entries.forEach(entry => {
      const hour = entry.createdAt.getHours()
      if (hour >= 5 && hour < 12) timeSlots.morning++
      else if (hour >= 12 && hour < 17) timeSlots.afternoon++
      else if (hour >= 17 && hour < 22) timeSlots.evening++
      else timeSlots.night++
    })

    const mostActiveTime = Object.entries(timeSlots).reduce((a, b) =>
      timeSlots[a[0] as keyof typeof timeSlots] >
      timeSlots[b[0] as keyof typeof timeSlots]
        ? a
        : b
    )[0] as 'morning' | 'afternoon' | 'evening' | 'night'

    const stats: JournalStats = {
      totalEntries,
      currentStreak,
      longestStreak,
      averageWordCount,
      averageMood,
      mostActiveTime,
      totalWords,
      totalMinutesWritten,
      moodDistribution,
      tagFrequency,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('GET /api/journal/stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journal statistics' },
      { status: 500 }
    )
  }
}
