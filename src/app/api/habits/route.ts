/**
 * Secure Habits API with comprehensive security middleware
 * GET /api/habits - List user habits with filtering and validation
 * POST /api/habits - Create new habit with validation and rate limiting
 */
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import type { CreateHabitRequest } from '@/types/habit'
import { calculateHabitProgress } from '@/lib/habit-utils'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { throwValidationError } from '@/lib/middleware/error-handler'
import schemas from '@/lib/validation/schemas'
import { createSafeRegex } from '@/lib/security/sanitization'

// GET /api/habits - Get user's habits with optional filters
export const GET = secureEndpoint.api(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    const { session } = context

    await connectDB()

    const { searchParams } = new URL(request.url)

    // Validate query parameters using schema
    const queryValidation = schemas.habitQuery.safeParse({
      status: searchParams.get('status') || 'active',
      category: searchParams.get('category') || undefined,
      include_progress: searchParams.get('include_progress') || 'false',
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    })

    if (!queryValidation.success) {
      throwValidationError(
        'Invalid query parameters',
        queryValidation.error.issues
      )
    }

    const filters = queryValidation.data!

    // Build secure MongoDB query
    const query: any = { userId: session!.user.id }

    // Status filtering
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

    // Category filtering (exact match)
    if (filters.category) {
      query.category = filters.category
    }

    // Date range filtering
    if (filters.date_from || filters.date_to) {
      query.createdAt = {}
      if (filters.date_from) {
        query.createdAt.$gte = filters.date_from
      }
      if (filters.date_to) {
        query.createdAt.$lte = filters.date_to
      }
    }

    // Search functionality with safe regex
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      const safeRegex = createSafeRegex(searchQuery)
      if (safeRegex) {
        query.$or = [
          { title: safeRegex },
          { description: safeRegex },
          { category: safeRegex },
        ]
      }
    }

    // Execute query with pagination and sorting
    const skip = (filters.page - 1) * filters.limit
    const sortField = filters.sortBy === 'priority' ? 'priority' : 'createdAt'
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1

    const [habits, totalCount] = await Promise.all([
      HabitModel.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(filters.limit)
        .lean(),
      HabitModel.countDocuments(query),
    ])

    // Calculate progress if requested
    let responseData: any[] = habits
    if (filters.include_progress) {
      const habitIds = habits.map(h => h._id)
      const logs = await HabitLogModel.find({
        habitId: { $in: habitIds },
        userId: session!.user.id,
      }).lean()

      responseData = habits.map(habit => {
        const habitLogs = logs.filter(
          log => log.habitId.toString() === (habit._id as any).toString()
        )
        return calculateHabitProgress(habit as any, habitLogs as any)
      })
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      meta: {
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / filters.limit),
        },
        filters: {
          status: filters.status,
          category: filters.category,
          includeProgress: filters.include_progress,
          search: searchQuery,
        },
        timestamp: new Date().toISOString(),
      },
    })
  }
)

// POST /api/habits - Create a new habit
export const POST = secureEndpoint.mutation(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    const { session } = context

    await connectDB()

    // Parse and validate request body
    let body: CreateHabitRequest | undefined
    try {
      body = await request.json()
    } catch (error) {
      throwValidationError('Invalid JSON in request body')
    }

    if (!body) {
      throwValidationError('No request body provided')
    }

    // Validate using schema
    const validation = schemas.createHabit.safeParse(body)
    if (!validation.success) {
      throwValidationError('Invalid habit data', {
        issues: validation.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      })
    }

    const validatedData = validation.data!

    // Additional business logic validation
    if (
      validatedData.frequency.type === 'weekly' ||
      validatedData.frequency.type === 'custom'
    ) {
      if (
        !validatedData.frequency.days ||
        validatedData.frequency.days.length === 0
      ) {
        throwValidationError(
          'Weekly and custom habits must specify days of week'
        )
      }
    }

    // Check if user has too many habits (rate limiting by resource count)
    const existingHabitsCount = await HabitModel.countDocuments({
      userId: session!.user.id,
      'status.archived': false,
    })

    if (existingHabitsCount >= 50) {
      // Reasonable limit
      throwValidationError('Maximum number of active habits reached (50)')
    }

    // Create habit with secure defaults
    const habit = new HabitModel({
      ...validatedData,
      userId: session!.user.id,
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
      // Security: Ensure these fields are controlled
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedHabit = await habit.save()

    return NextResponse.json(
      {
        success: true,
        data: savedHabit,
        message: 'Habit created successfully',
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  }
)
