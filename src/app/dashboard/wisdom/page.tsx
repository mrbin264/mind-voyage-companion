import React, { Suspense } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WisdomContent } from '@/components/dashboard/wisdom/WisdomContent'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface AuthUser {
  userId: string
  email: string
  name: string
}

export default async function WisdomPage() {
  // Server-side authentication check
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // Extract user data from session
  const user: AuthUser = {
    userId: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <SkeletonLoader variant="dashboard-widget" count={3} />
            </div>
          }
        >
          <WisdomContent />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
