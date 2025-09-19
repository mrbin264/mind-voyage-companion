import { NextRequest, NextResponse } from 'next/server'
import { completeOnboardingSchema } from '@/lib/validations/onboarding'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { requireAuth } from '@/lib/auth-utils'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    
    // Get the current user
    const currentUser = await requireAuth(req)

    const data = await req.json()
    const parsed = completeOnboardingSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: parsed.error.flatten().fieldErrors 
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
          frequency: habit.frequency
        }
      : {
          name: habit.customName,
          emoji: habit.customEmoji,
          type: 'custom',
          reminderTime: habit.reminderTime,
          frequency: habit.frequency
        }

    // Update user with complete onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.userId,
      {
        name: profile.displayName,
        timezone: profile.timezone,
        preferences: {
          language: profile.language,
          wakeUpTime: profile.wakeUpTime,
          sleepTime: profile.sleepTime,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          firstHabit: habitData
        }
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
        onboardingCompleted: true
      }
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
    const currentUser = await requireAuth(req)

    const user = await User.findById(currentUser.userId).select('preferences timezone name')

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
          preferences: user.preferences
        }
      }
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