/**
 * Comprehensive validation schemas for all API endpoints
 * Using Zod for runtime type checking and sanitization
 */
import { z } from 'zod'

// Base validation utilities
export const sanitizeHtml = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
}

export const sanitizeText = z.string()
  .transform(sanitizeHtml)
  .refine(val => val.length > 0, { message: "Text cannot be empty after sanitization" })

// Common field validators
export const mongoIdSchema = z.string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

export const emailSchema = z.string()
  .email("Invalid email format")
  .max(255, "Email too long")
  .toLowerCase()

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number")

export const nameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .transform(sanitizeHtml)

export const urlSchema = z.string()
  .url("Invalid URL format")
  .max(2048, "URL too long")

export const colorSchema = z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format (use hex)")

// Date validation
export const dateSchema = z.union([
  z.string().datetime(),
  z.date()
]).transform(val => new Date(val))

export const dateRangeSchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional()
}).refine(
  data => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: "Start date must be before end date" }
)

// Pagination and search schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, "Page must be positive").default(1),
  limit: z.coerce.number().min(1, "Limit must be positive").max(100, "Limit too high").default(20)
})

export const sortSchema = z.object({
  sortBy: z.string().max(50, "Sort field too long").default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const searchSchema = z.object({
  q: z.string()
    .max(100, "Search query too long")
    .transform(sanitizeHtml)
    .optional(),
  category: z.string().max(50, "Category too long").optional(),
  status: z.enum(['active', 'inactive', 'archived', 'all']).default('all'),
  tags: z.array(z.string().max(50, "Tag too long")).optional()
})

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  timezone: z.string().max(50, "Timezone too long").optional()
})

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  timezone: z.string().max(50, "Timezone too long").optional(),
  preferences: z.record(z.string(), z.unknown()).optional()
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
})

// Auth validation schemas
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: nameSchema,
    lastName: nameSchema,
    timezone: z.string().max(50, "Timezone too long").optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const resetRequestSchema = z.object({
  email: emailSchema,
})

export const resetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
})

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  profilePhoto: z.string().max(500, "Profile photo URL too long").optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').transform(sanitizeHtml).optional(),
  location: z.string().max(100, "Location too long").transform(sanitizeHtml).optional(),
  timezone: z.string().max(50, "Timezone too long").optional(),
  website: urlSchema.optional().or(z.literal('')),
  socialLinks: z
    .object({
      twitter: z.string().max(100, "Twitter handle too long").optional(),
      linkedin: z.string().max(200, "LinkedIn URL too long").optional(),
      github: z.string().max(100, "GitHub username too long").optional(),
      instagram: z.string().max(100, "Instagram handle too long").optional(),
    })
    .optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).optional(),
      timeFormat: z.enum(['12h', '24h']).optional(),
      weekStartsOn: z.enum(['sunday', 'monday']).optional(),
      language: z.string().max(10, "Language code too long").optional(),
      wakeUpTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid wake up time format").optional(),
      sleepTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid sleep time format").optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
          habitReminders: z.boolean().optional(),
          journalReminders: z.boolean().optional(),
          weeklyReports: z.boolean().optional(),
        })
        .optional(),
      privacy: z
        .object({
          publicProfile: z.boolean().optional(),
          shareStats: z.boolean().optional(),
        })
        .optional(),
      dashboard: z
        .object({
          showWeather: z.boolean().optional(),
          showQuote: z.boolean().optional(),
          showStreak: z.boolean().optional(),
          defaultView: z.enum(['grid', 'list']).optional(),
        })
        .optional(),
    })
    .optional(),
})

// Onboarding validation schemas
export const onboardingProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(30, 'First name must be 30 characters or less')
    .transform(sanitizeHtml),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(30, 'Last name must be 30 characters or less')
    .transform(sanitizeHtml),
  timezone: z.string().min(1, 'Timezone is required').max(50, "Timezone too long"),
  language: z.enum(['en-US', 'vi-VN']),
  wakeUpTime: z.string().min(1, 'Wake up time is required').regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid wake up time format"),
  sleepTime: z.string().min(1, 'Sleep time is required').regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid sleep time format"),
})

