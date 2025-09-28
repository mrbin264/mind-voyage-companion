import { NextRequest, NextResponse } from 'next/server'
import { onboardingProfileSchema } from '@/lib/validations/onboarding'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // Get the current user
    const session = await auth()
    console.log(
      'Onboarding profile - session:',
      session ? 'exists' : 'null',
      session?.user?.id
    )

    if (!session?.user?.id) {
      console.log('Onboarding profile - No session or user ID, returning 401')
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const parsed = onboardingProfileSchema.safeParse(data)

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

    const { displayName, timezone, language, wakeUpTime, sleepTime } =
      parsed.data

    // Update user with profile information
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: displayName,
        timezone: timezone,
        preferences: {
          language,
          wakeUpTime,
          sleepTime,
          onboardingStep: 2, // Track onboarding progress
        },
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
      message: 'Profile updated successfully',
      data: {
        name: updatedUser.name,
        timezone: updatedUser.timezone,
        preferences: updatedUser.preferences,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
