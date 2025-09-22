'use client'

import React from 'react'
import { TrendingUp, Target, Clock, Heart } from 'lucide-react'
import type { JournalStats } from '@/types/journal'
import { MOOD_EMOJIS } from '@/types/journal'

interface JournalStatsProps {
  stats: JournalStats
  className?: string
}

export default function JournalStatsWidget({ stats, className = '' }: JournalStatsProps) {
  const getMostUsedTags = (tagFrequency: { [tag: string]: number }, limit = 3) => {
    return Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag)
  }

  const mostUsedTags = getMostUsedTags(stats.tagFrequency)
  const topMood = Object.entries(stats.moodDistribution)
    .sort(([, a], [, b]) => b - a)[0]

  return (
    <div className={`bg-zinc-900 border border-gray-700 rounded-xl p-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Writing Statistics</h3>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p className="text-2xl font-semibold text-gray-200">{stats.totalEntries}</p>
          <p className="text-xs text-gray-400">Entries</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-200">{stats.totalWords.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Words</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-200">~{stats.totalMinutesWritten}m</p>
          <p className="text-xs text-gray-400">Written</p>
        </div>
      </div>

      {/* Streak section */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold flex items-center justify-center gap-2">
          🔥 {stats.currentStreak} days
        </p>
        <p className="text-sm text-gray-400">Current Streak</p>
        {stats.longestStreak > stats.currentStreak && (
          <p className="text-xs text-gray-500 mt-1">
            Best: {stats.longestStreak} days
          </p>
        )}
      </div>

      {/* Additional stats */}
      <div className="space-y-3 border-t border-gray-700 pt-4">
        {/* Average stats */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Avg. words per entry
          </span>
          <span className="text-sm font-medium text-gray-200">
            {stats.averageWordCount}
          </span>
        </div>

        {stats.averageMood > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Average mood
            </span>
            <span className="text-sm font-medium text-gray-200 flex items-center gap-1">
              {MOOD_EMOJIS[Math.round(stats.averageMood) as keyof typeof MOOD_EMOJIS]} 
              {stats.averageMood.toFixed(1)}
            </span>
          </div>
        )}

        {stats.mostActiveTime && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Most active time
            </span>
            <span className="text-sm font-medium text-gray-200 capitalize">
              {stats.mostActiveTime}
            </span>
          </div>
        )}

        {/* Top mood */}
        {topMood && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Most common mood
            </span>
            <span className="text-sm font-medium text-gray-200 flex items-center gap-1">
              {MOOD_EMOJIS[parseInt(topMood[0]) as keyof typeof MOOD_EMOJIS]}
              {topMood[1]} times
            </span>
          </div>
        )}

        {/* Popular tags */}
        {mostUsedTags.length > 0 && (
          <div>
            <span className="text-sm text-gray-400 block mb-2">Popular tags:</span>
            <div className="flex flex-wrap gap-1">
              {mostUsedTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pro tip */}
      <div className="bg-gray-800/50 p-3 rounded-lg mt-4 text-sm">
        <p>
          <span className="font-semibold text-yellow-400">⭐ Pro Tip:</span>{' '}
          {stats.currentStreak === 0
            ? 'Start your journal streak today!'
            : stats.currentStreak < 7
            ? 'Keep going to build a strong habit!'
            : 'Amazing streak! Consistency is key to growth.'}
        </p>
      </div>
    </div>
  )
}