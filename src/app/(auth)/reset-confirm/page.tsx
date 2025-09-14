import { Suspense } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import PasswordResetConfirmForm from '@/components/auth/PasswordResetConfirmForm'

export default function PasswordResetConfirmPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={<div className="text-sm text-gray-500">Loading...</div>}
      >
        <PasswordResetConfirmForm />
      </Suspense>
    </AuthLayout>
  )
}
