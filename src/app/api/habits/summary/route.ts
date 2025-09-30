import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { calculateHabitSummary } from '@/lib/habit-utils'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'
import mongoose from 'mongoose'

/**
 * Enhanced error handler for habit summary API
 */
function handleSummaryError(error: unknown) {
  console.error('Habit summary API error:', error)

  if (error instanceof mongoose.Error) {
    console.error('MongoDB connection issue in habit summary')
    return NextResponse.json(
      {
        error: 'Database connection error',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      },
      { status: 503 }
    )
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      details:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    },
    { status: 500 }
  )
}

// GET /api/habits/summary - Get habit summary statistics
export const GET = secureEndpoint.api(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    const { session } = context

    // Use enhanced connection manager
    await connectDB()

    // Get all user habits
    const habits = await HabitModel.find({ userId: session!.user.id })

    // Get recent logs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]

    const logs = await HabitLogModel.find({
      userId: session!.user.id,
      date: { $gte: startDate },
    })

    const summary = calculateHabitSummary(habits, logs)

    return NextResponse.json({ summary })
  }
)
