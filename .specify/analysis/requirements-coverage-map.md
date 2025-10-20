# Requirements → Implementation Coverage Map

**Analysis Date**: 2025-10-20  
**Project**: Mind Voyage Companion  
**PRD Version**: 1.0  
**Analyzer**: GitHub Copilot

---

## Executive Summary

| Metric                 | Count           | Percentage   |
| ---------------------- | --------------- | ------------ |
| **Total Requirements** | 12 user stories | 100%         |
| **Fully Covered**      | 7               | 58%          |
| **Partially Covered**  | 3               | 25%          |
| **Not Implemented**    | 2               | 17%          |
| **Orphan Endpoints**   | 5               | N/A          |
| **Critical Risks**     | 8               | P0: 3, P1: 5 |
| **Missing Tests**      | 11 user stories | 92%          |

### Health Status: 🟡 **MODERATE RISK**

**Key Findings**:

- ✅ Core MVP features (auth, habits, journal, wisdom) are implemented
- ⚠️ Pro features (AI, subscriptions, visualizations) missing or stubbed
- ❌ Critical gaps: Email verification, streak recovery, timezone handling
- ❌ Test coverage: Only 2 unit tests exist, no integration/e2e tests for features
- ⚠️ API contracts partially validated but missing edge case handling

---

## Coverage Map by Requirement

### ✅ MVC-001: User Registration and Authentication

**Status**: FULLY COVERED  
**Priority**: Critical  
**Implementation Score**: 90%

#### Implementation Files

- **API Route**: `src/app/api/auth/register/route.ts` (lines 1-104)
- **Validation Schema**: `src/lib/validation/schemas.ts` (lines 125-138)
- **User Model**: `src/lib/models/user.ts`
- **Auth Helpers**: `src/lib/auth-helpers.ts` (lines 20-73)
- **Security Middleware**: `src/lib/middleware/security.ts`

#### Acceptance Criteria Coverage

| Criterion                            | Status | Evidence                      |
| ------------------------------------ | ------ | ----------------------------- |
| Register with valid email/password   | ✅     | `register/route.ts:14-104`    |
| Email validation prevents duplicates | ✅     | `register/route.ts:31-36`     |
| Password requirements (8+ chars)     | ✅     | `schemas.ts:35-41`            |
| Confirmation email sent              | ⚠️     | Mentioned but NOT implemented |
| Immediate access after registration  | ✅     | Returns 201 with user data    |
| Password requirements communicated   | ✅     | Schema validation messages    |

#### Gaps Identified

