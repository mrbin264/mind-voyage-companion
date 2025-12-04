---
description: 'Implementation tasks for Enhanced Responsive Dashboard with Consistent Dark Theme'
---

# Tasks: Enhanced Responsive Dashboard (P1)

**Feature Branch**: `003-enhance`  
**Input**: Design documents from `/specs/003-enhance/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ quickstart.md

**Tests**: Comprehensive testing (90% coverage) is **REQUIRED** per spec.md success criteria. Test tasks are integrated into the workflow.

**Organization**: Tasks focused on User Story 1 (P1 - Dashboard Enhancement). P2-P4 stories are placeholders and will be planned separately after P1 completion.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]**: Belongs to User Story 1 (Dashboard Enhancement)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `src/` at repository root
- **Tests**: `src/components/**/__tests__/` (colocated), `e2e/` (end-to-end)
- All paths relative to repository root: `/Users/hoangtuan/DXC/Code/Tuan-Project/mind-voyage-companion/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency verification

**Duration Estimate**: 30 minutes

- [x] T001 Verify Node.js 18+ and pnpm are installed per quickstart.md
- [x] T002 Run `pnpm install` to ensure all dependencies current
- [x] T003 [P] Verify Tailwind CSS config includes correct content paths in `tailwind.config.ts`
- [x] T004 [P] Verify TypeScript strict mode enabled in `tsconfig.json`
- [x] T005 Start development server with `pnpm dev` and confirm MongoDB Memory Server starts
- [x] T006 Navigate to `http://localhost:3000/dashboard` and verify baseline (existing dashboard loads without errors)
- [x] T007 Create feature branch tracking document in `specs/003-enhance/progress.md` (task completion log)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and utilities that ALL components depend on

**Duration Estimate**: 1 hour

**⚠️ CRITICAL**: No component implementation can begin until this phase is complete

- [x] T008 [P] Create TypeScript type definitions file `src/types/ui.ts` with all interfaces from data-model.md:
  - WidgetCardProps
  - EmptyStateConfig
  - ActionConfig
  - SkeletonVariant
  - SkeletonLoaderProps
  - ErrorBoundaryProps
  - DashboardLayoutProps
  - ResponsiveColumns
  - ResponsiveGridProps
  - Breakpoint type

