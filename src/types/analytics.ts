export interface AnalyticsTimeframe {
  type: 'week' | 'month' | 'quarter' | 'year' | 'all'
  startDate?: string
  endDate?: string
}

export interface HabitCompletionData {
  date: string // YYYY-MM-DD format
  habitId: string
  habitTitle: string
  completed: boolean
  value?: number
  skipped?: boolean
  skipReason?: string
}

export interface WeeklyHabitTrends {
  week: string // e.g., "W37", "W38"
  completionRate: number // 0-100
  totalHabits: number
  completedHabits: number
  dateRange: {
    start: string
    end: string
  }
}

export interface HabitStreak {
  habitId: string
  habitTitle: string
  habitEmoji?: string
  currentStreak: number
  longestStreak: number
  streakStartDate?: string
  lastCompletedDate?: string
  isActive: boolean
}

export interface MoodCorrelation {
  factor: string
  correlation: number // -1 to 1
  averageMood: number // 1-5
  sampleSize: number
  impact: 'positive' | 'negative' | 'neutral'
}

export interface HabitAnalytics {
  habitId: string
  habitTitle: string
  completionRate: number
  totalAttempts: number
  successfulCompletions: number
  currentStreak: number
  longestStreak: number
  averageCompletionTime?: string // HH:MM format
  weeklyPattern: {
    [dayOfWeek: number]: number // 0-6, completion rate for each day
  }
  monthlyTrend: {
    month: string
    completionRate: number
  }[]
}

export interface JournalAnalytics {
  totalEntries: number
  averageWordCount: number
  writingConsistency: number // percentage of days with entries
  currentStreak: number
  longestStreak: number
  mostActiveTime: string
  favoriteTopics: {
    tag: string
    count: number
  }[]
  moodDistribution: {
    mood: number
    percentage: number
    emoji: string
  }[]
  weeklyStats: {
    entriesThisWeek: number
    wordsThisWeek: number
    averageMoodThisWeek: number
  }
  monthlyTrend: {
    month: string
    entries: number
    averageWords: number
    averageMood: number
  }[]
}

export interface AIInsight {
  id: string
  type: 'performance_booster' | 'challenge_day' | 'optimal_timing' | 'opportunity' | 'correlation'
  title: string
  description: string
  recommendation?: string
  confidence: number // 0-100
  impact: 'high' | 'medium' | 'low'
  category: 'habits' | 'journal' | 'mood' | 'timing'
  data?: Record<string, any>
}

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  category: 'streak' | 'consistency' | 'milestone' | 'completion'
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
  }
  isUnlocked: boolean
}

export interface AnalyticsOverview {
  timeframe: AnalyticsTimeframe
  
  // High-level metrics
  currentStreak: number
  longestStreak: number
  bestMonth: {
    month: string
    completionRate: number
  }
  totalHabitsCompleted: number
  totalJournalEntries: number
  
  // Habit trends
  weeklyTrends: WeeklyHabitTrends[]
  overallCompletionRate: number
  bestPerformingDay: string
  challengingDay: string
  
  // Streaks
  activeStreaks: HabitStreak[]
  
  // Correlations
  moodCorrelations: MoodCorrelation[]
  
  // Journal insights
  journalAnalytics: JournalAnalytics
  
  // AI insights (Pro feature)
  aiInsights?: AIInsight[]
  
  // Achievements
  recentAchievements: Achievement[]
  nextAchievement?: Achievement
}

export interface AnalyticsFilters {
  timeframe: AnalyticsTimeframe
  habitIds?: string[]
  includeArchived?: boolean
  includeJournal?: boolean
}

// API Response types
export interface AnalyticsResponse {
  success: boolean
  data: AnalyticsOverview
  error?: string
}

export interface HabitAnalyticsResponse {
  success: boolean
  data: HabitAnalytics
  error?: string
}

export interface ExportAnalyticsRequest {
  timeframe: AnalyticsTimeframe
  format: 'json' | 'csv' | 'pdf'
  includeCharts?: boolean
  sections: ('habits' | 'journal' | 'mood' | 'streaks' | 'achievements')[]
}