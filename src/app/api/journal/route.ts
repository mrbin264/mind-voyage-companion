import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { JournalEntryModel } from '@/lib/models/journal'
import { verify } from 'jsonwebtoken'
import type { JournalEntry, JournalSearchParams } from '@/types/journal'

interface AuthUser {
  userId: string
  email: string
  name: string
}

async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = verify(token, secret) as AuthUser

    return decoded
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

// Helper to format date as YYYY-MM-DD in user's timezone
function formatDateForEntry(date: Date): string {
  return date.toISOString().split('T')[0]
}

// GET /api/journal - Get journal entries with optional search/filter
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || undefined
    const mood = searchParams.get('mood')?.split(',').map(m => parseInt(m)).filter(m => !isNaN(m)) || undefined
    const tags = searchParams.get('tags')?.split(',').filter(tag => tag.trim()) || undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined
    const favorite = searchParams.get('favorite') === 'true' ? true : 
                    searchParams.get('favorite') === 'false' ? false : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 per page
    const sortBy = (searchParams.get('sortBy') as 'date' | 'wordCount' | 'mood') || 'date'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'

    const searchParameters: JournalSearchParams = {
      query,
      mood,
      tags,
      dateFrom,
      dateTo,
      favorite,
      page,
      limit,
      sortBy,
      sortOrder
    }

    const result = await JournalEntryModel.searchEntries(user.userId, searchParameters)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('GET /api/journal error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { title, content, mood, tags, date } = body

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content too long (max 50,000 characters)' },
        { status: 400 }
      )
    }

    if (mood && (mood < 1 || mood > 5)) {
      return NextResponse.json(
        { error: 'Mood must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (tags && tags.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 tags allowed per entry' },
        { status: 400 }
      )
    }

    // Use provided date or current date
    const entryDate = date || formatDateForEntry(new Date())

    // Check if entry already exists for this date
    const existingEntry = await JournalEntryModel.findOne({
      userId: user.userId,
      date: entryDate
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Journal entry already exists for this date' },
        { status: 409 }
      )
    }

    // Create new journal entry
    const journalEntry = new JournalEntryModel({
      userId: user.userId,
      title: title?.trim(),
      content: content.trim(),
      mood,
      tags: tags?.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) || [],
      date: entryDate,
      favorite: false,
    })

    await journalEntry.save()

    return NextResponse.json({
      success: true,
      data: journalEntry.toSafeObject()
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/journal error:', error)
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
}