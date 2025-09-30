import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { changePasswordSchema } from '@/lib/validation/schemas'
import { hash, compare } from 'bcryptjs'
import { User } from '@/lib/models/user'

// POST /api/auth/change-password - Change user password
export const POST = secureEndpoint.custom(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { validatedBody, session } = context
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { currentPassword, newPassword } = validatedBody

  // Find user with password
  const userProfile = await User.findById(session.user.id).select('+password')
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
  await User.findByIdAndUpdate(session.user.id, {
    password: hashedNewPassword,
  })

  return NextResponse.json({
    success: true,
    message: 'Password changed successfully',
  })
}, {
  rateLimit: { type: 'auth' },
  auth: { required: true },
  validation: { body: changePasswordSchema },
  sanitization: { sanitizeBody: true }
})
