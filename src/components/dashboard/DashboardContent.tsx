'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { HabitForm } from './HabitForm'
import { useHabits } from '@/hooks/useHabits'
import type { CreateHabitRequest } from '@/types/habit'
import { Target, Plus } from 'lucide-react'
import Link from 'next/link'

interface AuthUser {
  userId: string
  email: string
  name: string
}

interface DashboardContentProps {
  user: AuthUser
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState('😊')

  const {
    habits,
    summary,
    loading,
    summaryLoading,
    actionLoading,
    error,
    createHabit,
    completeHabit,
    skipHabit,
    fetchHabits,
    fetchSummary,
  } = useHabits({ status: 'active' })

  // Get today's habits only (first 4 for compact view)
  const todaysHabits = habits.slice(0, 4)

  const handleCompleteHabit = async (habitId: string, value?: number) => {
    const success = await completeHabit(habitId, value)
    if (success) {
      console.log('Habit completed successfully')
      await Promise.all([fetchHabits(), fetchSummary()])
    }
  }

  const handleSkipHabit = async (habitId: string) => {
    const reason = prompt('Why are you skipping this habit today? (optional)')
    const success = await skipHabit(habitId, reason || undefined)
    if (success) {
      console.log('Habit skipped successfully')
      await Promise.all([fetchHabits(), fetchSummary()])
    }
  }

  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    const success = await createHabit(habitData)
    if (success) {
      setShowCreateForm(false)
      await Promise.all([fetchHabits(), fetchSummary()])
    }
  }

  const moods = ['😔', '😐', '😊', '😄', '🤗']

  return (
    <div className="space-y-8">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Daily Wisdom & Today's Focus */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Wisdom */}
          <WidgetCard className="p-6 lg:col-span-2">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-gray-100">
              🏛️ Daily Wisdom
            </h3>
            <blockquote className="text-xl text-gray-300 italic mb-2">
              &ldquo;The best time to plant a tree was 20 years ago. The second
              best time is now.&rdquo;
            </blockquote>
            <cite className="block text-right text-gray-500 mb-4">
              — Chinese Proverb
            </cite>
            <div className="flex gap-2">
              <Link href="/dashboard/wisdom">
                <Button
                  size="sm"
                  className="text-sm bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold"
                >
                  💫 Generate New Quote
                </Button>
              </Link>
              <Link href="/dashboard/wisdom">
                <Button
                  size="sm"
                  className="text-sm bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 font-semibold"
                >
                  ❤️ Save
                </Button>
              </Link>
            </div>
          </WidgetCard>

          {/* Today's Focus */}
          <WidgetCard className="p-6 flex flex-col justify-center">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2 text-gray-100">
              🎯 Today&apos;s Focus
            </h3>
            <p className="text-gray-400 mb-4">
              Complete 3 habits to maintain your momentum.
            </p>
            <p className="text-sm font-semibold text-gray-300 mb-1">
              Progress: {summary?.completedToday || 0}/
              {summary?.totalCompletedToday || 0}
            </p>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: summary?.totalCompletedToday
                    ? `${(summary.completedToday / summary.totalCompletedToday) * 100}%`
                    : '0%',
                }}
              ></div>
            </div>
            <Link
              href="/dashboard/habits"
              className="text-blue-400 font-semibold text-sm hover:underline"
            >
              View All Habits
            </Link>
          </WidgetCard>
        </div>

        {/* Today's Habits */}
        <div className="xl:col-span-3">
          <WidgetCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-100">
                📈 Today&apos;s Habits
              </h3>
              <Button
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Habit
              </Button>
            </div>

            {todaysHabits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {todaysHabits.map(habitProgress => (
                  <WidgetCard
                    key={habitProgress.habit._id}
                    className={`p-4 border-l-4 ${
                      habitProgress.todayLog?.completed
                        ? 'border-green-500'
                        : 'border-gray-500'
                    }`}
                  >
                    <h4 className="font-bold text-gray-100 mb-2">
                      {habitProgress.habit.emoji || '📋'}{' '}
                      {habitProgress.habit.title}
                    </h4>
                    {habitProgress.todayLog?.completed ? (
                      <div>
                        <p className="text-sm text-green-400 mb-2">
                          ✓ Completed
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          🔥 {habitProgress.currentStreak}-day streak
                        </p>
                        <button className="text-xs font-semibold text-blue-400 hover:underline">
                          View Details
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          ○ Not started
                        </p>
                        <p className="text-xs text-gray-400 mb-3">🎯 Planned</p>
                        <Button
                          size="sm"
                          className="text-xs bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1 px-3"
                          onClick={() =>
                            handleCompleteHabit(habitProgress.habit._id!, 1)
                          }
                          disabled={actionLoading}
                        >
                          Complete
                        </Button>
                      </div>
                    )}
                  </WidgetCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-semibold mb-2 text-gray-100">
                  No habits for today
                </h4>
                <p className="text-gray-400 mb-4">
                  Create your first habit to start tracking your progress
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create Your First Habit
                </Button>
              </div>
            )}
          </WidgetCard>
        </div>

        {/* Quick Journal & Weekly Progress */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Quick Journal Entry */}
          <WidgetCard className="p-6 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-gray-100">
              📝 Quick Journal Entry
            </h3>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              How are you feeling today?
            </label>
            <div className="flex justify-between items-center mb-4">
              {moods.map(mood => (
                <button
                  key={mood}
                  className={`text-3xl p-2 transition-transform rounded-full ${
                    selectedMood === mood
                      ? 'transform scale-125 bg-blue-600/30'
                      : 'hover:transform hover:scale-110'
                  }`}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
            <textarea
              placeholder="What made today special?"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-500"
            />
            <div className="flex justify-between items-center mt-3">
              <button className="text-xs bg-gray-700/80 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">
                🔒 Private
              </button>
              <Link href="/journal">
                <Button className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4">
                  💾 Save Entry
                </Button>
              </Link>
            </div>
          </WidgetCard>

          {/* Weekly Progress */}
          <WidgetCard className="p-6 lg:col-span-3">
            <h3 className="font-bold text-lg mb-4 text-gray-100">
              📊 Weekly Progress
            </h3>
            <div className="space-y-3 text-sm">
              {habits.length > 0 ? (
                habits.slice(0, 4).map(habitProgress => (
                  <div key={habitProgress.habit._id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">
                        {habitProgress.habit.title}
                      </span>
                      <span className="font-semibold text-gray-200">
                        {habitProgress.weeklyProgress.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${habitProgress.weeklyProgress.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No habits to display
                </div>
              )}
            </div>
            {habits.length > 0 && (
              <div className="mt-6 border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-200 mb-2">
                  🎖️ Achievements This Week:
                </h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>✓ 7-day Morning Pages streak</li>
                  <li>✓ 5 consecutive journaling days</li>
                  <li className="text-yellow-400">
                    ⭐ Ready for: Consistency Champion
                  </li>
                </ul>
              </div>
            )}
          </WidgetCard>
        </div>

        {/* Recommendations & Quick Actions */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recommendations */}
          <WidgetCard className="p-6 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-gray-100">
              🎯 Recommendations
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Based on your patterns:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Try meditating after reading</li>
              <li>• Your hydration improves on journaling days</li>
              <li>• Consider an evening routine</li>
            </ul>
            <button className="text-sm font-semibold text-purple-400 mt-4 hover:underline">
              ✨ Get Pro AI Insights
            </button>
          </WidgetCard>

          {/* Quick Actions */}
          <WidgetCard className="p-6 lg:col-span-3">
            <h3 className="font-bold text-lg mb-4 text-gray-100">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/journal" className="block">
                <button className="p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full">
                  <h4 className="font-bold text-gray-200">📝 Journal</h4>
                  <p className="text-sm text-gray-400">Quick Entry</p>
                </button>
              </Link>
              <Link href="/dashboard/wisdom" className="block">
                <button className="p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full">
                  <h4 className="font-bold text-gray-200">
                    🏛️ Get Daily Wisdom
                  </h4>
                  <p className="text-sm text-gray-400">New Quote</p>
                </button>
              </Link>
              <Link href="/dashboard/analytics" className="block">
                <button className="p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full">
                  <h4 className="font-bold text-gray-200">📊 Analytics</h4>
                  <p className="text-sm text-gray-400">View Reports</p>
                </button>
              </Link>
              <Link href="/dashboard/settings" className="block">
                <button className="p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full">
                  <h4 className="font-bold text-gray-200">⚙️ Settings</h4>
                  <p className="text-sm text-gray-400">Preferences</p>
                </button>
              </Link>
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Create Habit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <HabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setShowCreateForm(false)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
