'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Login failed')
        setLoading(false)
        return
      }
      router.replace('/dashboard')
    } catch (e) {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900/50 feature-card p-8 sm:p-12 rounded-2xl">
      <div className="max-w-md mx-auto">
        <h2 className="text-4xl font-bold text-gray-100">Welcome Back! 👋</h2>
        <p className="text-gray-400 mt-2 mb-8">
          Sign in to continue your personal growth journey.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="form-input"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between !mt-4">
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="form-checkbox" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Keep me signed in
              </label>
            </div>
            <Link
              href="/reset-request"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              🔗 SSO Login
            </button>
            <button
              type="button"
              className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              📧 Magic Link
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          New to Mind Voyage?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:underline"
          >
            Create your free account
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
