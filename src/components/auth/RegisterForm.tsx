'use client'
import * as React from 'react'
import { registerSchema } from '@/lib/validations/auth'
import { FormSubmitButton } from './FormSubmitButton'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Globe,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

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
    <main className="mx-auto max-w-screen-lg px-4 py-10">
      <div className="md:grid md:grid-cols-2 md:gap-12 items-start">
        {/* Form Column - Fixed width for better UX */}
        <div className="max-w-md w-full mx-auto md:mx-0">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center md:text-left space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Create account
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Start your mindful habit journey in under a minute
              </p>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-6">
              {/* Display Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Display name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg 
                      text-slate-900 placeholder:text-slate-400 
                      focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none 
                      hover:border-slate-300 
                      transition-all duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={state?.fieldErrors?.name ? 'true' : 'false'}
                    aria-describedby={
                      state?.fieldErrors?.name ? 'name-error' : undefined
                    }
                  />
                </div>
                {state?.fieldErrors?.name && (
                  <div
                    id="name-error"
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle
                      className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {Array.isArray(state.fieldErrors.name)
                        ? state.fieldErrors.name[0]
                        : state.fieldErrors.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg 
                      text-slate-900 placeholder:text-slate-400 
                      focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none 
                      hover:border-slate-300 
                      transition-all duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={state?.fieldErrors?.email ? 'true' : 'false'}
                    aria-describedby={
                      state?.fieldErrors?.email ? 'email-error' : 'email-helper'
                    }
                  />
                </div>
                <p
                  id="email-helper"
                  className="text-xs text-slate-500 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" aria-hidden="true" />
                  We&apos;ll only use your email to create your account
                </p>
                {state?.fieldErrors?.email && (
                  <div
                    id="email-error"
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle
                      className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {Array.isArray(state.fieldErrors.email)
                        ? state.fieldErrors.email[0]
                        : state.fieldErrors.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Password Fields Group */}
              <fieldset className="space-y-4">
                <legend className="sr-only">Password requirements</legend>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className="h-5 w-5 text-slate-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="8+ characters"
                        className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-lg 
                          text-slate-900 placeholder:text-slate-400 
                          focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none 
                          hover:border-slate-300 
                          transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-invalid={
                          state?.fieldErrors?.password ? 'true' : 'false'
                        }
                        aria-describedby="password-requirements"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className="h-5 w-5 text-slate-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-lg 
                          text-slate-900 placeholder:text-slate-400 
                          focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none 
                          hover:border-slate-300 
                          transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-invalid={
                          state?.fieldErrors?.confirmPassword ? 'true' : 'false'
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div
                  id="password-requirements"
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                >
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Password requirements:
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        key: 'length',
                        text: 'At least 8 characters',
                        met: passwordStrength.checks.length,
                      },
                      {
                        key: 'uppercase',
                        text: 'One uppercase letter',
                        met: passwordStrength.checks.uppercase,
                      },
                      {
                        key: 'lowercase',
                        text: 'One lowercase letter',
                        met: passwordStrength.checks.lowercase,
                      },
                      {
                        key: 'number',
                        text: 'One number or special character',
                        met:
                          passwordStrength.checks.number ||
                          passwordStrength.checks.special,
                      },
                    ].map(req => (
                      <div key={req.key} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 ${req.met ? 'text-emerald-500' : 'text-slate-300'}`}
                          aria-hidden="true"
                        />
                        <span
                          className={`text-xs ${req.met ? 'text-emerald-700' : 'text-slate-600'}`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  {password && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">
                          Strength:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3].map(level => (
                            <div
                              key={level}
                              className={`h-1.5 w-6 rounded-full ${
                                passwordStrength.strength === 'weak' &&
                                level === 1
                                  ? 'bg-red-400'
                                  : passwordStrength.strength === 'medium' &&
                                      level <= 2
                                    ? 'bg-amber-400'
                                    : passwordStrength.strength === 'strong' &&
                                        level <= 3
                                      ? 'bg-emerald-400'
                                      : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === 'weak'
                              ? 'text-red-600'
                              : passwordStrength.strength === 'medium'
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                          }`}
                        >
                          {passwordStrength.strength}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Errors */}
                {state?.fieldErrors?.password && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle
                      className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {Array.isArray(state.fieldErrors.password)
                        ? state.fieldErrors.password[0]
                        : state.fieldErrors.password}
                    </p>
                  </div>
                )}
                {state?.fieldErrors?.confirmPassword && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle
                      className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {Array.isArray(state.fieldErrors.confirmPassword)
                        ? state.fieldErrors.confirmPassword[0]
                        : state.fieldErrors.confirmPassword}
                    </p>
                  </div>
                )}
              </fieldset>

              {/* Timezone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Timezone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <select
                    id="timezone"
                    name="timezone"
                    defaultValue={userTimezone}
                    className="w-full pl-10 pr-8 py-3 border-2 border-slate-200 rounded-lg 
                      text-slate-900 bg-white
                      focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none 
                      hover:border-slate-300 
                      transition-all duration-200 
                      appearance-none cursor-pointer"
                  >
                    <option value="America/New_York">
                      Eastern Time (America/New_York)
                    </option>
                    <option value="America/Chicago">
                      Central Time (America/Chicago)
                    </option>
                    <option value="America/Denver">
                      Mountain Time (America/Denver)
                    </option>
                    <option value="America/Los_Angeles">
                      Pacific Time (America/Los_Angeles)
                    </option>
                    <option value="Europe/London">
                      London (Europe/London)
                    </option>
                    <option value="Europe/Paris">Paris (Europe/Paris)</option>
                    <option value="Asia/Tokyo">Tokyo (Asia/Tokyo)</option>
                    <option value="Australia/Sydney">
                      Sydney (Australia/Sydney)
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  This helps us show you relevant timing for daily habits
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      id="agreeToTerms"
                      required
                      className="mt-1 h-4 w-4 text-primary-600 border-2 border-slate-300 rounded 
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-200"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-slate-700 leading-relaxed"
                    >
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium underline decoration-2 decoration-primary-200 hover:decoration-primary-300 transition-colors"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium underline decoration-2 decoration-primary-200 hover:decoration-primary-300 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <FormSubmitButton
                  pending={pending}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 
                    text-white font-semibold py-4 px-6 rounded-lg 
                    shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/25
                    transform hover:scale-[1.01] active:scale-[0.99]
                    transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                >
                  Create account
                </FormSubmitButton>
              </div>
            </form>

            {/* Sign in Link */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Column - Hidden on mobile, shown on md+ */}
        <div className="hidden md:block space-y-6">
          <div className="bg-gradient-to-br from-primary-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-100/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Why join Mind Voyage?
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: '🎯',
                  title: 'Private & secure',
                  description:
                    'Your data stays yours with optional encrypted cloud sync',
                },
                {
                  icon: '✨',
                  title: 'Guided prompts',
                  description:
                    'Thoughtful journaling prompts and mood tracking',
                },
                {
                  icon: '📊',
                  title: 'Beautiful habit visuals',
                  description:
                    'Streak tracking and progress insights that motivate',
                },
              ].map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg">{benefit.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="text-center bg-white/80 rounded-xl p-6 border border-slate-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📈</span>
              <p className="font-bold text-slate-900">
                Join 10,000+ mindful habit builders
              </p>
            </div>
            <p className="text-sm text-slate-600">
              already transforming their lives
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
