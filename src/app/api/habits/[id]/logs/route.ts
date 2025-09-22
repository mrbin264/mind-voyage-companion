import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { verify } from 'jsonwebtoken'
import mongoose from 'mongoose'
import type { LogHabitRequest } from '@/types/habit'
import { getTodayString, isHabitScheduledForDate } from '@/lib/habit-utils'

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

// GET /api/habits/[id]/logs - Get habit logs with date range
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid habit ID' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')

    await connectDB()

    // Verify habit belongs to user
    const habit = await HabitModel.findOne({
      _id: id,
      userId: user.userId,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Build query
    const query: any = {
      habitId: id,
      userId: user.userId,
    }

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate }
    }

    const logs = await HabitLogModel.find(query).sort({ date: -1 }).limit(limit)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching habit logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/habits/[id]/logs - Log habit completion
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid habit ID' }, { status: 400 })
    }

    const body: LogHabitRequest = await request.json()
    const logDate = body.date || getTodayString()

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify habit belongs to user
    const habit = await HabitModel.findOne({
      _id: id,
      userId: user.userId,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Check if habit is scheduled for this date
    const dateObj = new Date(logDate + 'T00:00:00')
    if (!isHabitScheduledForDate(habit, dateObj)) {
      return NextResponse.json(
        { error: 'Habit is not scheduled for this date' },
        { status: 400 }
      )
    }

    // Validate value for non-boolean habits
    if (habit.target.type !== 'boolean' && body.completed && !body.value) {
      return NextResponse.json(
        {
          error: `${habit.target.type} habits require a value when marking as completed`,
        },
        { status: 400 }
      )
    }

    // Check for existing log
    const existingLog = await HabitLogModel.findOne({
      habitId: id,
      userId: user.userId,
      date: logDate,
    })

    if (existingLog) {
      // Update existing log
      existingLog.completed = body.completed
      existingLog.value = body.value
      existingLog.notes = body.notes
      existingLog.skipped = body.skipped || false
      existingLog.skipReason = body.skipReason
      existingLog.completedAt = body.completed ? new Date() : undefined
      existingLog.updatedAt = new Date()

      await existingLog.save()
      return NextResponse.json({ log: existingLog })
    } else {
      // Create new log
      const newLog = new HabitLogModel({
        habitId: id,
        userId: user.userId,
        date: logDate,
        completed: body.completed,
        value: body.value,
        notes: body.notes,
        skipped: body.skipped || false,
        skipReason: body.skipReason,
        completedAt: body.completed ? new Date() : undefined,
      })

      await newLog.save()
      return NextResponse.json({ log: newLog }, { status: 201 })
    }
  } catch (error) {
    console.error('Error logging habit:', error)

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
