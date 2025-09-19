import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

// This is a temporary debug endpoint - remove in production
export async function GET() {
  try {
    await connectDB()
    
    const users = await User.find({}, { email: 1, name: 1, verified: 1, createdAt: 1 })
    
    return NextResponse.json({
      count: users.length,
      users: users
    })
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}