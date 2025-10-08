import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/db'

/**
 * GET /api/example - Sample API endpoint
 * Demonstrates authentication and database connection
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to database (optional, only if needed)
    await connectDB()

    // Sample response
    return NextResponse.json({
      message: 'Sample API endpoint working!',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/example - Sample POST endpoint
 * Demonstrates request body parsing and validation
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Example: Validate request body
    if (!body.data) {
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      )
    }

    // Process the request...
    // e.g., save to database, call external API, etc.

    return NextResponse.json({
      success: true,
      message: 'Data processed successfully',
      received: body.data,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
