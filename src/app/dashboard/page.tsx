import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, BookOpen, Target } from 'lucide-react'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

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

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    // This should be handled by middleware, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Please log in to access your dashboard.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <DashboardContent user={user} />
    </DashboardLayout>
  )
}
