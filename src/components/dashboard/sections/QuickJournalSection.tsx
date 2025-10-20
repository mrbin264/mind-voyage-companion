'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface QuickJournalSectionProps {
  selectedMood: string
  moods: string[]
  journalContent: string
  journalSaving: boolean
  journalSaved: boolean
  journalError: string | null
  onMoodSelect: (mood: string) => void
  onContentChange: (content: string) => void
  onSaveEntry: () => Promise<void>
}

export default function QuickJournalSection({
  selectedMood,
  moods,
  journalContent,
  journalSaving,
  journalSaved,
  journalError,
  onMoodSelect,
  onContentChange,
  onSaveEntry,
}: QuickJournalSectionProps) {
  return (
    <WidgetCard className="p-6 lg:col-span-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h3 className="font-bold text-lg text-gray-100">
          📝 Quick Journal Entry
        </h3>
        <div className="text-xs text-gray-500 whitespace-nowrap">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
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
            onClick={() => onMoodSelect(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      {journalSaved && (
        <div className="mb-3 p-2 bg-green-600/20 border border-green-600/30 rounded-lg text-green-300 text-sm flex items-center gap-2">
          ✅ Journal entry saved successfully! Your thoughts have been recorded.
        </div>
      )}
      {journalError && (
        <div className="mb-3 p-2 bg-red-600/20 border border-red-600/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
          ❌ {journalError}
        </div>
      )}
      <textarea
        value={journalContent}
        onChange={e => onContentChange(e.target.value)}
        placeholder="How are you feeling? What happened today? Any thoughts or reflections..."
        maxLength={5000}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-500"
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="text-xs bg-gray-700/80 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">
            🔒 Private
          </button>
          <span className="text-xs text-gray-500">
            {journalContent.length}/5000
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/journal"
            className="text-xs text-blue-400 hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
          <Button
            onClick={onSaveEntry}
            disabled={journalSaving || !journalContent.trim()}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 disabled:opacity-50 flex-1 sm:flex-initial"
          >
            {journalSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                💾 <span className="hidden sm:inline">Save Entry</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </WidgetCard>
  )
}
