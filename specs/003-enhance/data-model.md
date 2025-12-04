# Phase 1: Data Model - Component Entities

**Feature**: Enhanced Responsive Dashboard with Consistent Dark Theme  
**Branch**: `003-enhance`  
**Date**: 2025-10-20

## Overview

This document defines the component entities (UI components, not database models) for the responsive dashboard enhancement. No database schema changes are required for P1.

---

## Component Entity 1: WidgetCard (Enhanced)

### Purpose

Reusable container component providing consistent dark theme styling, responsive behavior, and state management for all dashboard widgets.

### Properties

| Property      | Type               | Required | Default | Description                                           |
| ------------- | ------------------ | -------- | ------- | ----------------------------------------------------- |
| `children`    | `React.ReactNode`  | Yes      | -       | Widget content to render inside card                  |
| `title`       | `string`           | No       | -       | Optional card title displayed in header               |
| `subtitle`    | `string`           | No       | -       | Optional subtitle/description                         |
| `icon`        | `React.ReactNode`  | No       | -       | Optional icon for card header                         |
| `className`   | `string`           | No       | `''`    | Additional Tailwind classes for customization         |
| `loading`     | `boolean`          | No       | `false` | If true, renders SkeletonLoader instead of children   |
| `error`       | `Error \| null`    | No       | `null`  | If provided, renders ErrorBoundary with error details |
| `empty`       | `boolean`          | No       | `false` | If true, renders EmptyState component                 |
| `emptyConfig` | `EmptyStateConfig` | No       | -       | Configuration for empty state (message, icon, action) |
| `actions`     | `React.ReactNode`  | No       | -       | Optional action buttons in card header                |
| `fullWidth`   | `boolean`          | No       | `false` | If true, removes max-width constraint                 |
| `noPadding`   | `boolean`          | No       | `false` | If true, removes internal padding (for charts/images) |

### Default Styling

```tsx
// Base classes applied automatically
const baseClasses = `
  bg-background-card           // zinc-900 (#18181B)
  border border-border-subtle  // white/10 opacity
  rounded-xl                   // 12px border radius
  p-6                          // 1.5rem padding
  transition-all duration-200  // Smooth animations
  hover:shadow-lg              // Elevation on hover
`
```

### State Variants

**Loading State**:

```tsx
<WidgetCard loading={true}>
  {/* Content hidden, SkeletonLoader shown */}
</WidgetCard>
```

**Error State**:

```tsx
<WidgetCard error={new Error('Failed to load habits')}>
  {/* Content hidden, ErrorBoundary shown with retry button */}
</WidgetCard>
```

**Empty State**:

```tsx
<WidgetCard
  empty={true}
  emptyConfig={{
    icon: <PlusCircle />,
    message: 'No habits yet',
    action: { label: 'Create Habit', onClick: () => {} },
  }}
>
  {/* Content hidden, EmptyState shown */}
</WidgetCard>
```

### Responsive Behavior

- **Mobile (375px-767px)**: Full width, reduced padding (`p-4`)
- **Tablet (768px-1023px)**: Standard padding (`p-6`), max-width constraints
- **Desktop (1024px+)**: Full padding (`p-6`), grid-aware sizing

### Accessibility

- Semantic HTML: Wraps content in `<section>` with `aria-labelledby` if title provided
- Focus management: Focusable if contains interactive elements
- Screen reader: Title announced as heading, state changes announced via `aria-live`

---

## Component Entity 2: SkeletonLoader (New)

### Purpose

Animated loading placeholder matching target widget dimensions to prevent layout shift during data fetching.

### Properties

| Property    | Type              | Required | Default | Description                                     |
| ----------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `variant`   | `SkeletonVariant` | Yes      | -       | Predefined skeleton layout matching widget type |
| `count`     | `number`          | No       | `1`     | Number of repeated skeleton items (for lists)   |
| `className` | `string`          | No       | `''`    | Additional Tailwind classes                     |
| `animate`   | `boolean`         | No       | `true`  | If true, shows pulse animation                  |

### Skeleton Variants

```typescript
type SkeletonVariant =
  | 'dashboard-widget' // Standard widget: 320px height, rounded corners
  | 'habit-card' // Habit item: 80px height, horizontal layout
  | 'chart' // Chart widget: 400px height, no pulse (static gray)
  | 'analytics' // Analytics widget: 240px height, stat blocks
  | 'list-item' // List entry: 60px height, repeated pattern
  | 'avatar' // User avatar: 48px circle
  | 'text-line' // Single text line: 16px height, variable width
```

