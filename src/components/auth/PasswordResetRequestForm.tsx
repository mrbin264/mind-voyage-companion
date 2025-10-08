'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

const resetRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

type ResetRequestValues = z.infer<typeof resetRequestSchema>

export default function PasswordResetRequestForm() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
  })

  const onSubmit = async (data: ResetRequestValues) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/auth/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Failed to send reset email')
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-100">
            ✉️ Check Your Email
          </h2>
          <p className="text-gray-400 mt-4">
            We&rsquo;ve sent a password reset link to your email address.
          </p>
          <p className="text-sm text-gray-500 my-6">
            The link will expire in 1 hour for your security.
          </p>

          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="w-full bg-gray-700/80 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Resend Email
          </button>

          <div className="mt-8 text-sm text-gray-400 space-y-2">
            <p>
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:underline"
              >
                Back to Sign In
              </Link>
            </p>
            <p>
              <div className="mt-4 text-center text-sm text-zinc-400">
                Need help?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-400 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
      <div className="max-w-md mx-auto">
        <h2 className="text-4xl font-bold text-gray-100">
          Reset Your Password 🔑
        </h2>
        <p className="text-gray-400 mt-3 mb-8">
          Enter your email address and we&rsquo;ll send you a secure link to
          reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              className="form-input"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {errors.email.message}
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
            {loading ? 'Sending...' : 'Send Reset Link'}
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
        <p className="text-center text-sm text-gray-400 mt-2">
          Need help?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Back to Login
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
