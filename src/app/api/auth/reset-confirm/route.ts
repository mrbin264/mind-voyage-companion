import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { resetConfirmSchema } from '@/lib/validation/schemas'
import { hash } from 'bcryptjs'
import { User, VerificationToken } from '@/lib/models/user'
import connectDB from '@/lib/db'

export const POST = secureEndpoint.custom(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  await connectDB()
  const { validatedBody } = context
  const { token, password } = validatedBody

  // Find valid verification token
  const verificationToken = await VerificationToken.findOne({
    token,
    expires: { $gt: new Date() }, // Token not expired
  })

  if (!verificationToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid or expired reset token',
        errors: { token: ['The reset token is invalid or has expired'] },
      },
      { status: 400 }
    )
  }

  // Find user by email
  const user = await User.findOne({ email: verificationToken.identifier })
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: 'User not found',
        errors: { token: ['User associated with this token not found'] },
      },
      { status: 404 }
    )
  }

  // Hash new password
  const hashedPassword = await hash(password, 12)

  // Update user password
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    verified: true, // Mark email as verified on password reset
  })

  // Delete the used verification token
  await VerificationToken.findByIdAndDelete(verificationToken._id)

  return NextResponse.json({
    success: true,
    message:
      'Password has been reset successfully. You can now log in with your new password.',
  })
}, {
  rateLimit: { type: 'auth' },
  auth: { required: false },
  validation: { body: resetConfirmSchema },
  sanitization: { sanitizeBody: true }
})
