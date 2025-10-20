# Quickstart Guide: Enhanced Responsive Dashboard

**Feature**: P1 - Enhanced Responsive Dashboard with Consistent Dark Theme  
**Branch**: `003-enhance`  
**Target**: Developers implementing or reviewing this enhancement

---

## Prerequisites

Before starting, ensure you have:

- [x] Node.js 18+ installed
- [x] pnpm package manager (`npm install -g pnpm`)
- [x] Git configured with access to repository
- [x] Code editor with TypeScript support (VS Code recommended)
- [x] Chrome/Firefox DevTools familiarity (for performance profiling)

---

## Getting Started

### 1. Checkout Feature Branch

```bash
# From develop branch
git checkout develop
git pull origin develop

# Checkout feature branch
git checkout 003-enhance

# If branch doesn't exist locally, create it
git checkout -b 003-enhance origin/003-enhance
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm list next react tailwindcss
```

### 3. Start Development Server

```bash
# Start Next.js dev server (MongoDB Memory Server starts automatically)
pnpm dev

# Server runs on http://localhost:3000
# Dashboard: http://localhost:3000/dashboard
```

**Expected Output**:

```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.x:3000

✓ MongoDB Memory Server started successfully
✓ Connected to database: mongodb://127.0.0.1:54321/mind-voyage-dev
```

### 4. Verify Current State

Open browser to `http://localhost:3000/dashboard` and verify:

- [ ] Dashboard loads without errors
- [ ] Existing widgets render correctly
- [ ] Dark theme (zinc-900) backgrounds present
- [ ] Sidebar navigation functional

---

## Project Structure Overview

Key directories for this enhancement:

```
src/
├── components/
│   ├── ui/                          # UI primitives (WidgetCard, etc.)
│   ├── layout/                      # Layout components (DashboardLayout)
│   └── dashboard/                   # Dashboard-specific widgets
│
├── app/
│   └── dashboard/                   # Dashboard pages (Server Components)
│
├── hooks/                           # Custom React hooks
├── lib/                             # Utilities, DB, auth
├── types/                           # TypeScript definitions
└── styles/                          # Global styles

specs/003-enhance/                   # Feature documentation
├── spec.md                          # Requirements
├── plan.md                          # Implementation plan
├── research.md                      # Technical decisions
├── data-model.md                    # Component entities
└── quickstart.md                    # This file
```

---

## Development Workflow

### Creating New Components

#### 1. UI Component (e.g., SkeletonLoader)

```bash
# Create component file
touch src/components/ui/skeleton-loader.tsx

# Create test file
touch src/components/ui/__tests__/skeleton-loader.test.tsx
```

**Component Template**:

```tsx
// src/components/ui/skeleton-loader.tsx
'use client'

import { SkeletonLoaderProps } from '@/types/ui'

export function SkeletonLoader({
  variant,
  count = 1,
  animate = true,
  className = '',
}: SkeletonLoaderProps) {
  // Implementation
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${variant}`}
      className={className}
    >
      {/* Skeleton UI */}
    </div>
  )
}
```

#### 2. Enhanced Existing Component (e.g., WidgetCard)

```bash
# Component already exists at src/components/ui/widget-card.tsx
# Add new props and state logic

# Create/update test
touch src/components/ui/__tests__/widget-card.test.tsx
```

### Testing Components

#### Unit Tests (Vitest + React Testing Library)

```bash
# Run tests in watch mode
pnpm test

# Run tests once with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/components/ui/__tests__/widget-card.test.tsx
```

**Test Template**:

```tsx
// src/components/ui/__tests__/widget-card.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WidgetCard } from '../widget-card'

