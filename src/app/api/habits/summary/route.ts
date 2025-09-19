import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { verify } from 'jsonwebtoken'
import { calculateHabitSummary } from '@/lib/habit-utils'

interface AuthUser {
  userId: string
  email: string
  name: string
}

async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = verify(token, secret) as AuthUser

    return decoded
  } catch (error) {
    return null
  }
}

// GET /api/habits/summary - Get habit summary statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get all user habits
    const habits = await HabitModel.find({ userId: user.userId })

    // Get recent logs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]

    const logs = await HabitLogModel.find({
      userId: user.userId,
      date: { $gte: startDate }
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