- **P0-CRITICAL**: Email verification NOT implemented (acceptance criterion #3)
  - Code comment exists but no email sending logic
  - `verified: false` set but never checked on login
  - Missing `/api/auth/verify` endpoint
  - **Impact**: Security risk - unverified emails can access accounts

#### Tests Missing

- [ ] Unit: Password validation edge cases (7 chars, 129 chars, missing uppercase/lowercase/digit)
- [ ] Unit: Duplicate email registration attempt
- [ ] Integration: Full registration flow with database persistence
- [ ] Integration: Email verification token generation and validation
- [ ] E2E: User registration through UI form

---

### ✅ MVC-002: Daily Habit Management

**Status**: FULLY COVERED  
**Priority**: Critical  
**Implementation Score**: 95%

#### Implementation Files

- **API Routes**:
  - `src/app/api/habits/route.ts` (POST: lines 149-223, GET: lines 17-148)
  - `src/app/api/habits/[id]/route.ts` (PUT/DELETE)
- **Validation**: `src/lib/validation/schemas.ts` (lines 235-298)
- **Model**: `src/lib/models/habit.ts`
- **Hook**: `src/hooks/useHabits.ts` (lines 1-300+)
- **Types**: `src/types/habit.ts` (lines 1-124)
- **UI Components**:
  - `src/components/dashboard/HabitForm.tsx`
  - `src/components/dashboard/HabitsPageContent.tsx`

#### Acceptance Criteria Coverage

| Criterion                                  | Status | Evidence                                 |
| ------------------------------------------ | ------ | ---------------------------------------- |
| Create habits with title, frequency, notes | ✅     | `route.ts:149-223`, `schemas.ts:235-298` |
| Custom scheduling (specific days)          | ✅     | `HabitFrequency.daysOfWeek` in types     |
| Habits display with creation date/streak   | ✅     | `HabitProgress` type includes streaks    |
| Edit habit details                         | ✅     | PUT endpoint in `[id]/route.ts`          |
| Archive habits no longer needed            | ✅     | `status.archived` field supported        |
| Prevent duplicate habit names              | ⚠️     | NOT validated in API                     |

#### Gaps Identified

- **P1-HIGH**: Duplicate habit name validation missing
  - Schema allows duplicate titles for same user
  - **Fix**: Add unique index or check in POST handler
  - **File**: `src/app/api/habits/route.ts:160-170`

#### Tests Missing

- [ ] Unit: HabitFrequency validation (daily/weekly/custom)
- [ ] Unit: Custom days validation (invalid day numbers)
- [ ] Integration: Create habit → Verify in database
- [ ] Integration: Archive habit → Verify excluded from active list
- [ ] E2E: Complete habit creation flow through UI

---

### ✅ MVC-003: Habit Completion Tracking

**Status**: FULLY COVERED  
**Priority**: Critical  
**Implementation Score**: 85%

#### Implementation Files

- **API Route**: `src/app/api/habits/[id]/logs/route.ts`
- **Utilities**: `src/lib/habit-utils.ts` (streak calculation)
- **Model**: `src/lib/models/habit.ts` (HabitLog)
- **Hook**: `src/hooks/useHabits.ts` (completeHabit, skipHabit methods)

#### Acceptance Criteria Coverage

| Criterion                              | Status | Evidence                                |
| -------------------------------------- | ------ | --------------------------------------- |
| One-click completion for current day   | ✅     | `useHabits.ts:247-252`                  |
| Mark habits complete for previous days | ✅     | Logs accept any date                    |
| Streak calculation auto-updates        | ✅     | `habit-utils.ts:calculateHabitProgress` |
| Visual indicators for completed habits | ✅     | UI components show status               |
| Habit logs permanently stored          | ✅     | HabitLogModel persists to MongoDB       |

#### Gaps Identified

- **P1-HIGH**: No "reasonable time window" limit for backdating
  - Users can mark habits complete for any past date
  - **Risk**: Streak manipulation, data integrity issues
  - **Fix**: Add date range validation (e.g., max 7 days back)
  - **File**: `src/app/api/habits/[id]/logs/route.ts`

- **P2-MEDIUM**: Timezone handling not explicit
  - Date stored as string (YYYY-MM-DD) but timezone conversion unclear
  - **Risk**: Streak breaks when user travels across timezones
  - **Fix**: Store UTC timestamp + timezone, calculate streaks based on user's local date

#### Tests Missing

- [ ] Unit: Streak calculation for daily habits (consecutive days)
- [ ] Unit: Streak calculation for weekly habits (missing weeks)
- [ ] Unit: Backdating validation
- [ ] Integration: Complete habit → Verify streak increments
- [ ] Integration: Skip habit → Verify streak resets
- [ ] E2E: Complete habit through dashboard UI

---

### ✅ MVC-004: Personal Journaling

**Status**: FULLY COVERED  
**Priority**: Critical  
**Implementation Score**: 90%

#### Implementation Files

- **API Routes**:
  - `src/app/api/journal/route.ts` (POST/GET)
  - `src/app/api/journal/[id]/route.ts` (PUT/DELETE)
  - `src/app/api/journal/stats/route.ts`
- **Validation**: `src/lib/validation/schemas.ts:journalQuerySchema, createJournalEntrySchema`
- **Model**: `src/lib/models/journal.ts` (JournalEntryModel)
- **Types**: `src/types/journal.ts`
- **UI**: `src/components/journal/` directory

#### Acceptance Criteria Coverage

| Criterion                              | Status | Evidence                             |
| -------------------------------------- | ------ | ------------------------------------ |
| Rich text editor with basic formatting | ✅     | Content field accepts formatted text |
| Optional mood selection (1-5 scale)    | ✅     | `mood?: number` in schema            |
| Entries saved with timestamp/mood      | ✅     | `createdAt`, `mood` fields           |
| Search by date range or mood           | ✅     | `JournalSearchParams` type           |
| Content secure and private             | ✅     | `userId` filter enforced in queries  |

#### Gaps Identified

- **P2-MEDIUM**: One entry per day restriction may be too strict
  - Code enforces single entry per date: `journal/route.ts:115-121`
  - **Issue**: Users cannot write multiple entries in one day (morning reflection + evening notes)
  - **Recommendation**: Remove restriction or make it configurable

#### Tests Missing

- [ ] Unit: Mood value validation (1-5 range)
- [ ] Unit: Search with multiple filters (mood + date range + tags)
- [ ] Integration: Create journal entry → Search by mood → Verify returned
- [ ] Integration: Update entry → Verify changes persisted
- [ ] E2E: Journal entry creation with mood tracking

---

### ✅ MVC-005: Daily Stoic Content

**Status**: FULLY COVERED  
**Priority**: High  
**Implementation Score**: 75%

#### Implementation Files

- **API Route**: `src/app/api/wisdom/quotes/route.ts`
- **Model**: Hardcoded quotes array (lines 7-75)
- **Components**:
  - `src/components/dashboard/DashboardContent.tsx` (displays quotes)
  - `src/app/dashboard/wisdom/page.tsx`

#### Acceptance Criteria Coverage

| Criterion                             | Status | Evidence                                |
| ------------------------------------- | ------ | --------------------------------------- |
| Same quote per user per local date    | ⚠️     | Implemented but not truly deterministic |
| Content refreshes at local midnight   | ❌     | NOT implemented                         |
| Quotes from authenticated Stoic texts | ✅     | Marcus Aurelius, Epictetus included     |
| Reflection prompts available          | ⚠️     | Limited prompts, not comprehensive      |
| Content cached for offline            | ❌     | No caching strategy implemented         |

#### Gaps Identified

- **P1-HIGH**: Deterministic quote selection NOT properly implemented
  - Current: Random selection from array
  - **Required**: Seed-based selection using date + userId for consistency
  - **File**: `src/app/api/wisdom/quotes/route.ts:110-140`
  - **Fix**: `const seed = hashCode(userId + date); quotes[seed % quotes.length]`

- **P1-HIGH**: Midnight refresh logic missing
  - No timezone-aware date boundary detection
  - **Impact**: Quote doesn't refresh at user's midnight
  - **Fix**: Add client-side timer or server-side date comparison with timezone

- **P2-MEDIUM**: Quotes database is hardcoded
  - Only 10 quotes available
  - **Required**: "Curated daily quotes" implies larger collection
  - **Fix**: Move to MongoDB collection, expand to 365+ quotes

#### Tests Missing

- [ ] Unit: Deterministic quote selection (same input → same output)
- [ ] Unit: Date-based quote rotation
- [ ] Integration: Fetch quote at midnight boundary
- [ ] E2E: Verify quote changes after 24 hours

---

### ✅ MVC-006: Progress Dashboard

**Status**: FULLY COVERED  
**Priority**: High  
**Implementation Score**: 85%

#### Implementation Files

- **API Routes**:
  - `src/app/api/habits/summary/route.ts`
  - `src/app/api/analytics/route.ts`
- **Hook**: `src/hooks/useAnalytics.ts`
- **Components**:
  - `src/app/dashboard/page.tsx`
  - `src/components/dashboard/DashboardContent.tsx`
  - `src/components/dashboard/analytics/AnalyticsWidgets.tsx`

#### Acceptance Criteria Coverage

| Criterion                           | Status | Evidence                        |
| ----------------------------------- | ------ | ------------------------------- |
| Dashboard loads in <300ms (cached)  | ⚠️     | No performance measurement      |
| Streak tiles with visual indicators | ✅     | Implemented in dashboard UI     |
| Mood trend chart (7-day, 30-day)    | ✅     | Analytics page has mood charts  |
| Empty states for new users          | ✅     | UI shows guidance when no data  |
| Real-time updates on completion     | ✅     | Optimistic updates in useHabits |

#### Gaps Identified

- **P2-MEDIUM**: Performance requirement not validated
  - No monitoring for 300ms load time
  - **Fix**: Add performance.mark() and Application Insights tracking
  - **File**: `src/app/dashboard/page.tsx`

#### Tests Missing

- [ ] Unit: Summary calculation logic
- [ ] Integration: Complete habit → Verify dashboard updates
- [ ] Performance: Dashboard load time under 300ms
- [ ] E2E: Empty state for new user

---

### ✅ MVC-007: Account Settings and Preferences

**Status**: FULLY COVERED  
**Priority**: High  
**Implementation Score**: 90%

#### Implementation Files

- **API Route**: `src/app/api/settings/route.ts` (GET/PATCH)
- **Types**: `src/types/settings.ts`
- **Components**:
  - `src/app/dashboard/settings/page.tsx`
  - `src/components/dashboard/SettingsPageContent.tsx`
  - `src/components/dashboard/settings/ProfileForm.tsx`

#### Acceptance Criteria Coverage

| Criterion                            | Status | Evidence                               |
| ------------------------------------ | ------ | -------------------------------------- |
| Timezone selection updates features  | ✅     | User model has timezone field          |
| Language toggle (EN/VI)              | ⚠️     | Field exists, UI not fully implemented |
| Email preferences for weekly summary | ✅     | Preferences include email settings     |
| Profile information editable         | ✅     | ProfileForm component implemented      |
| Settings apply immediately           | ✅     | No restart required                    |

#### Gaps Identified

- **P2-MEDIUM**: Vietnamese (VI) language support incomplete
  - Language field exists but no i18n implementation
  - UI text is all English
  - **Required**: PRD specifies EN/VI support
  - **Fix**: Implement i18n with next-intl or similar

#### Tests Missing

- [ ] Unit: Timezone change affects date calculations
- [ ] Integration: Update settings → Verify persisted
- [ ] E2E: Settings form submission

---

### ❌ MVC-008: AI-Powered Journal Enhancement

**Status**: NOT IMPLEMENTED  
**Priority**: Medium (Pro Feature)  
**Implementation Score**: 5%

#### Implementation Files

- **Stub Only**: Mentions in UI text but no functional code
- **References**:
  - `src/components/auth/AuthLayout.tsx:53` (marketing text)
  - `src/components/landing/HeroSection.tsx:13` (feature list)

#### Acceptance Criteria Coverage

| Criterion                                 | Status | Evidence        |
| ----------------------------------------- | ------ | --------------- |
| Side-by-side editor (original + enhanced) | ❌     | NOT implemented |
| Translation preserves meaning             | ❌     | NOT implemented |
| Grammar/vocabulary improvements           | ❌     | NOT implemented |
| Bullet-point explanations                 | ❌     | NOT implemented |
| Usage quota tracking                      | ❌     | NOT implemented |
| Process completes in <5 seconds           | ❌     | NOT implemented |

#### Gaps Identified

- **P0-CRITICAL**: Entire feature missing
  - PRD marks as Priority: Medium but essential for Pro tier
  - No Azure OpenAI integration code found
  - No API endpoint at `/api/journal/enhance` or similar
  - **Required Files**:
    - `src/app/api/journal/enhance/route.ts`
    - `src/lib/ai/openai-client.ts`
    - `src/components/journal/EnhancementEditor.tsx`

#### Tests Needed

- [ ] Unit: OpenAI API request formatting
- [ ] Unit: Response parsing and error handling
- [ ] Unit: Quota validation and enforcement
- [ ] Integration: Enhancement request → Receive improved text
- [ ] E2E: Journal enhancement flow with real AI call

---

### ⚠️ MVC-009: Weekly AI Reflection Report

**Status**: PARTIALLY IMPLEMENTED  
**Priority**: Medium (Pro Feature)  
**Implementation Score**: 30%

#### Implementation Files

- **Stub Function**: `src/app/api/analytics/route.ts:400-540` (`generateAIInsights`)
- **Types**: `src/types/analytics.ts` (AI insights interface)
- **UI Component**: `src/components/dashboard/analytics/AnalyticsWidgets.tsx:252-310` (AIInsightsWidget)
- **Hook**: `src/hooks/useAnalytics.ts:308-315` (`useAIInsights`)

#### Acceptance Criteria Coverage

| Criterion                              | Status | Evidence                          |
| -------------------------------------- | ------ | --------------------------------- |
| Analyzes habits, moods, journal themes | ⚠️     | Stub function generates fake data |
| Three actionable suggestions           | ⚠️     | Hardcoded suggestions             |
| Available in-app                       | ✅     | UI component exists               |
| Optional email digest                  | ❌     | No email sending logic            |
| Historical reports accessible          | ❌     | No persistence of reports         |

#### Gaps Identified

- **P1-HIGH**: AI generation is mocked, not real
  - `generateAIInsights` returns hardcoded strings
  - No Azure OpenAI integration
  - **File**: `src/app/api/analytics/route.ts:400-540`
  - **Fix**: Implement real AI analysis using user's data

- **P1-HIGH**: Email delivery not implemented
  - Acceptance criterion requires "optional email digest"
  - No email service integration found
  - **Required**: Azure Communication Services or SendGrid integration

- **P2-MEDIUM**: Report history not stored
  - Generated insights are ephemeral
  - Users cannot compare week-over-week
  - **Fix**: Create WeeklyReport model, store in database

#### Tests Needed

- [ ] Unit: Data aggregation for weekly analysis
- [ ] Unit: AI prompt construction from user data
- [ ] Integration: Generate report → Store in database
- [ ] Integration: Email sending with report content
- [ ] E2E: View weekly report in dashboard

---

### ❌ MVC-010: Data Export and Account Management

**Status**: PARTIALLY IMPLEMENTED  
**Priority**: Medium (Pro Feature)  
**Implementation Score**: 40%

#### Implementation Files

- **Types**:
  - `src/types/analytics.ts:183` (export format type)
  - `src/types/settings.ts:165-171` (DataExportRequest)
- **Hook**: `src/hooks/useAnalytics.ts:158-192` (exportAnalytics method)
- **UI References**: Settings page mentions export

#### Acceptance Criteria Coverage

| Criterion                                 | Status | Evidence                            |
| ----------------------------------------- | ------ | ----------------------------------- |
| Export generates CSV and JSON             | ⚠️     | Types defined but no implementation |
| Secure and authenticated only             | ⚠️     | No endpoint exists to secure        |
| File generation completes promptly        | ❌     | NOT implemented                     |
| Includes habits, logs, journals, settings | ❌     | NOT implemented                     |
| Respects privacy settings and consent     | ❌     | NOT implemented                     |

#### Gaps Identified

- **P0-CRITICAL**: Export endpoint missing
  - Hook calls `/api/analytics/export` which doesn't exist
  - **Required**: `src/app/api/analytics/export/route.ts`
  - **Fix**: Implement POST endpoint to generate and return export file

- **P1-HIGH**: GDPR data export requirement
  - PRD mentions GDPR compliance
  - No account deletion endpoint found
  - **Required**: `/api/auth/delete-account` with cascade deletion

#### Tests Needed

- [ ] Unit: CSV formatting from user data
- [ ] Unit: JSON export structure validation
- [ ] Integration: Export includes all user data
- [ ] Integration: Account deletion cascades to all collections
- [ ] E2E: Request export → Download file

---

### ❌ MVC-011: Subscription Management

**Status**: NOT IMPLEMENTED  
**Priority**: Medium (Pro Feature)  
**Implementation Score**: 10%

#### Implementation Files

- **Types Only**: `src/types/settings.ts:125-150` (SubscriptionInfo interface)
- **UI Stubs**: Settings page has "Subscription & Billing" section
- **Placeholder Data**: `src/app/api/settings/route.ts:398-410` (getDefaultSubscriptionInfo)

#### Acceptance Criteria Coverage

| Criterion                            | Status | Evidence                                 |
| ------------------------------------ | ------ | ---------------------------------------- |
| Clear pricing and feature comparison | ⚠️     | Landing page mentions Pro but no pricing |
| Secure payment processing            | ❌     | No payment integration                   |
| Immediate Pro access on subscription | ❌     | No subscription model                    |
| Easy cancellation process            | ❌     | No subscription endpoints                |
| Billing history and receipt access   | ❌     | NOT implemented                          |

#### Gaps Identified

- **P0-CRITICAL**: No subscription system exists
  - No Stripe/Azure Marketplace integration
  - No Pro tier enforcement in middleware
  - No billing database models
  - **Required Files**:
    - `src/lib/models/subscription.ts`
    - `src/app/api/subscriptions/route.ts`
    - `src/app/api/subscriptions/checkout/route.ts`
    - `src/middleware.ts` (Pro tier check)

#### Tests Needed

- [ ] Unit: Subscription state validation
- [ ] Unit: Feature access control (Free vs Pro)
- [ ] Integration: Stripe webhook handling
- [ ] Integration: Subscription upgrade → Pro features enabled
- [ ] E2E: Complete checkout flow

---

### ❌ MVC-012: Advanced Data Visualizations

**Status**: NOT IMPLEMENTED  
**Priority**: Medium (Pro Feature)  
**Implementation Score**: 0%

#### Implementation Files

- **None**: No Habit Garden or Mood Galaxy components found
- **Generic Viz**: Basic charts in analytics, not the creative visualizations specified

#### Acceptance Criteria Coverage

| Criterion                           | Status | Evidence        |
| ----------------------------------- | ------ | --------------- |
| Habit Garden visualization          | ❌     | NOT implemented |
| Mood Galaxy constellation interface | ❌     | NOT implemented |
| Visualizations load in <2 seconds   | ❌     | N/A             |
| Interactive drill-down              | ❌     | NOT implemented |
| Accessible with alt text            | ❌     | NOT implemented |

#### Gaps Identified

- **P1-HIGH**: Creative visualizations missing entirely
  - PRD specifies unique metaphors (garden, galaxy)
  - Current implementation has standard charts only
  - **Required Components**:
    - `src/components/dashboard/visualizations/HabitGarden.tsx`
    - `src/components/dashboard/visualizations/MoodGalaxy.tsx`

#### Tests Needed

- [ ] Unit: Habit data → Garden growth mapping
- [ ] Unit: Mood data → Constellation positioning
- [ ] Performance: Visualization render time <2s
- [ ] Accessibility: Screen reader announces visualization data
- [ ] E2E: Interactive visualization exploration

---

## Orphan / Over-Implementation Analysis

### Endpoints Without Requirements

| Endpoint                   | Purpose             | Justification                                          |
| -------------------------- | ------------------- | ------------------------------------------------------ |
| `/api/health`              | Health check        | ✅ **Valid**: Infrastructure monitoring                |
| `/api/health/db`           | Database health     | ✅ **Valid**: Production monitoring                    |
| `/api/debug/seed`          | Seed test data      | ✅ **Valid**: Development tooling                      |
| `/api/debug/users`         | User debugging      | ⚠️ **Review**: Should be dev-only, security risk       |
| `/api/onboarding/complete` | Complete onboarding | ⚠️ **Missing Req**: Onboarding flow not in PRD         |
| `/api/profile/avatar`      | Avatar upload       | ⚠️ **Missing Req**: Not in MVC-007 acceptance criteria |
| `/api/wisdom/favorites`    | Favorite quotes     | ⚠️ **Missing Req**: Not in MVC-005 spec                |
| `/api/wisdom/stats`        | Wisdom statistics   | ⚠️ **Missing Req**: Not in PRD                         |

### Recommendations

1. **Onboarding**: Add to PRD as MVC-013 or document as technical enhancement
2. **Debug endpoints**: Ensure disabled in production via environment check
3. **Avatar upload**: Clarify if part of MVC-007 or separate feature
4. **Wisdom features**: Document as enhancements beyond MVP

---

## Requirement Quality Issues

### Ambiguities Detected

1. **MVC-003: "Reasonable time window" undefined**
   - **Issue**: How far back can users log habits?
   - **Impact**: P1 - Affects streak integrity
   - **Proposed Fix**: "Users can mark habits complete up to 7 days in the past"

2. **MVC-005: "Cache optimization for performance" vague**
   - **Issue**: What caching strategy? Client, server, CDN?
   - **Impact**: P2 - Non-functional requirement unclear
   - **Proposed Fix**: "Quotes cached in-memory on server for 24h, client-side for offline access via Service Worker"

3. **MVC-008: "Preserves meaning while improving" subjective**
   - **Issue**: How to validate AI output quality?
   - **Impact**: P1 - Acceptance testing impossible
   - **Proposed Fix**: "Translation validated by maintaining >90% semantic similarity (cosine distance) and improving grammar score by ≥2 points on scale of 1-10"

### Contradictions

1. **MVC-004 vs Implementation: One entry per day**
   - **PRD States**: "Write private journal entries"
   - **Implementation**: Restricts to 1 entry per date
   - **Resolution Needed**: Clarify if multiple daily entries allowed

### Missing Non-Functional Requirements

| Category          | Missing Criteria                                | Impact |
| ----------------- | ----------------------------------------------- | ------ |
| **Performance**   | MVC-001: Registration completion time           | P2     |
| **Performance**   | MVC-003: Streak calculation timeout             | P2     |
| **Performance**   | MVC-008: AI enhancement timeout (defined: <5s)  | P1     |
| **Security**      | MVC-001: Password strength meter visibility     | P2     |
| **Security**      | All: Rate limiting specifications               | P1     |
| **Security**      | All: CSRF protection requirements               | P0     |
| **Accessibility** | All: Keyboard navigation support                | P0     |
| **Accessibility** | All: Screen reader announcements                | P0     |
| **Localization**  | MVC-007: Vietnamese UI translation completeness | P1     |
| **Error States**  | All: Network failure recovery                   | P1     |
| **Error States**  | All: Database timeout handling                  | P1     |

### Undefined Data Contracts

1. **MVC-008: AI Enhancement Response Format**

   ```typescript
   // MISSING in types/journal.ts
   interface JournalEnhancementResponse {
     original: string
     enhanced: string
     improvements: {
       type: 'grammar' | 'vocabulary' | 'structure'
       original: string
       improved: string
       explanation: string
     }[]
     metadata: {
       processingTime: number
       tokensUsed: number
       quotaRemaining: number
     }
   }
   ```

2. **MVC-009: Weekly Report Structure**
   ```typescript
   // MISSING in types/analytics.ts
   interface WeeklyReport {
     id: string
     userId: string
     weekStartDate: string
     weekEndDate: string
     insights: {
       habitAnalysis: string
       moodTrends: string
       journalThemes: string[]
     }
     suggestions: string[] // Must be exactly 3
     generatedAt: Date
     emailSent: boolean
   }
   ```

---

## Test Coverage Analysis

### Existing Tests

| File                                                              | Type      | Coverage                      |
| ----------------------------------------------------------------- | --------- | ----------------------------- |
| `src/lib/__tests__/utils.test.ts`                                 | Unit      | cn() function, JWT validation |
| `src/components/auth/__tests__/PasswordResetRequestForm.test.tsx` | Component | Password reset UI             |

**Total Coverage**: <5% of codebase

### Critical Missing Tests by Requirement

#### MVC-001: Authentication (0% coverage)

**Required Tests**:

```gherkin
# Unit Tests
Given password "short12"
When user registers
Then validation error "Password must be at least 8 characters"

Given email "test@example.com" already exists
When user registers with same email
Then return 409 "User already exists"

# Integration Tests
Given valid registration data
When POST /api/auth/register
Then user created in database
And verification email sent
And response status 201

# E2E Tests
Given user on registration page
When user fills form and submits
Then redirected to onboarding
And welcome email received
```

#### MVC-003: Habit Tracking (0% coverage)

**Required Tests**:

```gherkin
# Unit Tests
Given habit completed Mon-Tue-Wed-Thu-Fri
When calculate streak
Then current streak = 5

Given habit missed on Saturday
When calculate streak on Sunday
Then current streak = 0 (or 1 if skipped allowed)

# Integration Tests
Given habit with daily frequency
When POST /api/habits/{id}/logs with date="2025-10-20"
Then log created
And streak updated
And summary reflects completion

# Boundary Tests
Given today is 2025-10-20
When mark habit complete for 2025-10-12 (8 days ago)
Then validation error "Cannot log habits older than 7 days"
```

#### MVC-005: Stoic Content (0% coverage)

**Required Tests**:

```gherkin
# Unit Tests - Determinism
Given userId="user123" and date="2025-10-20"
When fetch daily quote twice
Then both requests return identical quote

Given userId="user123" and date="2025-10-21"
When fetch daily quote
Then quote differs from previous day

# Integration Tests
Given current time is 23:59:59 local
When fetch quote
Then returns today's quote

Given current time is 00:00:01 next day
When fetch quote
Then returns new quote for new day
```

### Test Plan Additions

#### Quick Wins (≤30 min each)

1. **Habit duplicate name validation** (Unit test + fix)
2. **JWT secret validation** (Already exists, expand cases)
3. **Mood value range check** (Unit test: 0, 6, null)
4. **Email format validation edge cases** (Unit test)
5. **Timezone string length limits** (Unit test)

#### Medium Effort (1-2 hours each)

1. **Streak calculation comprehensive suite** (Unit + Integration)
2. **Quote determinism validation** (Unit + Integration)
3. **Journal search with multiple filters** (Integration)
4. **Settings persistence** (Integration)
5. **Authentication flow** (E2E)

#### Large Effort (4+ hours each)

1. **AI enhancement feature implementation + tests** (Full stack)
2. **Weekly report generation + delivery** (Full stack)
3. **Data export with all formats** (Full stack)
4. **Subscription system** (Full stack)
5. **Creative visualizations** (Full stack)

---

## Actionable Fixes

### P0-CRITICAL Fixes (Security/Data Integrity)

#### 1. Implement Email Verification

**Requirement**: MVC-001  
**Impact**: Security vulnerability - unverified emails have full access

```typescript
// File: src/app/api/auth/verify/route.ts (NEW)
import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string
    }
    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: decoded.email, verified: false },
      { verified: true, verifiedAt: new Date() },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
}
```

**Fix Location**: `src/app/api/auth/register/route.ts:70-80`

```typescript
// AFTER user creation, ADD:
const verificationToken = jwt.sign(
  { email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '24h' }
)

await sendVerificationEmail(user.email, verificationToken)
```

---

#### 2. Add CSRF Protection

**Requirement**: All mutation endpoints  
**Impact**: Security vulnerability

```typescript
// File: src/lib/middleware/security.ts (MODIFY)
// Line ~50, ADD to secureEndpoint.mutation()

import { cookies } from 'next/headers'

// Before request processing:
const cookieStore = cookies()
const csrfToken = cookieStore.get('csrf-token')?.value
const headerToken = request.headers.get('x-csrf-token')

if (!csrfToken || csrfToken !== headerToken) {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
}
```

---

#### 3. Implement Data Export Endpoint

**Requirement**: MVC-010  
**Impact**: GDPR compliance failure

```typescript
// File: src/app/api/analytics/export/route.ts (NEW)
import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, SecurityContext } from '@/lib/middleware/security'
import { HabitModel, HabitLogModel } from '@/lib/models/habit'
import { JournalEntryModel } from '@/lib/models/journal'
import { User } from '@/lib/models/user'

export const POST = secureEndpoint.mutation(
  async (request: NextRequest, context: SecurityContext) => {
    const { format } = (await request.json()) as { format: 'json' | 'csv' }
    const userId = context.session!.user.id

    // Fetch all user data
    const [user, habits, habitLogs, journalEntries] = await Promise.all([
      User.findById(userId).select('-password').lean(),
      HabitModel.find({ userId }).lean(),
      HabitLogModel.find({ userId }).lean(),
      JournalEntryModel.find({ userId }).lean(),
    ])

    const exportData = {
      user,
      habits,
      habitLogs,
      journalEntries,
      exportedAt: new Date().toISOString(),
    }

    if (format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="mind-voyage-export-${Date.now()}.json"`,
        },
      })
    }

    // CSV generation
    const csv = convertToCSV(exportData) // Implement conversion
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mind-voyage-export-${Date.now()}.csv"`,
      },
    })
  }
)
```

---

### P1-HIGH Fixes (Functional Gaps)

#### 4. Fix Deterministic Quote Selection

**Requirement**: MVC-005  
**Impact**: User experience - quote changes randomly

```typescript
// File: src/app/api/wisdom/quotes/route.ts:110-140 (REPLACE)
function getDailyQuote(userId: string, dateStr: string): Quote {
  // Create deterministic seed from userId + date
  const seed = hashCode(userId + dateStr)
  const index = Math.abs(seed) % quotesDatabase.length
  return quotesDatabase[index]
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash
}

