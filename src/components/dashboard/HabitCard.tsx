import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { HabitProgress, Habit, HabitLog } from '@/types/habit'
import { getHabitDisplayStatus, getHabitProgressPercentage } from '@/lib/habit-utils'
import { 
  Clock, 
  Target, 
  Calendar, 
  Flame, 
  MoreVertical, 
  Play,
  Pause,
  CheckCircle,
  Circle,
  SkipForward 
} from 'lucide-react'

interface HabitCardProps {
  habitProgress: HabitProgress
  onComplete?: (habitId: string, value?: number) => void
  onSkip?: (habitId: string) => void
  onEdit?: (habitId: string) => void
  onViewDetails?: (habitId: string) => void
  compact?: boolean
  timezone?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 border-green-300 bg-green-50'
    case 'in-progress':
      return 'text-yellow-600 border-yellow-300 bg-yellow-50'
    case 'skipped':
      return 'text-gray-500 border-gray-300 bg-gray-50'
    default:
      return 'text-gray-600 border-gray-300 bg-gray-50'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'in-progress':
      return <Play className="h-4 w-4 text-yellow-600" />
    case 'skipped':
      return <SkipForward className="h-4 w-4 text-gray-500" />
    default:
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}

const formatTarget = (habit: Habit) => {
  switch (habit.target.type) {
    case 'boolean':
      return 'Complete'
    case 'count':
      return `${habit.target.value} ${habit.target.unit || 'times'}`
    case 'duration':
      return `${habit.target.value} ${habit.target.unit || 'minutes'}`
    case 'amount':
      return `${habit.target.value} ${habit.target.unit || 'units'}`
    default:
      return 'Complete'
  }
}

const formatProgress = (habit: Habit, todayLog?: HabitLog) => {
  if (habit.target.type === 'boolean') {
    return todayLog?.completed ? 'Completed' : 'Not started'
  }
  
  const current = todayLog?.value || 0
  const target = habit.target.value || 1
  return `${current}/${target} ${habit.target.unit || 'units'}`
}

export function HabitCard({ 
  habitProgress, 
  onComplete, 
  onSkip, 
  onEdit, 
  onViewDetails,
  compact = false 
}: HabitCardProps) {
  const { habit, todayLog, currentStreak, weeklyProgress } = habitProgress
  const status = getHabitDisplayStatus(habit, todayLog)
  const progressPercentage = getHabitProgressPercentage(habit, todayLog)

  const handleComplete = () => {
    if (habit.target.type === 'boolean') {
      onComplete?.(habit._id!, 1)
    } else {
      // For non-boolean habits, you might want to open a dialog to input the value
      const value = prompt(`Enter value for ${habit.title}:`)
      if (value && !isNaN(Number(value))) {
        onComplete?.(habit._id!, Number(value))
      }
    }
  }

  if (compact) {
    return (
      <Card className={`p-4 transition-all hover:shadow-md ${status === 'completed' ? 'border-l-4 border-l-green-500' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{habit.emoji || '📋'}</span>
            <div>
              <h4 className="font-semibold text-sm">{habit.title}</h4>
              <p className="text-xs text-muted-foreground">{formatProgress(habit, todayLog)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status !== 'completed' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleComplete}
                className="h-8 px-2"
              >
                {getStatusIcon(status)}
              </Button>
            )}
            {status === 'completed' && (
              <Badge variant="success" className="text-xs">
                ✓ Done
              </Badge>
            )}
          </div>
        </div>
        {habit.target.type !== 'boolean' && (
          <div className="mt-2">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className={`p-6 transition-all hover:shadow-md ${status === 'completed' ? 'border-l-4 border-l-green-500' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{habit.emoji || '📋'}</span>
          <div>
            <h3 className="font-bold text-lg">{habit.title}</h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {formatTarget(habit)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {habit.frequency.type === 'daily' ? 'Daily' : 
                 habit.frequency.type === 'weekly' ? `${habit.frequency.daysOfWeek?.length || 0} days/week` :
                 'Custom schedule'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentStreak > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {currentStreak} days
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(habit._id!)}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {formatProgress(habit, todayLog)}
          </span>
        </div>
        {habit.target.type !== 'boolean' && (
          <Progress value={progressPercentage} className="h-2 mb-2" />
        )}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">This Week</span>
          <span className="text-sm font-bold">{weeklyProgress.percentage}%</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const isCompleted = i < weeklyProgress.completed
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {weeklyProgress.completed}/{weeklyProgress.total} completed
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {status === 'completed' ? (
          <Button variant="success" className="flex-1" disabled>
            <CheckCircle className="h-4 w-4" />
            Completed
          </Button>
        ) : (
          <>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleComplete}
            >
              {status === 'in-progress' ? 'Complete' : 'Start'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onSkip?.(habit._id!)}
            >
              Skip
            </Button>
          </>
        )}
        <Button 
          variant="ghost" 
          onClick={() => onViewDetails?.(habit._id!)}
        >
          Details
        </Button>
      </div>
    </Card>
  )
}