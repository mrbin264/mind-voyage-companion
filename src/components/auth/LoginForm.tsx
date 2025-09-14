'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormField } from './FormField'
import { PasswordField } from './PasswordField'
import { FormSubmitButton } from './FormSubmitButton'

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
      // On success, redirect to dashboard or onboarding (route not implemented yet)
      // router.replace("/dashboard");
    } catch (e) {
      setError('Network error')
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
      <PasswordField
        label="Password"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <FormSubmitButton>Sign in</FormSubmitButton>
    </form>
  )
}
