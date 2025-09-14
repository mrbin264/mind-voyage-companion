'use client'
import * as React from 'react'
import { useFormState } from 'react-dom'
import { registerSchema } from '@/lib/validations/auth'
import { FormField } from './FormField'
import { PasswordField } from './PasswordField'
import { FormSubmitButton } from './FormSubmitButton'

async function registerAction(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  }
  // Client-side Zod validation (optional, server will re-validate)
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }
  // Call API
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  })
  if (!res.ok) {
    const result = await res.json()
    return { fieldErrors: result.errors }
  }
  // Success: redirect or show onboarding
  window.location.href = '/onboarding'
  return {}
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, null)
  const [pending, startTransition] = React.useTransition()

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        error={state?.fieldErrors?.email}
        required
      />
      <PasswordField
        name="password"
        label="Password"
        requirements={{
          minLength: 8,
          requireNumbers: true,
          requireSpecialChars: true,
        }}
        error={state?.fieldErrors?.password}
        autoComplete="new-password"
        required
      />
      <FormField
        name="name"
        type="text"
        label="Name (optional)"
        autoComplete="name"
        error={state?.fieldErrors?.name}
      />
      <FormSubmitButton pending={pending}>Create Account</FormSubmitButton>
    </form>
  )
}
