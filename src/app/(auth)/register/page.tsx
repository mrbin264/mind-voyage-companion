import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function RegisterPage() {
  return (
    <AuthLayout type="register">
      <RegisterForm />
    </AuthLayout>
  )
}
