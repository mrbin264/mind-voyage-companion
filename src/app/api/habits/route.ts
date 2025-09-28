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

// GET /api/habits - Get user's habits with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

      return NextResponse.json({ habits: habitsWithProgress })
    }

    return NextResponse.json({ habits })
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    // Validate required fields
    if (!body.title || !body.frequency || !body.target) {
      return NextResponse.json(
        { error: 'Missing required fields: title, frequency, target' },
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

    await connectDB()

    const habit = new HabitModel({
      ...body,
      userId: session.user.id,
      status: {
        active: true,
        archived: false,
      },
    })

    await habit.save()

    return NextResponse.json({ habit }, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)

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
