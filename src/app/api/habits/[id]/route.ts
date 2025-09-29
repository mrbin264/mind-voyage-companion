import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import mongoose from 'mongoose'
import type { UpdateHabitRequest } from '@/types/habit'
import { calculateHabitProgress } from '@/lib/habit-utils'
import { auth } from '@/lib/auth'

/**
 * Enhanced error handler for habit API routes
 */
function handleHabitError(error: unknown, operation: string) {
  console.error(`Habit API error during ${operation}:`, error)

  if (error instanceof mongoose.Error) {
    console.error('MongoDB connection issue detected')
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

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.message },
      { status: 400 }
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

// GET /api/habits/[id] - Get a specific habit with progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid habit ID' }, { status: 400 })
    }

    await connectDB()

    const habit = await HabitModel.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Get logs for progress calculation
    const logs = await HabitLogModel.find({
      habitId: habit._id,
      userId: session.user.id,
    }).sort({ date: -1 })

    const habitWithProgress = calculateHabitProgress(habit, logs)

    return NextResponse.json({ habit: habitWithProgress })
  } catch (error) {
    return handleHabitError(error, 'habit fetch')
  }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid habit ID' }, { status: 400 })
    }

    const body: UpdateHabitRequest = await request.json()

    // Validate frequency if provided
    if (body.frequency) {
      if (
        body.frequency.type === 'weekly' ||
        body.frequency.type === 'custom'
      ) {
        if (
          !body.frequency.daysOfWeek ||
          body.frequency.daysOfWeek.length === 0
        ) {
          return NextResponse.json(
            { error: 'Weekly and custom habits must specify days of week' },
            { status: 400 }
          )
        }

        if (!body.frequency.daysOfWeek.every(day => day >= 0 && day <= 6)) {
          return NextResponse.json(
            {
              error: 'Days of week must be between 0 (Sunday) and 6 (Saturday)',
            },
            { status: 400 }
          )
        }
      }
    }

    // Validate target if provided
    if (
      body.target &&
      ['count', 'duration', 'amount'].includes(body.target.type) &&
      !body.target.value
    ) {
      return NextResponse.json(
        { error: `${body.target.type} habits must have a target value` },
        { status: 400 }
      )
    }

    await connectDB()

    const habit = await HabitModel.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ habit })
  } catch (error) {
    return handleHabitError(error, 'habit update')
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid habit ID' }, { status: 400 })
    }

    await connectDB()

    // Check if habit exists and belongs to user
    const habit = await HabitModel.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Delete the habit and all associated logs
    await Promise.all([
      HabitModel.deleteOne({ _id: id, userId: session.user.id }),
      HabitLogModel.deleteMany({ habitId: id, userId: session.user.id }),
    ])

    return NextResponse.json({ message: 'Habit deleted successfully' })
  } catch (error) {
    return handleHabitError(error, 'habit deletion')
  }
}