// In GET handler:
const userTz = session.user.timezone || 'UTC'
const todayInUserTz = new Date().toLocaleDateString('en-CA', {
  timeZone: userTz,
})
const dailyQuote = getDailyQuote(session.user.id, todayInUserTz)
```

---

#### 5. Add Backdating Validation

**Requirement**: MVC-003  
**Impact**: Data integrity - streak manipulation

```typescript
// File: src/app/api/habits/[id]/logs/route.ts (ADD validation)
// After parsing request body, BEFORE creating log:

const requestDate = new Date(date) // date from request body
const today = new Date()
const maxDaysBack = 7
const daysAgo = Math.floor(
  (today.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24)
)

if (daysAgo > maxDaysBack) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: { date: [`Cannot log habits older than ${maxDaysBack} days`] },
    },
    { status: 400 }
  )
}

if (requestDate > today) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: { date: ['Cannot log habits in the future'] },
    },
    { status: 400 }
  )
}
```

---

#### 6. Implement AI Journal Enhancement

**Requirement**: MVC-008  
**Impact**: Pro feature unavailable

**New Files Required**:

1. `src/lib/ai/openai-client.ts`
2. `src/app/api/journal/enhance/route.ts`
3. `src/components/journal/EnhancementEditor.tsx`

```typescript
// File: src/lib/ai/openai-client.ts (NEW)
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!)
)

