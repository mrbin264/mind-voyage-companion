'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Save, Lock } from 'lucide-react'
import MoodSelector from './MoodSelector'
import type { JournalEntry } from '@/types/journal'

interface JournalEntryFormProps {
  entry?: JournalEntry
  onSave: (entryData: Partial<JournalEntry>) => Promise<void>
  onCancel?: () => void
  isEditing?: boolean
  className?: string
}

export default function JournalEntryForm({
  entry,
  onSave,
  onCancel,
  isEditing = false,
  className = '',
}: JournalEntryFormProps) {
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [mood, setMood] = useState<number | undefined>(entry?.mood)
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  // Update word count and reading time
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
    setWordCount(words.length)
    setReadingTime(Math.max(1, Math.ceil(words.length / 200)))
  }, [content])

  // Adjust textarea height when content changes
  useEffect(() => {
    adjustTextareaHeight()
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 20) // Max 20 tags

      await onSave({
        title: title.trim() || undefined,
        content: content.trim(),
        mood,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      })
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with mood selector and actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <MoodSelector selectedMood={mood} onMoodChange={setMood} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Privacy
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            form="journal-form"
            disabled={!content.trim() || isSubmitting}
            className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main form */}
      <form id="journal-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Optional title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Entry title (optional)"
            className="w-full bg-transparent border-0 border-b border-gray-700 text-lg font-medium text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors px-0 py-2"
            maxLength={200}
          />
        </div>

        {/* Main content */}
        <div className="bg-zinc-900 border border-gray-700 rounded-xl">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing here..."
            className="w-full h-96 min-h-96 p-6 bg-transparent border-0 text-gray-300 leading-relaxed placeholder-gray-500 focus:outline-none resize-none"
            maxLength={50000}
          />

          {/* Stats bar */}
          <div className="border-t border-gray-700 px-6 py-3 flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <span>{wordCount} words</span>
              <span>{readingTime} min read</span>
              <span>{content.length}/50,000 chars</span>
            </div>
            <div className="text-xs">Auto-saved • Private</div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Tags (optional)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="gratitude, habits, reflection..."
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate tags with commas. Maximum 20 tags.
          </p>
        </div>
      </form>
    </div>
  )
}
