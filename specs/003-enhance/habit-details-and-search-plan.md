# Implementation Plan: Habit Details & Global Search

**Date:** November 6, 2025  
**Branch:** 003-enhance  
**Priority:** P2 (Post-MVP Enhancement)

---

## 1. Current State Analysis

### 1.1 Habit Details Feature

**Status:** Placeholder implementation exists

**Current Implementation:**

- "View Details" buttons exist in:
  - `HabitCard.tsx` (line 216-219)
  - `TodaysHabitsSection.tsx` (line 67)
  - `HabitOverviewWidget.tsx` (line 139)
- Handler `handleViewHabitDetails()` in `HabitsPageContent.tsx` (line 108-111)
- Currently only logs to console: `console.log('View habit details:', habitId)`

**Missing:**

- Dedicated habit details page/route: `/dashboard/habits/[id]`
- Habit detail view component
- Detailed statistics and history visualization
- Edit functionality from detail view

### 1.2 Global Search Feature

**Status:** Placeholder with alert

**Current Implementation:**

- Search input in `DashboardLayout.tsx` (line 197-210)
- Shows alert on Enter: "🔍 Global search coming soon!"
- Empty search directory: `src/app/dashboard/search/`

**Missing:**

- Search page route: `/dashboard/search`
- Search API endpoint: `/api/search`
- Search results component
- Multi-entity search (habits, journal entries, wisdom quotes)
- Search filters and sorting

---

## 2. Feature Specifications

### 2.1 Habit Details Page (`/dashboard/habits/[id]`)

#### 2.1.1 Route Structure

```
src/app/dashboard/habits/[id]/page.tsx
```

#### 2.1.2 Page Sections

**A. Header Section**

- Habit title with emoji
- Frequency display (Daily, Weekly, Custom)
- Category badge
- Streak indicator (current/longest)
- Action buttons: Edit, Delete, Archive

**B. Progress Overview (Top Stats)**

- Current Streak: X days 🔥
- Longest Streak: Y days
- Completion Rate: Z% (last 30 days)
- Total Completions: N times
- Time Tracked: X hours (if applicable)

**C. Calendar View (Heatmap)**

- Monthly/yearly view toggle
- Visual heatmap showing completion history
- Color intensity based on consistency
- Hover tooltips with date + notes
- Navigate between months

**D. Completion Log (Timeline)**

- Chronological list of completions
- Date, time (if tracked)
- Notes/reflections for each completion
- Option to edit/delete individual logs
- Pagination (show 20 per page)

**E. Statistics Charts**

- Weekly completion trend (bar chart)
- Time of day analysis (if time tracked)
- Longest streaks timeline
- Monthly completion rate

**F. Insights & Patterns**

- Best completion days (Mon-Sun analysis)
- Average time to complete (if tracked)
- Consistency score
- Motivational insights

**G. Notes & Reflections**

- Quick notes section
- Recent reflections from completions
- Link to related journal entries

#### 2.1.3 Technical Requirements

**Data Fetching:**

```typescript
// API endpoint: GET /api/habits/[id]/details
interface HabitDetailsResponse {
  habit: Habit
  statistics: {
    currentStreak: number
    longestStreak: number
    completionRate: number
    totalCompletions: number
    totalTimeTracked?: number
  }
  completionLogs: HabitLog[]
  insights: {
    bestDays: string[]
    averageTime?: number
    consistencyScore: number
  }
}
```

**Components to Create:**

- `HabitDetailsHeader.tsx` - Title, actions, basic info
- `HabitStatsOverview.tsx` - Top-level statistics cards
- `HabitCalendarHeatmap.tsx` - Visual completion calendar
- `HabitCompletionLog.tsx` - Timeline of completions
- `HabitStatisticsCharts.tsx` - Progress charts
- `HabitInsights.tsx` - AI-generated insights

---

### 2.2 Global Search Feature (`/dashboard/search`)