export async function enhanceJournalEntry(
  content: string,
  targetLanguage: 'en' = 'en'
): Promise<{
  enhanced: string
  improvements: Array<{
    type: string
    original: string
    improved: string
    explanation: string
  }>
  tokensUsed: number
}> {
  const prompt = `You are an English writing enhancement assistant. Improve this journal entry by:
1. Correcting grammar and spelling
2. Enhancing vocabulary (suggest better words)
3. Improving sentence structure
4. Maintaining the author's voice and meaning

Original: ${content}

Respond in JSON format:
{
  "enhanced": "improved version",
  "improvements": [{ "type": "grammar|vocabulary|structure", "original": "text", "improved": "text", "explanation": "why" }]
}`

  const response = await client.getChatCompletions(
    'gpt-4', // deployment name
    [{ role: 'user', content: prompt }],
    { maxTokens: 1000, temperature: 0.7 }
  )

  const result = JSON.parse(response.choices[0].message.content)
  return {
    ...result,
    tokensUsed: response.usage?.totalTokens || 0,
  }
}
```

```typescript
// File: src/app/api/journal/enhance/route.ts (NEW)
import { NextRequest, NextResponse } from 'next/server'
import { secureEndpoint, SecurityContext } from '@/lib/middleware/security'
import { enhanceJournalEntry } from '@/lib/ai/openai-client'
import { User } from '@/lib/models/user'

