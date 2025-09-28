import { NextRequest, NextResponse } from 'next/server'
import { updateProfileSchema } from '@/lib/validations/auth'
import { hash, compare } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { auth } from '@/lib/auth'

// GET /api/auth/profile - Get current user profile
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
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

    console.error('Get profile error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// PATCH /api/auth/profile - Update user profile
export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    const data = await req.json()
    const parsed = updateProfileSchema.safeParse(data)

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

    const updateData: any = {}
    if (parsed.data.name) updateData.name = parsed.data.name
    if (parsed.data.timezone) updateData.timezone = parsed.data.timezone
    if (parsed.data.preferences) {
      updateData.$set = {}
      if (parsed.data.preferences.theme) {
        updateData.$set['preferences.theme'] = parsed.data.preferences.theme
      }
      if (parsed.data.preferences.notifications) {
        if (parsed.data.preferences.notifications.email !== undefined) {
          updateData.$set['preferences.notifications.email'] =
            parsed.data.preferences.notifications.email
        }
        if (parsed.data.preferences.notifications.push !== undefined) {
          updateData.$set['preferences.notifications.push'] =
            parsed.data.preferences.notifications.push
        }
      }
      if (parsed.data.preferences.privacy) {
        if (parsed.data.preferences.privacy.publicProfile !== undefined) {
          updateData.$set['preferences.privacy.publicProfile'] =
            parsed.data.preferences.privacy.publicProfile
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(session.user.id, updateData, {
      new: true,
      select: '-password',
    })

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

    console.error('Update profile error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/profile - Delete user account
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
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

    console.error('Delete account error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
