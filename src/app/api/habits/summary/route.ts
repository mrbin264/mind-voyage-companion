import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { calculateHabitSummary } from '@/lib/habit-utils'
import { auth } from '@/lib/auth'

// GET /api/habits/summary - Get habit summary statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get all user habits
    const habits = await HabitModel.find({ userId: session.user.id })

    // Get recent logs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]

    const logs = await HabitLogModel.find({
      userId: session.user.id,
      date: { $gte: startDate },
    })

    const summary = calculateHabitSummary(habits, logs)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error fetching habit summary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