export const POST = secureEndpoint.mutation(
  async (request: NextRequest, context: SecurityContext) => {
    const { content } = await request.json()
    const userId = context.session!.user.id

    // Check Pro subscription status
    const user = await User.findById(userId).select('subscription').lean()
    if (!user.subscription?.active) {
      return NextResponse.json(
        { error: 'Pro subscription required' },
        { status: 403 }
      )
    }

    // Check quota
    const quotaUsed = user.subscription.aiQuotaUsed || 0
    const quotaLimit = user.subscription.aiQuotaLimit || 100
    if (quotaUsed >= quotaLimit) {
      return NextResponse.json({ error: 'AI quota exceeded' }, { status: 429 })
    }

    // Enhance journal
    const startTime = Date.now()
    const result = await enhanceJournalEntry(content)
    const processingTime = Date.now() - startTime

    // Update quota
    await User.findByIdAndUpdate(userId, {
      $inc: { 'subscription.aiQuotaUsed': 1 },
    })

    return NextResponse.json({
      success: true,
      data: {
        original: content,
        enhanced: result.enhanced,
        improvements: result.improvements,
        metadata: {
          processingTime,
          tokensUsed: result.tokensUsed,
          quotaRemaining: quotaLimit - quotaUsed - 1,
        },
      },
    })
  },
  { rateLimit: { type: 'mutation', windowMs: 60000, maxRequests: 10 } }
)
```

---

### P2-MEDIUM Fixes (UX/Polish)

#### 7. Remove One-Entry-Per-Day Restriction

**Requirement**: MVC-004  
**Impact**: User flexibility

```typescript
// File: src/app/api/journal/route.ts:115-121 (REMOVE)
// DELETE these lines:
if (existingEntry) {
  return NextResponse.json(
    { error: 'Journal entry already exists for this date' },
    { status: 409 }
  )
}