### Implementation Example

```tsx
// Variant: 'dashboard-widget'
<div className="space-y-4 animate-pulse">
  {/* Title skeleton */}
  <div className="h-6 bg-zinc-800 rounded w-1/3" />

  {/* Content skeleton */}
  <div className="h-32 bg-zinc-800 rounded" />

  {/* Footer skeleton */}
  <div className="flex gap-2">
    <div className="h-4 bg-zinc-800 rounded w-1/4" />
    <div className="h-4 bg-zinc-800 rounded w-1/4" />
  </div>
</div>
```

### Accessibility

- `role="status"`: Indicates loading region
- `aria-live="polite"`: Announces loading to screen readers
- `aria-label="Loading {variant}"`: Descriptive label for context

---

## Component Entity 3: EmptyState (New)

### Purpose

User-friendly placeholder displayed when widgets have no data, providing context and actionable next steps.

### Properties

| Property      | Type                     | Required | Default     | Description                            |
| ------------- | ------------------------ | -------- | ----------- | -------------------------------------- |
| `icon`        | `React.ReactNode`        | Yes      | -           | Icon representing empty state context  |
| `message`     | `string`                 | Yes      | -           | Primary message explaining empty state |
| `description` | `string`                 | No       | -           | Optional secondary description/hint    |
| `action`      | `ActionConfig \| null`   | No       | `null`      | Optional CTA button configuration      |
| `variant`     | `'default' \| 'compact'` | No       | `'default'` | Display size variant                   |
| `className`   | `string`                 | No       | `''`        | Additional Tailwind classes            |

### Action Configuration

```typescript
interface ActionConfig {
  label: string // Button text
  onClick: () => void // Click handler
  variant?: 'primary' | 'secondary' // Button style
  icon?: React.ReactNode // Optional button icon
}
```

### Visual Design

```tsx
// Default variant
<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
  {/* Icon: 48px, zinc-600 color */}
  <div className="mb-4 text-zinc-600">{icon}</div>

  {/* Message: 18px, zinc-400 */}
  <p className="text-lg text-zinc-400 mb-2">{message}</p>

  {/* Description: 14px, zinc-500 (optional) */}
  {description && <p className="text-sm text-zinc-500 mb-6">{description}</p>}

  {/* CTA Button (optional) */}
  {action && (
    <button
      onClick={action.onClick}
      className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
    >
      {action.label}
    </button>
  )}
</div>
```

### Accessibility

- `role="status"`: Indicates informational region
- `aria-label`: Descriptive label combining message + context
- Button: Proper focus indicator and keyboard activation

---

## Component Entity 4: ErrorBoundary (New)

### Purpose

Graceful error handling component displaying user-friendly error messages with retry mechanism.

### Properties

| Property      | Type                     | Required | Default    | Description                                           |
| ------------- | ------------------------ | -------- | ---------- | ----------------------------------------------------- |
| `error`       | `Error`                  | Yes      | -          | Error object containing details                       |
| `retry`       | `() => void \| null`     | No       | `null`     | Optional retry callback function                      |
| `context`     | `string`                 | No       | `'Widget'` | Contextual name (e.g., "Habit Overview", "Analytics") |
| `fallback`    | `React.ReactNode`        | No       | -          | Optional custom fallback UI                           |
| `showDetails` | `boolean`                | No       | `false`    | If true, shows error stack in dev mode                |
| `onError`     | `(error: Error) => void` | No       | -          | Optional error reporting callback                     |

### Error Types Handled

```typescript
// Network errors
{ name: 'NetworkError', message: 'Failed to fetch data' }

// API errors
{ name: 'APIError', message: 'Server returned 500', status: 500 }

// Validation errors
{ name: 'ValidationError', message: 'Invalid data format' }

// Generic errors
{ name: 'Error', message: 'Something went wrong' }
```

### Visual Design

```tsx
<div className="flex flex-col items-center justify-center py-8 px-6 text-center">
  {/* Error Icon: Red/Orange color */}
  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />

  {/* Error Title */}
  <h3 className="text-lg font-semibold text-zinc-200 mb-2">
    Unable to load {context}
  </h3>

  {/* Error Message */}
  <p className="text-sm text-zinc-400 mb-6">{getUserFriendlyMessage(error)}</p>

  {/* Action Buttons */}
  <div className="flex gap-3">
    {retry && (
      <button
        onClick={retry}
        className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
      >
        Try Again
      </button>
    )}
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg"
    >
      Refresh Page
    </button>
  </div>

  {/* Error Details (dev only) */}
  {showDetails && process.env.NODE_ENV === 'development' && (
    <details className="mt-6 text-left text-xs text-zinc-500">
      <summary>Error Details</summary>
      <pre className="mt-2 p-4 bg-zinc-900 rounded overflow-auto">
        {error.stack}
      </pre>
    </details>
  )}
</div>
```