#### 2.2.1 Route Structure

```
src/app/dashboard/search/page.tsx
```

#### 2.2.2 Search Capabilities

**Entities to Search:**

1. **Habits**
   - Search by: title, description, category
   - Show: title, streak, completion rate, last completed
2. **Journal Entries**
   - Search by: title, content, mood, tags
   - Show: title, date, mood, preview (first 100 chars)
3. **Wisdom Quotes**
   - Search by: quote text, author, category
   - Show: quote, author, category, favorite status

#### 2.2.3 Search UI Components

**A. Search Input**

- Large centered search bar
- Real-time search (debounced 300ms)
- Clear button
- Search suggestions dropdown

**B. Filters Panel (Sidebar)**

- Filter by entity type (Habits, Journal, Wisdom)
- Date range picker
- Category filters (per entity type)
- Sort options:
  - Relevance (default)
  - Date (newest/oldest)
  - Alphabetical

**C. Results Display**

- Tabbed interface (All, Habits, Journal, Wisdom)
- Result count badges
- Grid/List view toggle
- Pagination (20 results per page)

**D. Result Cards**
Each result card shows:

- Entity type badge
- Title/preview
- Metadata (date, category, etc.)
- Quick actions (View, Edit)
- Highlight matching search terms

**E. Empty States**

- No query entered: Show suggestions
- No results: "No results found for [query]"
- Search tips and examples

#### 2.2.4 Search API

**Endpoint:** `GET /api/search`

**Query Parameters:**

```typescript
interface SearchParams {
  q: string // Search query
  type?: 'habits' | 'journal' | 'wisdom' | 'all'
  category?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'relevance' | 'date' | 'alpha'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
```

**Response:**

```typescript
interface SearchResponse {
  query: string
  totalResults: number
  results: {
    habits: SearchResultItem[]
    journal: SearchResultItem[]
    wisdom: SearchResultItem[]
  }
  pagination: {
    page: number
    limit: number
    totalPages: number
  }
}

interface SearchResultItem {
  id: string
  type: 'habit' | 'journal' | 'wisdom'
  title: string
  preview: string
  matchedFields: string[]
  metadata: Record<string, any>
  score: number // Relevance score
}
```

---

## 3. Implementation Tasks

### Phase 1: Habit Details Page (Priority 1)

**T101: Create Habit Details Route & Page**

- [ ] Create `src/app/dashboard/habits/[id]/page.tsx`
- [ ] Implement server-side data fetching
- [ ] Add loading and error states
- [ ] Set up page metadata (title, description)

**T102: Build Habit Details API Endpoint**

- [ ] Create `src/app/api/habits/[id]/details/route.ts`
- [ ] Aggregate habit statistics
- [ ] Fetch completion logs with pagination
- [ ] Calculate insights and patterns
- [ ] Add error handling and validation

**T103: Create Habit Statistics Components**

- [ ] `HabitDetailsHeader.tsx` - Hero section with title, actions
- [ ] `HabitStatsOverview.tsx` - Stats cards (streak, rate, total)
- [ ] `HabitStatisticsCharts.tsx` - Trend charts
- [ ] Add responsive design for mobile/tablet/desktop

**T104: Build Habit Calendar Heatmap**

- [ ] `HabitCalendarHeatmap.tsx` - Visual calendar grid
- [ ] Month/year view toggle
- [ ] Color coding for completion intensity
- [ ] Tooltips with date details
- [ ] Navigation between months

**T105: Create Completion Log Timeline**

- [ ] `HabitCompletionLog.tsx` - Chronological list
- [ ] Display date, time, notes for each log
- [ ] Edit/delete functionality for individual logs
- [ ] Pagination controls
- [ ] Empty state for no completions

**T106: Build Insights & Patterns Section**

