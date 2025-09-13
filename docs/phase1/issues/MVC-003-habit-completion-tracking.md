# [MVC-003] Habit completion tracking

**Phase**: 1 (MVP)  
**Priority**: Critical  
**GitHub Issue**: [#3](https://github.com/mrbin264/mind-voyage-companion/issues/3)

## User Story

**ID**: MVC-003  
**Description**: As a user, I want to quickly mark habits as complete for any day so that I can maintain accurate tracking and see my progress streaks

## Acceptance Criteria

- [ ] One-click habit completion for current day with immediate visual feedback
- [ ] Ability to mark habits complete for previous days within reasonable time window
- [ ] Streak calculation automatically updates based on habit frequency and completion
- [ ] Visual indicators clearly show completed vs. incomplete habits
- [ ] Habit logs are permanently stored for historical analysis

## Priority

Critical - Phase 1 (MVP)

## Technical Notes

- HabitLog table for tracking completions
- Streak calculation algorithm based on frequency rules
- Optimistic UI updates with fallback on error
- Historical logging for analytics
- Efficient queries for streak calculation

## Definition of Done

- [ ] One-click completion interface
- [ ] Streak calculation logic implemented
- [ ] Visual feedback for completion states
- [ ] Historical completion tracking
- [ ] Performance optimization for real-time updates
- [ ] Comprehensive testing of streak logic

## Dependencies

- MVC-002 (Habit management) - Required for habit existence
- MVC-001 (Authentication) - Required for user context

## Estimated Effort

**Story Points**: 21  
**Time Estimate**: 3-4 weeks

## Technical Implementation Details

### Frontend Components

#### Habit Completion Interface with Optimistic Updates
```typescript
// components/habits/HabitCompletionToggle.tsx
'use client'
interface HabitCompletionProps {
  habitId: string
  completed: boolean
  streak: number
  date?: string
}

export function HabitCompletionToggle({ 
  habitId, completed, streak, date = new Date().toISOString() 
}: HabitCompletionProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(completed)
  const [optimisticStreak, setOptimisticStreak] = useOptimistic(streak)
  
  const handleToggle = async () => {
    // Optimistic UI update
    startTransition(() => {
      setOptimisticCompleted(!optimisticCompleted)
      setOptimisticStreak(optimisticCompleted ? streak - 1 : streak + 1)
    })
    
    try {
      await toggleHabitCompletion(habitId, date, !optimisticCompleted)
    } catch (error) {
      // Revert on error
      toast.error('Failed to update habit. Please try again.')
    }
  }
  
  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={handleToggle}
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center",
          optimisticCompleted 
            ? "bg-green-500 border-green-500 text-white" 
            : "border-gray-300 hover:border-green-400"
        )}
        whileTap={{ scale: 0.95 }}
        animate={optimisticCompleted ? { scale: [1, 1.1, 1] } : {}}
      >
        <AnimatePresence>
          {optimisticCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <StreakCounter 
        value={optimisticStreak}
        animate={optimisticCompleted !== completed}
      />
    </div>
  )
}
```

#### Streak Visualization Components
```typescript
// components/habits/StreakVisualization.tsx
export function StreakVisualization({ habit, logs }: StreakVisualizationProps) {
  const streakData = useMemo(() => calculateStreakData(habit, logs), [habit, logs])
  
  return (
    <div className="space-y-4">
      {/* Current Streak Display */}
      <div className="text-center">
        <motion.div 
          className="text-3xl font-bold text-green-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          {streakData.current}
        </motion.div>
        <p className="text-sm text-gray-500">Current Streak</p>
      </div>
      
      {/* Mini Calendar View */}
      <HabitCalendar 
        habit={habit}
        logs={logs}
        onDateClick={(date) => handleDateCompletion(habit.id, date)}
        className="max-w-sm mx-auto"
      />
      
      {/* Progress Ring */}
      <CircularProgress 
        value={streakData.weeklyProgress}
        size={80}
        strokeWidth={6}
        className="mx-auto"
      />
    </div>
  )
}

// components/habits/HabitCalendar.tsx - Calendar heatmap component
export function HabitCalendar({ habit, logs, onDateClick }: HabitCalendarProps) {
  const calendarData = useHabitCalendarData(habit, logs)
  
  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {calendarData.map(({ date, completed, isToday, isInFuture }) => (
        <button
          key={date.toISOString()}
          onClick={() => !isInFuture && onDateClick(date)}
          disabled={isInFuture}
          className={cn(
            "aspect-square rounded-sm border transition-colors",
            completed ? "bg-green-500 border-green-600" : "bg-gray-100 border-gray-200",
            isToday && "ring-2 ring-blue-400",
            !isInFuture && "hover:bg-green-200 cursor-pointer",
            isInFuture && "opacity-50 cursor-not-allowed"
          )}
        >
          {date.getDate()}
        </button>
      ))}
    </div>
  )
}
```

#### Real-time Updates with React Query
```typescript
// hooks/useHabitCompletion.ts
export function useHabitCompletion(habitId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ date, completed }: { date: string; completed: boolean }) =>
      toggleHabitCompletion(habitId, date, completed),
    
    onMutate: async ({ date, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habit', habitId] })
      
      // Snapshot previous value
      const previousHabit = queryClient.getQueryData(['habit', habitId])
      
      // Optimistically update
      queryClient.setQueryData(['habit', habitId], (old: Habit) => ({
        ...old,
        streak: completed ? old.streak + 1 : old.streak - 1,
        logs: updateHabitLogs(old.logs, date, completed)
      }))
      
      return { previousHabit }
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousHabit) {
        queryClient.setQueryData(['habit', habitId], context.previousHabit)
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] })
    }
  })
}
```

### Backend API Endpoints
- `POST /api/habits/:id/logs` - Mark habit complete/incomplete
- `GET /api/habits/:id/logs` - Get habit completion history
- `GET /api/habits/:id/streak` - Get current streak data

### Database Schema
```sql
HabitLog {
  id       UUID     @id @default(uuid())
  habitId  UUID     @relation(Habit)
  userId   UUID     @relation(User)
  date     DateTime @db.Date
  value    Boolean  @default(true)
  note     String?
  createdAt DateTime @default(now())
  
  @@unique([habitId, date])
}
```

### Streak Calculation Algorithm
```typescript
function calculateStreak(habit: Habit, logs: HabitLog[]): number {
  // Implementation based on habit frequency and completion logs
  // Handles daily, weekly, and custom frequencies
  // Returns current consecutive completion count
}
```

## Testing Strategy

- Unit tests for streak calculation algorithm
- Integration tests for habit logging API
- E2E tests for completion flow
- Performance tests for optimistic UI updates
- Edge case testing for different frequencies and timezones