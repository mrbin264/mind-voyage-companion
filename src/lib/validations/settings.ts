import { z } from 'zod'

// Profile validation schema
export const settingsProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(30, 'First name must be 30 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(30, 'Last name must be 30 characters or less'),
  email: z.string().email('Invalid email address'),
  profilePhoto: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  socialLinks: z
    .object({
      twitter: z.string().max(100, 'Twitter handle too long').optional(),
      linkedin: z.string().max(200, 'LinkedIn URL too long').optional(),
      github: z.string().max(100, 'GitHub username too long').optional(),
      instagram: z.string().max(100, 'Instagram handle too long').optional(),
    })
    .optional(),
})

// Preferences validation schema
export const settingsPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12h', '24h']),
  weekStartsOn: z.enum(['sunday', 'monday']),
  language: z.string(),
  wakeUpTime: z.string().optional(),
  sleepTime: z.string().optional(),
})

// Notification settings validation schema
export const settingsNotificationSchema = z.object({
  email: z.object({
    habitReminders: z.boolean(),
    journalReminders: z.boolean(),
    weeklyReports: z.boolean(),
    achievements: z.boolean(),
    productUpdates: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  push: z.object({
    habitReminders: z.boolean(),
    journalReminders: z.boolean(),
    achievements: z.boolean(),
    streakMilestones: z.boolean(),
  }),
  inApp: z.object({
    achievements: z.boolean(),
    streakMilestones: z.boolean(),
    tips: z.boolean(),
  }),
  reminderTimes: z.object({
    morning: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    evening: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  }),
})

// Privacy settings validation schema
export const settingsPrivacySchema = z.object({
  dataSharing: z.object({
    analytics: z.boolean(),
    improvements: z.boolean(),
    research: z.boolean(),
  }),
  visibility: z.object({
    profile: z.enum(['public', 'private', 'friends']),
    habits: z.enum(['public', 'private', 'friends']),
    achievements: z.enum(['public', 'private', 'friends']),
  }),
  dataRetention: z.object({
    deleteInactiveData: z.boolean(),
    retentionPeriodDays: z.number().min(30).max(3650),
  }),
})

// Dashboard preferences validation schema
export const settingsDashboardSchema = z.object({
  showWeather: z.boolean(),
  showQuote: z.boolean(),
  showStreak: z.boolean(),
  defaultView: z.enum(['grid', 'list']),
})

// Combined settings update schema
export const settingsUpdateSchema = z.object({
  profile: settingsProfileSchema.partial().optional(),
  preferences: settingsPreferencesSchema.partial().optional(),
  notifications: settingsNotificationSchema.partial().optional(),
  privacy: settingsPrivacySchema.partial().optional(),
  dashboard: settingsDashboardSchema.partial().optional(),
})

// Password change validation schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*(),.?":{}|<>])/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Account deletion validation schema
export const accountDeletionSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
  confirmDeletion: z.literal('DELETE').refine(
    (val) => val === 'DELETE',
    { message: 'Please type DELETE to confirm' }
  ),
  reason: z.string().optional(),
})

// Data export request validation schema
export const dataExportSchema = z.object({
  dataTypes: z.array(z.enum(['habits', 'journal', 'analytics', 'profile', 'all'])).min(1, 'Select at least one data type'),
  format: z.enum(['json', 'csv', 'pdf']),
  dateRange: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
})

// Two-factor authentication setup schema
export const twoFactorAuthSchema = z.object({
  method: z.enum(['sms', 'email', 'app']),
  phone: z.string().optional(),
  code: z.string().length(6, 'Verification code must be 6 digits'),
})

// Type exports for TypeScript
export type SettingsProfile = z.infer<typeof settingsProfileSchema>
export type SettingsPreferences = z.infer<typeof settingsPreferencesSchema>
export type SettingsNotification = z.infer<typeof settingsNotificationSchema>
export type SettingsPrivacy = z.infer<typeof settingsPrivacySchema>
export type SettingsDashboard = z.infer<typeof settingsDashboardSchema>
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>
export type PasswordChange = z.infer<typeof passwordChangeSchema>
export type AccountDeletion = z.infer<typeof accountDeletionSchema>
export type DataExport = z.infer<typeof dataExportSchema>
export type TwoFactorAuth = z.infer<typeof twoFactorAuthSchema>