// REPLACE with:
// Allow multiple entries per day - no restriction
```

---

#### 8. Expand Stoic Quotes Database

**Requirement**: MVC-005  
**Impact**: Content variety

```typescript
// File: src/lib/models/stoic-quote.ts (NEW)
import mongoose from 'mongoose'

const stoicQuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  source: { type: String }, // Book/work reference
  category: {
    type: String,
    enum: ['stoic', 'buddhist', 'modern', 'ancient'],
    required: true,
  },
  tags: [String],
  active: { type: Boolean, default: true },
  priority: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
})

export const StoicQuoteModel = mongoose.model('StoicQuote', stoicQuoteSchema)

// Migration: Move hardcoded quotes to database
// Seed with 365+ quotes for year-long variety
```

---

## Improved Requirement Wording

### MVC-003: Habit Completion Tracking (REVISED)

**Original Acceptance Criterion**:

> "Ability to mark habits complete for previous days within reasonable time window"

**Improved Version**:

> "Users MUST be able to mark habits complete for dates up to 7 days in the past. Attempts to log habits older than 7 days MUST return validation error 'Cannot log habits older than 7 days'. Future dates MUST be rejected."

**Acceptance Scenarios** (ADD):

```gherkin
Given today is 2025-10-20
And habit "Morning Meditation" exists
When user marks habit complete for 2025-10-19 (1 day ago)
Then log is created successfully
And current streak increments

