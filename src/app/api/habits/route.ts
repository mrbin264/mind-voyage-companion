import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import mongoose from 'mongoose'
import type { CreateHabitRequest, HabitFilters } from '@/types/habit'
import {
  calculateHabitProgress,
  calculateHabitSummary,
} from '@/lib/habit-utils'
import { auth } from '@/lib/auth'

/**
 * Enhanced error handler for API routes with connection health monitoring
 */
function handleDatabaseError(error: unknown, operation: string) {
  console.error(`Database error during ${operation}:`, error)

  // Check if it's a connection error
  if (
    error instanceof mongoose.Error ||
    (error as any)?.name?.includes('Mongo')
  ) {
    console.error('MongoDB connection issue detected, may need reconnection')
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

// GET /api/habits - Get user's habits with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use enhanced connection manager
    await connectDB()

    const { searchParams } = new URL(request.url)
    const filters: HabitFilters = {
      status: (searchParams.get('status') as any) || 'all',
      category: searchParams.get('category') || undefined,
      frequency: (searchParams.get('frequency') as any) || undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      search: searchParams.get('search') || undefined,
    }

    // Build query
    const query: any = { userId: session.user.id }

    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          query['status.active'] = true
          query['status.archived'] = false
          break
        case 'paused':
          query['status.active'] = false
          query['status.pausedAt'] = { $exists: true }
          break
        case 'archived':
          query['status.archived'] = true
          break
      }
    }

    if (filters.category) {
      query.category = filters.category
    }

    if (filters.frequency) {
      query['frequency.type'] = filters.frequency
    }

    if (filters.priority) {
      query.priority = filters.priority
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ]
    }

    const habits = await HabitModel.find(query).sort({
      priority: -1,
      createdAt: -1,
    })

    // Get logs for progress calculation if requested
    const includeProgress = searchParams.get('include_progress') === 'true'
    if (includeProgress) {
      const habitIds = habits.map(h => h._id)
      const logs = await HabitLogModel.find({
        habitId: { $in: habitIds },
        userId: session.user.id,
      })

      const habitsWithProgress = habits.map(habit => {
        const habitLogs = logs.filter(
          log => log.habitId.toString() === habit._id.toString()
        )
        return calculateHabitProgress(habit, habitLogs)
      })

      return NextResponse.json({
        habits: habitsWithProgress,
        meta: {
          total: habitsWithProgress.length,
          filters,
          includeProgress: true,
        },
      })
    }

    return NextResponse.json({
      habits,
      meta: {
        total: habits.length,
        filters,
        includeProgress: false,
      },
    })
  } catch (error) {
    return handleDatabaseError(error, 'habits fetch')
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateHabitRequest = await request.json()

    // Enhanced validation with detailed error messages
    if (!body.title || !body.frequency || !body.target) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: {
            title: !body.title ? 'Title is required' : null,
            frequency: !body.frequency ? 'Frequency is required' : null,
            target: !body.target ? 'Target is required' : null,
          },
        },
        { status: 400 }
      )
    }

    // Validate frequency
    if (body.frequency.type === 'weekly' || body.frequency.type === 'custom') {
      if (
        !body.frequency.daysOfWeek ||
        body.frequency.daysOfWeek.length === 0
      ) {
        return NextResponse.json(
          { error: 'Weekly and custom habits must specify days of week' },
          { status: 400 }
        )
      }

      // Validate days of week
      if (!body.frequency.daysOfWeek.every(day => day >= 0 && day <= 6)) {
        return NextResponse.json(
          { error: 'Days of week must be between 0 (Sunday) and 6 (Saturday)' },
          { status: 400 }
        )
      }
    }

    // Validate target
    if (
      ['count', 'duration', 'amount'].includes(body.target.type) &&
      !body.target.value
    ) {
      return NextResponse.json(
        { error: `${body.target.type} habits must have a target value` },
        { status: 400 }
      )
    }

    // Use enhanced connection manager
    await connectDB()

    const habit = new HabitModel({
      ...body,
      userId: session.user.id,
      status: {
        active: true,
        archived: false,
        createdAt: new Date(),
      },
      analytics: {
        totalCompletions: 0,
        currentStreak: 0,
        bestStreak: 0,
        averagePerformance: 0,
        lastCompletedAt: null,
      },
    })

    const savedHabit = await habit.save()

    return NextResponse.json(
      {
        habit: savedHabit,
        message: 'Habit created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    return handleDatabaseError(error, 'habit creation')
  }
}
