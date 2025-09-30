import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { onboardingProfileSchema } from '@/lib/validation/schemas'
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

    const { firstName, lastName, timezone, language, wakeUpTime, sleepTime } =
      validatedBody

    // Update user with profile information
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`, // Computed display name
        timezone: timezone,
        'preferences.language': language,
        'preferences.wakeUpTime': wakeUpTime,
        'preferences.sleepTime': sleepTime,
        'preferences.onboardingStep': 2, // Track onboarding progress
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
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        name: updatedUser.name,
        timezone: updatedUser.timezone,
        preferences: updatedUser.preferences,
      },
    })
  },
  {
    rateLimit: { type: 'mutation' },
    auth: { required: true },
    validation: { body: onboardingProfileSchema },
    sanitization: { sanitizeBody: true },
  }
)