- [ ] `HabitInsights.tsx` - AI insights component
- [ ] Calculate best days of week
- [ ] Consistency score algorithm
- [ ] Pattern detection (time of day, etc.)
- [ ] Motivational messages

**T107: Wire Up Navigation**

- [ ] Update `handleViewHabitDetails` in `HabitsPageContent.tsx`
- [ ] Use Next.js router to navigate to `/dashboard/habits/[id]`
- [ ] Update all "View Details" button handlers
- [ ] Test navigation from all entry points

**T108: Add Edit/Delete Actions**

- [ ] Edit button opens HabitForm modal with habit data
- [ ] Delete button with confirmation dialog
- [ ] Archive functionality (soft delete)
- [ ] Success/error notifications

---

### Phase 2: Global Search Feature (Priority 2)

**T201: Create Search Page & Route**

- [ ] Create `src/app/dashboard/search/page.tsx`
- [ ] Implement search input with debouncing
- [ ] Add URL query parameter sync (`?q=query`)
- [ ] Loading states and skeletons

**T202: Build Search API Endpoint**

- [ ] Create `src/app/api/search/route.ts`
- [ ] Implement text search across Habit model
- [ ] Implement text search across Journal model
- [ ] Implement text search across Wisdom/Quote model
- [ ] MongoDB text indexes for performance
- [ ] Relevance scoring algorithm

**T203: Create Search UI Components**

- [ ] `SearchInput.tsx` - Large search bar with suggestions
- [ ] `SearchFilters.tsx` - Sidebar filters panel
- [ ] `SearchResults.tsx` - Tabbed results display
- [ ] `SearchResultCard.tsx` - Individual result card
- [ ] `SearchEmptyState.tsx` - No results/initial state

**T204: Implement Search Filters**

- [ ] Entity type filters (All, Habits, Journal, Wisdom)
- [ ] Date range picker integration
- [ ] Category/tag filters
- [ ] Sort dropdown (Relevance, Date, Alpha)
- [ ] Filter state management (URL params)

**T205: Add Search Highlighting**

- [ ] Highlight matching terms in results
- [ ] Text truncation with match context
- [ ] Bold matched keywords
- [ ] Show matched field names

**T206: Wire Up Global Search Input**

- [ ] Update `DashboardLayout.tsx` search input
- [ ] Remove alert, navigate to `/dashboard/search?q=query`
- [ ] Submit on Enter key
- [ ] Show search icon/button

**T207: Add Search Suggestions (Optional)**

- [ ] Recent searches (localStorage)
- [ ] Popular searches
- [ ] Autocomplete dropdown
- [ ] Keyboard navigation (arrow keys)

**T208: Pagination & Performance**

- [ ] Implement pagination controls
- [ ] Infinite scroll option
- [ ] Search result caching
- [ ] Optimize MongoDB queries with indexes

---

## 4. Data Models & Schemas

### 4.1 Habit Details Data

**Extend existing Habit type:**

```typescript
// No changes to Habit model needed
// Use existing HabitLog model for completion history
```

**New API Response Types:**

```typescript
// src/types/habit-details.ts
export interface HabitStatistics {
  currentStreak: number
  longestStreak: number
  completionRate: number // 0-100
  totalCompletions: number
  totalTimeTracked?: number // in minutes
  averageCompletionTime?: number
}

export interface HabitInsights {
  bestDays: DayOfWeek[]
  worstDays: DayOfWeek[]
  consistencyScore: number // 0-100
  averageTime?: number
  peakTimes?: number[] // hour of day (0-23)
  patterns: string[] // Descriptive patterns
}

export interface HabitDetails {
  habit: Habit
  statistics: HabitStatistics
  completionLogs: HabitLog[]
  insights: HabitInsights
  relatedJournalEntries?: number // Count
}
```

### 4.2 Search Data

**New Search Types:**

