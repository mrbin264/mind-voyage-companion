import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { JournalEntryModel } from '@/lib/models/journal'
import { verify } from 'jsonwebtoken'
import mongoose from 'mongoose'

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

// GET /api/journal/[id] - Get specific journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 })
    }

    const entry = await JournalEntryModel.findOne({
      _id: id,
      userId: user.userId,
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: entry.toSafeObject(),
    })
  } catch (error) {
    console.error('GET /api/journal/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journal entry' },
      { status: 500 }
    )
  }
}

// PUT /api/journal/[id] - Update journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { title, content, mood, tags, favorite } = body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 })
    }

    // Validation
    if (content !== undefined) {
      if (!content || content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Content cannot be empty' },
          { status: 400 }
        )
      }

      if (content.length > 50000) {
        return NextResponse.json(
          { error: 'Content too long (max 50,000 characters)' },
          { status: 400 }
        )
      }
    }

    if (mood !== undefined && (mood < 1 || mood > 5)) {
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

    // Build update object
    const updateData: any = {}
    if (title !== undefined) updateData.title = title?.trim()
    if (content !== undefined) updateData.content = content.trim()
    if (mood !== undefined) updateData.mood = mood
    if (tags !== undefined) {
      updateData.tags = tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    }
    if (favorite !== undefined) updateData.favorite = favorite

    const entry = await JournalEntryModel.findOneAndUpdate(
      { _id: id, userId: user.userId },
      updateData,
      { new: true, runValidators: true }
    )

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: entry.toSafeObject(),
    })
  } catch (error) {
    console.error('PUT /api/journal/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/journal/[id] - Delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 })
    }

    const entry = await JournalEntryModel.findOneAndDelete({
      _id: id,
      userId: user.userId,
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/journal/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    )
  }
}
