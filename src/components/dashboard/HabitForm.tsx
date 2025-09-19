import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { CreateHabitRequest, HabitFrequency, HabitTarget, Habit } from '@/types/habit'
import { X, Calendar, Target, Clock, Tag, Palette } from 'lucide-react'

interface HabitFormProps {
  habit?: Habit // For editing existing habit
  onSubmit: (habit: CreateHabitRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

const COMMON_EMOJIS = [
  '📚', '💧', '🏃', '🧘', '💤', '🥗', '💪', '🎯',
  '✍️', '🎨', '🎵', '📱', '🌅', '🌙', '☕', '📝'
]

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#EC4899', // Pink
]

export function HabitForm({ habit, onSubmit, onCancel, loading = false }: HabitFormProps) {
  const [formData, setFormData] = useState<CreateHabitRequest>({
    title: habit?.title || '',
    description: habit?.description || '',
    emoji: habit?.emoji || '',
    category: habit?.category || '',
    frequency: habit?.frequency || { type: 'daily' },
    target: habit?.target || { type: 'boolean' },
    color: habit?.color || '#3B82F6',
    priority: habit?.priority || 'medium',
    reminderTime: habit?.reminderTime || '',
    notes: habit?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.frequency.type === 'weekly' || formData.frequency.type === 'custom') {
      if (!formData.frequency.daysOfWeek || formData.frequency.daysOfWeek.length === 0) {
        newErrors.frequency = 'Please select at least one day'
      }
    }

    if (['count', 'duration', 'amount'].includes(formData.target.type) && !formData.target.value) {
      newErrors.target = 'Target value is required for this type'
    }

    if (formData.reminderTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.reminderTime)) {
      newErrors.reminderTime = 'Please enter time in HH:MM format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const updateFormData = (updates: Partial<CreateHabitRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear related errors
    const newErrors = { ...errors }
    Object.keys(updates).forEach(key => {
      delete newErrors[key]
    })
    setErrors(newErrors)
  }

  const toggleDayOfWeek = (day: number) => {
    const current = formData.frequency.daysOfWeek || []
    const updated = current.includes(day) 
      ? current.filter(d => d !== day)
      : [...current, day].sort()
    
    updateFormData({
      frequency: { ...formData.frequency, daysOfWeek: updated }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {habit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g., Morning Pages, Drink Water, Exercise"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Optional description of your habit"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`p-2 rounded-lg border hover:bg-gray-50 ${
                          formData.emoji === emoji ? 'border-primary bg-primary/10' : 'border-gray-300'
                        }`}
                        onClick={() => updateFormData({ emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <Input
                    value={formData.emoji}
                    onChange={(e) => updateFormData({ emoji: e.target.value })}
                    placeholder="Or type custom emoji"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-full h-10 rounded-lg border-2 ${
                          formData.color === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateFormData({ color })}
                      />
                    ))}
                  </div>
                  <Input
                    value={formData.color}
                    onChange={(e) => updateFormData({ color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Frequency
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.frequency.type === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ frequency: { type: 'daily' } })}
                  >
                    Daily
                  </Button>
                  <Button
                    type="button"
                    variant={formData.frequency.type === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ frequency: { type: 'weekly', daysOfWeek: [] } })}
                  >
                    Weekly
                  </Button>
                  <Button
                    type="button"
                    variant={formData.frequency.type === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ frequency: { type: 'custom', daysOfWeek: [] } })}
                  >
                    Custom
                  </Button>
                </div>

                {(formData.frequency.type === 'weekly' || formData.frequency.type === 'custom') && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Days
                    </label>
                    <div className="flex gap-1">
                      {DAYS_OF_WEEK.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={formData.frequency.daysOfWeek?.includes(day.value) ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleDayOfWeek(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                    {errors.frequency && (
                      <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Target */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.target.type === 'boolean' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ target: { type: 'boolean' } })}
                  >
                    Yes/No
                  </Button>
                  <Button
                    type="button"
                    variant={formData.target.type === 'count' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ target: { type: 'count', value: 1, unit: 'times' } })}
                  >
                    Count
                  </Button>
                  <Button
                    type="button"
                    variant={formData.target.type === 'duration' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ target: { type: 'duration', value: 30, unit: 'minutes' } })}
                  >
                    Duration
                  </Button>
                  <Button
                    type="button"
                    variant={formData.target.type === 'amount' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ target: { type: 'amount', value: 8, unit: 'glasses' } })}
                  >
                    Amount
                  </Button>
                </div>

                {formData.target.type !== 'boolean' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Target Value
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.target.value || ''}
                        onChange={(e) => updateFormData({ 
                          target: { ...formData.target, value: parseInt(e.target.value) || 0 }
                        })}
                        placeholder="e.g., 8, 30, 5"
                        className={errors.target ? 'border-red-500' : ''}
                      />
                      {errors.target && (
                        <p className="text-red-500 text-sm mt-1">{errors.target}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Unit
                      </label>
                      <Input
                        value={formData.target.unit || ''}
                        onChange={(e) => updateFormData({ 
                          target: { ...formData.target, unit: e.target.value }
                        })}
                        placeholder="e.g., glasses, minutes, pages"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Additional Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => updateFormData({ category: e.target.value })}
                    placeholder="e.g., Health, Work, Personal"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => updateFormData({ priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reminder Time
                </label>
                <Input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => updateFormData({ reminderTime: e.target.value })}
                  className={errors.reminderTime ? 'border-red-500' : ''}
                />
                {errors.reminderTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.reminderTime}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData({ notes: e.target.value })}
                  placeholder="Additional notes or motivation for this habit"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : (habit ? 'Update Habit' : 'Create Habit')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}