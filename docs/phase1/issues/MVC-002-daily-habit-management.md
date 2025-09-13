# [MVC-002] Daily habit management

**Phase**: 1 (MVP)  
**Priority**: Critical  
**GitHub Issue**: [#2](https://github.com/mrbin264/mind-voyage-companion/issues/2)

## User Story

**ID**: MVC-002  
**Description**: As a user, I want to create custom habits with flexible scheduling so that I can track behaviors that matter to me on my preferred schedule

## Acceptance Criteria

- [ ] User can create habits with title, frequency (daily/weekly/custom), and optional notes
- [ ] Custom scheduling allows selection of specific days of the week
- [ ] Habits display in an organized list with creation date and current streak
- [ ] User can edit habit details and archive habits no longer needed
- [ ] System prevents duplicate habit names within user account

## Priority

Critical - Phase 1 (MVP)

## Technical Notes

- Database schema for habits with flexible frequency options
- CRUD operations for habit management
- Validation for duplicate habit names per user
- Support for daily/weekly/custom scheduling patterns
- Efficient querying for habit lists and streaks

## Definition of Done

- [ ] Habit creation form with scheduling options
- [ ] Habit list view with sorting/filtering
- [ ] Edit and archive functionality
- [ ] Duplicate name validation
- [ ] Unit tests for habit management logic
- [ ] Performance optimization for habit queries

## Dependencies

- MVC-001 (User authentication) - Required for user association

## Estimated Effort

**Story Points**: 13  
**Time Estimate**: 2-3 weeks

## Technical Implementation Details

### Frontend Components

#### Habit Management Interface
```typescript
// app/(app)/habits/page.tsx - Server Component
export default async function HabitsPage() {
  const habits = await getHabits() // Server-side data fetching
  
  return (
    <div className="container mx-auto p-4">
      <HabitsHeader />
      <HabitsList initialHabits={habits} />
      <CreateHabitDialog />
    </div>
  )
}

// components/habits/HabitsList.tsx - Client Component with Optimistic UI
'use client'
interface HabitsListProps {
  initialHabits: Habit[]
}

export function HabitsList({ initialHabits }: HabitsListProps) {
  const [optimisticHabits, addOptimisticHabit] = useOptimistic(
    initialHabits,
    (state, newHabit: Habit) => [...state, newHabit]
  )
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {optimisticHabits.map(habit => (
        <HabitCard 
          key={habit.id} 
          habit={habit}
          onUpdate={addOptimisticHabit}
        />
      ))}
    </div>
  )
}
```

#### Habit Creation Form
```typescript
// components/habits/CreateHabitForm.tsx
export function CreateHabitForm() {
  const [frequency, setFrequency] = useState<Frequency>('DAILY')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  
  return (
    <Form action={createHabitAction}>
      <FormField name="title" label="Habit Title" required />
      <FormField name="description" label="Description (Optional)" />
      
      {/* Frequency Selection with Compound Component Pattern */}
      <FrequencySelector value={frequency} onChange={setFrequency}>
        <FrequencySelector.Option value="DAILY">
          Daily
        </FrequencySelector.Option>
        <FrequencySelector.Option value="WEEKLY">
          Weekly
        </FrequencySelector.Option>
        <FrequencySelector.Option value="CUSTOM">
          Custom Schedule
        </FrequencySelector.Option>
      </FrequencySelector>
      
      {frequency === 'CUSTOM' && (
        <WeekdaySelector 
          selectedDays={selectedDays}
          onChange={setSelectedDays}
        />
      )}
      
      <FormSubmitButton>Create Habit</FormSubmitButton>
    </Form>
  )
}
```

#### Advanced Component Patterns
```typescript
// components/habits/HabitCard.tsx - Compound Component
export function HabitCard({ habit, onUpdate }: HabitCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <HabitCard.Header>
        <HabitCard.Title>{habit.title}</HabitCard.Title>
        <HabitCard.Actions habitId={habit.id} />
      </HabitCard.Header>
      
      <HabitCard.Body>
        <HabitCard.Streak value={habit.streak} />
        <HabitCard.Schedule frequency={habit.frequency} days={habit.daysOfWeek} />
      </HabitCard.Body>
      
      <HabitCard.Footer>
        <HabitCard.LastCompleted date={habit.lastCompleted} />
      </HabitCard.Footer>
    </Card>
  )
}

// Sorting and Filtering with URL State Management
// hooks/useHabitFilters.ts
export function useHabitFilters() {
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('streak'))
  const [filterBy, setFilterBy] = useQueryState('filter', parseAsString.withDefault('all'))
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))
  
  return {
    sortBy, setSortBy,
    filterBy, setFilterBy,
    search, setSearch
  }
}
```

### Backend API Endpoints
- `GET /api/habits` - List user's habits
- `POST /api/habits` - Create new habit
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Archive habit

### Database Schema
```sql
Habit {
  id           UUID      @id @default(uuid())
  userId       UUID      @relation(User)
  title        String
  description  String?
  frequency    Frequency @default(DAILY)
  daysOfWeek   Int[]     -- For custom scheduling
  streak       Int       @default(0)
  isArchived   Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

enum Frequency {
  DAILY
  WEEKLY
  CUSTOM
}
```

## Testing Strategy

- Unit tests for habit CRUD operations
- Integration tests for API endpoints
- Validation tests for duplicate names
- E2E tests for complete habit management flow
- Performance tests for large habit lists