Given today is 2025-10-20
When user marks habit complete for 2025-10-12 (8 days ago)
Then validation error "Cannot log habits older than 7 days"
And no log is created

Given today is 2025-10-20
When user marks habit complete for 2025-10-21 (future)
Then validation error "Cannot log habits in the future"
```

---

### MVC-005: Daily Stoic Content (REVISED)

**Original Acceptance Criterion**:

> "Deterministic content selection ensuring same content per day per user"

**Improved Version**:

> "Quote selection MUST be deterministic: Given the same userId and calendar date (in user's timezone), the system MUST return identical quote. Quote MUST refresh at user's local midnight (00:00 in their timezone). Implementation MUST use seeded random selection: `hash(userId + YYYY-MM-DD) % quoteCount`."

**Acceptance Scenarios** (ADD):

```gherkin
Given user "alice" with timezone "America/New_York"
And date is "2025-10-20" in New York
When user fetches daily quote at 10:00 AM
And user fetches daily quote at 11:00 PM
Then both responses contain identical quote

Given user "alice" in New York (date: 2025-10-20)
And user "bob" in New York (date: 2025-10-20)
When both users fetch daily quote
Then they receive different quotes (user-specific)

Given user "alice" in New York
And current time is 2025-10-20 23:59:59 EST
When user fetches quote
Then quote is for 2025-10-20