```typescript
// src/types/search.ts
export type SearchEntityType = 'habit' | 'journal' | 'wisdom' | 'all'
export type SearchSortBy = 'relevance' | 'date' | 'alpha'
export type SearchSortOrder = 'asc' | 'desc'

export interface SearchParams {
  q: string
  type?: SearchEntityType
  category?: string
  dateFrom?: Date
  dateTo?: Date
  sortBy?: SearchSortBy
  sortOrder?: SearchSortOrder
  page?: number
  limit?: number
}

export interface SearchResultItem {
  id: string
  type: 'habit' | 'journal' | 'wisdom'
  title: string
  preview: string
  matchedFields: string[]
  metadata: {
    date?: Date
    category?: string
    author?: string
    streak?: number
    mood?: string
    [key: string]: any
  }
  score: number
}

export interface SearchResults {
  habits: SearchResultItem[]
  journal: SearchResultItem[]
  wisdom: SearchResultItem[]
}

export interface SearchResponse {
  query: string
  totalResults: number
  results: SearchResults
  pagination: {
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}
```

---

## 5. Implementation Order

### Week 1: Habit Details (Core)

1. ✅ T101: Create route and page structure
2. ✅ T102: Build API endpoint
3. ✅ T103: Stats overview components
4. ✅ T107: Wire up navigation

### Week 2: Habit Details (Advanced)

5. ✅ T104: Calendar heatmap
6. ✅ T105: Completion log timeline
7. ✅ T106: Insights section
8. ✅ T108: Edit/delete actions

### Week 3: Global Search (Core)

9. ✅ T201: Create search page
10. ✅ T202: Build search API
11. ✅ T203: Search UI components
12. ✅ T206: Wire up global search input

### Week 4: Global Search (Advanced)

13. ✅ T204: Implement filters
14. ✅ T205: Search highlighting
15. ✅ T208: Pagination & performance
16. ✅ T207: Search suggestions (if time permits)

---

## 6. Success Criteria

### Habit Details

- [x] User can view detailed habit statistics
- [x] Visual calendar shows completion history
- [x] Completion logs are displayed chronologically
- [x] User can edit/delete habit from detail page
- [x] Page is responsive across all breakpoints
- [x] Performance: page loads in <1s

### Global Search

- [x] User can search across habits, journal, wisdom
- [x] Results are relevant and well-formatted
- [x] Filters work correctly
- [x] Search is fast (<500ms for typical queries)
- [x] Matching terms are highlighted
- [x] Navigation from search input works seamlessly

---

## 7. Testing Requirements

### Unit Tests

- [ ] Habit statistics calculation functions
- [ ] Search query parsing and filtering
- [ ] Result ranking/scoring algorithm

### Integration Tests

- [ ] Habit details API endpoint
- [ ] Search API endpoint with various queries
- [ ] Navigation flows

### E2E Tests

- [ ] View habit details from habits page
- [ ] Search and navigate to result
- [ ] Filter search results
- [ ] Edit habit from detail page

---

## 8. Performance Considerations

### Database Optimization

- Create text indexes on Habit.title, Habit.description
- Create text indexes on Journal.title, Journal.content
- Create indexes on date fields for range queries
- Optimize aggregation pipelines

### Frontend Optimization

- Debounce search input (300ms)
- Cache search results (React Query)
- Lazy load completion logs (pagination)
- Optimize calendar heatmap rendering

### API Optimization

- Limit search results per query (20-50)
- Implement cursor-based pagination
- Add rate limiting on search endpoint
- Cache popular searches

---

## 9. Future Enhancements (Post-Implementation)

### Habit Details

- Export habit data (CSV, PDF)
- Share habit progress (public link)
- Compare with other habits
- Set goals and milestones
- Habit templates/recommendations

### Global Search

- Advanced search operators (AND, OR, NOT)
- Saved searches
- Search history
- Voice search
- Search analytics

---

**Status:** Ready to begin implementation  
**Next Step:** Start with T101 - Create Habit Details Route & Page
