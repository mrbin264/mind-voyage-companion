# E2E Testing Guide - Mind Voyage Companion

## Overview

This directory contains comprehensive End-to-End (E2E) tests for the Mind Voyage Companion application using [Playwright](https://playwright.dev/).

## Test Structure

### Test Files

- **`dashboard-widgets.spec.ts`** - Dashboard widgets and components (T028-T033)
- **`habits-page.spec.ts`** - Habits page functionality (T034-T041)
- **`journal-page.spec.ts`** - Journal page features (T042-T049)
- **`analytics-page.spec.ts`** - Analytics and insights (T050-T058)
- **`wisdom-page.spec.ts`** - Wisdom/quotes features (T059-T067)

### Shared Utilities

- **`fixtures.ts`** - Test fixtures and authentication helpers
- **`.eslintrc.json`** - ESLint configuration for E2E tests

## Test Optimization Features

### 1. **Shared Authentication Fixtures**

Tests use Playwright fixtures to share authentication state across tests, reducing redundant login operations:

```typescript
import { test, expect, loginAsTestUser } from './fixtures'

test('My test', async ({ page }) => {
  await loginAsTestUser(page)
  // Test continues with authenticated page
})
```

### 2. **Extended Timeouts**

Configuration optimized for MongoDB Atlas latency and Next.js compilation:

- **Test Timeout**: 60 seconds (for slow database connections)
- **Navigation Timeout**: 30 seconds (for page loads)
- **Assertion Timeout**: 10 seconds (for element checks)

### 3. **Network Idle Waits**

Login helper uses `networkidle` wait strategy to ensure pages are fully loaded before proceeding:

```typescript
await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 })
```

## Running Tests

### All Tests

```bash
# Run all E2E tests across all browsers
pnpm playwright test

# Run in CI mode (Chromium only, faster)
CI=true pnpm playwright test
```

### Specific Test Files

```bash
# Dashboard widgets only
pnpm playwright test e2e/dashboard-widgets.spec.ts

# Habits page only
pnpm playwright test e2e/habits-page.spec.ts

# Journal page only
pnpm playwright test e2e/journal-page.spec.ts

# Analytics page only
pnpm playwright test e2e/analytics-page.spec.ts

# Wisdom page only
pnpm playwright test e2e/wisdom-page.spec.ts
```

### Specific Browsers

```bash
# Chromium only (fastest)
pnpm playwright test --project=chromium

# Firefox only
pnpm playwright test --project=firefox

# WebKit only
pnpm playwright test --project=webkit

# Mobile Chrome
pnpm playwright test --project="Mobile Chrome"

# Mobile Safari
pnpm playwright test --project="Mobile Safari"
```

### Debug Mode

```bash
# Run with UI mode (interactive)
pnpm playwright test --ui

# Run in headed mode (see browser)
pnpm playwright test --headed

# Debug specific test
pnpm playwright test --debug e2e/dashboard-widgets.spec.ts

# Run with specific grep pattern
pnpm playwright test -g "T028"  # Run all T028 tests
```

### Generate Report

```bash
# Generate HTML report after test run
pnpm playwright show-report

# Open last report
pnpm playwright show-report playwright-report
```

## Test Configuration

### Browser Support

Tests run on multiple browsers:

- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)
- **Mobile Chrome** (Pixel 5)
- **Mobile Safari** (iPhone 12)

**Note**: In CI mode, only Chromium runs for speed.

### Viewport Testing

Tests validate responsive design at:

- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1920x1080 (Full HD)

## Test Coverage

### Dashboard Widgets (T028-T033)

- ✅ Loading states and skeleton loaders
- ✅ Data display and rendering
- ✅ Empty states and CTAs
- ✅ Error handling and graceful failures
- ✅ Responsive design
- ✅ Accessibility compliance

### Habits Page (T034-T041)

- ✅ Navigation and page loading
- ✅ Habit list display and filtering
- ✅ Habit creation flow
- ✅ Habit completion tracking
- ✅ Search and filtering
- ✅ Responsive design
- ✅ Error handling
- ✅ Accessibility

### Journal Page (T042-T049)