Given user "alice" in New York
And current time is 2025-10-21 00:00:01 EST
When user fetches quote
Then quote is for 2025-10-21 (different from previous)
```

---

### MVC-008: AI Journal Enhancement (ADD ACCEPTANCE CRITERIA)

**New Acceptance Criteria** (currently vague):

```markdown
**Performance Requirements**:

- Response time p95 < 5 seconds (measured from request to response)
- Concurrent requests: Support 10 simultaneous enhancements
- Timeout: Fail gracefully after 10 seconds

**Quality Requirements**:

- Grammar score improvement: ≥2 points on scale of 1-10
- Semantic similarity: ≥0.90 (cosine similarity between embeddings)
- Vocabulary enhancements: 3-10 suggestions per 500 words
- Explanation clarity: Each improvement includes before/after/why

**Quota Requirements**:

- Pro users: 100 enhancements per month
- Quota resets on billing anniversary
- UI displays remaining quota after each use
- Warning at 90% usage, block at 100%

**Error Handling**:

- Azure OpenAI timeout → "Enhancement taking longer than expected, please try again"
- Quota exceeded → "Monthly AI quota reached. Upgrade or wait until [reset date]"
- Invalid content → "Journal entry too short (minimum 50 characters required)"
```

**Acceptance Scenarios** (ADD):

```gherkin
Given Pro user with 95/100 quota remaining
And journal entry "me go store yesterday"
When user requests enhancement
Then receive enhanced text "I went to the store yesterday"
And improvement explanation "Grammar: Changed 'me go' to 'I went' (proper subject-verb agreement)"
And quota decrements to 94/100
And response time < 5 seconds

Given Pro user with 0/100 quota remaining
When user requests enhancement
Then error "Monthly AI quota reached. Resets on [date]"
And no tokens consumed

Given Free user (non-Pro)
When user clicks "Enhance with AI"
Then modal "Upgrade to Pro for AI-powered journal enhancement"
And link to subscription page
```

---

## Summary of Quick Wins (≤30 min)

| #   | Task                                  | Requirement | File                                     | Estimated Impact |
| --- | ------------------------------------- | ----------- | ---------------------------------------- | ---------------- |
| 1   | Add habit duplicate name validation   | MVC-002     | `src/app/api/habits/route.ts:160`        | Medium           |
| 2   | Expand JWT validation test cases      | MVC-001     | `src/lib/__tests__/utils.test.ts`        | Low              |
| 3   | Add mood range validation tests       | MVC-004     | NEW: `src/lib/__tests__/journal.test.ts` | Low              |
| 4   | Disable debug endpoints in production | N/A         | `src/app/api/debug/*/route.ts`           | High (Security)  |
| 5   | Add timezone validation               | MVC-007     | `src/lib/validation/schemas.ts:170`      | Medium           |
| 6   | Document orphan endpoints             | N/A         | Add to PRD as enhancements               | Low              |
| 7   | Add backdating validation             | MVC-003     | `src/app/api/habits/[id]/logs/route.ts`  | High             |
| 8   | Remove one-entry-per-day limit        | MVC-004     | `src/app/api/journal/route.ts:115`       | Medium           |
| 9   | Add performance marks to dashboard    | MVC-006     | `src/app/dashboard/page.tsx`             | Low              |
| 10  | Create habit name uniqueness index    | MVC-002     | `src/lib/db.ts:setupDatabaseIndexes`     | Medium           |

---

## Appendix: API Contract Validation

### Zod Schemas vs PRD Requirements

| Endpoint                | Schema                     | PRD Requirement | Match? | Issues                          |
| ----------------------- | -------------------------- | --------------- | ------ | ------------------------------- |
| `/api/auth/register`    | `registerSchema`           | MVC-001         | ✅     | Email verification not enforced |
| `/api/habits`           | `habitSchema`              | MVC-002         | ✅     | Duplicate name not checked      |
| `/api/habits/[id]/logs` | `habitLogSchema`           | MVC-003         | ⚠️     | Date range not validated        |
| `/api/journal`          | `createJournalEntrySchema` | MVC-004         | ✅     | Mood 1-5 enforced               |
| `/api/wisdom/quotes`    | None                       | MVC-005         | ❌     | No query validation             |
| `/api/settings`         | `updateProfileSchema`      | MVC-007         | ✅     | Complete                        |
| `/api/journal/enhance`  | N/A                        | MVC-008         | ❌     | Endpoint missing                |

---

**End of Coverage Map**  
_Last Updated: 2025-10-20_  
_Reviewer: Recommend prioritizing P0-CRITICAL fixes before deploying to production_
