import { AuthLayout } from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function LoginPage() {
  const session = await auth()
  
  if (session?.user) {
    // Redirect authenticated users to dashboard
    redirect('/dashboard')
  }
  return (
    <AuthLayout type="login">
      <LoginForm />
    </AuthLayout>
  )
}
