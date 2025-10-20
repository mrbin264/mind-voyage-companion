````markdown
# Implementation Plan: Enhanced Responsive Dashboard with Consistent Dark Theme

**Branch**: `003-enhance` | **Date**: 2025-10-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-enhance/spec.md`

**Note**: This plan focuses on P1 (Dashboard & UI Components). P2-P4 phases will be planned separately after P1 completion.

## Summary

This implementation enhances the Mind Voyage Companion dashboard with a fully responsive widget system and consistent dark theme implementation across all breakpoints (mobile 375px, tablet 768px, desktop 1024px, xl 1280px+). The technical approach leverages Next.js 15 App Router Server Components, Tailwind CSS responsive utilities, and client-side React hooks for state management. Key deliverables include enhanced WidgetCard component with loading/error/empty states, responsive grid system with xl:col-span patterns, 60fps animations, and sub-1-second page load performance with lazy-loaded widgets.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**:

- Next.js 15 (App Router)
- React 18.x
- Tailwind CSS 3.x
- Mongoose (MongoDB ODM)
- NextAuth.js (authentication)

**Storage**: MongoDB (MongoDB Memory Server in development, Atlas in production)
**Testing**:

- Vitest + React Testing Library (unit/component tests)
- Playwright (E2E and visual regression tests)
- Lighthouse CI (performance metrics)

**Target Platform**: Web (responsive: mobile 375px+, tablet 768px+, desktop 1024px+, xl 1280px+)
**Project Type**: Web application (Next.js monolith with App Router)

**Performance Goals**:

- Initial page load: <1s on fast connection, <2s on 3G
- Animation performance: 60fps minimum (no frame drops)
- Lighthouse Performance score: ≥90
- Bundle size: <300KB gzipped for dashboard route

**Constraints**:

- WCAG 2.1 AA accessibility compliance mandatory
- Dark theme only (zinc-900 palette, no light mode in P1)
- No external dependencies for responsive grid (Tailwind built-in only)
- Must maintain dual MongoDB connections (NextAuth + Mongoose)
- Browser support: Last 2 versions of Chrome, Firefox, Safari, Edge

**Scale/Scope**:

- ~10 dashboard widgets to enhance
- 4 breakpoint targets (mobile, tablet, desktop, xl)
- 3 widget states each (loading, error, empty + content)
- Expected daily active users: <1000 (MVP phase)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Privacy-First Architecture

✅ **PASS** - No changes to authentication, data storage, or privacy model. Enhancement purely affects UI/presentation layer.

### Principle II: TypeScript Strict Mode & Type Safety

✅ **PASS** - All new components will use TypeScript strict mode. Props interfaces required for WidgetCard enhancements, loading states, error boundaries. Zod schemas not required (no API changes).

### Principle III: Test-Driven Development

✅ **PASS** - Comprehensive testing (90% coverage) specified:

- Unit tests for component states (Vitest + React Testing Library)
- Visual regression tests for breakpoints (Playwright)
- Performance tests (Lighthouse CI)
- Accessibility tests (axe-core automated + manual keyboard/screen reader)

### Principle IV: Component-Based Architecture

✅ **PASS** - Following established patterns:

- Server Components for DashboardLayout and static content
- Client Components for interactive widgets (marked with 'use client')
- Custom hooks pattern maintained (e.g., `useHabits` not modified)
- PascalCase for components, proper file organization in `src/components/`

### Principle V: Performance & Accessibility Standards

✅ **PASS** - Explicitly specified:

- WCAG 2.1 AA compliance: keyboard navigation, focus indicators, 4.5:1 contrast ratios, screen reader support
- Performance targets: <1s load, 60fps animations, optimized bundle via lazy-loading
- Next.js Image/Font optimization to be used where applicable
- Suspense boundaries for async widget data

### Principle VI: Dark Theme Design System

✅ **PASS** - Core focus of enhancement:

- Zinc-900 (#18181B) backgrounds enforced across all widgets
- Border-white/10 opacity standardized
- WidgetCard component will enforce consistent styling
- Typography and spacing follow existing design system
- Grid layouts use xl:col-span patterns

### Principle VII: MongoDB Architecture Patterns

✅ **PASS** - No database layer changes:

- Dual MongoDB clients unchanged
- No new models or API routes required
- Existing `useHabits` hook pattern preserved
- Widget data fetching uses established patterns

### Gate Summary

**Status**: ✅ ALL GATES PASSED

**Justification**: This enhancement is a pure UI/presentation layer improvement. No architectural changes, no new external dependencies, no deviations from established patterns. All constitution principles naturally satisfied by the design.

## Project Structure

### Documentation (this feature)

```
specs/003-enhance/
├── spec.md              # Feature specification (completed via /speckit.clarify)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (API contracts if needed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── app/
│   ├── dashboard/           # Dashboard pages (Server Components)
│   │   ├── page.tsx         # Main dashboard (to be enhanced)
│   │   ├── habits/          # Habit tracking section
│   │   ├── journal/         # Journal section
│   │   └── analytics/       # Analytics section
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles (dark theme variables)
│
├── components/
│   ├── ui/
│   │   ├── widget-card.tsx              # [ENHANCE] Add state variants
│   │   ├── skeleton-loader.tsx          # [NEW] Loading state component
│   │   ├── empty-state.tsx              # [NEW] Empty data component
│   │   └── error-boundary.tsx           # [NEW] Error handling component
│   │
│   ├── layout/
│   │   ├── DashboardLayout.tsx          # [ENHANCE] Responsive grid system
│   │   ├── Sidebar.tsx                  # [ENHANCE] Mobile collapsible
│   │   └── MobileNav.tsx                # [ENHANCE] Hamburger menu
│   │
│   └── dashboard/                       # Dashboard-specific widgets
│       ├── HabitOverview.tsx            # [ENHANCE] Responsive layout
│       ├── StreakCard.tsx               # [ENHANCE] Responsive layout
│       ├── ProgressChart.tsx            # [ENHANCE] Responsive layout
│       └── [other widgets...]           # [ENHANCE] Consistent states
│
├── hooks/
│   ├── useHabits.ts                     # [NO CHANGE] Existing hook
│   ├── useSettings.ts                   # [NO CHANGE] Existing hook
│   └── useMediaQuery.ts                 # [NEW] Responsive breakpoint hook
│
├── lib/
│   ├── db.ts                            # [NO CHANGE] Database connection
│   ├── auth.ts                          # [NO CHANGE] Authentication
│   └── utils.ts                         # [ENHANCE] Add responsive utilities
│
└── types/
    ├── habit.ts                         # [NO CHANGE] Existing types
    ├── ui.ts                            # [NEW] UI component types
    └── ...

