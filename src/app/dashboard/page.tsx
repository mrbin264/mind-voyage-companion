import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, BookOpen, Target } from 'lucide-react'

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

    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
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
          <p className="text-center text-muted-foreground">Please log in to access your dashboard.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mind Voyage Companion</h1>
              <p className="text-slate-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="ghost" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Daily Habits</h3>
                <p className="text-2xl font-bold text-primary-600">0</p>
                <p className="text-sm text-slate-600">habits created</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <Calendar className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Current Streak</h3>
                <p className="text-2xl font-bold text-success-600">0</p>
                <p className="text-sm text-slate-600">days in a row</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Journal Entries</h3>
                <p className="text-2xl font-bold text-secondary-600">0</p>
                <p className="text-sm text-slate-600">entries written</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-slate-900 mb-2">Create Your First Habit</h3>
              <p className="text-slate-600 mb-4">Start tracking daily habits that matter to you</p>
              <Button className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Create Habit
              </Button>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-slate-900 mb-2">Write in Your Journal</h3>
              <p className="text-slate-600 mb-4">Reflect on your day and track your mood</p>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Writing
              </Button>
            </Card>
          </div>
        </div>

        {/* Daily Stoic Section */}
        <div className="mt-8">
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Daily Stoic Reflection</h2>
            <blockquote className="italic text-slate-700 mb-4">
              &ldquo;The happiness of your life depends upon the quality of your thoughts.&rdquo;
            </blockquote>
            <p className="text-sm text-slate-600">&mdash; Marcus Aurelius</p>
            <Button variant="ghost" className="mt-4">
              Read Today&apos;s Reflection
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
