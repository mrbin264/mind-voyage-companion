import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, type SecurityContext } from '@/lib/middleware/security'
import { updateProfileSchema } from '@/lib/validation/schemas'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

// GET /api/auth/profile - Get current user profile
export const GET = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  await connectDB()
  const { session } = context
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userProfile = await User.findById(session.user.id).select('-password')
  if (!userProfile) {
    return NextResponse.json(
      {
        success: false,
        message: 'User not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    user: {
      id: userProfile._id.toString(),
      email: userProfile.email,
      name: userProfile.name,
      verified: userProfile.verified,
      timezone: userProfile.timezone,
      preferences: userProfile.preferences,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    },
  })
})

// PATCH /api/auth/profile - Update user profile
export const PATCH = secureEndpoint.custom(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  await connectDB()
  const { session, validatedBody } = context
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const updateData: any = {}
  if (validatedBody.firstName) updateData.firstName = validatedBody.firstName
  if (validatedBody.lastName) updateData.lastName = validatedBody.lastName
  if (validatedBody.firstName && validatedBody.lastName) {
    updateData.name = `${validatedBody.firstName} ${validatedBody.lastName}`
  }
  if (validatedBody.profilePhoto)
    updateData.profilePhoto = validatedBody.profilePhoto
  if (validatedBody.dateOfBirth)
    updateData.dateOfBirth = validatedBody.dateOfBirth
  if (validatedBody.bio) updateData.bio = validatedBody.bio
  if (validatedBody.location) updateData.location = validatedBody.location
  if (validatedBody.timezone) updateData.timezone = validatedBody.timezone
  if (validatedBody.website) updateData.website = validatedBody.website
  if (validatedBody.socialLinks)
    updateData.socialLinks = validatedBody.socialLinks
  if (validatedBody.preferences) {
    updateData.$set = {}
    if (validatedBody.preferences.theme) {
      updateData.$set['preferences.theme'] = validatedBody.preferences.theme
    }
    if (validatedBody.preferences.notifications) {
      if (validatedBody.preferences.notifications.email !== undefined) {
        updateData.$set['preferences.notifications.email'] =
          validatedBody.preferences.notifications.email
      }
      if (validatedBody.preferences.notifications.push !== undefined) {
        updateData.$set['preferences.notifications.push'] =
          validatedBody.preferences.notifications.push
      }
    }
    if (validatedBody.preferences.privacy) {
      if (validatedBody.preferences.privacy.publicProfile !== undefined) {
        updateData.$set['preferences.privacy.publicProfile'] =
          validatedBody.preferences.privacy.publicProfile
      }
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    updateData,
    {
      new: true,
      select: '-password',
    }
  )

  if (!updatedUser) {
    return NextResponse.json(
      {
        success: false,
        message: 'User not found',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      verified: updatedUser.verified,
      timezone: updatedUser.timezone,
      preferences: updatedUser.preferences,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  })
}, {
  rateLimit: { type: 'mutation' },
  auth: { required: true },
  validation: { body: updateProfileSchema },
  sanitization: { sanitizeBody: true }
})

// DELETE /api/auth/profile - Delete user account
export const DELETE = secureEndpoint.mutation(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  await connectDB()
  const { session } = context
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Delete user account
  await User.findByIdAndDelete(session.user.id)

  // Return success response (NextAuth will handle session cleanup)
  return NextResponse.json({
    success: true,
    message: 'Account deleted successfully',
  })
})
