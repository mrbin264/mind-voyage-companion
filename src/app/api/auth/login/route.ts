import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { sign } from 'jsonwebtoken'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const parsed = loginSchema.safeParse(data)

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

    const { email, password } = parsed.data

    // Find user by email
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid credentials',
          errors: { email: ['Invalid email or password'] } 
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid credentials',
          errors: { password: ['Invalid email or password'] } 
        },
        { status: 401 }
      )
    }

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
      message: 'Login successful',
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        verified: user.verified,
        timezone: user.timezone,
        createdAt: user.createdAt,
        preferences: user.preferences
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
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        errors: { server: ['Something went wrong. Please try again.'] }
      },
      { status: 500 }
    )
  }
}