- ✅ Entry list display
- ✅ Entry creation (textarea + contenteditable)
- ✅ Entry viewing and reading
- ✅ Mood tracking integration
- ✅ Search and date filtering
- ✅ Responsive design
- ✅ Error handling
- ✅ Accessibility

### Analytics Page (T050-T058)

- ✅ Chart and visualization display
- ✅ Time range filtering
- ✅ Performance metrics
- ✅ Insights and trends
- ✅ Data export
- ✅ Responsive design
- ✅ Error handling
- ✅ Accessibility

### Wisdom Page (T059-T067)

- ✅ Quote display
- ✅ Quote generation/refresh
- ✅ Favorites system
- ✅ Category filtering
- ✅ Search functionality
- ✅ Responsive design
- ✅ Error handling
- ✅ Accessibility

## Best Practices

### 1. **Use Semantic Selectors**

Prefer text matching and role-based selectors over data-testid:

```typescript
// Good
await page.locator('button:has-text("Create Habit")').click()
await page.locator('[role="button"]').click()

// Avoid (brittle)
await page.locator('[data-testid="create-habit-btn"]').click()
```

### 2. **Wait for Network Idle**

For pages with API calls, wait for network to settle:

```typescript
await page.goto('/dashboard', { waitUntil: 'networkidle' })
```

### 3. **Handle Different UI States**

Tests should handle loading, empty, and error states:

```typescript
const hasData = (await page.locator('.habit-card').count()) > 0
const hasEmptyState = await page.locator('text=/no habits/i').isVisible()
expect(hasData || hasEmptyState).toBeTruthy()
```

### 4. **Use Fixtures for Authentication**

Always use the shared `loginAsTestUser` fixture to reduce test time:

```typescript
import { test, expect, loginAsTestUser } from './fixtures'

test('My test', async ({ page }) => {
  await loginAsTestUser(page)
  // Continue with authenticated session
})
```

## Troubleshooting

### Tests Timeout

If tests timeout:

1. **Increase timeout in `playwright.config.ts`**:

   ```typescript
   timeout: 90000, // 90 seconds
   ```

2. **Check MongoDB Atlas connection**:
   - Ensure `MONGODB_URI` is set correctly
   - Check network latency to MongoDB Atlas

3. **Check Next.js dev server**:
   - Ensure `pnpm dev` is running
   - Check for compilation errors

### Tests Fail Intermittently

1. **Use more robust selectors**:
   - Avoid timing-dependent selectors
   - Wait for elements explicitly

2. **Increase wait times**:

   ```typescript
   await page.waitForTimeout(1000) // Add explicit wait
   ```

3. **Use network idle**:
   ```typescript
   await page.waitForLoadState('networkidle')
   ```

### Browser Launch Fails

1. **Install Playwright browsers**:

   ```bash
   pnpm playwright install
   ```

2. **Update Playwright**:
   ```bash
   pnpm add -D @playwright/test@latest
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright Browsers
  run: pnpm playwright install --with-deps chromium

- name: Run E2E Tests
  run: CI=true pnpm playwright test
  env:
    MONGODB_URI: ${{ secrets.MONGODB_URI }}
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Azure DevOps Pipeline

```yaml
- script: |
    pnpm install
    pnpm playwright install --with-deps chromium
  displayName: 'Install dependencies'

- script: |
    CI=true pnpm playwright test
  displayName: 'Run E2E Tests'
  env:
    MONGODB_URI: $(MONGODB_URI)
    NEXTAUTH_SECRET: $(NEXTAUTH_SECRET)

- task: PublishTestResults@2
  condition: always()
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'test-results/results.xml'
```

## Performance Tips

1. **Run in CI mode** for faster execution (Chromium only)
2. **Use parallel execution** (enabled by default)
3. **Reuse existing dev server** (`reuseExistingServer: true`)
4. **Limit retries** in local development (`retries: 0`)
5. **Use shared fixtures** to reduce authentication overhead

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

## Support

For issues or questions:

1. Check test logs in `playwright-report/`
2. Review test traces with `pnpm playwright show-trace`
3. Open an issue in the repository
4. Contact the development team
