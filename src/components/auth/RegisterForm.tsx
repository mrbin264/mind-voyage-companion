'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    timezone: z.string().min(1, { message: 'Timezone is required' }),
    termsAccepted: z
      .boolean()
      .refine(val => val, { message: 'You must accept the terms of service' }),
    updatesOptIn: z.boolean().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      timezone: 'America/New_York',
      termsAccepted: false,
      updatesOptIn: false,
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    setError(null)
    try {
      // First, register the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Registration failed')
        setLoading(false)
        return
      }

      // Then automatically sign them in
      console.log('Attempting automatic sign in with:', data.email)
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      console.log('Sign in result:', signInResult)

      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error)
        setError(
          'Account created but sign in failed. Please try signing in manually.'
        )
        setLoading(false)
        return
      }

      console.log('Sign in successful, redirecting to onboarding')
      // New users always go to onboarding
      router.replace('/onboarding')
    } catch (e) {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900/50 feature-card p-8 rounded-2xl">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-gray-100">
          Create Your Account
        </h2>
        <p className="text-gray-400 mt-2 mb-8">
          Start your journey to better habits and mindful reflection.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="form-input pr-10"
                  {...register('firstName')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-2">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="form-input pr-10"
                  {...register('lastName')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-2">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="form-input pr-10"
                {...register('email')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Password (8+ characters)"
                className="form-input pl-10"
                {...register('password')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                className="form-input pl-10"
                {...register('confirmPassword')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="timezone" className="sr-only">
              Timezone
            </label>
            <div className="relative">
              <select
                id="timezone"
                className="form-input appearance-none pl-10"
                {...register('timezone')}
              >
                <option value="America/New_York">
                  Timezone: America/New_York
                </option>
                <option value="Europe/London">Timezone: Europe/London</option>
                <option value="Asia/Tokyo">Timezone: Asia/Tokyo</option>
                <option value="America/Los_Angeles">
                  Timezone: America/Los_Angeles
                </option>
                <option value="America/Chicago">
                  Timezone: America/Chicago
                </option>
                <option value="Australia/Sydney">
                  Timezone: Australia/Sydney
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v1.5a1.5 1.5 0 01-3 0V12a2 2 0 00-2-2 2 2 0 01-2-2V8.707a5.969 5.969 0 01-1.668-.68z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.timezone && (
              <p className="text-red-400 text-sm mt-2">
                {errors.timezone.message}
              </p>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="form-checkbox mt-1"
                {...register('termsAccepted')}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="font-medium text-blue-400 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-blue-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-400 text-sm">
                {errors.termsAccepted.message}
              </p>
            )}

            <div className="flex items-center">
              <input
                id="updates"
                type="checkbox"
                className="form-checkbox"
                {...register('updatesOptIn')}
              />
              <label htmlFor="updates" className="ml-3 text-sm text-gray-400">
                Send me occasional product updates (optional).
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 !mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Sign in here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
