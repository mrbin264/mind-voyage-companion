import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import connectDB from '@/lib/db'

// GET /api/auth/me - Get current authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const user = getCurrentUser(req)
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Not authenticated',
          user: null
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
    })

  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        user: null
      },
      { status: 500 }
    )
  }
}