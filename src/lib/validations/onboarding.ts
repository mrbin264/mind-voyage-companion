import { z } from 'zod'

export const onboardingProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name must be 50 characters or less'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(['english', 'vietnamese']),
  wakeUpTime: z.string().min(1, 'Wake up time is required'),
  sleepTime: z.string().min(1, 'Sleep time is required'),
})

export const onboardingHabitSchema = z.object({
  habitId: z.number().optional(),
  customName: z.string().optional(),
  customEmoji: z.string().optional(),
  reminderTime: z.string().default('9:00 AM'),
  frequency: z.string().default('daily'),
})

export const completeOnboardingSchema = z.object({
  profile: onboardingProfileSchema,
  habit: onboardingHabitSchema,
})

export type OnboardingProfile = z.infer<typeof onboardingProfileSchema>
export type OnboardingHabit = z.infer<typeof onboardingHabitSchema>
export type CompleteOnboarding = z.infer<typeof completeOnboardingSchema>