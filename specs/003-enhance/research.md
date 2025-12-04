# Phase 0: Research & Technical Decisions

**Feature**: Enhanced Responsive Dashboard with Consistent Dark Theme  
**Branch**: `003-enhance`  
**Date**: 2025-10-20

## Overview

This document consolidates all technical research and design decisions for implementing a fully responsive dashboard with consistent dark theme across all breakpoints, achieving 60fps performance and sub-1-second load times.

---

## Research Area 1: Responsive Grid System with Tailwind CSS

### Decision

Use Tailwind CSS built-in responsive grid utilities with breakpoint-specific column spans (`grid-cols-{n}` at each breakpoint, `xl:col-span-{n}` for layout control).

### Rationale

1. **Zero Dependencies**: Tailwind is already in the project; no additional libraries needed
2. **Performance**: CSS-only solution, no JavaScript overhead for grid calculations
3. **Maintainability**: Declarative className approach aligns with existing codebase patterns
4. **Mobile-First**: Tailwind's mobile-first breakpoint system matches our approach (375px → 768px → 1024px → 1280px+)
5. **Design System Alignment**: Existing components already use Tailwind; consistency maintained

### Alternatives Considered

- **CSS Grid Module Systems** (e.g., react-grid-layout): Rejected due to added bundle size (~50KB), JavaScript overhead, and overkill for fixed responsive layouts
- **Flexbox-only approach**: Rejected due to difficulty achieving complex multi-column layouts with precise control
- **Bootstrap Grid**: Rejected due to design system conflict (would require theme override) and larger footprint

### Implementation Pattern

```tsx
// Container: Define columns at each breakpoint
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
  {/* Widget: Span multiple columns at larger breakpoints */}
  <div className="col-span-1 xl:col-span-3">
    <WidgetCard>...</WidgetCard>
  </div>
  <div className="col-span-1 xl:col-span-2">
    <WidgetCard>...</WidgetCard>
  </div>
</div>
```

### Best Practices

- Use `gap-{n}` for consistent spacing (current: `gap-6` = 1.5rem)
- Always define base mobile layout first (`grid-cols-1`), then add breakpoint modifiers
- Test at exact breakpoint boundaries (767px, 1023px, 1279px) to verify no visual jumps
- Use `min-w-0` on grid items to prevent overflow issues with long text

---

## Research Area 2: Component State Management (Loading, Error, Empty)

### Decision

Implement state-specific wrapper components (`<SkeletonLoader>`, `<EmptyState>`, `<ErrorBoundary>`) with standardized props interface.

### Rationale

1. **Reusability**: Same loading/error/empty UI across all widgets
2. **Consistency**: Dark theme colors (zinc-900) enforced at component level
3. **Testability**: Each state component tested independently
4. **Accessibility**: Screen reader announcements built into state components
5. **Performance**: Skeleton loaders prevent layout shift during data fetching

### Alternatives Considered

- **Inline Conditional Rendering**: Rejected due to code duplication across widgets and inconsistent UX
- **Higher-Order Component Pattern**: Rejected due to TypeScript complexity and reduced flexibility
- **Render Props Pattern**: Rejected due to verbosity and less intuitive API

### Implementation Pattern

```tsx
// Widget with all states
export function HabitOverviewWidget() {
  const { data, isLoading, error } = useHabits()

  if (isLoading) {
    return <SkeletonLoader variant="dashboard-widget" />
  }

  if (error) {
    return (
      <ErrorBoundary
        error={error}
        retry={() => refetch()}
        context="Habit Overview"
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<PlusCircle />}
        message="No habits yet"
        action={{
          label: 'Create Habit',
          onClick: () => router.push('/habits/new'),
        }}
      />
    )
  }

  return <WidgetCard>{/* actual content */}</WidgetCard>
}
```

### Best Practices

- **Skeleton Loaders**: Match target component dimensions exactly to prevent layout shift
- **Error Boundaries**: Always provide retry mechanism and contextual error messages
- **Empty States**: Include actionable CTA (call-to-action) to guide user next steps
- **Loading States**: Use animated pulse effect (`animate-pulse` Tailwind class) for visual feedback
- **Accessibility**: Add `role="status"`, `aria-live="polite"` for screen readers

---

