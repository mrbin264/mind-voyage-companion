'use client'

import React, { useState, lazy, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { HabitForm } from './HabitForm'
import { useHabits } from '@/hooks/useHabits'
import { useWisdom } from '@/hooks/useWisdom'
import type { CreateHabitRequest } from '@/types/habit'
import { Target, Plus, RefreshCw, Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'

// Lazy load below-the-fold sections for better initial page load performance
const TodaysHabitsSection = lazy(() => import('./sections/TodaysHabitsSection'))
const QuickJournalSection = lazy(() => import('./sections/QuickJournalSection'))
const WeeklyProgressSection = lazy(
  () => import('./sections/WeeklyProgressSection')
)
const RecommendationsSection = lazy(
  () => import('./sections/RecommendationsSection')
)
const QuickActionsSection = lazy(() => import('./sections/QuickActionsSection'))

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
  const [wisdomActionLoading, setWisdomActionLoading] = useState<string | null>(
    null
  )
  const [journalContent, setJournalContent] = useState('')
  const [journalSaving, setJournalSaving] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)
  const [journalError, setJournalError] = useState<string | null>(null)

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

  const {
    currentQuote,
    fetchRandomQuote,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
  } = useWisdom()

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

  const handleGenerateWisdomQuote = async () => {
    setWisdomActionLoading('generate')
    try {
      await fetchRandomQuote()
    } finally {
      setWisdomActionLoading(null)
    }
  }

  const handleToggleWisdomFavorite = async () => {
    if (!currentQuote) return

    setWisdomActionLoading('favorite')
    try {
      const isCurrentlyFavorited = isFavorited(currentQuote.id)
      if (isCurrentlyFavorited) {
        await removeFromFavorites(currentQuote.id)
      } else {
        await addToFavorites(currentQuote)
      }
    } finally {
      setWisdomActionLoading(null)
    }
  }

  const handleQuickJournal = () => {
    // Scroll to journal section and focus textarea
    const journalSection = document.querySelector(
      'textarea[placeholder*="How are you feeling"]'
    ) as HTMLTextAreaElement
    if (journalSection) {
      journalSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        journalSection.focus()
      }, 500)
    }
  }

  const handleSaveJournalEntry = async () => {
    if (!journalContent.trim()) {
      setJournalError(
        'Please write something before saving your journal entry!'
      )
      setTimeout(() => setJournalError(null), 3000)
      return
    }

    setJournalSaving(true)
    setJournalError(null)
    try {
      // Convert mood emoji to number (1-5 scale)
      const moodMap: { [key: string]: number } = {
        '😔': 1,
        '😐': 2,
        '😊': 3,
        '😄': 4,
        '🤗': 5,
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: journalContent.trim(),
          mood: moodMap[selectedMood] || 3,
          date: new Date().toISOString().split('T')[0], // Today's date
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setJournalError(
            'You already have a journal entry for today! You can edit it from the Journal page.'
          )
        } else {
          setJournalError(result.error || 'Failed to save journal entry')
        }
        setTimeout(() => setJournalError(null), 5000)
        return
      }

      // Success! Clear the form and show feedback
      setJournalContent('')
      setSelectedMood('😊')
      setJournalSaved(true)

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setJournalSaved(false)
      }, 3000)
    } catch (error) {
      console.error('Error saving journal entry:', error)
      setJournalError('Failed to save journal entry. Please try again.')
      setTimeout(() => setJournalError(null), 3000)
    } finally {
      setJournalSaving(false)
    }
  }

  const moods = ['😔', '😐', '😊', '😄', '🤗']

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Wisdom & Today's Focus */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Daily Wisdom */}
          <WidgetCard className="p-4 sm:p-6 lg:col-span-2">
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 mb-4 text-heading">
              🏛️ Daily Wisdom
            </h3>
            {currentQuote ? (
              <>
                <blockquote className="text-lg sm:text-xl text-body italic mb-2">
                  &ldquo;{currentQuote.text}&rdquo;
                </blockquote>
                <cite className="block text-right text-xs sm:text-sm text-muted mb-4">
                  — {currentQuote.author}
                </cite>
              </>
            ) : (
              <>
                <blockquote className="text-lg sm:text-xl text-body italic mb-2">
                  &ldquo;The best time to plant a tree was 20 years ago. The
                  second best time is now.&rdquo;
                </blockquote>
                <cite className="block text-right text-xs sm:text-sm text-muted mb-4">
                  — Chinese Proverb
                </cite>
              </>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleGenerateWisdomQuote}
                disabled={wisdomActionLoading === 'generate'}
                className="text-sm bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold"
              >
                {wisdomActionLoading === 'generate' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Generate New Quote</span>
                <span className="sm:hidden">New Quote</span>
              </Button>
              <Button
                size="sm"
                onClick={handleToggleWisdomFavorite}
                disabled={wisdomActionLoading === 'favorite' || !currentQuote}
                className={`text-sm font-semibold ${
                  currentQuote && isFavorited(currentQuote.id)
                    ? 'bg-pink-600/40 text-pink-200'
                    : 'bg-pink-600/20 text-pink-300'
                } hover:bg-pink-600/40`}
              >
                {wisdomActionLoading === 'favorite' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      currentQuote && isFavorited(currentQuote.id)
                        ? 'fill-current'
                        : ''
                    }`}
                  />
                )}
                <span className="hidden sm:inline">
                  {currentQuote && isFavorited(currentQuote.id)
                    ? 'Favorited'
                    : 'Save to Favorites'}
                </span>
                <span className="sm:hidden">
                  {currentQuote && isFavorited(currentQuote.id)
                    ? 'Saved'
                    : 'Save'}
                </span>
              </Button>
              <Link
                href="/dashboard/wisdom"
                className="text-xs text-blue-400 hover:underline ml-2 flex items-center"
              >
                Explore More →
              </Link>
            </div>
          </WidgetCard>

          {/* Today's Focus */}
          <WidgetCard className="p-4 sm:p-6 flex flex-col justify-center">
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 mb-2 text-heading">
              🎯 Today&apos;s Focus
            </h3>
            <p className="text-xs sm:text-sm text-muted mb-4">
              Complete 3 habits to maintain your momentum.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-body mb-1">
              Progress: {summary?.completedToday || 0}/
              {summary?.totalCompletedToday || 0}
            </p>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full origin-left transition-transform duration-300"
                style={{
                  transform: summary?.totalCompletedToday
                    ? `scaleX(${summary.completedToday / summary.totalCompletedToday})`
                    : 'scaleX(0)',
                }}
              ></div>
            </div>
            <Link
              href="/dashboard/habits"
              className="text-blue-400 font-semibold text-xs sm:text-sm hover:underline touch-manipulation"
            >
              View All Habits
            </Link>
          </WidgetCard>
        </div>

        {/* Today's Habits - Lazy Loaded */}
        <Suspense
          fallback={
            <div className="xl:col-span-3">
              <SkeletonLoader variant="dashboard-widget" count={1} />
            </div>
          }
        >
          <TodaysHabitsSection
            habits={habits}
            actionLoading={actionLoading}
            onCompleteHabit={handleCompleteHabit}
            onShowCreateForm={() => setShowCreateForm(true)}
          />
        </Suspense>

        {/* Quick Journal & Weekly Progress - Lazy Loaded */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <Suspense
            fallback={
              <div className="lg:col-span-2">
                <SkeletonLoader variant="dashboard-widget" count={1} />
              </div>
            }
          >
            <QuickJournalSection
              selectedMood={selectedMood}
              moods={moods}
              journalContent={journalContent}
              journalSaving={journalSaving}
              journalSaved={journalSaved}
              journalError={journalError}
              onMoodSelect={setSelectedMood}
              onContentChange={setJournalContent}
              onSaveEntry={handleSaveJournalEntry}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="lg:col-span-3">
                <SkeletonLoader variant="dashboard-widget" count={1} />
              </div>
            }
          >
            <WeeklyProgressSection habits={habits} />
          </Suspense>
        </div>

        {/* Recommendations & Quick Actions - Lazy Loaded */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <Suspense
            fallback={
              <div className="lg:col-span-2">
                <SkeletonLoader variant="dashboard-widget" count={1} />
              </div>
            }
          >
            <RecommendationsSection />
          </Suspense>

          <Suspense
            fallback={
              <div className="lg:col-span-3">
                <SkeletonLoader variant="dashboard-widget" count={1} />
              </div>
            }
          >
            <QuickActionsSection
              onQuickJournal={handleQuickJournal}
              onGenerateWisdom={handleGenerateWisdomQuote}
              wisdomActionLoading={wisdomActionLoading}
            />
          </Suspense>
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
