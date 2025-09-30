import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { JournalEntryModel } from '@/lib/models/journal'
import type { JournalEntry, JournalSearchParams } from '@/types/journal'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'
import { journalQuerySchema, createJournalEntrySchema } from '@/lib/validation/schemas'

// Helper to format date as YYYY-MM-DD in user's timezone
function formatDateForEntry(date: Date): string {
  return date.toISOString().split('T')[0]
}

// GET /api/journal - Get journal entries with optional search/filter
export const GET = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  await connectDB()

  // Parse query parameters
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || undefined
  const mood =
    searchParams
      .get('mood')
      ?.split(',')
      .map(m => parseInt(m))
      .filter(m => !isNaN(m)) || undefined
  const tags =
    searchParams
      .get('tags')
      ?.split(',')
      .filter(tag => tag.trim()) || undefined
  const dateFrom = searchParams.get('dateFrom') || undefined
  const dateTo = searchParams.get('dateTo') || undefined
  const favorite =
    searchParams.get('favorite') === 'true'
      ? true
      : searchParams.get('favorite') === 'false'
        ? false
        : undefined
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 per page
  const sortBy =
    (searchParams.get('sortBy') as 'date' | 'wordCount' | 'mood') || 'date'
  const sortOrder =
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

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
    sortOrder,
  }

  const result = await JournalEntryModel.searchEntries(
    session!.user.id,
    searchParameters
  )

  return NextResponse.json({
    success: true,
    data: result,
  })
})

// POST /api/journal - Create new journal entry
export const POST = secureEndpoint.mutation(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  await connectDB()

  // Parse and validate request body
  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  // Validate using schema
  const validation = createJournalEntrySchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: validation.error.issues 
      },
      { status: 400 }
    )
  }

  const { title, content, mood, tags, isPrivate, weather, location } = validation.data!

    // Use provided date or current date
    const entryDate = formatDateForEntry(new Date())

    // Check if entry already exists for this date
    const existingEntry = await JournalEntryModel.findOne({
      userId: session!.user.id,
      date: entryDate,
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Journal entry already exists for this date' },
        { status: 409 }
      )
    }

    // Create new journal entry
    const journalEntry = new JournalEntryModel({
      userId: session!.user.id,
      title: title?.trim(),
      content: content.trim(),
      mood,
      tags: tags?.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) || [],
      date: entryDate,
      isPrivate: isPrivate ?? true,
      weather,
      location,
      favorite: false,
    })

    await journalEntry.save()

    return NextResponse.json(
      {
        success: true,
        data: journalEntry.toSafeObject(),
      },
      { status: 201 }
    )
})