## Research Area 3: Animation Performance (60fps Target)

### Decision

Use CSS-only animations via Tailwind's `transition-*` utilities with GPU-accelerated properties (`transform`, `opacity`). Avoid animating layout properties (`width`, `height`, `margin`).

### Rationale

1. **GPU Acceleration**: `transform` and `opacity` trigger GPU compositing (no CPU layout recalc)
2. **Performance Budget**: CSS animations offloaded to compositor thread
3. **Browser Support**: CSS transitions supported in all target browsers (last 2 versions)
4. **60fps Guaranteed**: GPU-accelerated properties maintain 60fps even on mobile devices
5. **Reduced JavaScript**: No React animation libraries needed (lighter bundle)

### Alternatives Considered

- **Framer Motion**: Rejected due to bundle size (~35KB gzipped) and unnecessary complexity for simple transitions
- **React Spring**: Rejected due to physics-based animations being overkill for dashboard transitions
- **JavaScript requestAnimationFrame**: Rejected due to main-thread blocking risk and maintenance overhead

### Implementation Pattern

```tsx
// Hover animations (transform + shadow)
<div className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  <WidgetCard>...</WidgetCard>
</div>

// Theme transitions (opacity)
<div className="transition-opacity duration-300 ease-in-out opacity-100">
  {children}
</div>

// Loading states (pulse)
<div className="animate-pulse bg-zinc-800 rounded-lg h-32" />
```

### Best Practices

- **Duration**: Use `duration-200` (200ms) for micro-interactions, `duration-300` (300ms) for theme changes
- **Easing**: Default `ease-in-out` for most transitions; `ease-out` for entrances
- **Will-Change**: Avoid `will-change` CSS property (modern browsers auto-optimize)
- **Transforms**: Use `scale`, `translateX/Y` for movement; never animate `left/top`
- **Testing**: Profile with Chrome DevTools Performance tab to verify no dropped frames

---

## Research Area 4: Lazy Loading Strategy for Widgets

### Decision

Use Next.js 15 built-in lazy loading with React `<Suspense>` boundaries around below-the-fold widgets.

### Rationale

1. **Native Support**: Next.js 15 App Router has built-in code-splitting for client components
2. **Automatic Code Splitting**: Each dynamically imported widget becomes separate chunk
3. **Performance**: Reduces initial bundle size by 30-40% (only load visible widgets first)
4. **Progressive Enhancement**: Above-the-fold content renders immediately, below-the-fold loads progressively
5. **TypeScript Compatible**: No additional configuration needed

### Alternatives Considered

- **Manual `next/dynamic` imports**: Rejected as unnecessary (React 18 Suspense is preferred pattern in App Router)
- **Intersection Observer API**: Rejected as over-engineering (Suspense handles this natively)
- **Priority-based loading**: Rejected for P1 scope (can be added in future optimization)

### Implementation Pattern

```tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'
import HabitOverviewWidget from '@/components/dashboard/HabitOverviewWidget'

// Lazy-load below-the-fold widgets
const AnalyticsWidget = lazy(
  () => import('@/components/dashboard/AnalyticsWidget')
)
const HistoryWidget = lazy(() => import('@/components/dashboard/HistoryWidget'))

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Above-the-fold: Load immediately */}
      <HabitOverviewWidget />

      {/* Below-the-fold: Lazy load with suspense */}
      <Suspense fallback={<SkeletonLoader variant="analytics" />}>
        <AnalyticsWidget />
      </Suspense>

      <Suspense fallback={<SkeletonLoader variant="history" />}>
        <HistoryWidget />
      </Suspense>
    </DashboardLayout>
  )
}
```

### Best Practices

- **Suspense Boundaries**: Place around each lazy-loaded widget (not entire page) for granular loading
- **Fallback UI**: Always provide matching SkeletonLoader to prevent layout shift
- **Priority**: Load top 2-3 widgets immediately, lazy-load rest
- **Bundle Analysis**: Use `@next/bundle-analyzer` to verify chunk sizes (<50KB per widget)
- **Prefetching**: Consider `priority` prop for critical below-fold widgets

---

## Research Area 5: Dark Theme Consistency & Color Tokens

### Decision

Centralize dark theme colors in Tailwind config as semantic tokens, enforce via WidgetCard component default styling.

