# [MVC-006] Progress dashboard

**Phase**: 1 (MVP)  
**Priority**: High  
**GitHub Issue**: [#6](https://github.com/mrbin264/mind-voyage-companion/issues/6)

## User Story

**ID**: MVC-006  
**Description**: As a user, I want to see a visual summary of my habit streaks and mood trends so that I can quickly understand my progress and patterns

## Acceptance Criteria

- [ ] Dashboard loads in under 300ms with cached data
- [ ] Streak tiles show current streak count and visual progress indicators
- [ ] Mood trend chart displays 7-day and 30-day patterns with clear visualization
- [ ] Empty states provide helpful guidance for new users with no data
- [ ] Dashboard updates in real-time when habits are marked complete

## Priority

High - Phase 1 (MVP)

## Technical Notes

- Dashboard component with performance optimization
- Chart library integration for mood trends (Chart.js or D3)
- Real-time updates using optimistic UI patterns
- Caching strategy for dashboard data
- Responsive design for mobile and desktop

## Definition of Done

- [ ] Dashboard layout with streak tiles
- [ ] Mood trend visualization (7/30 days)
- [ ] Real-time updates on habit completion
- [ ] Empty state handling for new users
- [ ] Performance meets <300ms load time target
- [ ] Responsive design implemented

## Dependencies

- MVC-003 (Habit completion) - Required for streak data
- MVC-004 (Journaling) - Required for mood data
- MVC-001 (Authentication) - Required for user context

## Estimated Effort

**Story Points**: 13  
**Time Estimate**: 2-3 weeks

## Technical Implementation Details

### Frontend Components
- Dashboard with grid layout
- StreakTile for each habit
- MoodTrendChart (line/area chart)
- EmptyState for new users
- LoadingSkeleton for better UX

### Backend API Endpoints
- `GET /api/dashboard` - Get dashboard summary data
- `GET /api/dashboard/streaks` - Get habit streak data
- `GET /api/dashboard/mood-trends` - Get mood trend data

### Data Aggregation
```typescript
interface DashboardData {
  streaks: {
    habitId: string;
    title: string;
    currentStreak: number;
    longestStreak: number;
    completedToday: boolean;
  }[];
  moodTrends: {
    date: string;
    averageMood: number;
    entryCount: number;
  }[];
  summary: {
    totalHabits: number;
    activeStreaks: number;
    journalEntries: number;
    averageMood: number;
  };
}
```

### Performance Optimizations
- Server-side caching for dashboard data
- Incremental static regeneration for streak calculations
- Optimistic UI updates for real-time feel
- Lazy loading for chart components

### Chart Visualizations
- Streak progress bars with color coding
- Mood trend line chart with smooth curves
- Mini calendars showing completion patterns
- Progress circles for habit completion rates

## Testing Strategy

- Performance tests to verify <300ms load time
- Unit tests for data aggregation logic
- Integration tests for dashboard API
- Visual regression tests for chart components
- E2E tests for real-time updates
- Responsive design tests across devices