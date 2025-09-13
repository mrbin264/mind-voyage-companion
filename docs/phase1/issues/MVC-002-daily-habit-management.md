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
- HabitCreateForm with frequency selection
- HabitList with sorting/filtering options
- HabitEditModal for updates
- HabitCard displaying streak and details

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