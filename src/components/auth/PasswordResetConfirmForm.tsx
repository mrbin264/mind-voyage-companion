'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordField } from './PasswordField'
import { FormSubmitButton } from './FormSubmitButton'
import { useSearchParams } from 'next/navigation'

const resetConfirmSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
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
    watch,
  } = useForm<ResetConfirmValues>({
    resolver: zodResolver(
      resetConfirmSchema.refine(
        data => data.password === data.confirmPassword,
        { message: 'Passwords do not match', path: ['confirmPassword'] }
      )
    ),
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
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-red-600 text-sm">
        Invalid or missing reset token.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordField
        label="New password"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          Your password has been reset. You may now sign in.
        </div>
      )}
      <FormSubmitButton>
        {loading ? 'Resetting...' : 'Reset password'}
      </FormSubmitButton>
    </form>
  )
}
