import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { completeOnboardingSchema } from '@/lib/validation/schemas'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

export const POST = secureEndpoint.custom(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    await connectDB()
    const { session, validatedBody } = context

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { profile, habit } = validatedBody

    // Get current user to preserve firstName/lastName
    const currentUser = await User.findById(session.user.id)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

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

    // Update user with complete onboarding data (preserve existing name)
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
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
  },
  {
    rateLimit: { type: 'mutation' },
    auth: { required: true },
    validation: { body: completeOnboardingSchema },
    sanitization: { sanitizeBody: true },
  }
)

// GET endpoint to check onboarding status
export const GET = secureEndpoint.api(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    await connectDB()
    const { session } = context

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
  }
)
