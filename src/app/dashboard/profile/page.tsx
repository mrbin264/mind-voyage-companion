import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProfileSettings } from '@/components/dashboard/profile/ProfileSettings'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = {
    userId: session.user.id!,
    email: session.user.email!,
    name: session.user.name!,
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your account settings and personal information
          </p>
        </div>

        {/* Profile Content */}
        <ProfileSettings user={user} />
      </div>
    </DashboardLayout>
  )
}