import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/lib/models/user'
import { HabitModel } from '@/lib/models/habit'
import { JournalEntryModel } from '@/lib/models/journal'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'

export const GET = secureEndpoint.api(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    const { session } = context

    await connectDB()

    // Get user data
    const user = await User.findById(session!.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user statistics
    const [totalHabits, totalJournalEntries] = await Promise.all([
      HabitModel.countDocuments({ userId: session!.user.id }),
      JournalEntryModel.countDocuments({ userId: session!.user.id }),
    ])

    // Calculate current streak (simplified - you may want to implement proper streak calculation)
    const recentHabits = await HabitModel.find({ userId: session!.user.id })
      .populate('logs')
      .limit(10)

    const currentStreak = 0
    // This is a simplified streak calculation
    // You should implement proper streak calculation based on your habit log structure

    // Calculate total login days (simplified)
    const totalLoginDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    const profileData = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      avatar: user.avatar,
      timezone: user.timezone || 'America/New_York',
      joinedAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || user.updatedAt,
      // Statistics
      totalHabits,
      totalJournalEntries,
      currentStreak,
      totalLoginDays: Math.max(1, totalLoginDays), // At least 1 day
    }

    return NextResponse.json(profileData)
  }
)

export const PUT = secureEndpoint.mutation(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    const { session } = context

    const body = await request.json()
    const { firstName, lastName, email, timezone } = body

    // Basic validation
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      session!.user.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        timezone: timezone || 'America/New_York',
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        timezone: updatedUser.timezone,
      },
    })
  }
)