describe('WidgetCard', () => {
  it('renders children content', () => {
    render(
      <WidgetCard>
        <div>Test Content</div>
      </WidgetCard>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('shows loading state when loading prop is true', () => {
    render(
      <WidgetCard loading={true}>
        <div>Content</div>
      </WidgetCard>
    )
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Loading')
    )
  })
})
```

#### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (interactive)
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test e2e/dashboard-responsive.spec.ts
```

**E2E Test Template**:

```typescript
// e2e/dashboard-responsive.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard Responsive Behavior', () => {
  test('renders mobile layout at 375px width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')

    // Verify hamburger menu visible
    const hamburger = page.getByRole('button', { name: /menu/i })
    await expect(hamburger).toBeVisible()

    // Verify widgets stack vertically
    const widgets = page.locator('[class*="widget-card"]')
    const count = await widgets.count()
    expect(count).toBeGreaterThan(0)
  })

  test('renders desktop layout at 1280px width', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/dashboard')

    // Verify sidebar always visible
    const sidebar = page.getByRole('navigation')
    await expect(sidebar).toBeVisible()

    // Verify grid layout
    const grid = page.locator('.grid')
    await expect(grid).toHaveClass(/xl:grid-cols-5/)
  })
})
```

### Performance Testing

#### Lighthouse CI (Automated)

```bash
# Install Lighthouse CI
pnpm install -g @lhci/cli

# Build production version
pnpm build

# Start production server in background
pnpm start &

# Run Lighthouse CI
lhci autorun

# Stop background server
pkill -f "next start"
```

#### Chrome DevTools Profiling (Manual)

1. Open Dashboard: `http://localhost:3000/dashboard`
2. Open DevTools: `Cmd+Option+I` (Mac) or `F12` (Windows/Linux)
3. Switch to **Performance** tab
4. Click **Record** (circle icon)
5. Interact with dashboard (scroll, click widgets, toggle sidebar)
6. Click **Stop** (square icon)
7. Analyze:
   - **FPS graph**: Should be consistently green (60fps)
   - **Scripting time**: Should be <100ms per interaction
   - **Rendering time**: Should be <16ms per frame

---

## Responsive Testing Workflow

### Breakpoint Testing

Use Chrome DevTools Device Toolbar (`Cmd+Shift+M` or `Ctrl+Shift+M`):

1. **Mobile (375px)**:
   - Device: iPhone SE
   - Verify: Hamburger menu, vertical widget stack, readable text

2. **Tablet (768px)**:
   - Device: iPad Mini
   - Verify: 2-column grid, collapsible sidebar, touch-friendly buttons

3. **Desktop (1024px)**:
   - Device: Custom (1024x768)
   - Verify: 3-column grid, persistent sidebar, all widgets visible

4. **XL (1280px+)**:
   - Device: Custom (1280x800 or larger)
   - Verify: 5-column grid, xl:col-span patterns, optimal spacing

### Manual Testing Checklist

At each breakpoint:

- [ ] Layout adjusts smoothly (no jumps or overlaps)
- [ ] Text remains readable (no truncation or overflow)
- [ ] Interactive elements accessible (buttons, links, inputs)
- [ ] Images/charts scale appropriately
- [ ] Dark theme colors consistent (zinc-900 backgrounds)
- [ ] Animations run at 60fps (no jank)

---

## Accessibility Testing

### Automated Testing (axe-core)

```bash
# Install axe DevTools extension for Chrome/Firefox
# https://www.deque.com/axe/devtools/

# Or run programmatic tests
pnpm add -D @axe-core/playwright
```

**Automated Test**:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('dashboard has no accessibility violations', async ({ page }) => {
  await page.goto('/dashboard')

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

### Manual Keyboard Testing

1. **Tab Navigation**:
   - Press `Tab` repeatedly
   - Verify focus moves logically (top → bottom, left → right)
   - All interactive elements reachable
   - Focus indicators visible (2px solid ring)

2. **Keyboard Shortcuts**:
   - `Escape`: Close modals/dropdowns
   - `Enter`/`Space`: Activate buttons
   - `Arrow keys`: Navigate within widgets (if applicable)

3. **Skip Link**:
   - Press `Tab` on page load
   - Verify "Skip to content" link appears
   - Press `Enter` to skip to main content

### Screen Reader Testing

**macOS (VoiceOver)**:

```bash
# Enable VoiceOver
Cmd+F5

# Navigate
Control+Option+Arrow keys

# Read page
Control+Option+A

# Disable VoiceOver
Cmd+F5
```

**Windows (NVDA)**:

```bash
# Download NVDA: https://www.nvaccess.org/download/

# Start NVDA
Ctrl+Alt+N

# Navigate
Arrow keys or Tab

# Read page
Insert+Down Arrow
```

**Testing Checklist**:

- [ ] Page title announced on load
- [ ] Landmarks announced (navigation, main content)
- [ ] Widget titles read as headings
- [ ] Loading states announced ("Loading habits")
- [ ] Error states announced ("Unable to load habits")
- [ ] Empty states provide context ("No habits yet")
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels

---

## Code Quality Checks

### Before Committing

Run the full quality pipeline:

```bash
# 1. Lint and auto-fix issues
pnpm lint:fix

# 2. Format code with Prettier
pnpm format

# 3. Type check
pnpm type-check

# 4. Run tests
pnpm test

# All pass? Safe to commit!
```

### Pre-commit Hooks (Husky)

Hooks run automatically on `git commit`:

- ESLint validation
- Prettier formatting check
- TypeScript compilation

If hooks fail, commit is blocked. Fix issues and try again.

---

## Common Issues & Solutions

### Issue 1: MongoDB Memory Server Fails to Start

**Symptom**: Error connecting to database on `pnpm dev`

**Solution**:

```bash
# Clean up stale MongoDB process
pnpm db:cleanup

# Restart dev server
pnpm dev
```

### Issue 2: Port 3000 Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Issue 3: Tailwind Classes Not Applying

**Symptom**: Component renders but styles don't apply

**Solution**:

```bash
# Verify Tailwind config includes correct paths
cat tailwind.config.ts | grep content

# Should include: './src/**/*.{js,ts,jsx,tsx}'

# Restart dev server to rebuild Tailwind
pnpm dev
```

### Issue 4: TypeScript Errors in Editor but CLI Passes

**Symptom**: VS Code shows errors, but `pnpm type-check` succeeds

**Solution**:

```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or restart VS Code entirely
```

### Issue 5: Tests Fail with "Cannot find module '@/components/...'"

**Symptom**: Import aliases not resolving in tests

**Solution**:

```bash
# Verify vitest.config.ts has correct alias setup
cat vitest.config.ts | grep resolve

# Should map '@' to './src'

# Restart test runner
pnpm test
```

---

## Debugging Tips

### React DevTools

```bash
# Install React DevTools extension
# Chrome: https://chrome.google.com/webstore (search "React Developer Tools")
# Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/

# Usage:
# 1. Open DevTools → "Components" tab
# 2. Select component in tree
# 3. View props, state, hooks
# 4. Edit props in real-time
```

### Next.js Debug Mode

```bash
# Enable verbose logging
NODE_OPTIONS='--inspect' pnpm dev

# Open chrome://inspect in Chrome
# Click "inspect" under Remote Target
# Set breakpoints in Sources tab
```

### Performance Profiling

```bash
# Generate production build with profiling
pnpm build -- --profile

# Analyze bundle
pnpm add -D @next/bundle-analyzer
# Add to next.config.js:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true pnpm build
```

---

## Environment Variables

### Development (.env.local)

```bash
# MongoDB (Memory Server used in dev, this is optional)
# MONGODB_URI=mongodb://127.0.0.1:54321/mind-voyage-dev

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Production (.env.production)

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mind-voyage

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<production-secret>

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=false
```

**Security**: Never commit `.env.local` or `.env.production` to Git!

---

## Useful Commands Reference

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start development server       |
| `pnpm build`         | Build production bundle        |
| `pnpm start`         | Start production server        |
| `pnpm lint`          | Run ESLint (check only)        |
| `pnpm lint:fix`      | Run ESLint with auto-fix       |
| `pnpm format`        | Format code with Prettier      |
| `pnpm type-check`    | TypeScript compilation check   |
| `pnpm test`          | Run unit tests (watch mode)    |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm test:e2e`      | Run Playwright E2E tests       |
| `pnpm db:cleanup`    | Clean MongoDB Memory Server    |

---

## Documentation References

- **Feature Spec**: `specs/003-enhance/spec.md`
- **Implementation Plan**: `specs/003-enhance/plan.md`
- **Research Decisions**: `specs/003-enhance/research.md`
- **Data Model**: `specs/003-enhance/data-model.md`
- **Constitution**: `.specify/memory/constitution.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Playwright**: https://playwright.dev/docs/intro
- **Vitest**: https://vitest.dev/guide/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

## Getting Help

1. **Read the docs**: Check `specs/003-enhance/` for detailed info
2. **Search codebase**: Use `grep` or VS Code search for examples
3. **Check constitution**: `.specify/memory/constitution.md` for patterns
4. **Ask AI agent**: GitHub Copilot knows the project structure

---

**Quickstart Guide Version**: 1.0  
**Last Updated**: 2025-10-20  
**Maintainer**: Development Team
