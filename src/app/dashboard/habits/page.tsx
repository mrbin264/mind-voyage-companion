import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { HabitsPageContent } from '@/components/dashboard/HabitsPageContent'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HabitsPage() {
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
    <DashboardLayout
      user={{ name: user.name, email: user.email }}
    >
      <HabitsPageContent user={user} />
    </DashboardLayout>
  )
}
