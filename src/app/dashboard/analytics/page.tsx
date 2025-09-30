import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AnalyticsPageContent } from '@/components/dashboard/AnalyticsPageContent'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
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
      showDefaultHeader={true}
    >
      <AnalyticsPageContent user={user} />
    </DashboardLayout>
  )
}