export const onboardingHabitSchema = z.object({
  habitId: z.number().optional(),
  customName: z.string().max(100, "Custom habit name too long").transform(sanitizeHtml).optional(),
  customEmoji: z.string().max(10, "Emoji too long").optional(),
  reminderTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid reminder time format").default('9:00'),
  frequency: z.string().max(20, "Frequency too long").default('daily'),
})

export const completeOnboardingSchema = z.object({
  profile: onboardingProfileSchema,
  habit: onboardingHabitSchema,
})

// Habit validation schemas
export const habitFrequencySchema = z.object({
  type: z.enum(['daily', 'weekly', 'custom']),
  value: z.number().min(1, "Frequency value must be positive").max(7, "Max 7 times per week"),
  days: z.array(z.number().min(0).max(6)).optional() // 0-6 for days of week
})

export const createHabitSchema = z.object({
  name: nameSchema,
  description: z.string().max(500, "Description too long").transform(sanitizeHtml).optional(),
  category: z.string().max(50, "Category too long").transform(sanitizeHtml),
  frequency: habitFrequencySchema,
  target: z.number().min(0, "Target cannot be negative").max(1000, "Target too high").optional(),
  unit: z.string().max(20, "Unit too long").optional(),
  color: colorSchema.default('#3B82F6'),
  icon: z.string().max(50, "Icon name too long").optional(),
  reminders: z.array(z.object({
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    enabled: z.boolean().default(true)
  })).max(5, "Maximum 5 reminders").optional(),
  isPrivate: z.boolean().default(false)
})

export const updateHabitSchema = createHabitSchema.partial()

export const logHabitSchema = z.object({
  value: z.number().min(0, "Value cannot be negative").max(1000, "Value too high").default(1),
  date: dateSchema.optional().default(() => new Date()),
  notes: z.string().max(200, "Notes too long").transform(sanitizeHtml).optional()
})

export const habitQuerySchema = z.object({
  status: z.enum(['active', 'paused', 'archived', 'all']).default('active'),
  category: z.string().max(50, "Category too long").optional(),
  include_progress: z.coerce.boolean().default(false),
  date_from: dateSchema.optional(),
  date_to: dateSchema.optional()
}).merge(paginationSchema).merge(sortSchema)

// Journal validation schemas
export const createJournalEntrySchema = z.object({
  title: z.string().max(200, "Title too long").transform(sanitizeHtml).optional(),
  content: z.string().min(1, "Content is required").max(10000, "Content too long").transform(sanitizeHtml),
  mood: z.number().min(1, "Mood must be 1-10").max(10, "Mood must be 1-10").optional(),
  tags: z.array(z.string().max(30, "Tag too long")).max(20, "Too many tags").optional(),
  isPrivate: z.boolean().default(true),
  weather: z.string().max(50, "Weather description too long").optional(),
  location: z.string().max(100, "Location too long").transform(sanitizeHtml).optional()
})

export const updateJournalEntrySchema = createJournalEntrySchema.partial()

export const journalQuerySchema = z.object({
  mood: z.coerce.number().min(1).max(10).optional(),
  tags: z.array(z.string().max(30)).optional(),
  content_search: z.string().max(100).transform(sanitizeHtml).optional()
}).merge(paginationSchema).merge(sortSchema).merge(dateRangeSchema)

// Analytics validation schemas
export const analyticsQuerySchema = z.object({
  timeframe: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  habit_ids: z.array(mongoIdSchema).max(50, "Too many habit IDs").optional(),
  include_archived: z.coerce.boolean().default(false),
  include_journal: z.coerce.boolean().default(true),
  metrics: z.array(z.enum([
    'completion_rate', 
    'streak_count', 
    'consistency_score', 
    'improvement_trend',
    'mood_correlation'
  ])).optional()
}).merge(dateRangeSchema)

// Wisdom/Quotes validation schemas
export const quotesQuerySchema = z.object({
  category: z.string().max(50, "Category name too long").optional(),
  search: z.string().max(100, "Search query too long").transform(sanitizeHtml).optional(),
  random: z.string().transform(val => val === 'true').optional(),
}).merge(paginationSchema)

