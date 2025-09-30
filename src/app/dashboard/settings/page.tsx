import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SettingsPageContent } from '@/components/dashboard/SettingsPageContent'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
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
      <SettingsPageContent user={user} />
    </DashboardLayout>
  )
}
