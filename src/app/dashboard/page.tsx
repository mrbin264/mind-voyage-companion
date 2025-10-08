import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-2">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Card 1 */}
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
            <h3 className="text-lg font-semibold text-white mb-2">
              Getting Started
            </h3>
            <p className="text-sm text-zinc-400">
              This is a sample dashboard. Start building your features here.
            </p>
          </div>

          {/* Sample Card 2 */}
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
            <h3 className="text-lg font-semibold text-white mb-2">
              API Routes
            </h3>
            <p className="text-sm text-zinc-400">
              Check out <code className="text-zinc-300">/api/example</code> for
              sample API implementation.
            </p>
          </div>

          {/* Sample Card 3 */}
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
            <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
            <p className="text-sm text-zinc-400">
              MongoDB is configured and ready. See{' '}
              <code className="text-zinc-300">src/lib/db.ts</code>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