tests/
├── unit/
│   └── components/
│       ├── widget-card.test.tsx         # [NEW] Component unit tests
│       ├── skeleton-loader.test.tsx     # [NEW]
│       └── empty-state.test.tsx         # [NEW]
│
└── e2e/
    └── dashboard-responsive.spec.ts     # [NEW] Breakpoint tests

design/
└── html/
    └── dashboard/                       # Reference designs to match
        ├── index.html                   # Desktop reference
        └── mobile.html                  # Mobile reference (if exists)
```

**Structure Decision**: This is a web application using Next.js App Router monolith structure. No backend/frontend separation needed. All enhancements are in existing `src/` directory following established patterns. New components in `src/components/ui/`, enhanced layouts in `src/components/layout/`, and dashboard widgets in `src/components/dashboard/`.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

**Status**: No violations detected. All Constitution gates passed. This section is not applicable.

---

## Phase 0: Outline & Research

**Objective**: Resolve all technical unknowns and establish best practices for responsive dashboard implementation with dark theme consistency.

**Status**: ✅ **COMPLETE**

**Output**: `research.md` (generated)

### Research Areas Covered

1. **Responsive Grid System**: Tailwind CSS built-in utilities with breakpoint-specific column spans
2. **Component State Management**: State-specific wrapper components (SkeletonLoader, EmptyState, ErrorBoundary)
3. **Animation Performance**: CSS-only animations with GPU-accelerated properties (60fps target)
4. **Lazy Loading Strategy**: Next.js 15 built-in lazy loading with React Suspense boundaries
5. **Dark Theme Consistency**: Centralized color tokens in Tailwind config, enforced via WidgetCard
6. **Accessibility Best Practices**: WCAG 2.1 AA compliance with automated + manual testing
7. **Performance Monitoring**: Lighthouse CI in GitHub Actions + Chrome DevTools profiling

### Key Decisions Made

- Zero external dependencies (Tailwind only for responsive grid)
- State components over HOCs for flexibility and testability
- GPU-accelerated CSS animations for 60fps performance
- React Suspense for native code-splitting (no manual dynamic imports)
- Semantic color tokens in Tailwind config (no raw hex values in components)
- Comprehensive accessibility testing (automated axe-core + manual keyboard/screen reader)
- Lighthouse CI for continuous performance enforcement

**All technical unknowns resolved**. Ready for Phase 1.

---

## Phase 1: Design & Contracts

**Objective**: Define component entities, generate API contracts (if needed), create developer quickstart guide, and update agent context.

**Status**: ✅ **COMPLETE**

### Outputs Generated

1. ✅ **data-model.md**: Component entity definitions
   - 6 component entities defined (WidgetCard, SkeletonLoader, EmptyState, ErrorBoundary, DashboardLayout, ResponsiveGrid)
   - 1 custom hook defined (useMediaQuery)
   - Complete TypeScript type definitions (src/types/ui.ts)
   - Component relationship diagram
   - State transition specifications
   - Performance considerations

2. ✅ **contracts/README.md**: API contracts status
   - Documented: No API changes required for P1 (presentational enhancement only)
   - Listed existing API routes used (unchanged)
   - Noted future contract location for P2-P4 phases

3. ✅ **quickstart.md**: Developer setup guide
   - Prerequisites and getting started steps
   - Development workflow (creating components, testing, debugging)
   - Responsive testing workflow (breakpoint checklist)
   - Accessibility testing (automated + manual)
   - Code quality checks and common issues
   - Complete command reference

4. ✅ **Agent context updated**: `.github/copilot-instructions.md`
   - Added TypeScript 5.x (strict mode)
   - Added MongoDB (Memory Server in dev, Atlas in prod)
   - Context synchronized with feature requirements

### Component Entities Summary

| Entity          | Type     | Purpose                                               | Status  |
| --------------- | -------- | ----------------------------------------------------- | ------- |
| WidgetCard      | Enhanced | Consistent dark theme container with state management | Defined |
| SkeletonLoader  | New      | Animated loading placeholder (7 variants)             | Defined |
| EmptyState      | New      | User-friendly "no data" placeholder with CTA          | Defined |
| ErrorBoundary   | New      | Graceful error handling with retry mechanism          | Defined |
| DashboardLayout | Enhanced | Responsive grid system and sidebar management         | Defined |
| ResponsiveGrid  | New      | Utility for enforcing consistent grid layouts         | Defined |
| useMediaQuery   | New      | Hook for breakpoint detection                         | Defined |

### Constitution Re-Check

**Post-Phase 1 Verification**: ✅ **ALL GATES STILL PASSING**

- No architectural deviations introduced
- All component designs follow established patterns
- TypeScript strict mode maintained in all entity definitions
- Accessibility baked into component specifications
- Performance budgets documented and enforceable
- Dark theme consistency enforced at component level

**No complexity tracking needed** - design remains simple and aligned with constitution.

---

## Phase 2: Task Decomposition

**Status**: ⏳ **PENDING** (requires `/speckit.tasks` command)

This phase will generate `tasks.md` with detailed implementation tasks organized by:

- Component creation/enhancement tasks
- Test implementation tasks
- Documentation tasks
- Review/validation tasks

**Command to proceed**: `/speckit.tasks`

---

## Artifacts Generated

### Phase 0 (Research)

- ✅ `specs/003-enhance/research.md` (7 research areas, 30+ pages)

### Phase 1 (Design & Contracts)

- ✅ `specs/003-enhance/data-model.md` (Component entities, 40+ pages)
- ✅ `specs/003-enhance/contracts/README.md` (API status documentation)
- ✅ `specs/003-enhance/quickstart.md` (Developer guide, 25+ pages)
- ✅ `.github/copilot-instructions.md` (Updated agent context)

### Pending Phase 2

- ⏳ `specs/003-enhance/tasks.md` (Implementation tasks, to be generated)

---

## Next Steps

1. ✅ Phase 0 Complete - All research decisions made
2. ✅ Phase 1 Complete - Component entities defined, quickstart ready, agent context updated
3. **Run `/speckit.tasks`** - Generate detailed implementation task list
4. Begin implementation following task breakdown
5. Execute comprehensive testing (90% coverage target)
6. Performance validation (Lighthouse CI)
7. Accessibility validation (WCAG 2.1 AA)
8. Code review and merge to develop

---

**Planning Completed**: 2025-10-20  
**Branch**: `003-enhance`  
**Spec**: [spec.md](./spec.md)  
**Planned By**: AI Agent (GitHub Copilot)
````