### Rationale

1. **Single Source of Truth**: Tailwind config defines all colors; no magic hex values in components
2. **Type Safety**: Tailwind IntelliSense provides autocomplete for color names
3. **Consistency**: WidgetCard component enforces zinc-900 background by default
4. **Maintainability**: Theme changes require updating only `tailwind.config.ts`
5. **Design System**: Aligns with existing `.github/copilot-instructions.md` color specs

### Alternatives Considered

- **CSS Variables**: Rejected due to Tailwind already providing theme system (redundant)
- **Inline Hex Values**: Rejected due to lack of centralization and maintenance risk
- **Theme Context Provider**: Rejected as unnecessary for dark-only theme in P1

### Implementation Pattern

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0A0A0A',    // Body background
          sidebar: '#101010',     // Sidebar background
          card: '#18181B',        // zinc-900 - Widget cards
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',  // border-white/10
        },
      },
    },
  },
}

// Component usage
<WidgetCard className="bg-background-card border border-border-subtle">
  {children}
</WidgetCard>
```

### Best Practices

- **Semantic Names**: Use `background-card` not `zinc-900` in components (easier to change later)
- **Opacity Utilities**: Use Tailwind's `/` notation for alpha (`white/10` = rgba(255,255,255,0.1))
- **Contrast Testing**: Automated tests verify 4.5:1 minimum contrast ratio (WCAG AA)
- **Consistency Enforcement**: Lint rule to warn on raw hex colors in JSX (force theme tokens)

---

## Research Area 6: Accessibility Best Practices for Responsive Widgets

### Decision

Implement comprehensive keyboard navigation, focus management, and ARIA attributes per WCAG 2.1 AA guidelines.

### Rationale

1. **Legal Compliance**: WCAG 2.1 AA is increasingly required by law (ADA, Section 508)
2. **Inclusive Design**: 15% of global population has some form of disability
3. **SEO Benefit**: Semantic HTML improves search engine understanding
4. **Better UX for All**: Keyboard shortcuts benefit power users, not just screen reader users
5. **Constitution Requirement**: Principle V mandates WCAG 2.1 AA compliance

### Alternatives Considered

- **Accessibility as Post-Launch Addition**: Rejected due to retrofitting cost being 3-5x higher
- **WCAG 2.0 Level A Only**: Rejected due to insufficient for modern web standards
- **Manual Testing Only**: Rejected due to inability to catch all issues (need automated + manual)

### Implementation Checklist

**Keyboard Navigation**:

- [ ] All interactive elements reachable via Tab key
- [ ] Tab order follows logical visual flow (top → bottom, left → right)
- [ ] Focus indicators visible (2px solid ring, high contrast color)
- [ ] Escape key closes modals/dropdowns
- [ ] Arrow keys navigate within widgets (if applicable)
- [ ] Enter/Space activate buttons

**Focus Management**:

- [ ] Focus trapped within modal dialogs
- [ ] Focus returns to trigger element after modal close
- [ ] Skip-to-content link for keyboard users (bypass navigation)
- [ ] No focus traps in main content flow

**ARIA Attributes**:

```tsx
// Loading state
<div role="status" aria-live="polite" aria-label="Loading habits">
  <SkeletonLoader />
</div>

// Error state
<div role="alert" aria-live="assertive">
  <ErrorBoundary error={error} />
</div>

// Empty state
<div role="status" aria-label="No habits found">
  <EmptyState message="No habits yet" />
</div>

// Interactive widget
<section aria-labelledby="habit-overview-title">
  <h2 id="habit-overview-title">Habit Overview</h2>
  {/* widget content */}
