import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { HabitsPageContent } from '@/components/dashboard/HabitsPageContent'

interface AuthUser {
  userId: string
  email: string
  name: string
}

async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = verify(token, secret) as AuthUser

    return decoded
  } catch (error) {
    return null
  }
}

export default async function HabitsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="p-6 bg-zinc-900 border-white/10">
          <p className="text-center text-gray-300">
            Please log in to access your habits.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout user={{ name: user.name, email: user.email }} showDefaultHeader={false}>
      <HabitsPageContent user={user} />
    </DashboardLayout>
  )
}