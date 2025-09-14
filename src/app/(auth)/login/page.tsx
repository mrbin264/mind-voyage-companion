import { AuthLayout } from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import { redirect } from 'next/navigation'
// TODO: Replace with actual Auth.js session util when available
// import { getServerSession } from "next-auth";

// Placeholder async session check (replace with real session logic)
async function getSession() {
  // TODO: Use Auth.js getServerSession or custom session util
  return null
}

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    // Redirect authenticated users to onboarding or dashboard
    // TODO: Uncomment when /onboarding route is implemented
    // redirect("/onboarding");
  }
  return (
    <AuthLayout type="login">
      <LoginForm />
    </AuthLayout>
  )
}
