import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

// This is a temporary seed endpoint - remove in production
export async function GET() {
  try {
    await connectDB()

    // Create a test user
    const email = 'test@example.com'
    const password = 'password123'
    const hashedPassword = await hash(password, 10)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({
        message: 'Test user already exists',
        credentials: { email, password },
      })
    }

    const user = new User({
      name: 'Test User',
      email,
      password: hashedPassword,
      verified: true,
      timezone: 'UTC',
    })

    await user.save()

    return NextResponse.json({
      message: 'Test user created',
      credentials: { email, password },
    })
  } catch (error) {
    console.error('Seed user error:', error)
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    )
  }
}
