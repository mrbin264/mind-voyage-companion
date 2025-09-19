'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const resetConfirmSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ResetConfirmValues = z.infer<typeof resetConfirmSchema>

export default function PasswordResetConfirmForm() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetConfirmValues>({
    resolver: zodResolver(resetConfirmSchema),
  })

  const onSubmit = async (data: ResetConfirmValues) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })
      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Failed to reset password')
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch (e) {
      setError('Network error')
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-100">🔗 Invalid Link</h2>
          <p className="text-gray-400 mt-4">
            This password reset link is invalid or has expired.
          </p>

          <div className="mt-8 text-sm text-gray-400 space-y-2">
            <p>
              <Link
                href="/reset-request"
                className="font-medium text-blue-400 hover:underline"
              >
                Request a new reset link
              </Link>
            </p>
            <p>
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:underline"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-100">
            ✅ Password Reset
          </h2>
          <p className="text-gray-400 mt-4">
            Your password has been successfully reset.
          </p>

          <Link
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 mt-8 block text-center"
          >
            Sign In with New Password
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
      <div className="max-w-md mx-auto">
        <h2 className="text-4xl font-bold text-gray-100">🔒 New Password</h2>
        <p className="text-gray-400 mt-3 mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="New Password (8+ characters)"
              className="form-input"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm New Password"
              className="form-input"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Back to Sign In
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
