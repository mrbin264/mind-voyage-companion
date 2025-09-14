'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from './FormField'
import { FormSubmitButton } from './FormSubmitButton'

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          If an account exists for this email, a reset link has been sent.
        </div>
      )}
      <FormSubmitButton>
        {loading ? 'Sending...' : 'Send reset link'}
      </FormSubmitButton>
    </form>
  )
}
