/**
 * Secure User Registration API with rate limiting and validation
 * POST /api/auth/register - Create new user account
 */
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { throwValidationError } from '@/lib/middleware/error-handler'
import schemas from '@/lib/validation/schemas'

// POST /api/auth/register - User registration with rate limiting
export const POST = secureEndpoint.custom(
  async (
    request: NextRequest,
    context: SecurityContext
  ): Promise<NextResponse> => {
    await connectDB()

    // Use validated body from security middleware
    const { email, password, firstName, lastName, timezone } =
      context.validatedBody!

    // Combine firstName and lastName into name for user creation
    const name = `${firstName} ${lastName}`.trim()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throwValidationError('User already exists', {
        email: ['Email already in use'],
      })
    }

    // Hash password securely
    const hashedPassword = await hash(password, 12)

    // Create user with secure defaults
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verified: false,
      timezone: timezone || 'UTC',
      preferences: {
        theme: 'system',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        weekStartsOn: 'sunday',
        language: 'en-US',
        notifications: {
          email: true,
          push: false,
          habitReminders: true,
          journalReminders: true,
          weeklyReports: true,
        },
        privacy: {
          publicProfile: false,
          shareStats: false,
        },
        onboardingCompleted: false,
        onboardingStep: 0,
        dashboard: {
          showWeather: true,
          showQuote: true,
          showStreak: true,
          defaultView: 'grid',
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please sign in to continue.',
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          verified: user.verified,
          timezone: user.timezone,
          createdAt: user.createdAt,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  },
  {
    rateLimit: { type: 'auth' },
    auth: { required: false },
    validation: { body: schemas.register },
    sanitization: { sanitizeBody: true },
    logging: { logRequests: true },
  }
)
