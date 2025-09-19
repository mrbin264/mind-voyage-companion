import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { sign } from 'jsonwebtoken'

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

    // Create JWT token
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      secret,
      { expiresIn: '7d' }
    )

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        verified: user.verified,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
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
