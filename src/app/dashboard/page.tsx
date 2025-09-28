import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, BookOpen, Target } from 'lucide-react'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    // This should be handled by middleware, but redirect as fallback
    redirect('/login')
  }

  const user = {
    userId: session.user.id!,
    email: session.user.email!,
    name: session.user.name!,
  }

  return (
    <DashboardLayout user={user}>
      <DashboardContent user={user} />
    </DashboardLayout>
  )
}
