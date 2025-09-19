export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom'
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc. Only used for 'weekly' and 'custom'
  interval?: number // For future use (e.g., every N days)
}

export interface HabitTarget {
  type: 'boolean' | 'count' | 'duration' | 'amount'
  value?: number // Target value for count/duration/amount types
  unit?: string // e.g., 'glasses', 'minutes', 'pages'
}

export interface HabitStatus {
  active: boolean
  archived: boolean
  pausedAt?: Date
  pauseReason?: string
}

export interface Habit {
  _id?: string
  userId: string
  title: string
  description?: string
  emoji?: string
  category?: string
  frequency: HabitFrequency
  target: HabitTarget
  status: HabitStatus
  color?: string
  priority?: 'low' | 'medium' | 'high'
  reminderTime?: string // HH:MM format
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface HabitLog {
  _id?: string
  habitId: string
  userId: string
  date: string // YYYY-MM-DD format in user's timezone
  completed: boolean
  value?: number // For count/duration/amount habits
  completedAt?: Date
  notes?: string
  skipped?: boolean
  skipReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface HabitStreak {
  habitId: string
  currentStreak: number
  longestStreak: number
  lastCompletedDate?: string // YYYY-MM-DD
}

export interface HabitProgress {
  habit: Habit
  todayLog?: HabitLog
  currentStreak: number
  longestStreak: number
  weeklyProgress: {
    completed: number
    total: number
    percentage: number
  }
  monthlyProgress: {
    completed: number
    total: number
    percentage: number
  }
}

export interface HabitSummary {
  totalHabits: number
  activeHabits: number
  completedToday: number
  totalCompletedToday: number
  longestCurrentStreak: {
    habitTitle: string
    streakCount: number
  }
  weeklyCompletions: number
  weeklyTotal: number
}

// API Response types
export interface CreateHabitRequest {
  title: string
  description?: string
  emoji?: string
  category?: string
  frequency: HabitFrequency
  target: HabitTarget
  color?: string
  priority?: 'low' | 'medium' | 'high'
  reminderTime?: string
  notes?: string
}

export interface UpdateHabitRequest extends Partial<CreateHabitRequest> {
  status?: HabitStatus
}

export interface LogHabitRequest {
  date?: string // Defaults to today if not provided
  completed: boolean
  value?: number
  notes?: string
  skipped?: boolean
  skipReason?: string
}

export interface HabitFilters {
  status?: 'all' | 'active' | 'paused' | 'archived'
  category?: string
  frequency?: 'daily' | 'weekly' | 'custom'
  priority?: 'low' | 'medium' | 'high'
  search?: string
}