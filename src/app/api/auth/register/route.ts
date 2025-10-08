import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import connectDB from '@/lib/db'
import { User } from '@/lib/models/user'
import { registerSchema } from '@/lib/validation/schemas'

// Use Node.js runtime for bcryptjs compatibility
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create user
    const user = await User.create({
      email: validatedData.email,
      name: validatedData.name || validatedData.email.split('@')[0],
      password: hashedPassword,
      verified: false,
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
