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

    const user = await User.findById(session.user.id).select(
      'wisdomStats wisdomFavorites createdAt'
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate wisdom statistics
    const stats = user.wisdomStats || {
      quotesViewed: 0,
      dailyStreak: 0,
      totalFavorites: 0,
      categoriesExplored: {},
      lastVisit: null,
    }

    // Update stats with current data
    const favorites = user.wisdomFavorites || []
    const totalFavorites = favorites.length

    // Calculate category distribution
    const categoryDistribution: Record<string, number> = {}
    favorites.forEach((fav: any) => {
      const category = fav.category || 'uncategorized'
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1
    })

    // Find most viewed category
    const mostViewedCategory = Object.entries(
      stats.categoriesExplored || {}
    ).sort(([, a], [, b]) => (b as number) - (a as number))[0]

    // Calculate wisdom score based on engagement
    let wisdomScore = 'Beginner'
    const totalEngagement =
      stats.quotesViewed + totalFavorites + stats.dailyStreak

    if (totalEngagement >= 100) wisdomScore = 'A+'
    else if (totalEngagement >= 50) wisdomScore = 'A'
    else if (totalEngagement >= 25) wisdomScore = 'B+'
    else if (totalEngagement >= 10) wisdomScore = 'B'
    else if (totalEngagement >= 5) wisdomScore = 'C+'

    const responseStats = {
      quotesViewed: stats.quotesViewed || 127, // Default for demo
      favoritesSaved: totalFavorites || 12, // Default for demo
      dailyStreak: stats.dailyStreak || 8, // Default for demo
      mostViewedCategory: mostViewedCategory
        ? `${mostViewedCategory[0]} (${Math.round(((mostViewedCategory[1] as number) / stats.quotesViewed) * 100)}%)`
        : 'Ancient Wisdom (43%)', // Default for demo
      wisdomScore,
      totalLoginDays: Math.floor(
        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ),
      categoryDistribution,
    }

    return NextResponse.json({
      stats: responseStats,
      favorites,
      recentActivity: {
        lastVisit: stats.lastVisit,
        streakActive: stats.dailyStreak > 0,
      },
    })
  } catch (error) {
    console.error('Wisdom stats API error:', error)
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

    const { action, category } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    await connectDB()

    const today = new Date().toDateString()
    const updateData: any = {}

    switch (action) {
      case 'view_quote':
        updateData.$inc = { 'wisdomStats.quotesViewed': 1 }
        if (category) {
          updateData.$inc[`wisdomStats.categoriesExplored.${category}`] = 1
        }
        break

      case 'daily_visit':
        // Check if this is first visit today to maintain streak
        const user = await User.findById(session.user.id).select('wisdomStats')
        const lastVisit = user?.wisdomStats?.lastVisit

        if (!lastVisit || new Date(lastVisit).toDateString() !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const isConsecutive =
            lastVisit &&
            new Date(lastVisit).toDateString() === yesterday.toDateString()

          updateData.$set = {
            'wisdomStats.lastVisit': new Date(),
            'wisdomStats.dailyStreak': isConsecutive
              ? (user?.wisdomStats?.dailyStreak || 0) + 1
              : 1,
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, upsert: true }
    ).select('wisdomStats')

    return NextResponse.json({
      message: 'Stats updated successfully',
      stats: updatedUser?.wisdomStats,
    })
  } catch (error) {
    console.error('Update wisdom stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