### Accessibility

- `role="alert"`: Announces error to screen readers immediately
- `aria-live="assertive"`: High-priority announcement
- Focus management: Moves focus to retry button for keyboard users

---

## Component Entity 5: DashboardLayout (Enhanced)

### Purpose

Root layout component managing responsive grid system, sidebar navigation, and mobile menu behavior.

### Properties

| Property           | Type                           | Required | Default | Description               |
| ------------------ | ------------------------------ | -------- | ------- | ------------------------- |
| `children`         | `React.ReactNode`              | Yes      | -       | Main dashboard content    |
| `user`             | `User`                         | Yes      | -       | Authenticated user object |
| `sidebarCollapsed` | `boolean`                      | No       | `false` | Initial sidebar state     |
| `onSidebarToggle`  | `(collapsed: boolean) => void` | No       | -       | Sidebar toggle callback   |

### Responsive Behavior

**Mobile (375px-767px)**:

- Sidebar hidden by default
- Hamburger menu button visible in top-left
- Sidebar slides in as overlay when opened (z-index: 50)
- Backdrop overlay dims content (bg-black/50)
- Close on backdrop click or Escape key

**Tablet (768px-1023px)**:

- Sidebar collapsible (toggle button in header)
- When collapsed: icon-only navigation (64px width)
- When expanded: full navigation (256px width)
- Content area adjusts width accordingly

**Desktop (1024px+)**:

- Sidebar persistent (always visible)
- Full width navigation (256px)
- No collapse functionality (always expanded)

### Grid Container

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
  {children}
</div>
```

### Accessibility

- Landmark regions: `<nav>`, `<main>`, `<aside>`
- Skip-to-content link: Bypasses sidebar navigation
- Focus trap: When mobile sidebar open, focus contained within
- Keyboard shortcuts: `Ctrl+B` toggles sidebar

---

## Component Entity 6: ResponsiveGrid (New Helper)

### Purpose

Utility component enforcing consistent grid layouts across dashboard pages.

### Properties

| Property    | Type                | Required | Default | Description                       |
| ----------- | ------------------- | -------- | ------- | --------------------------------- |
| `children`  | `React.ReactNode`   | Yes      | -       | Grid items (widgets)              |
| `columns`   | `ResponsiveColumns` | No       | Default | Column count per breakpoint       |
| `gap`       | `number`            | No       | `6`     | Gap size (Tailwind spacing scale) |
| `className` | `string`            | No       | `''`    | Additional classes                |

### Column Configuration

```typescript
interface ResponsiveColumns {
  mobile: number // 375px+: Default 1
  tablet: number // 768px+: Default 2
  desktop: number // 1024px+: Default 3
  xl: number // 1280px+: Default 5
}
```

### Usage Example

```tsx
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 5 }}>
  <WidgetCard className="xl:col-span-3">
    <HabitOverview />
  </WidgetCard>
  <WidgetCard className="xl:col-span-2">
    <StreakCard />
  </WidgetCard>
</ResponsiveGrid>
```

---

## Custom Hook: useMediaQuery (New)

### Purpose

React hook for responsive breakpoint detection and conditional rendering.

### Signature

```typescript
function useMediaQuery(query: string): boolean
```

### Usage Example

```tsx
function DashboardWidget() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return <WidgetCard>{isMobile ? <MobileView /> : <DesktopView />}</WidgetCard>
}
```

### Predefined Breakpoints Export

```typescript
export const breakpoints = {
  isMobile: '(max-width: 767px)',
  isTablet: '(min-width: 768px) and (max-width: 1023px)',
  isDesktop: '(min-width: 1024px)',
  isXL: '(min-width: 1280px)',
}
```

### Implementation

- Uses `window.matchMedia` API
- Server-side safe (returns `false` during SSR)
- Subscribes to media query changes with `useEffect`
- Cleans up listeners on unmount

---

## Type Definitions (src/types/ui.ts)

```typescript
// Widget Card Types
export interface WidgetCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  className?: string
  loading?: boolean
  error?: Error | null
  empty?: boolean
  emptyConfig?: EmptyStateConfig
  actions?: React.ReactNode
  fullWidth?: boolean
  noPadding?: boolean
}

