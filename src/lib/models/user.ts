import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface ISession extends Document {
  sessionToken: string
  userId: mongoose.Types.ObjectId
  expires: Date
}

// Structured preferences interface
export interface IUserPreferences {
  // Theme and display preferences
  theme?: 'light' | 'dark' | 'system'
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat?: '12h' | '24h'
  weekStartsOn?: 'sunday' | 'monday'
  
  // Language and localization
  language?: 'en-US' | 'vi-VN'
  
  // Daily rhythm preferences
  wakeUpTime?: string
  sleepTime?: string
  
  // Notification preferences
  notifications?: {
    email?: boolean
    push?: boolean
    habitReminders?: boolean
    journalReminders?: boolean
    weeklyReports?: boolean
  }
  
  // Privacy settings
  privacy?: {
    publicProfile?: boolean
    shareStats?: boolean
  }
  
  // Onboarding tracking
  onboardingCompleted?: boolean
  onboardingStep?: number
  
  // Dashboard preferences
  dashboard?: {
    showWeather?: boolean
    showQuote?: boolean
    showStreak?: boolean
    defaultView?: 'grid' | 'list'
  }
}

export interface IUser extends Document {
  // Primary identification fields
  firstName?: string
  lastName?: string
  email: string
  password?: string // bcrypt hash, optional for OAuth
  
  // Computed display name (firstName + lastName or fallback)
  name?: string
  
  // Account status
  emailVerified?: Date
  verified?: boolean
  
  // Profile information
  profilePhoto?: string // Primary profile photo field (NextAuth compatible as 'image')
  dateOfBirth?: string
  bio?: string // Changed from aboutMe for consistency
  location?: string
  timezone: string
  website?: string
  
  // Social media links
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
  }
  
  // Wisdom/Quotes related fields
  wisdomFavorites?: Array<{
    quoteId: string
    text: string
    author: string
    category: string
    addedAt: Date
  }>
  wisdomStats?: {
    quotesViewed: number
    dailyStreak: number
    totalFavorites: number
    categoriesExplored: Record<string, number>
    lastVisit?: Date
  }
  
  // Structured user preferences
  preferences: IUserPreferences
  
  createdAt: Date
  updatedAt: Date
}

export interface IVerificationToken extends Document {
  identifier: string
  token: string
  expires: Date
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
})

// Add compound index after schema creation
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true },
})

const UserSchema = new Schema<IUser>(
  {
    // Primary identification fields
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // bcrypt hash, optional for OAuth, excluded by default
    
    // Computed display name (virtual or stored)
    name: String,
    
    // Account status
    emailVerified: Date,
    verified: { type: Boolean, default: false },
    
    // Profile information
    profilePhoto: String, // Primary profile photo field
    dateOfBirth: String,
    bio: String, // Changed from aboutMe
    location: String,
    timezone: { type: String, default: 'UTC' },
    website: String,
    
    // Social media links
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      instagram: String,
    },
    
    // Wisdom/Quotes related fields
    wisdomFavorites: [
      {
        quoteId: { type: String, required: true },
        text: { type: String, required: true },
        author: { type: String, required: true },
        category: { type: String, default: 'uncategorized' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    wisdomStats: {
      quotesViewed: { type: Number, default: 0 },
      dailyStreak: { type: Number, default: 0 },
      totalFavorites: { type: Number, default: 0 },
      categoriesExplored: { type: Schema.Types.Mixed, default: {} },
      lastVisit: Date,
    },
    
    // Structured user preferences
    preferences: {
      type: {
        // Theme and display preferences
        theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
        dateFormat: { type: String, enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], default: 'MM/DD/YYYY' },
        timeFormat: { type: String, enum: ['12h', '24h'], default: '12h' },
        weekStartsOn: { type: String, enum: ['sunday', 'monday'], default: 'sunday' },
        
        // Language and localization
        language: { type: String, default: 'en-US' },
        
        // Daily rhythm preferences
        wakeUpTime: String,
        sleepTime: String,
        
        // Notification preferences
        notifications: {
          email: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
          habitReminders: { type: Boolean, default: true },
          journalReminders: { type: Boolean, default: true },
          weeklyReports: { type: Boolean, default: true },
        },
        
        // Privacy settings
        privacy: {
          publicProfile: { type: Boolean, default: false },
          shareStats: { type: Boolean, default: false },
        },
        
        // Onboarding tracking
        onboardingCompleted: { type: Boolean, default: false },
        onboardingStep: { type: Number, default: 0 },
        
        // Dashboard preferences
        dashboard: {
          showWeather: { type: Boolean, default: true },
          showQuote: { type: Boolean, default: true },
          showStreak: { type: Boolean, default: true },
          defaultView: { type: String, enum: ['grid', 'list'], default: 'grid' },
        },
      },
      default: () => ({
        theme: 'system',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        weekStartsOn: 'sunday',
        language: 'en-US',
        notifications: {
          email: true,
          push: false,
          habitReminders: true,
          journalReminders: true,
          weeklyReports: true,
        },
        privacy: {
          publicProfile: false,
          shareStats: false,
        },
        onboardingCompleted: false,
        onboardingStep: 0,
        dashboard: {
          showWeather: true,
          showQuote: true,
          showStreak: true,
          defaultView: 'grid',
        },
      }),
    },
  },
  {
    timestamps: true,
  }
)

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
})

// Virtual field for NextAuth compatibility (maps profilePhoto to image)
UserSchema.virtual('image').get(function() {
  return this.profilePhoto
})

UserSchema.virtual('image').set(function(value: string) {
  this.profilePhoto = value
})

// Virtual field to compute full name if name is not set
UserSchema.virtual('displayName').get(function() {
  if (this.name) return this.name
  if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`
  if (this.firstName) return this.firstName
  if (this.lastName) return this.lastName
  return 'User'
})

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true })
UserSchema.set('toObject', { virtuals: true })

// Add compound index after schema creation
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true })

export const Account =
  mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema)
export const Session =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)
export const User =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    'VerificationToken',
    VerificationTokenSchema
  )
