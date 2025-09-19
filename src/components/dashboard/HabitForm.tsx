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
  '📚', '💧', '🏃', '🧘', '💤', '💪', '🎯','✍️', '🎨', '🎵', '📝'
]

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow/Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
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
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="habit-title" className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="habit-title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="e.g., Morning Pages, Drink Water, Exercise"
                className={`w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="habit-description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="habit-description"
                rows={3}
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Optional description of your habit"
                className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
            </div>

            {/* Emoji & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Emoji</label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => updateFormData({ emoji })}
                      className={`text-2xl p-2 rounded-md transition-colors ${
                        formData.emoji === emoji 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700/50 hover:bg-gray-600/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => updateFormData({ emoji: e.target.value })}
                  placeholder="Or type custom emoji"
                  className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateFormData({ color })}
                      className={`w-full h-10 rounded-md border-2 transition-all ${
                        formData.color === color 
                          ? 'border-white border-2' 
                          : 'border-transparent hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => updateFormData({ color: e.target.value })}
                  className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Frequency
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateFormData({ frequency: { type: 'daily' } })}
                  className={`flex-1 text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.frequency.type === 'daily'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ frequency: { type: 'weekly', daysOfWeek: [] } })}
                  className={`flex-1 text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.frequency.type === 'weekly'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ frequency: { type: 'custom', daysOfWeek: [] } })}
                  className={`flex-1 text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.frequency.type === 'custom'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Custom
                </button>
              </div>

              {(formData.frequency.type === 'weekly' || formData.frequency.type === 'custom') && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Select Days
                  </label>
                  <div className="flex gap-1">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDayOfWeek(day.value)}
                        className={`flex-1 text-sm font-semibold py-2 px-2 rounded-lg border transition-all ${
                          formData.frequency.daysOfWeek?.includes(day.value)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.frequency && (
                    <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
                  )}
                </div>
              )}
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Target
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateFormData({ target: { type: 'boolean' } })}
                  className={`text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.target.type === 'boolean'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Yes/No
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ target: { type: 'count', value: 1, unit: 'times' } })}
                  className={`text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.target.type === 'count'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Count
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ target: { type: 'duration', value: 30, unit: 'minutes' } })}
                  className={`text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.target.type === 'duration'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ target: { type: 'amount', value: 8, unit: 'glasses' } })}
                  className={`text-sm font-semibold py-2 px-4 rounded-lg border transition-all ${
                    formData.target.type === 'amount'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  Amount
                </button>
              </div>

              {formData.target.type !== 'boolean' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Target Value
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.target.value || ''}
                      onChange={(e) => updateFormData({ 
                        target: { ...formData.target, value: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="e.g., 8, 30, 5"
                      className={`w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.target ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.target && (
                      <p className="text-red-500 text-sm mt-1">{errors.target}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.target.unit || ''}
                      onChange={(e) => updateFormData({ 
                        target: { ...formData.target, unit: e.target.value }
                      })}
                      placeholder="e.g., glasses, minutes, pages"
                      className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="space-y-6 pt-4 border-t border-gray-700">
              <h3 className="text-md font-semibold text-gray-200">Additional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => updateFormData({ category: e.target.value })}
                    placeholder="e.g., Health, Work, Personal"
                    className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => updateFormData({ priority: e.target.value as any })}
                    className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-300 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  id="reminder-time"
                  value={formData.reminderTime}
                  onChange={(e) => updateFormData({ reminderTime: e.target.value })}
                  className={`w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.reminderTime ? 'border-red-500' : ''
                  }`}
                />
                {errors.reminderTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.reminderTime}</p>
                )}
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => updateFormData({ notes: e.target.value })}
                  placeholder="Additional notes or motivation for this habit"
                  className="w-full rounded-lg px-4 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-sm font-semibold text-gray-300 hover:bg-gray-700/50 py-2 px-5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : (habit ? 'Update Habit' : 'Create Habit')}
          </button>
        </div>
      </div>
    </div>
  )
}