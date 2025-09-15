'use client'
import * as React from 'react'
import { registerSchema } from '@/lib/validations/auth'
import { FormSubmitButton } from './FormSubmitButton'
import { FormField } from './FormField'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

async function registerAction(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    name: formData.get('name'),
    timezone: formData.get('timezone'),
  }

  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  })

  if (!res.ok) {
    const result = await res.json()
    return { fieldErrors: result.errors }
  }

  window.location.href = '/dashboard'
  return {}
}

// Utility to detect user's timezone
function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'America/New_York'
  }
}

// Password strength checker
function checkPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length
  return {
    checks,
    score,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
  }
}

export function RegisterForm() {
  const [state, formAction] = React.useActionState(registerAction, null)
  const [pending, startTransition] = React.useTransition()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [userTimezone, setUserTimezone] = React.useState('')

  React.useEffect(() => {
    setUserTimezone(getUserTimezone())
  }, [])

  const passwordStrength = checkPasswordStrength(password)

  return (
    <div className="card bg-mv-surface/95 border border-mv-border/80 backdrop-blur supports-[backdrop-filter]:bg-mv-surface/80 rounded-mv-lg shadow-mv-card p-s32 tablet:p-s40 max-w-xl">
      {/* Header */}
      <div className="space-y-s12 mb-s32">
        <h1 className="text-h2 font-bold text-mv-text tracking-tight">
          Create your free account
        </h1>
        <p className="text-body text-mv-text-subtle leading-relaxed max-w-prose">
          Start your mindful habit journey in under a minute. No credit card
          required.
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-s32">
        {/* Display Name Field */}
        <FormField
          label="Display name"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your full name"
          error={state?.fieldErrors?.name}
        />

        {/* Email Field */}
        <FormField
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          error={state?.fieldErrors?.email}
        />

        {/* Password Field */}
        <div className="space-y-s12">
          <label
            htmlFor="password"
            className="block text-small font-semibold text-mv-text"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`
                w-full h-mv-input px-mv-input-x pr-12
                bg-mv-form-input-bg border border-mv-form-input-border rounded-mv-input
                text-mv-form-input-text placeholder:text-mv-form-input-placeholder
                transition-all duration-200 ease-out
                focus:outline-none focus:border-mv-cta focus:shadow-focus-ring
                hover:border-mv-text-subtle/40
                ${state?.fieldErrors?.password ? 'border-mv-danger focus:border-mv-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}
              `}
              aria-invalid={state?.fieldErrors?.password ? 'true' : 'false'}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-mv-text-subtle" />
              ) : (
                <Eye className="w-5 h-5 text-mv-text-subtle" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-s8">
              <div className="flex items-center justify-between">
                <span className="text-small text-mv-text-subtle font-medium tracking-wide uppercase">
                  Strength
                </span>
                <span
                  className={`text-small font-semibold ${
                    passwordStrength.strength === 'weak'
                      ? 'text-mv-danger'
                      : passwordStrength.strength === 'medium'
                        ? 'text-mv-warning'
                        : 'text-mv-success'
                  }`}
                >
                  {passwordStrength.strength === 'weak'
                    ? 'Weak'
                    : passwordStrength.strength === 'medium'
                      ? 'Good'
                      : 'Strong'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-mv-border via-mv-border to-mv-border relative overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                    passwordStrength.strength === 'weak'
                      ? 'w-1/3 bg-mv-danger'
                      : passwordStrength.strength === 'medium'
                        ? 'w-2/3 bg-mv-warning'
                        : 'w-full bg-mv-success'
                  }`}
                />
              </div>
              <ul className="grid grid-cols-2 gap-2 text-[11px] text-mv-text-subtle tracking-wide">
                <li
                  className={
                    passwordStrength.checks.length ? 'text-mv-success' : ''
                  }
                >
                  8+ characters
                </li>
                <li
                  className={
                    passwordStrength.checks.uppercase ? 'text-mv-success' : ''
                  }
                >
                  Uppercase
                </li>
                <li
                  className={
                    passwordStrength.checks.lowercase ? 'text-mv-success' : ''
                  }
                >
                  Lowercase
                </li>
                <li
                  className={
                    passwordStrength.checks.number ? 'text-mv-success' : ''
                  }
                >
                  Number
                </li>
                <li
                  className={
                    passwordStrength.checks.special ? 'text-mv-success' : ''
                  }
                >
                  Symbol
                </li>
              </ul>
            </div>
          )}

          {state?.fieldErrors?.password && (
            <p className="text-small text-mv-danger font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-s12">
          <label
            htmlFor="confirmPassword"
            className="block text-small font-semibold text-mv-text"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Confirm your password"
              className={`
                w-full h-mv-input px-mv-input-x pr-12
                bg-mv-form-input-bg border border-mv-form-input-border rounded-mv-input
                text-mv-form-input-text placeholder:text-mv-form-input-placeholder
                transition-all duration-200 ease-out
                focus:outline-none focus:border-mv-cta focus:shadow-focus-ring
                hover:border-mv-text-subtle/40
                ${state?.fieldErrors?.confirmPassword ? 'border-mv-danger focus:border-mv-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}
              `}
              aria-invalid={
                state?.fieldErrors?.confirmPassword ? 'true' : 'false'
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-mv-text-subtle" />
              ) : (
                <Eye className="w-5 h-5 text-mv-text-subtle" />
              )}
            </button>
          </div>
          {state?.fieldErrors?.confirmPassword && (
            <p className="text-small text-mv-danger font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>

        {/* Timezone Field */}
        <FormField
          label="Timezone"
          id="timezone"
          name="timezone"
          type="text"
          value={userTimezone}
          readOnly
          placeholder="Detecting timezone..."
          error={state?.fieldErrors?.timezone}
          helperText="We'll use this to send you timely habit reminders"
        />

        {/* Terms and Marketing Checkboxes */}
        <div className="space-y-s20 pt-s8 border-t border-dashed border-mv-border/60">
          <div className="flex items-start gap-3">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="mt-1 w-5 h-5 text-mv-cta bg-mv-form-input-bg border-mv-form-input-border rounded focus:ring-mv-cta/25 focus:ring-2"
            />
            <label
              htmlFor="terms"
              className="text-small text-mv-text-subtle leading-relaxed"
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-mv-cta hover:underline font-medium"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-mv-cta hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          <div className="flex items-start gap-3">
            <input
              id="marketing"
              name="marketing"
              type="checkbox"
              className="mt-1 w-5 h-5 text-mv-cta bg-mv-form-input-bg border-mv-form-input-border rounded focus:ring-mv-cta/25 focus:ring-2"
            />
            <label
              htmlFor="marketing"
              className="text-small text-mv-text-subtle leading-relaxed"
            >
              Send me helpful tips and updates about building better habits
            </label>
          </div>
        </div>
        {/* Submit Button + Login Link */}
        <div className="space-y-s16 pt-s8">
          <FormSubmitButton
            pending={pending}
            className="w-full btn btn-primary text-center justify-center"
          >
            Create Account
          </FormSubmitButton>
          <p className="text-small text-mv-text-subtle text-center">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-mv-cta hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
