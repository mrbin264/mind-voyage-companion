'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { HabitLog } from '@/types/habit'

interface LogEditFormProps {
  log: HabitLog
  habitTargetType: 'boolean' | 'count' | 'duration' | 'amount'
  habitUnit?: string
  onSave: (
    logId: string,
    updates: { notes?: string; value?: number }
  ) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function LogEditForm({
  log,
  habitTargetType,
  habitUnit,
  onSave,
  onCancel,
  loading = false,
}: LogEditFormProps) {
  const [notes, setNotes] = useState(log.notes || '')
  const [value, setValue] = useState<number | undefined>(log.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updates: { notes?: string; value?: number } = {}

    // Only include changed fields
    if (notes !== (log.notes || '')) {
      updates.notes = notes
    }

    if (habitTargetType !== 'boolean' && value !== log.value) {
      updates.value = value
    }

    await onSave(log._id as string, updates)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Notes Field */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any notes about this completion..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Value Field (for counter/duration habits) */}
      {habitTargetType !== 'boolean' && (
        <div>
          <label
            htmlFor="value"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Value {habitUnit && `(${habitUnit})`}
          </label>
          <input
            type="number"
            id="value"
            value={value ?? ''}
            onChange={e =>
              setValue(e.target.value ? parseFloat(e.target.value) : undefined)
            }
            min="0"
            step={habitTargetType === 'duration' ? '1' : '0.1'}
            placeholder="Enter value..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-700 hover:border-gray-600"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
