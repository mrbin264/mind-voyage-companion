import { z } from 'zod'

// Password validation function that can be reused
const passwordValidationRefine = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return hasUppercase && hasLowercase && hasNumberOrSpecial
}

const passwordValidationMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character'

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(passwordValidationRefine, passwordValidationMessage),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    timezone: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const resetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(passwordValidationRefine, passwordValidationMessage),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(passwordValidationRefine, passwordValidationMessage),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  timezone: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
      publicProfile: z.boolean().optional(),
    }).optional(),
  }).optional(),
})

// Common validation utilities
export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(passwordValidationRefine, passwordValidationMessage)

export const emailValidation = z.string().email('Invalid email address')

export const nameValidation = z.string().min(2, 'Name must be at least 2 characters')

// Type exports for TypeScript
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ResetRequestData = z.infer<typeof resetRequestSchema>
export type ResetConfirmData = z.infer<typeof resetConfirmSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