// Wisdom/Quote validation schemas
export const createQuoteSchema = z.object({
  text: z.string().min(10, "Quote too short").max(1000, "Quote too long").transform(sanitizeHtml),
  author: z.string().max(100, "Author name too long").transform(sanitizeHtml).optional(),
  category: z.string().max(50, "Category too long").transform(sanitizeHtml).optional(),
  tags: z.array(z.string().max(30, "Tag too long")).max(10, "Too many tags").optional(),
  source: urlSchema.optional(),
  isPublic: z.boolean().default(false)
})

export const updateQuoteSchema = createQuoteSchema.partial()

export const quoteQuerySchema = z.object({
  category: z.string().max(50, "Category too long").optional(),
  author: z.string().max(100, "Author too long").optional(),
  random: z.coerce.boolean().default(false),
  daily: z.coerce.boolean().default(false)
}).merge(paginationSchema).merge(searchSchema)

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1, "Filename required").max(255, "Filename too long"),
  mimetype: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i, "Invalid MIME type"),
  size: z.number().min(1, "File too small").max(10 * 1024 * 1024, "File too large (max 10MB)")
})

// Notification validation
export const notificationSchema = z.object({
  type: z.enum(['habit_reminder', 'streak_milestone', 'journal_prompt', 'system']),
  title: z.string().max(100, "Title too long"),
  message: z.string().max(500, "Message too long"),
  scheduled_for: dateSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

// Batch operations validation
export const batchOperationSchema = z.object({
  operation: z.enum(['delete', 'archive', 'update']),
  ids: z.array(mongoIdSchema).min(1, "At least one ID required").max(100, "Too many IDs"),
  data: z.record(z.string(), z.unknown()).optional() // For batch updates
})

// Request validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: true; data: T 
} | { 
  success: false; errors: z.ZodError 
} {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Body parser for Next.js API routes
export async function parseAndValidate<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
  try {
    const body = await req.json()
    return validateRequest(schema, body)
  } catch (error) {
    // Return a validation error for invalid JSON
    return {
      success: false,
      errors: new z.ZodError([{
        code: 'custom',
        path: [],
        message: 'Invalid JSON in request body'
      }])
    }
  }
}

// Query parameter validation helper
export function validateSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const params: Record<string, any> = {}
  
  // Convert URLSearchParams to plain object
  searchParams.forEach((value, key) => {
    // Handle array parameters (e.g., ?tags=tag1&tags=tag2)
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value)
      } else {
        params[key] = [params[key], value]
      }
    } else {
      params[key] = value
    }
  })
  
  return validateRequest(schema, params)
}

export default {
  // User schemas
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  login: loginSchema,
  
  // Auth schemas
  register: registerSchema,
  resetRequest: resetRequestSchema,
  resetConfirm: resetConfirmSchema,
  changePassword: changePasswordSchema,
  updateProfile: updateProfileSchema,
  
  // Onboarding schemas
  onboardingProfile: onboardingProfileSchema,
  onboardingHabit: onboardingHabitSchema,
  completeOnboarding: completeOnboardingSchema,
  
  // Habit schemas
  createHabit: createHabitSchema,
  updateHabit: updateHabitSchema,
  logHabit: logHabitSchema,
  habitQuery: habitQuerySchema,
  
  // Journal schemas
  createJournalEntry: createJournalEntrySchema,
  updateJournalEntry: updateJournalEntrySchema,
  journalQuery: journalQuerySchema,
  
  // Analytics schemas
  analyticsQuery: analyticsQuerySchema,
  
  // Quote schemas
  createQuote: createQuoteSchema,
  updateQuote: updateQuoteSchema,
  quoteQuery: quoteQuerySchema,
  
  // Common schemas
  pagination: paginationSchema,
  search: searchSchema,
  sort: sortSchema,
  dateRange: dateRangeSchema,
  batchOperation: batchOperationSchema,
  
  // Utilities
  validateRequest,
  parseAndValidate,
  validateSearchParams
}