import { NextRequest, NextResponse } from 'next/server'
import { completeOnboardingSchema } from '@/lib/validations/onboarding'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // Get the current user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const parsed = completeOnboardingSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { profile, habit } = parsed.data

    // Create habit data structure
    const habitData = habit.habitId
      ? {
          id: habit.habitId,
          type: 'predefined',
          reminderTime: habit.reminderTime,
          frequency: habit.frequency,
        }
      : {
          name: habit.customName,
          emoji: habit.customEmoji,
          type: 'custom',
          reminderTime: habit.reminderTime,
          frequency: habit.frequency,
        }

    // Update user with complete onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
        name: `${profile.firstName} ${profile.lastName}`,
        timezone: profile.timezone,
        'preferences.language': profile.language,
        'preferences.wakeUpTime': profile.wakeUpTime,
        'preferences.sleepTime': profile.sleepTime,
        'preferences.onboardingCompleted': true,
        'preferences.onboardingCompletedAt': new Date(),
        'preferences.firstHabit': habitData,
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        name: updatedUser.name,
        timezone: updatedUser.timezone,
        preferences: updatedUser.preferences,
        onboardingCompleted: true,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Complete onboarding error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check onboarding status
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    // Get the current user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await User.findById(session.user.id).select(
      'preferences timezone name'
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const onboardingCompleted = user.preferences?.onboardingCompleted || false
    const onboardingStep = user.preferences?.onboardingStep || 1

    return NextResponse.json({
      success: true,
      data: {
        onboardingCompleted,
        onboardingStep,
        profile: {
          name: user.name,
          timezone: user.timezone,
          preferences: user.preferences,
        },
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Get onboarding status error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
