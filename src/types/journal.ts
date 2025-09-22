export interface JournalEntry {
  _id?: string
  userId: string
  title?: string
  content: string
  mood?: number // 1-5 scale (1=😔, 2=😐, 3=😊, 4=😄, 5=🤗)
  tags?: string[]
  date: string // YYYY-MM-DD format in user's timezone
  wordCount?: number
  readingTime?: number // estimated reading time in minutes
  favorite?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface JournalStats {
  totalEntries: number
  currentStreak: number
  longestStreak: number
  averageWordCount: number
  averageMood: number
  mostActiveTime?: 'morning' | 'afternoon' | 'evening' | 'night'
  totalWords: number
  totalMinutesWritten: number
  moodDistribution: {
    [mood: number]: number
  }
  tagFrequency: {
    [tag: string]: number
  }
}

export interface JournalSearchParams {
  query?: string
  mood?: number[]
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  favorite?: boolean
  page?: number
  limit?: number
  sortBy?: 'date' | 'wordCount' | 'mood'
  sortOrder?: 'asc' | 'desc'
}

export interface JournalSearchResult {
  entries: JournalEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface JournalPrompt {
  _id?: string
  category: 'reflection' | 'gratitude' | 'intention' | 'stoic' | 'general'
  text: string
  active: boolean
  priority?: number
  createdAt: Date
}

export interface DailyPrompts {
  date: string
  reflection: JournalPrompt
  gratitude: JournalPrompt
  intention: JournalPrompt
}

// Mood mapping for UI display
export const MOOD_EMOJIS = {
  1: '😔',
  2: '😐', 
  3: '😊',
  4: '😄',
  5: '🤗'
} as const

export const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Good', 
  4: 'Great',
  5: 'Excellent'
} as const

export type MoodValue = keyof typeof MOOD_EMOJIS