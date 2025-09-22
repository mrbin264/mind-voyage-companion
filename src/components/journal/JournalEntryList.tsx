'use client'

import React from 'react'
import { Heart, Edit, Share, Eye } from 'lucide-react'
import type { JournalEntry } from '@/types/journal'
import { MOOD_EMOJIS } from '@/types/journal'

interface JournalEntryCardProps {
  entry: JournalEntry
  onEdit?: (entry: JournalEntry) => void
  onToggleFavorite?: (entry: JournalEntry) => void
  onView?: (entry: JournalEntry) => void
  onShare?: (entry: JournalEntry) => void
  className?: string
}

function JournalEntryCard({
  entry,
  onEdit,
  onToggleFavorite,
  onView,
  onShare,
  className = '',
}: JournalEntryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (dateStr === todayStr) return 'Today'
    if (dateStr === yesterdayStr) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    })
  }

  const getPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  return (
    <div
      className={`bg-zinc-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-200 flex items-center gap-2">
            {entry.title ? (
              <>
                <span>{formatDate(entry.date)}</span>
                <span className="text-gray-500">•</span>
                <span className="text-base font-medium">{entry.title}</span>
              </>
            ) : (
              `${formatDate(entry.date)} • ${new Date(
                entry.createdAt
              ).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}`
            )}
          </h4>
        </div>
        {entry.mood && (
          <span className="text-2xl ml-4" title={`Mood: ${entry.mood}/5`}>
            {MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]}
          </span>
        )}
      </div>

      {/* Content preview */}
      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
        &ldquo;{getPreview(entry.content)}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-700 pt-4">
        {/* Stats and tags */}
        <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
          <span>{entry.wordCount} words</span>
          <span>•</span>
          <span>{entry.readingTime} min read</span>
          {entry.tags && entry.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex flex-wrap gap-1">
                {entry.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-blue-400">
                    #{tag}
                  </span>
                ))}
                {entry.tags.length > 3 && (
                  <span className="text-gray-500">
                    +{entry.tags.length - 3}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(entry)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              Read Full Entry
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(entry)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(entry)}
              className={`text-xs font-semibold transition-colors flex items-center gap-1 ${
                entry.favorite
                  ? 'text-pink-400 hover:text-pink-300'
                  : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Heart
                className={`w-3 h-3 ${entry.favorite ? 'fill-current' : ''}`}
              />
              {entry.favorite ? 'Favorited' : 'Favorite'}
            </button>
          )}

          {onShare && (
            <button
              onClick={() => onShare(entry)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <Share className="w-3 h-3" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface JournalEntryListProps {
  entries: JournalEntry[]
  onEdit?: (entry: JournalEntry) => void
  onToggleFavorite?: (entry: JournalEntry) => void
  onView?: (entry: JournalEntry) => void
  onShare?: (entry: JournalEntry) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  className?: string
}

export default function JournalEntryList({
  entries,
  onEdit,
  onToggleFavorite,
  onView,
  onShare,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className = '',
}: JournalEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          No journal entries yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start your journaling journey by writing your first entry.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Write Your First Entry
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {entries.map(entry => (
        <JournalEntryCard
          key={entry._id}
          entry={entry}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
          onView={onView}
          onShare={onShare}
        />
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More Entries...'}
          </button>
        </div>
      )}
    </div>
  )
}
