import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import mongoose from 'mongoose'

/**
 * Enhanced error handler for auth registration
 */
function handleRegistrationError(error: unknown) {
  console.error('Registration error:', error)

  if (error instanceof mongoose.Error) {
    console.error('MongoDB connection issue during registration')
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection error',
        errors: {
          server: ['Service temporarily unavailable. Please try again.'],
        },
      },
      { status: 503 }
    )
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Data validation error',
        errors: { server: [error.message] },
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
      errors: { server: ['Something went wrong. Please try again.'] },
    },
    { status: 500 }
  )
}

export async function POST(req: NextRequest) {
  try {
    // Use enhanced connection manager
    await connectDB()
    const data = await req.json()
    const parsed = registerSchema.safeParse(data)

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

    const { email, password, firstName, lastName, timezone } = parsed.data

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists',
          errors: { email: ['Email already in use'] },
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user with firstName and lastName
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`, // Computed display name
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
    })

    // Return success response (NextAuth will handle authentication)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in to continue.',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        verified: user.verified,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    return handleRegistrationError(error)
  }
}
