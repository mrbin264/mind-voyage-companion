'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import JournalEntryForm from '@/components/journal/JournalEntryForm'
import JournalPromptsWidget from '@/components/journal/JournalPromptsWidget'
import JournalStatsWidget from '@/components/journal/JournalStatsWidget'
import type { JournalEntry, JournalStats } from '@/types/journal'

interface JournalPrompt {
  category: string
  text: string
  emoji: string
}

export default function NewJournalEntryPage() {
  const router = useRouter()
  const [stats, setStats] = useState<JournalStats | null>(null)
  const [currentDate, setCurrentDate] = useState('')
  const [prompts] = useState<JournalPrompt[]>([
    {
      category: 'Reflection',
      emoji: '💭',
      text: 'What small action today moved you closer to your goals?'
    },
    {
      category: 'Gratitude', 
      emoji: '🙏',
      text: 'What are you grateful for today?'
    },
    {
      category: 'Tomorrow',
      emoji: '🎯', 
      text: "What&apos;s your intention for tomorrow?"
    }
  ])

  // Mock user for now - in real app this would come from auth context
  const user = { name: 'User', email: 'user@example.com' }

  useEffect(() => {
    // Set current date
    const today = new Date()
    setCurrentDate(today.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))

    // Fetch stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/journal/stats')
      if (!response.ok) return
      
      const result = await response.json()
      setStats(result.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSave = async (entryData: Partial<JournalEntry>) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save entry')
      }

      const result = await response.json()
      
      // Success! Redirect to journal list or show success message
      router.push('/journal' as any)
    } catch (error) {
      console.error('Error saving journal entry:', error)
      // TODO: Show error message to user
      alert(`Failed to save entry: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCancel = () => {
    router.push('/journal' as any)
  }

  const handleUsePrompt = (prompt: JournalPrompt) => {
    // This would typically scroll to the form and insert the prompt
    // For now, we'll just scroll to the form
    const form = document.getElementById('journal-form')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <DashboardLayout user={user} showDefaultHeader={false}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">📝 Today&apos;s Journal Entry</h1>
            <p className="text-gray-400">{currentDate}</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Writing Area */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6">
              <JournalEntryForm
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>

            {/* AI Enhancement Promo (Pro Feature) */}
            <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-yellow-300">✨ AI Enhancement (Pro)</h3>
                <p className="text-sm text-gray-400 max-w-md mt-1">
                  Enhance your writing with AI-powered suggestions for grammar, style, and emotional expression.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm font-semibold text-gray-300 hover:text-gray-100 transition-colors">
                  Learn More
                </button>
                <button className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                  Enhance Writing
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Prompts & Stats */}
          <div className="space-y-6">
            {/* Prompts Widget */}
            <JournalPromptsWidget 
              prompts={prompts}
              onUsePrompt={handleUsePrompt}
            />

            {/* Stats Widget */}
            {stats && <JournalStatsWidget stats={stats} />}

            {/* Recent Entries Quick Links */}
            <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Recent Entries</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>
                  <button className="hover:text-gray-300 transition-colors text-left">
                    • Yesterday: &ldquo;Challenging but rewarding...&rdquo;
                  </button>
                </div>
                <div>
                  <button className="hover:text-gray-300 transition-colors text-left">
                    • Sep 20: &ldquo;Small wins add up...&rdquo;
                  </button>
                </div>
                <div>
                  <button className="hover:text-gray-300 transition-colors text-left">
                    • Sep 19: &ldquo;Feeling more focused...&rdquo;
                  </button>
                </div>
              </div>
              <button 
                onClick={() => router.push('/journal' as any)}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 mt-3 block transition-colors"
              >
                View All Entries
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}