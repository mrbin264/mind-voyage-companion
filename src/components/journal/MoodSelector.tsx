'use client'

import React from 'react'
import { MOOD_EMOJIS, MOOD_LABELS, type MoodValue } from '@/types/journal'

interface MoodSelectorProps {
  selectedMood?: number
  onMoodChange: (mood: number | undefined) => void
  className?: string
}

export default function MoodSelector({
  selectedMood,
  onMoodChange,
  className = ''
}: MoodSelectorProps) {
  const moods = [1, 2, 3, 4, 5] as const

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-300">Mood:</span>
      <div className="flex items-center mood-selector">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => onMoodChange(selectedMood === mood ? undefined : mood)}
            className={`text-2xl p-2 transition-transform hover:scale-110 rounded-full ${
              selectedMood === mood
                ? 'selected scale-125 bg-blue-500/30 ring-2 ring-blue-400'
                : 'hover:bg-gray-700/50'
            }`}
            title={MOOD_LABELS[mood as MoodValue]}
            aria-label={`Select mood: ${MOOD_LABELS[mood as MoodValue]}`}
          >
            {MOOD_EMOJIS[mood as MoodValue]}
          </button>
        ))}
      </div>
    </div>
  )
}