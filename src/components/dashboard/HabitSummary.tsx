import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { HabitSummary } from '@/types/habit'
import {
  Target,
  Calendar,
  Flame,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface HabitSummaryCardsProps {
  summary: HabitSummary
  loading?: boolean
}

export function HabitSummaryCards({
  summary,
  loading = false,
}: HabitSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
              <div>
                <div className="w-20 h-4 bg-muted rounded mb-1"></div>
                <div className="w-8 h-6 bg-muted rounded mb-1"></div>
                <div className="w-16 h-3 bg-muted rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const todayProgress =
    summary.totalCompletedToday > 0
      ? (summary.completedToday / summary.totalCompletedToday) * 100
      : 0

  const weeklyProgress =
    summary.weeklyTotal > 0
      ? (summary.weeklyCompletions / summary.weeklyTotal) * 100
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              Today&apos;s Progress
            </h3>
            <p className="text-2xl font-bold text-primary">
              {summary.completedToday}/{summary.totalCompletedToday}
            </p>
            <p className="text-sm text-muted-foreground">habits completed</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={todayProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(todayProgress)}% of today&apos;s habits
          </p>
        </div>
      </Card>

      {/* Current Streak */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Current Streak</h3>
            <p className="text-2xl font-bold text-orange-600">
              {summary.longestCurrentStreak.streakCount}
            </p>
            <p className="text-sm text-muted-foreground">days in a row</p>
          </div>
        </div>
        {summary.longestCurrentStreak.habitTitle && (
          <div className="mt-4">
            <Badge variant="outline" className="text-xs">
              {summary.longestCurrentStreak.habitTitle}
            </Badge>
          </div>
        )}
      </Card>

      {/* Active Habits */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success-100 rounded-lg">
            <Target className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Active Habits</h3>
            <p className="text-2xl font-bold text-success-600">
              {summary.activeHabits}
            </p>
            <p className="text-sm text-muted-foreground">habits tracking</p>
          </div>
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-secondary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Weekly Progress</h3>
            <p className="text-2xl font-bold text-secondary-600">
              {summary.weeklyCompletions}/{summary.weeklyTotal}
            </p>
            <p className="text-sm text-muted-foreground">
              completions this week
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(weeklyProgress)}% weekly completion
          </p>
        </div>
      </Card>
    </div>
  )
}

interface TodaysFocusCardProps {
  summary: HabitSummary
  loading?: boolean
}

export function TodaysFocusCard({
  summary,
  loading = false,
}: TodaysFocusCardProps) {
  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="w-24 h-5 bg-muted rounded"></div>
        </div>
        <div className="w-full h-2 bg-muted rounded mb-2"></div>
        <div className="w-32 h-4 bg-muted rounded"></div>
      </Card>
    )
  }

  const todayProgress =
    summary.totalCompletedToday > 0
      ? (summary.completedToday / summary.totalCompletedToday) * 100
      : 0

  const remainingHabits = summary.totalCompletedToday - summary.completedToday

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
        🎯 Today&apos;s Focus
      </h3>
      <p className="text-muted-foreground mb-4">
        {remainingHabits > 0
          ? `Complete ${remainingHabits} more ${remainingHabits === 1 ? 'habit' : 'habits'} to maintain your momentum.`
          : summary.totalCompletedToday > 0
            ? 'All habits completed for today! Great job! 🎉'
            : 'No habits scheduled for today.'}
      </p>
      {summary.totalCompletedToday > 0 && (
        <>
          <p className="text-sm font-semibold text-muted-foreground mb-2">
            Progress: {summary.completedToday}/{summary.totalCompletedToday}
          </p>
          <div className="mb-4">
            <Progress value={todayProgress} className="h-3" />
          </div>
        </>
      )}
    </Card>
  )
}
