import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/db'
import { User } from '@/lib/models/user'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).select('wisdomFavorites')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      favorites: user.wisdomFavorites || []
    })
  } catch (error) {
    console.error('Get favorites API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quoteId, text, author, category } = await request.json()

    if (!quoteId || !text || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: quoteId, text, author' },
        { status: 400 }
      )
    }

    await connectDB()

    const favoriteQuote = {
      quoteId,
      text,
      author,
      category: category || 'uncategorized',
      addedAt: new Date()
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $addToSet: {
          wisdomFavorites: favoriteQuote
        }
      },
      { new: true }
    ).select('wisdomFavorites')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Quote added to favorites',
      favorites: user.wisdomFavorites
    })
  } catch (error) {
    console.error('Add favorite API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quoteId } = await request.json()

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Missing required field: quoteId' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $pull: {
          wisdomFavorites: { quoteId }
        }
      },
      { new: true }
    ).select('wisdomFavorites')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Quote removed from favorites',
      favorites: user.wisdomFavorites
    })
  } catch (error) {
    console.error('Remove favorite API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}