'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormField } from './FormField'
import { PasswordField } from './PasswordField'
import { FormSubmitButton } from './FormSubmitButton'
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          {...register('email')}
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          required
        />

        <PasswordField
          {...register('password')}
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="keepSignedIn"
              name="keepSignedIn"
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="keepSignedIn" className="text-sm text-neutral-700">
              Keep me signed in for 30 days
            </label>
          </div>
          <Link
            href="/reset-request"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <FormSubmitButton
          pending={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </FormSubmitButton>
      </form>

      <div className="text-center">
        <p className="text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  )
}
