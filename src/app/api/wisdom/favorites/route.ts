import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/lib/models/user'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'

export const GET = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  await connectDB()

  const user = await User.findById(session!.user.id).select('wisdomFavorites')
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    favorites: user.wisdomFavorites || [],
  })
})

export const POST = secureEndpoint.mutation(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
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
    addedAt: new Date(),
  }

  const user = await User.findByIdAndUpdate(
    session!.user.id,
    {
      $addToSet: {
        wisdomFavorites: favoriteQuote,
      },
    },
    { new: true }
  ).select('wisdomFavorites')

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    message: 'Quote added to favorites',
    favorites: user.wisdomFavorites,
  })
})

export const DELETE = secureEndpoint.mutation(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  const { quoteId } = await request.json()

  if (!quoteId) {
    return NextResponse.json(
      { error: 'Missing required field: quoteId' },
      { status: 400 }
    )
  }

  await connectDB()

  const user = await User.findByIdAndUpdate(
    session!.user.id,
    {
      $pull: {
        wisdomFavorites: { quoteId },
      },
    },
    { new: true }
  ).select('wisdomFavorites')

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    message: 'Quote removed from favorites',
    favorites: user.wisdomFavorites,
  })
})
