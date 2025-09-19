import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { User, VerificationToken } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { randomBytes } from 'crypto'

const resetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const parsed = resetRequestSchema.safeParse(data)

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

    const { email } = parsed.data

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link.',
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Delete any existing reset tokens for this user
    await VerificationToken.deleteMany({ identifier: email })

    // Create new verification token
    await VerificationToken.create({
      identifier: email,
      token: resetToken,
      expires,
    })

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-confirm?token=${resetToken}`
    // await sendPasswordResetEmail(email, resetUrl)

    console.log(`Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link.',
      // Remove in production - only for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    })

  } catch (error) {
    console.error('Reset request error:', error)
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
