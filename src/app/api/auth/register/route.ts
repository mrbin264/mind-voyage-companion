import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
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

    const { email, password, name, timezone } = parsed.data

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

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verified: false,
      timezone: timezone || 'UTC',
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: false,
        },
        privacy: {
          publicProfile: false,
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
        name: user.name,
        verified: user.verified,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        errors: { server: ['Something went wrong. Please try again.'] },
      },
      { status: 500 }
    )
  }
}
