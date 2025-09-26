// Settings System Types

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePhoto?: string
  dateOfBirth?: string
  aboutMe?: string
  location?: string
  timezone: string
  language: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
  }
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  userId: string
  email: {
    habitReminders: boolean
    journalReminders: boolean
    weeklyReports: boolean
    achievements: boolean
    productUpdates: boolean
    marketingEmails: boolean
  }
  push: {
    habitReminders: boolean
    journalReminders: boolean
    achievements: boolean
    streakMilestones: boolean
  }
  inApp: {
    achievements: boolean
    streakMilestones: boolean
    tips: boolean
  }
  reminderTimes: {
    morning: string // HH:MM format
    evening: string // HH:MM format
  }
  updatedAt: string
}

export interface PrivacySettings {
  userId: string
  dataSharing: {
    analytics: boolean
    improvements: boolean
    research: boolean
  }
  visibility: {
    profile: 'public' | 'private' | 'friends'
    habits: 'public' | 'private' | 'friends'
    achievements: 'public' | 'private' | 'friends'
  }
  dataRetention: {
    deleteInactiveData: boolean
    retentionPeriodDays: number
  }
  updatedAt: string
}

export interface UserPreferences {
  userId: string
  theme: 'light' | 'dark' | 'system'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  weekStartsOn: 'sunday' | 'monday'
  currency: string
  habitDefaults: {
    reminderTime: string
    difficulty: 'easy' | 'medium' | 'hard'
    category: string
  }
  journalDefaults: {
    reminderTime: string
    defaultMood: number
    enablePrompts: boolean
  }
  dashboard: {
    showWeather: boolean
    showQuote: boolean
    showStreak: boolean
    defaultView: 'grid' | 'list'
  }
  updatedAt: string
}

export interface SecuritySettings {
  userId: string
  twoFactorAuth: {
    enabled: boolean
    method: 'sms' | 'email' | 'app' | null
    phone?: string
  }
  passwordSettings: {
    lastChanged: string
    requireChange: boolean
  }
  loginSecurity: {
    logoutAfterInactivity: boolean
    inactivityMinutes: number
    requirePasswordForSensitiveActions: boolean
  }
  activeSessions: {
    sessionId: string
    device: string
    location: string
    lastActive: string
    current: boolean
  }[]
  updatedAt: string
}

export interface SubscriptionInfo {
  userId: string
  plan: 'free' | 'pro' | 'premium'
  status: 'active' | 'canceled' | 'expired' | 'trial'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt?: string
  canceledAt?: string
  features: {
    aiInsights: boolean
    unlimitedHabits: boolean
    advancedAnalytics: boolean
    exportData: boolean
    prioritySupport: boolean
    customThemes: boolean
  }
  billing: {
    nextBillDate?: string
    amount?: number
    currency: string
    paymentMethod?: string
  }
  updatedAt: string
}

export interface AccountStatistics {
  userId: string
  memberSince: string
  totalLoginDays: number
  habitsCreated: number
  journalEntries: number
  longestStreak: number
  totalHabitsCompleted: number
  currentActiveHabits: number
  averageMoodRating: number
  streaksAchieved: number
  lastActiveDate: string
  generatedAt: string
}

export interface DataExportRequest {
  userId: string
  requestId: string
  dataTypes: ('habits' | 'journal' | 'analytics' | 'profile' | 'all')[]
  format: 'json' | 'csv' | 'pdf'
  dateRange?: {
    start: string
    end: string
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  expiresAt?: string
  requestedAt: string
}

export interface SupportTicket {
  ticketId: string
  userId: string
  subject: string
  category: 'bug' | 'feature' | 'billing' | 'account' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  description: string
  attachments?: string[]
  responses: {
    id: string
    author: 'user' | 'support'
    message: string
    timestamp: string
  }[]
  createdAt: string
  updatedAt: string
}

// Combined Settings Interface
export interface UserSettings {
  profile: UserProfile
  notifications: NotificationSettings
  privacy: PrivacySettings
  preferences: UserPreferences
  security: SecuritySettings
  subscription: SubscriptionInfo
  statistics: AccountStatistics
}

// Settings Navigation
export type SettingsSection =
  | 'profile'
  | 'notifications'
  | 'privacy'
  | 'preferences'
  | 'data'
  | 'security'
  | 'subscription'
  | 'support'
  | 'statistics'

// Form Data Types
export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  dateOfBirth?: string
  bio: string
  location?: string
  timezone: string
  language: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
  }
}

export interface NotificationFormData {
  email: NotificationSettings['email']
  push: NotificationSettings['push']
  inApp: NotificationSettings['inApp']
  reminderTimes: NotificationSettings['reminderTimes']
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// API Response Types
export interface SettingsResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface SettingsUpdateResponse {
  success: boolean
  message: string
  updatedFields: string[]
  error?: string
}

// Timezone and Language Options
export interface TimezoneOption {
  value: string
  label: string
  offset: string
}

export interface LanguageOption {
  value: string
  label: string
  code: string
}

// Settings Validation
export interface SettingsValidationError {
  field: string
  message: string
  code: string
}

// Settings Form State
export interface SettingsFormState<T> {
  data: T
  loading: boolean
  error: string | null
  isDirty: boolean
  validationErrors: SettingsValidationError[]
}

// File Upload Types
export interface ProfilePhotoUpload {
  file: File
  preview: string
  uploading: boolean
  error?: string
}
