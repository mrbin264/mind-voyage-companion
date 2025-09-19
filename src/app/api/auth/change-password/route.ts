import { NextRequest, NextResponse } from 'next/server'
import { changePasswordSchema } from '@/lib/validations/auth'
import { hash, compare } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { requireAuth } from '@/lib/auth-utils'

// POST /api/auth/change-password - Change user password
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await requireAuth(req)
    const data = await req.json()
    const parsed = changePasswordSchema.safeParse(data)

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

    const { currentPassword, newPassword } = parsed.data

    // Find user with password
    const userProfile = await User.findById(user.userId).select('+password')
    if (!userProfile || !userProfile.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found or account has no password set',
        },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(
      currentPassword,
      userProfile.password
    )
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Current password is incorrect',
          errors: { currentPassword: ['Current password is incorrect'] },
        },
        { status: 400 }
      )
    }

    // Check if new password is different from current
    const isSamePassword = await compare(newPassword, userProfile.password)
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'New password must be different from current password',
          errors: {
            newPassword: [
              'New password must be different from current password',
            ],
          },
        },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await hash(newPassword, 12)

    // Update password
    await User.findByIdAndUpdate(user.userId, {
      password: hashedNewPassword,
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      )
    }

    console.error('Change password error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
