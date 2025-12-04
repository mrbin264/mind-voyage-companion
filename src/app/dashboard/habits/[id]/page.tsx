'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Edit,
  Trash2,
} from 'lucide-react'
import { HabitDetails } from '@/types/habit-details'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { HabitCalendarHeatmap } from '@/components/dashboard/HabitCalendarHeatmap'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { HabitForm } from '@/components/dashboard/HabitForm'
import { LogEditForm } from '@/components/dashboard/LogEditForm'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'
import type { CreateHabitRequest, HabitLog } from '@/types/habit'

export default function HabitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const habitId = params.id as string

  console.log('🔍 HabitDetailsPage mounted:', { params, habitId })

  const [habitDetails, setHabitDetails] = useState<HabitDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null)
  const [logUpdateLoading, setLogUpdateLoading] = useState(false)
  const [logsToShow, setLogsToShow] = useState(20) // Pagination

  useEffect(() => {
    const loadHabitDetails = async () => {
      console.log('📡 Starting to load habit details for:', habitId)

      if (!habitId) {
        console.error('❌ No habitId available')
        setError('Invalid habit ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const apiUrl = `/api/habits/${habitId}/details`
        console.log('📡 Fetching:', apiUrl)

        const response = await fetch(apiUrl)
        console.log('📡 Response status:', response.status, response.statusText)

        if (!response.ok) {
          throw new Error('Failed to fetch habit details')
        }

        const data = await response.json()
        console.log('✅ Habit details loaded:', data)
        setHabitDetails(data)
      } catch (err) {
        console.error('❌ Error fetching habit details:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadHabitDetails()
  }, [habitId])

  const fetchHabitDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/habits/${habitId}/details`)

      if (!response.ok) {
        throw new Error('Failed to fetch habit details')
      }

      const data = await response.json()
      setHabitDetails(data)
    } catch (err) {
      console.error('Error fetching habit details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleUpdateHabit = async (updatedHabit: CreateHabitRequest) => {
    try {
      setUpdateLoading(true)

      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHabit),
      })

      if (!response.ok) {
        throw new Error('Failed to update habit')
      }

      // Refresh habit details
      await fetchHabitDetails()
      setShowEditModal(false)
    } catch (err) {
      console.error('Error updating habit:', err)
      alert('Failed to update habit. Please try again.')
      throw err // Re-throw to let HabitForm handle the error state
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true)

      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete habit')
      }

      router.push('/dashboard/habits')
    } catch (err) {
      console.error('Error deleting habit:', err)
      alert('Failed to delete habit. Please try again.')
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleEditLog = (logId: string) => {
    setEditingLogId(logId)
  }

  const handleUpdateLog = async (
    logId: string,
    updates: { notes?: string; value?: number }
  ) => {
    try {
      setLogUpdateLoading(true)

      const response = await fetch(`/api/habits/${habitId}/logs/${logId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update log')
      }

      // Refresh habit details to show updated log
      await fetchHabitDetails()
      setEditingLogId(null)
    } catch (err) {
      console.error('Error updating log:', err)
      alert('Failed to update log. Please try again.')
    } finally {
      setLogUpdateLoading(false)
    }
  }

  const handleDeleteLog = async (logId: string) => {
    try {
      setLogUpdateLoading(true)

      const response = await fetch(`/api/habits/${habitId}/logs/${logId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete log')
      }

      // Refresh habit details
      await fetchHabitDetails()
      setDeletingLogId(null)
    } catch (err) {
      console.error('Error deleting log:', err)
      alert('Failed to delete log. Please try again.')
    } finally {
      setLogUpdateLoading(false)
    }
  }

  const handleLoadMore = () => {
    setLogsToShow(prev => prev + 20)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-8 bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-64 bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>

          <div className="h-96 bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !habitDetails) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Error Loading Habit
          </h1>
          <p className="text-gray-400 mb-6">{error || 'Habit not found'}</p>
          <Button
            onClick={() => router.push('/dashboard/habits')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Habits
          </Button>
        </div>
      </div>
    )
  }

  const { habit, statistics, completionLogs, insights } = habitDetails

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/habits')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Habits</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{habit.emoji || '📝'}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {habit.title}
                </h1>
                {habit.description && (
                  <p className="text-gray-400 mt-1">{habit.description}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-gray-700 hover:border-gray-600"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                className="border-red-900 text-red-500 hover:bg-red-950 hover:border-red-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm">
              {habit.frequency.type === 'daily'
                ? 'Daily'
                : habit.frequency.type === 'weekly'
                  ? 'Weekly'
                  : 'Custom'}
            </span>
            {habit.category && (
              <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm">
                {habit.category}
              </span>
            )}
            {habit.target.type === 'duration' && (
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time Tracked
              </span>
            )}
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <WidgetCard className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-white">
                  {statistics.currentStreak}
                </p>
                <p className="text-gray-500 text-xs mt-1">days 🔥</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </WidgetCard>

          <WidgetCard className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-white">
                  {statistics.longestStreak}
                </p>
                <p className="text-gray-500 text-xs mt-1">days</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </WidgetCard>

          <WidgetCard className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-white">
                  {statistics.completionRate.toFixed(0)}%
                </p>
                <p className="text-gray-500 text-xs mt-1">last 30 days</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </WidgetCard>

          <WidgetCard className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Completions</p>
                <p className="text-3xl font-bold text-white">
                  {statistics.totalCompletions}
                </p>
                <p className="text-gray-500 text-xs mt-1">times</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </WidgetCard>
        </div>

        {/* Insights Section */}
        {insights && (
          <WidgetCard title="Insights & Patterns" className="mb-8">
            <div className="space-y-6">
              {/* Consistency Score */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Consistency Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${insights.consistencyScore}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">
                    {insights.consistencyScore}%
                  </span>
                </div>
              </div>

              {/* Best/Worst Days Visualization */}
              {(insights.bestDays.length > 0 ||
                insights.worstDays.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Best Days Chart */}
                  {insights.bestDays.length > 0 && (
                    <div>
                      <BarChart
                        data={insights.bestDays.map(day => ({
                          label: day.substring(0, 3),
                          value: Math.round(Math.random() * 15 + 10), // TODO: Get actual completion counts
                          color: '#10b981', // Green
                        }))}
                        title="Best Days"
                        height={180}
                        showValues={true}
                      />
                    </div>
                  )}

                  {/* Worst Days Chart */}
                  {insights.worstDays.length > 0 && (
                    <div>
                      <BarChart
                        data={insights.worstDays.map(day => ({
                          label: day.substring(0, 3),
                          value: Math.round(Math.random() * 8 + 2), // TODO: Get actual completion counts
                          color: '#ef4444', // Red
                        }))}
                        title="Needs Improvement"
                        height={180}
                        showValues={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Consistency Trend (Last 7 Days) */}
              {completionLogs.length > 0 && (
                <div>
                  <LineChart
                    data={completionLogs
                      .slice(0, 14)
                      .reverse()
                      .map((log, index) => ({
                        label: new Date(log.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        }),
                        value: log.value || (log.completed ? 100 : 0),
                      }))}
                    title="Recent Activity Trend"
                    height={200}
                    color="#8b5cf6" // Purple
                    showPoints={true}
                    showGrid={true}
                  />
                </div>
              )}

              {/* Patterns */}
              {insights.patterns.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Patterns Detected
                  </p>
                  <div className="space-y-2">
                    {insights.patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivational Message */}
              {insights.motivationalMessage && (
                <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    {insights.motivationalMessage}
                  </p>
                </div>
              )}
            </div>
          </WidgetCard>
        )}

        {/* Calendar Heatmap */}
        <WidgetCard title="Activity Calendar" className="mb-8">
          <HabitCalendarHeatmap
            completionLogs={completionLogs}
            monthsToShow={3}
          />
        </WidgetCard>

        {/* Completion Log */}
        <WidgetCard title="Completion History" className="mb-8">
          {completionLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 text-6xl mb-4">📝</div>
              <p className="text-gray-400">No completions yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Complete this habit to start tracking your progress!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {completionLogs.slice(0, logsToShow).map((log, index) => {
                  const completedDate = log.completedAt
                    ? new Date(log.completedAt)
                    : new Date(log.date)
                  const isEditing = editingLogId === log._id
                  const isDeleting = deletingLogId === log._id

                  return (
                    <div
                      key={log._id || index}
                      className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {isEditing ? (
                        <LogEditForm
                          log={log}
                          habitTargetType={habit.target.type}
                          habitUnit={habit.target.unit}
                          onSave={handleUpdateLog}
                          onCancel={() => setEditingLogId(null)}
                          loading={logUpdateLoading}
                        />
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">
                                {completedDate.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {completedDate.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {log.notes && (
                              <p className="text-gray-400 text-sm">
                                {log.notes}
                              </p>
                            )}
                            {log.value !== undefined && (
                              <p className="text-gray-500 text-xs mt-1">
                                Value: {log.value}{' '}
                                {habit.target.unit || 'units'}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditLog(log._id as string)}
                              variant="outline"
                              size="sm"
                              className="border-gray-700 hover:border-gray-600 text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() =>
                                setDeletingLogId(log._id as string)
                              }
                              variant="outline"
                              size="sm"
                              className="border-red-900 text-red-500 hover:bg-red-950 hover:border-red-800 text-xs"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Load More Button */}
              {completionLogs.length > logsToShow && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="border-gray-700 hover:border-gray-600"
                  >
                    Load More ({completionLogs.length - logsToShow} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </WidgetCard>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Habit"
        size="lg"
      >
        {habitDetails && (
          <HabitForm
            habit={habitDetails.habit}
            onSubmit={handleUpdateHabit}
            onCancel={() => setShowEditModal(false)}
            loading={updateLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        title="Delete Habit?"
        message="This will permanently delete this habit and all its completion history. This action cannot be undone."
        confirmText="Delete Habit"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      {/* Delete Log Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingLogId}
        onConfirm={() => deletingLogId && handleDeleteLog(deletingLogId)}
        onCancel={() => setDeletingLogId(null)}
        title="Delete Log Entry?"
        message="This will permanently delete this completion entry. This action cannot be undone."
        confirmText="Delete Entry"
        cancelText="Cancel"
        variant="danger"
        loading={logUpdateLoading}
      />
    </div>
  )
}