- [x] T009 [P] Add dark theme semantic tokens to `tailwind.config.ts`:
  - `colors.background.primary` (#0A0A0A)
  - `colors.background.sidebar` (#101010)
  - `colors.background.card` (#18181B)
  - `colors.border.subtle` (rgba(255,255,255,0.1))

- [x] T010 [P] Create custom hook `src/hooks/useMediaQuery.ts` with breakpoint constants:
  - `isMobile`: '(max-width: 767px)'
  - `isTablet`: '(min-width: 768px) and (max-width: 1023px)'
  - `isDesktop`: '(min-width: 1024px)'
  - `isXL`: '(min-width: 1280px)'

- [x] T011 [P] Add responsive utility functions to `src/lib/utils.ts`:
  - `cn()` for className merging (if not exists)
  - `getUserFriendlyMessage(error: Error)` for error parsing

**Checkpoint**: Foundation ready - component implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enhanced Responsive Dashboard (Priority: P1) 🎯 MVP

**Goal**: Deliver a fully responsive dashboard with consistent zinc-900 dark theme across all breakpoints (mobile 375px, tablet 768px, desktop 1024px, xl 1280px+), achieving <1s load time, 60fps animations, and WCAG 2.1 AA accessibility.

**Independent Test**: Load dashboard at each breakpoint (375px, 768px, 1024px, 1280px), verify widgets stack/grid correctly, dark theme consistent, animations smooth, Lighthouse score ≥90.

**Duration Estimate**: 20-25 hours (2-3 days for single developer)

### 3.1: Core UI Components (Foundational for US1)

**Duration Estimate**: 4-5 hours

- [x] T012 [P] [US1] Create SkeletonLoader component `src/components/ui/skeleton-loader.tsx`:
  - Implement 7 variants: dashboard-widget, habit-card, chart, analytics, list-item, avatar, text-line
  - Add pulse animation with `animate-pulse` Tailwind class
  - Include accessibility: `role="status"`, `aria-live="polite"`, `aria-label`
  - Follow dark theme (zinc-800 backgrounds)

- [x] T013 [P] [US1] Create EmptyState component `src/components/ui/empty-state.tsx`:
  - Support icon, message, description, optional action button
  - Two variants: 'default' (py-12) and 'compact' (py-8)
  - Action button with primary/secondary styles
  - Accessibility: `role="status"`, descriptive `aria-label`

- [x] T014 [P] [US1] Create ErrorBoundary component `src/components/ui/error-boundary.tsx`:
  - Accept error, retry callback, context string props
  - Display user-friendly error messages with AlertCircle icon
  - Retry and Refresh Page buttons
  - Dev mode: Show error stack in collapsible details
  - Accessibility: `role="alert"`, `aria-live="assertive"`, focus on retry button

### 3.2: WidgetCard Enhancement (Prerequisite for US1)

**Duration Estimate**: 1.5 hours

- [x] T015 [P] [US1] Enhance WidgetCard component `src/components/ui/widget-card.tsx`:
  - Add state management props: loading, error, empty, emptyConfig, title, subtitle, icon, actions, fullWidth, noPadding
  - Implement state logic: if loading → SkeletonLoader, if error → ErrorBoundary, if empty → EmptyState, else children
  - Add title section with icon and actions (header only if title or actions exist)
  - Enforce dark theme: bg-background-card, border-border-subtle, rounded-xl, p-4 md:p-6
  - Add hover effect: hover:shadow-lg hover:shadow-black/20 transition-all duration-200
  - Responsive padding: p-4 (mobile) → p-6 (desktop)
  - Text truncation: Apply truncate class to title with tooltip for >60 char titles

### 3.3: Unit Tests for Core Components (TDD - Write Before Enhancement)

**Duration Estimate**: 3-4 hours

**⚠️ Note**: These tests must be written FIRST and FAIL before implementation

- [x] T016 [P] [US1] Write unit tests for SkeletonLoader `src/components/ui/__tests__/skeleton-loader.test.tsx`:
  - Test all 7 variants render with correct class names
  - Test count prop repeats skeleton N times
  - Test animate prop controls pulse animation
  - Test accessibility attributes (role, aria-live, aria-label)
  - Coverage target: 100% (simple component)
  - **Result**: ✅ 28/28 tests passing, 100% coverage achieved

- [x] T017 [P] [US1] Write unit tests for EmptyState `src/components/ui/__tests__/empty-state.test.tsx`:
  - Test icon and message render correctly
  - Test optional description displays when provided
  - Test action button click handler fires
  - Test variant sizing (default vs compact)
  - Test accessibility attributes
  - Coverage target: 100%
  - **Result**: ✅ 31/31 tests passing, 100% coverage achieved

- [x] T018 [P] [US1] Write unit tests for ErrorBoundary `src/components/ui/__tests__/error-boundary.test.tsx`:
  - Test error message displays user-friendly text
  - Test retry button calls retry callback
  - Test refresh button reloads page
  - Test context string appears in error title
  - Test dev mode shows error stack
  - Coverage target: 100%
  - **Result**: ✅ 37/37 tests passing, 100% coverage achieved

- [x] T019 [US1] Write unit tests for enhanced WidgetCard `src/components/ui/__tests__/widget-card.test.tsx`:
  - Test loading state renders SkeletonLoader
  - Test error state renders ErrorBoundary
  - Test empty state renders EmptyState
  - Test normal state renders children
  - Test title creates section with aria-labelledby
  - Test responsive padding classes
  - Test hover animations
  - Test text truncation with tooltip (>60 characters)
  - Coverage target: ≥95%
  - **Result**: ✅ 46/46 tests passing, comprehensive coverage achieved

**Checkpoint**: Run `pnpm test` - all tests should FAIL (components not yet implemented/enhanced). If tests pass, there's an error in the test setup.

### 3.3b: Text Truncation Implementation

**Duration Estimate**: 30 minutes

- [x] T019b [US1] Implement text truncation with tooltip in WidgetCard header `src/components/ui/widget-card.tsx`:
  - Apply CSS `truncate` class (overflow: hidden, text-overflow: ellipsis, white-space: nowrap) to title element ✅
  - Wrap title in Tooltip component that shows on hover ✅
  - Display full title text in tooltip when title exceeds 60 characters ✅
  - Ensure tooltip has proper z-index (z-50) and positioning (top/bottom based on available space) ✅
  - Test with long titles (>60 characters) to verify truncation and tooltip ✅
  - Add aria-label with full title for screen readers ✅
  - Ensure tooltip is keyboard-accessible (appears on focus) ✅
  - **Result**: Implemented with Radix UI Tooltip, all 46 WidgetCard tests passing

### 3.4: Layout Components Enhancement

**Duration Estimate**: 4-5 hours

- [ ] T020 [P] [US1] Create ResponsiveGrid utility component `src/components/ui/responsive-grid.tsx`:
  - Accept children, columns (ResponsiveColumns), gap, className props
  - Default columns: { mobile: 1, tablet: 2, desktop: 3, xl: 5 }
  - Render div with dynamic grid classes based on columns config
  - Use gap-6 default (1.5rem spacing)

- [ ] T021 [US1] Enhance DashboardLayout component `src/components/layout/DashboardLayout.tsx`:
  - Add responsive sidebar behavior:
    - Mobile (375px-767px): Sidebar hidden, hamburger menu button, overlay when opened
    - Tablet (768px-1023px): Collapsible sidebar (icon-only 64px / full 256px)
    - Desktop (1024px+): Persistent full sidebar (256px)
  - Implement state management for sidebar collapsed/expanded
  - Add keyboard shortcut: Ctrl+B toggles sidebar
  - Add focus trap when mobile sidebar open
  - Add Escape key handler to close mobile sidebar
  - Add backdrop overlay (bg-black/50) for mobile sidebar
  - Ensure proper landmark regions: `<nav>`, `<main>`, `<aside>`

- [ ] T022 [US1] Create or enhance Sidebar component `src/components/layout/Sidebar.tsx`:
  - Responsive width: 256px (desktop), 64px (tablet collapsed), 0 (mobile hidden)
  - Background: bg-background-sidebar (#101010)
  - Smooth transitions: transition-all duration-300
  - Icon-only mode for tablet collapsed state
  - Add skip-to-content link at top (visible on focus)

- [ ] T023 [P] [US1] Create or enhance MobileNav component `src/components/layout/MobileNav.tsx`:
  - Hamburger menu button (visible only <768px)
  - Three-line icon animation when sidebar opens
  - Position: fixed top-left corner
  - z-index: 50 (above content, below overlay)
  - Accessibility: aria-label="Toggle navigation menu", aria-expanded state

### 3.5: Dashboard Widgets Enhancement

**Duration Estimate**: 3-4 hours

**Note**: Apply responsive patterns and consistent state handling to existing dashboard widgets

- [ ] T024 [P] [US1] Enhance HabitOverviewWidget `src/components/dashboard/HabitOverview.tsx` (or similar):
  - Wrap in WidgetCard with loading, error, empty states
  - Use useHabits hook for data fetching
  - Display SkeletonLoader while loading
  - Display ErrorBoundary on error with retry calling fetchHabits()
  - Display EmptyState if no habits with "Create Habit" action
  - Apply responsive classes: single column mobile, wider desktop
  - Test at all breakpoints

- [ ] T025 [P] [US1] Enhance StreakCard widget `src/components/dashboard/StreakCard.tsx` (or similar):
  - Wrap in WidgetCard with all states
  - Apply responsive grid spanning: `xl:col-span-2`
  - Consistent dark theme colors
  - Loading/error/empty states

- [ ] T026 [P] [US1] Enhance ProgressChart widget `src/components/dashboard/ProgressChart.tsx` (or similar):
  - Wrap in WidgetCard with noPadding={true} for chart
  - SkeletonLoader variant="chart" for loading state
  - Responsive chart sizing at each breakpoint
  - Apply `xl:col-span-3` for wide layout

- [ ] T027 [US1] Update main dashboard page `src/app/dashboard/page.tsx`:
  - Wrap all widgets in ResponsiveGrid component
  - Apply appropriate xl:col-span values per widget
  - Add Suspense boundaries for lazy-loaded below-the-fold widgets
  - Pass user prop to DashboardLayout from server-side auth check

### 3.6: E2E Tests for Responsive Behavior

**Duration Estimate**: 4-5 hours

- [ ] T028 [P] [US1] Create E2E responsive test file `e2e/dashboard-responsive.spec.ts`:
  - Test mobile layout (375px): hamburger menu visible, widgets stack vertically, sidebar hidden
  - Test tablet layout (768px): sidebar collapsible, widgets in 2-column grid
  - Test desktop layout (1024px): sidebar persistent, widgets in 3-column grid
  - Test XL layout (1280px): 5-column grid, xl:col-span patterns correct
  - Test sidebar toggle on tablet/desktop
  - Test mobile sidebar overlay and backdrop click-to-close
  - Test Escape key closes mobile sidebar
  - Test skip-to-content link on Tab keypress

- [ ] T029 [P] [US1] Create E2E widget states test file `e2e/dashboard-widget-states.spec.ts`:
  - Test loading states appear with skeleton loaders
  - Test error states display with retry button
  - Test empty states show with CTA button
  - Test retry button refetches data
  - Test error transitions to success after retry

- [ ] T030 [P] [US1] Create E2E dark theme test file `e2e/dashboard-theme.spec.ts`:
  - Test all widgets have zinc-900 backgrounds
  - Test borders have white/10 opacity
  - Test text contrast ratios meet WCAG AA (4.5:1 minimum)
  - Test no raw hex colors visible (all use semantic tokens)
  - Take screenshots at each breakpoint for visual regression baseline

- [ ] T030b [P] [US1] Create E2E theme stress test file `e2e/dashboard-theme-stress.spec.ts`:
  - Test rapid theme toggling (10+ toggles within 5 seconds)
  - Verify no animation conflicts or visual glitches
  - Verify debounce mechanism prevents race conditions
  - Verify final theme state is stable after rapid toggles
  - Test during data loading to catch timing issues
  - Take screenshots at each breakpoint for visual regression baseline
  - Take screenshots at each breakpoint for visual regression baseline

### 3.7: Performance Optimization & Validation

**Duration Estimate**: 2-3 hours

- [x] T031 [US1] Implement lazy loading for below-the-fold widgets in `src/app/dashboard/page.tsx`:
  - Use React.lazy() for AnalyticsWidget, HistoryWidget, etc.
  - Wrap each in Suspense with matching SkeletonLoader fallback
  - Verify bundle size reduction with `@next/bundle-analyzer`
  - Target: 30-40% initial bundle size reduction
  - ✅ Extended to all application pages (dashboard, analytics, habits, profile, wisdom, journal)
  - ✅ Commit 919ae55 (Oct 20, 2025)

- [x] T032 [US1] Optimize animations for 60fps in components:
  - ✅ **Phase 1** (commit 4bded05): HabitForm.tsx (20 instances) + 5 progress bars (scaleX transforms)
  - ✅ **Phase 2** (commit 53e80b8): UI components (widget-card, Sidebar, MobileNav, DashboardLayout, StreakCard, QuickStatsWidget) + globals.css
  - ✅ All `transition-all` instances eliminated (45 total)
  - ✅ Progress bars converted to GPU-accelerated scaleX transforms
  - ✅ Sidebar collapse uses will-change hints for smooth transitions
  - ✅ All animations use specific property transitions (colors, opacity, transform)
  - ✅ Production build successful, all tests passing (154/154)
  - ✅ Documentation: `specs/003-enhance/T032-animation-optimization-summary.md`

- [x] T033 [US1] Setup Lighthouse CI configuration file `lighthouserc.json`:
  - ✅ Created lighthouserc.json with comprehensive configuration
  - ✅ Performance budget: score ≥90 for all categories
  - ✅ Core Web Vitals thresholds: FCP <1.8s, LCP <2.5s, TTI <3.5s, TBT <300ms, CLS <0.1
  - ✅ Speed Index threshold: <3.4s
  - ✅ Installed @lhci/cli and lighthouse packages
  - ✅ Added npm scripts: lhci:autorun, lhci:collect, lhci:assert, perf:audit
  - ✅ Configured for desktop testing (1350x940 viewport)
  - ✅ Set numberOfRuns: 3 for reliable averages
  - ✅ Added .lighthouseci/ to .gitignore
  - ✅ Successfully ran initial audit on homepage
  - ✅ Report URL: https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1762402492078-73878.report.html

- [ ] T034 [US1] Run Lighthouse CI locally and validate metrics:
  - Build production: `pnpm build`
  - Start production server: `pnpm start`
  - Run Lighthouse: `lhci autorun`
  - Verify all performance budgets pass
  - Document results in `specs/003-enhance/performance-results.md`

### 3.8: Accessibility Testing & Validation

**Duration Estimate**: 3-4 hours

- [ ] T035 [P] [US1] Create accessibility E2E test file `e2e/dashboard-a11y.spec.ts`:
  - Run axe-core automated tests on dashboard
  - Assert zero WCAG 2.1 AA violations
  - Test against wcag2a, wcag2aa, wcag21aa rule sets
  - Include all breakpoints in scan

- [ ] T036 [US1] Manual keyboard navigation testing:
  - Tab through entire dashboard (all interactive elements reachable)
  - Verify focus indicators visible (2px ring, high contrast)
  - Test Escape key closes modals/sidebar
  - Test Enter/Space activates buttons
  - Test skip-to-content link (Tab on page load)
  - Document findings in `specs/003-enhance/a11y-manual-test-results.md`

- [ ] T037 [US1] Screen reader testing (VoiceOver on macOS or NVDA on Windows):
  - Test page title announced on load
  - Test landmark regions announced (navigation, main)
  - Test widget titles read as headings
  - Test loading states announced ("Loading habits")
  - Test error states announced ("Unable to load habits")
  - Test empty states provide context ("No habits yet")
  - Test all buttons have descriptive labels
  - Document findings in `specs/003-enhance/a11y-screenreader-results.md`

- [ ] T038 [US1] Color contrast validation:
  - Use automated tools (axe DevTools extension)
  - Verify text contrast ≥4.5:1 for normal text (14px+)
  - Verify text contrast ≥3:1 for large text (18px+ or 14px bold)
  - Verify focus indicators contrast ≥3:1
  - Fix any violations found

### 3.9: Integration & Final Validation

**Duration Estimate**: 2-3 hours

- [ ] T039 [US1] Run full test suite and verify ≥90% coverage:
  - Unit tests: `pnpm test:coverage`
  - E2E tests: `pnpm test:e2e`
  - Verify coverage report shows ≥90% for all enhanced/new components
  - Fix any failing tests

- [ ] T040 [US1] Run code quality pipeline:
  - ESLint: `pnpm lint:fix`
  - Prettier: `pnpm format`
  - TypeScript: `pnpm type-check`
  - Ensure all pass with zero errors

- [ ] T041 [US1] Manual cross-browser testing:
  - Chrome (latest): Verify all features work at 100%, 150%, 200% zoom levels
  - Firefox (latest): Verify all features work at 100%, 150%, 200% zoom levels
  - Safari (latest): Verify all features work at 100%, 150%, 200% zoom levels
  - Edge (latest): Verify all features work at 100%, 150%, 200% zoom levels
  - Verify layout integrity, readability, and no horizontal scrolling at all zoom levels
  - Document any browser-specific issues

- [ ] T042 [US1] Verify quickstart.md workflows:
  - Follow development workflow section
  - Confirm all commands work as documented
  - Test common issue solutions
  - Update quickstart.md if any discrepancies found

**Checkpoint**: User Story 1 (P1 Dashboard Enhancement) is now fully functional, tested, and validated. All success criteria from spec.md should be met.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple components

**Duration Estimate**: 2-3 hours

- [ ] T043 [P] Update project documentation in `README.md`:
  - Add section describing responsive dashboard features
  - Update screenshots to show mobile/tablet/desktop layouts
  - Document new components (SkeletonLoader, EmptyState, ErrorBoundary)
  - Update development workflow if needed

- [ ] T044 [P] Add TypeScript documentation comments:
  - Add JSDoc comments to all public component props
  - Document complex functions in useMediaQuery hook
  - Add inline comments for non-obvious responsive logic

- [ ] T045 [P] Performance optimization sweep:
  - Run bundle analyzer: `ANALYZE=true pnpm build`
  - Identify any unexpectedly large chunks
  - Consider additional code-splitting opportunities
  - Document findings in `specs/003-enhance/bundle-analysis.md`

- [ ] T046 [P] Create component showcase page (optional):
  - Create `src/app/style-guide/page.tsx` if doesn't exist
  - Showcase WidgetCard in all states (loading, error, empty, content)
  - Showcase SkeletonLoader variants
  - Showcase EmptyState variants
  - Showcase ErrorBoundary examples
  - Useful for design review and future reference

- [ ] T047 Final Git workflow:
  - Review all changed files: `git status`
  - Stage changes: `git add .`
  - Commit with descriptive message: `git commit -m "[MVC-003] Enhanced responsive dashboard with consistent dark theme - P1 complete"`
  - Push to feature branch: `git push origin 003-enhance`

- [ ] T048 Create pull request:
  - Title: `[MVC-003] P1: Enhanced Responsive Dashboard with Consistent Dark Theme`
  - Description: Link to spec.md, summarize changes, note test coverage
  - Target branch: `develop`
  - Add screenshots: mobile, tablet, desktop, xl layouts
  - Request code review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (30 min)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all component work (1 hour)
- **User Story 1 (Phase 3)**: Depends on Foundational completion (20-25 hours)
  - Sections 3.1-3.9 have internal dependencies (see below)
- **Polish (Phase 4)**: Depends on User Story 1 completion (2-3 hours)

### Within User Story 1 (Phase 3) - Section Dependencies

1. **3.1 Core UI Components** (T012-T014): No dependencies, can start immediately after Phase 2
2. **3.2 Widget Card Enhancement** (T015): Depends on 3.1 completion (needs SkeletonLoader, EmptyState, ErrorBoundary)
3. **3.3 Unit Tests** (T016-T019): Can be written in parallel with 3.1-3.2 (TDD approach)
4. **3.4 Layout Components** (T020-T023): Can start in parallel with 3.1-3.2 (independent)
5. **3.5 Dashboard Widgets** (T024-T027): Depends on 3.2 and 3.4 completion (needs WidgetCard and layouts)
6. **3.6 E2E Tests** (T028-T030): Depends on 3.5 completion (needs working dashboard)
7. **3.7 Performance** (T031-T034): Depends on 3.5 completion (needs implemented features)
8. **3.8 Accessibility** (T035-T038): Depends on 3.5 completion (needs implemented features)
9. **3.9 Integration** (T039-T042): Depends on all previous sections (final validation)

### Parallel Opportunities

**Within Phase 1 (Setup)**: T003, T004 can run in parallel

**Within Phase 2 (Foundational)**: T008, T009, T010, T011 can all run in parallel

**Within Phase 3 (User Story 1)**:

- **Section 3.1**: T012, T013, T014 can all run in parallel (different files)
- **Section 3.3**: T016, T017, T018 can run in parallel (T019 depends on T015)
- **Section 3.4**: T020, T021 can run in parallel (T022, T023 depend on T021)
- **Section 3.5**: T024, T025, T026 can run in parallel (T027 depends on all)
- **Section 3.6**: T028, T029, T030 can all run in parallel
- **Section 3.7**: T031, T032 can run in parallel (T033, T034 are sequential)
- **Section 3.8**: T035 and T038 can run in parallel (T036, T037 are manual)

**Within Phase 4 (Polish)**: T043, T044, T045, T046 can all run in parallel

### Critical Path (Minimum Time)

Assuming unlimited parallel execution:

1. Phase 1: 30 min
2. Phase 2: 1 hour (all parallel)
3. Phase 3:
   - 3.1 Core Components: 1.5 hours (parallel)
   - 3.2 Widget Card: 2 hours (sequential, depends on 3.1)
   - 3.4 Layouts: 2 hours (parallel with 3.1-3.2)
   - 3.5 Widgets: 3 hours (sequential, depends on 3.2 and 3.4)
   - 3.6 E2E Tests: 1.5 hours (parallel, depends on 3.5)
   - 3.7 Performance: 2 hours (sequential, depends on 3.5)
   - 3.8 Accessibility: 2 hours (parallel with 3.7)
   - 3.9 Integration: 2 hours (sequential, final)
4. Phase 4: 1 hour (most parallel)

**Total Critical Path**: ~18-20 hours (best case with parallel execution)

**Realistic Single Developer**: 25-30 hours (sequential with some parallel within sections)

---

## Parallel Execution Examples

### Example 1: Core UI Components (3.1)

All three can be developed simultaneously by same or different developers:

```bash
# Terminal 1
Task T012: Create SkeletonLoader in src/components/ui/skeleton-loader.tsx

# Terminal 2
Task T013: Create EmptyState in src/components/ui/empty-state.tsx

# Terminal 3
Task T014: Create ErrorBoundary in src/components/ui/error-boundary.tsx
```

### Example 2: Unit Tests (3.3)

All tests can be written in parallel:

```bash
# Terminal 1
Task T016: Write SkeletonLoader tests in src/components/ui/__tests__/skeleton-loader.test.tsx

# Terminal 2
Task T017: Write EmptyState tests in src/components/ui/__tests__/empty-state.test.tsx

# Terminal 3
Task T018: Write ErrorBoundary tests in src/components/ui/__tests__/error-boundary.test.tsx
```

### Example 3: E2E Tests (3.6)

All E2E tests can run in parallel:

```bash
# Terminal 1
Task T028: Create responsive E2E tests in e2e/dashboard-responsive.spec.ts

# Terminal 2
Task T029: Create widget states E2E tests in e2e/dashboard-widget-states.spec.ts

# Terminal 3
Task T030: Create theme E2E tests in e2e/dashboard-theme.spec.ts
```

---

## Implementation Strategy

### Recommended Approach: TDD + Incremental

1. **Phase 1 + 2**: Setup + Foundational (1.5 hours) - Complete before anything else
2. **Iteration 1**: Core Components (Section 3.1 + 3.3)
   - Write tests first (T016-T018) - verify they FAIL
   - Implement components (T012-T014)
   - Run tests - verify they PASS
   - Checkpoint: `git commit -m "Add core UI components with tests"`
3. **Iteration 2**: Widget Card Enhancement (Section 3.2 + T019)
   - Write test (T019) - verify FAILS
   - Enhance WidgetCard (T015)
   - Run test - verify PASSES
   - Checkpoint: `git commit -m "Enhance WidgetCard with state management"`
4. **Iteration 3**: Layouts (Section 3.4)
   - Complete T020-T023 sequentially
   - Test manually at each breakpoint
   - Checkpoint: `git commit -m "Enhance layouts for responsive behavior"`
5. **Iteration 4**: Dashboard Widgets (Section 3.5)
   - Complete T024-T027
   - Test each widget independently
   - Checkpoint: `git commit -m "Enhance dashboard widgets with responsive patterns"`
6. **Iteration 5**: E2E + Performance + Accessibility (Sections 3.6-3.8)
   - Run E2E tests, fix issues
   - Validate performance, optimize
   - Test accessibility, fix violations
   - Checkpoint: `git commit -m "Complete E2E, performance, and accessibility validation"`
7. **Iteration 6**: Integration + Polish (Sections 3.9 + Phase 4)
   - Final validation
   - Documentation
   - Create PR

### MVP-Only Scope

If you need the absolute minimum to demonstrate value:

1. Complete Phase 1 + 2 (foundation)
2. Complete Section 3.1 (core components)
3. Complete Section 3.2 (WidgetCard enhancement)
4. Complete T024 (enhance one widget as proof-of-concept)
5. Complete T027 (update dashboard page)
6. **STOP and DEMO**: You now have a working responsive widget system

This MVP is ~8-10 hours of work and demonstrates the core functionality.

---

## Task Summary

### Total Tasks: 50

### Tasks by Phase:

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 4 tasks
- **Phase 3 (User Story 1)**: 33 tasks
  - 3.1 Core Components: 3 tasks
  - 3.2 Widget Card: 1 task
  - 3.3 Unit Tests: 4 tasks
  - 3.3b Text Truncation: 1 task (T019b)
  - 3.4 Layouts: 4 tasks
  - 3.5 Widgets: 4 tasks
  - 3.6 E2E Tests: 4 tasks (including T030b)
  - 3.7 Performance: 4 tasks
  - 3.8 Accessibility: 4 tasks
  - 3.9 Integration: 4 tasks
- **Phase 4 (Polish)**: 6 tasks

### Parallelizable Tasks: 25 (marked with [P])

### Sequential Tasks: 24 (blocking dependencies)

### Time Estimates:

- **Best Case** (unlimited parallel): 18-20 hours
- **Single Developer** (realistic): 25-30 hours
- **MVP Only** (proof-of-concept): 8-10 hours

---

## Success Criteria Validation

Upon completion of all tasks, verify against spec.md success criteria:

- [ ] **SC-001**: Dashboard loads in <1s (Lighthouse ≥90) ✅ Validated in T034
- [ ] **SC-002**: Animations maintain 60fps ✅ Validated in T032
- [ ] **SC-003**: Responsive across all breakpoints (zero visual regressions) ✅ Validated in T028
- [ ] **SC-004**: ≥90% test coverage ✅ Validated in T039
- [ ] **SC-005**: WCAG 2.1 AA compliance ✅ Validated in T035-T038
- [ ] **SC-006**: Initial bundle reduced by ≥30% ✅ Validated in T031
- [ ] **SC-007**: Supports 200% zoom ✅ Validated in T041
- [ ] **SC-008**: Zero console errors ✅ Validated in T041
- [ ] **SC-009**: ≥90% visual regression tests pass ✅ Validated in T030
- [ ] **SC-010**: Dark theme color consistency ✅ Validated in T030

---

## Notes

- **[P] tasks** can run in parallel (different files, no blocking dependencies)
- **[US1] label** maps task to User Story 1 for traceability
- **Test-first approach**: Write tests before implementation where marked
- **Incremental commits**: Commit after each logical section completion
- **Constitution compliance**: All tasks align with 7 principles (verified in plan.md)
- **No database changes**: P1 is purely presentational (no API/DB modifications)
- **P2-P4 stories**: Will be planned separately after P1 completion and validation

---

**Tasks Generated**: 2025-10-20  
**Feature**: Enhanced Responsive Dashboard with Consistent Dark Theme (P1)  
**Branch**: `003-enhance`  
**Ready for Implementation**: ✅ YES