// Empty State Types
export interface EmptyStateConfig {
  icon: React.ReactNode
  message: string
  description?: string
  action?: ActionConfig | null
}

export interface ActionConfig {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
}

// Skeleton Loader Types
export type SkeletonVariant =
  | 'dashboard-widget'
  | 'habit-card'
  | 'chart'
  | 'analytics'
  | 'list-item'
  | 'avatar'
  | 'text-line'

export interface SkeletonLoaderProps {
  variant: SkeletonVariant
  count?: number
  className?: string
  animate?: boolean
}

// Error Boundary Types
export interface ErrorBoundaryProps {
  error: Error
  retry?: (() => void) | null
  context?: string
  fallback?: React.ReactNode
  showDetails?: boolean
  onError?: (error: Error) => void
}

// Dashboard Layout Types
export interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  sidebarCollapsed?: boolean
  onSidebarToggle?: (collapsed: boolean) => void
}

// Responsive Grid Types
export interface ResponsiveColumns {
  mobile: number
  tablet: number
  desktop: number
  xl: number
}

export interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: ResponsiveColumns
  gap?: number
  className?: string
}

// Breakpoint Types
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'xl'
```

---

## Component Relationships

```
DashboardLayout (root)
├── Sidebar (navigation)
│   ├── Logo
│   ├── NavLinks
│   └── UserProfile
│
├── MobileNav (mobile only)
│   └── Hamburger Menu
│
└── ResponsiveGrid (main content)
    └── WidgetCard (repeated)
        ├── [Normal State]
        │   ├── Title/Icon/Actions
        │   └── Children Content
        │
        ├── [Loading State]
        │   └── SkeletonLoader
        │
        ├── [Error State]
        │   └── ErrorBoundary
        │       ├── Error Icon
        │       ├── Message
        │       └── Retry Button
        │
        └── [Empty State]
            └── EmptyState
                ├── Icon
                ├── Message
                └── CTA Button
```

---

## Validation Rules

### WidgetCard

- `children` must not be empty if `loading`, `error`, and `empty` are all false
- `emptyConfig` required if `empty={true}`
- `title` max length: 50 characters
- `subtitle` max length: 100 characters

### SkeletonLoader

- `count` must be positive integer (1-20)
- `variant` must match predefined SkeletonVariant enum

### EmptyState

- `message` required, max length: 100 characters
- `description` max length: 200 characters
- `action.label` max length: 30 characters

### ErrorBoundary

- `error` must have `name` and `message` properties
- `context` max length: 50 characters
- `retry` function must be non-blocking (async operations handled internally)

---

## State Transitions

### WidgetCard State Machine

```
Initial → Loading
Loading → Content (success) | Error (failure)
Content → Loading (refresh) | Error (failure)
Error → Loading (retry) | Content (success)
Empty → Loading (action triggered) | Content (data added)
```

### Accessibility State Announcements

- Loading → Error: `aria-live="assertive"` (immediate announcement)
- Loading → Content: `aria-live="polite"` (delayed announcement)
- Empty → Loading: `aria-live="polite"` (delayed announcement)

---

## Performance Considerations

### Rendering Optimization

- **Memoization**: Wrap WidgetCard in `React.memo` to prevent unnecessary re-renders
- **Code Splitting**: Each widget variant lazy-loaded via `React.lazy()`
- **Virtual Scrolling**: For widgets with >50 list items, use react-window (future enhancement)

### Bundle Impact

| Component       | Estimated Size | Notes                         |
| --------------- | -------------- | ----------------------------- |
| WidgetCard      | ~2KB           | Base component                |
| SkeletonLoader  | ~0.5KB         | Minimal (CSS-only animations) |
| EmptyState      | ~1KB           | Simple UI, no complex logic   |
| ErrorBoundary   | ~1.5KB         | Includes error parsing logic  |
| DashboardLayout | ~3KB           | Includes sidebar logic        |
| useMediaQuery   | ~0.5KB         | Lightweight hook              |
| **Total**       | **~9KB**       | Gzipped: ~3KB                 |

---

## Next Steps

1. ✅ **Phase 1**: Data model defined (this document)
2. **Phase 1**: Generate API contracts (N/A for P1 - no API changes)
3. **Phase 1**: Generate `quickstart.md` (developer setup guide)
4. **Phase 1**: Update agent context files
5. **Phase 2**: Generate `tasks.md` with implementation tasks

---

**Data Model Completed**: 2025-10-20  
**Reviewed By**: AI Agent (GitHub Copilot)  
**Approved for Implementation**: Yes ✅