</section>
```

**Screen Reader Testing**:

- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA (Windows)
- [ ] Verify all content readable in logical order
- [ ] Verify state changes announced (loading, error, success)

**Color Contrast**:

- [ ] Text contrast ratio ≥ 4.5:1 for normal text (14px+)
- [ ] Text contrast ratio ≥ 3:1 for large text (18px+ or 14px bold)
- [ ] Focus indicators contrast ratio ≥ 3:1 against background
- [ ] Automated testing via axe-core

### Best Practices

- **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, `<section>` (not `<div>` with roles)
- **Labels**: Every form input has associated `<label>` or `aria-label`
- **Dynamic Content**: Use `aria-live` regions for content that updates without page reload
- **Skip Links**: Provide hidden skip-to-content link for keyboard users
- **Testing**: Run `axe-core` automated tests + manual keyboard/screen reader testing

---

## Research Area 7: Performance Monitoring & Metrics

### Decision

Use Lighthouse CI in GitHub Actions to enforce performance budgets; Chrome DevTools for local profiling.

### Rationale

1. **Automated Enforcement**: CI pipeline fails if performance regresses below thresholds
2. **Free**: Lighthouse CI is open-source, no additional cost
3. **Industry Standard**: Lighthouse metrics align with Core Web Vitals (Google's ranking factors)
4. **Actionable**: Provides specific recommendations for improvements
5. **CI Integration**: Easy to add to existing GitHub Actions workflow

### Alternatives Considered

- **WebPageTest**: Rejected due to more complex setup and potential costs for CI integration
- **Manual Testing Only**: Rejected due to human error and inconsistency
- **Real User Monitoring (RUM)**: Deferred to post-MVP (requires analytics infrastructure)

### Implementation Pattern

**Lighthouse CI Configuration** (`lighthouserc.json`):

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "speed-index": ["error", { "maxNumericValue": 3000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**GitHub Actions Workflow**:

```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    npm run build
    npm run start &
    sleep 5
    lhci autorun
```

**Local Profiling Workflow**:

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Navigate to dashboard, interact with widgets
4. Stop recording
5. Verify:
   - No frames dropped (green bar consistently)
   - Scripting time <100ms per interaction
   - Rendering time <16ms per frame (60fps = 16.67ms budget)

### Performance Budgets

| Metric                         | Target | Lighthouse Threshold |
| ------------------------------ | ------ | -------------------- |
| First Contentful Paint (FCP)   | <1s    | <1.8s (error)        |
| Largest Contentful Paint (LCP) | <2s    | <2.5s (error)        |
| Time to Interactive (TTI)      | <3s    | <3.5s (error)        |
| Total Blocking Time (TBT)      | <200ms | <300ms (error)       |
| Cumulative Layout Shift (CLS)  | <0.1   | <0.1 (error)         |
| Speed Index                    | <2.5s  | <3s (error)          |
| Performance Score              | ≥95    | ≥90 (error)          |

### Best Practices

- **Baseline**: Establish baseline metrics before starting enhancement
- **Run Multiple Times**: Average of 3+ runs for reliable results (network variance)
- **Throttling**: Test with "Slow 3G" network and "4x CPU slowdown" in DevTools
- **Bundle Analysis**: Use `@next/bundle-analyzer` to identify heavy chunks
- **Image Optimization**: Verify all images use Next.js `<Image>` component with WebP format

---

## Summary of Key Decisions

| Area                   | Decision                                    | Rationale                                   |
| ---------------------- | ------------------------------------------- | ------------------------------------------- |
| Grid System            | Tailwind CSS built-in responsive grid       | Zero dependencies, mobile-first, performant |
| State Management       | State-specific wrapper components           | Reusability, consistency, accessibility     |
| Animations             | CSS-only transitions (GPU-accelerated)      | 60fps guaranteed, lighter bundle            |
| Lazy Loading           | React Suspense with Next.js code-splitting  | Native support, automatic optimization      |
| Theme Consistency      | Tailwind config semantic tokens             | Single source of truth, type-safe           |
| Accessibility          | WCAG 2.1 AA with automated + manual testing | Legal compliance, inclusive design          |
| Performance Monitoring | Lighthouse CI in GitHub Actions             | Automated enforcement, industry standard    |

---

## Next Steps

1. ✅ **Phase 0 Complete**: All technical unknowns resolved
2. **Phase 1**: Generate `data-model.md` (component entity definitions)
3. **Phase 1**: Generate API contracts in `/contracts/` (if needed)
4. **Phase 1**: Generate `quickstart.md` (developer setup guide)
5. **Phase 1**: Update agent context files (Copilot instructions)
6. **Phase 2**: Generate `tasks.md` with detailed implementation tasks

---

**Research Completed**: 2025-10-20  
**Reviewed By**: AI Agent (GitHub Copilot)  
**Approved for Phase 1**: Yes ✅
