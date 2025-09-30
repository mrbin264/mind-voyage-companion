import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'

// Sample quotes data - in a real app, this would come from a database
const quotesDatabase = [
  {
    id: '1',
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
    category: 'ancient',
    tags: ['wisdom', 'action', 'time'],
  },
  {
    id: '2',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'modern',
    tags: ['work', 'passion', 'success'],
  },
  {
    id: '3',
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: 'modern',
    tags: ['opportunity', 'difficulty', 'growth'],
  },
  {
    id: '4',
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    category: 'ancient',
    tags: ['philosophy', 'self-reflection', 'wisdom'],
  },
  {
    id: '5',
    text: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    category: 'modern',
    tags: ['authenticity', 'individuality', 'self'],
  },
  {
    id: '6',
    text: 'Yesterday is history, tomorrow is a mystery, today is a gift.',
    author: 'Master Oogway',
    category: 'modern',
    tags: ['present', 'mindfulness', 'time'],
  },
  {
    id: '7',
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'buddhist',
    tags: ['mind', 'thoughts', 'transformation'],
  },
  {
    id: '8',
    text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    category: 'stoic',
    tags: ['control', 'strength', 'mindset'],
  },
  {
    id: '9',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    category: 'modern',
    tags: ['action', 'beginning', 'success'],
  },
  {
    id: '10',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'modern',
    tags: ['success', 'failure', 'courage', 'persistence'],
  },
]

const categories = {
  ancient: {
    name: 'Ancient Wisdom',
    emoji: '🏛️',
    description: 'Stoic • Buddhist • Taoist',
  },
  modern: {
    name: 'Modern Wisdom',
    emoji: '💡',
    description: 'Contemporary • Inspirational',
  },
  stoic: {
    name: 'Stoic Philosophy',
    emoji: '⚖️',
    description: 'Marcus Aurelius • Epictetus',
  },
  buddhist: {
    name: 'Buddhist Wisdom',
    emoji: '☸️',
    description: 'Buddha • Zen • Meditation',
  },
  success: {
    name: 'Success & Achievement',
    emoji: '🎯',
    description: 'Business • Leadership',
  },
  mindfulness: {
    name: 'Mindfulness & Peace',
    emoji: '🧘',
    description: 'Meditation • Peace',
  },
}

export const GET = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  await connectDB()

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const random = searchParams.get('random') === 'true'

    let filteredQuotes = [...quotesDatabase]

    // Filter by category
    if (category && category !== 'all') {
      filteredQuotes = filteredQuotes.filter(
        quote => quote.category === category
      )
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase()
      filteredQuotes = filteredQuotes.filter(
        quote =>
          quote.text.toLowerCase().includes(searchLower) ||
          quote.author.toLowerCase().includes(searchLower) ||
          quote.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Return random quote if requested
    if (random && filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length)
      const randomQuote = filteredQuotes[randomIndex]
      return NextResponse.json({
        quote: randomQuote,
        category:
          categories[randomQuote.category as keyof typeof categories] || null,
      })
    }

    // Return all matching quotes with pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex)

    return NextResponse.json({
      quotes: paginatedQuotes,
      pagination: {
        page,
        limit,
        total: filteredQuotes.length,
        pages: Math.ceil(filteredQuotes.length / limit),
      },
      categories: Object.entries(categories).map(([key, value]) => ({
        id: key,
        ...value,
        count: quotesDatabase.filter(q => q.category === key).length,
      })),
    })
})

// Get daily quote for the user
export const POST = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  await connectDB()

  // In a real app, you might store user's daily quote preference or use AI to personalize
  // For now, we'll return a quote based on the current date to ensure consistency
  const today = new Date().toDateString()
  const seed = today
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const dailyQuoteIndex = seed % quotesDatabase.length
  const dailyQuote = quotesDatabase[dailyQuoteIndex]

  return NextResponse.json({
    quote: dailyQuote,
    category:
      categories[dailyQuote.category as keyof typeof categories] || null,
    date: today,
  })
})
