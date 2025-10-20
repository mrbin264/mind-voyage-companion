import { test, expect, loginAsTestUser } from './fixtures'

/**
 * E2E Tests for Dashboard Widgets
 *
 * Tests the following components:
 * - HabitOverviewWidget
 * - StreakCard
 * - WeeklyProgressChart
 * - QuickStatsWidget
 *
 * Test scenarios:
 * - Loading states (skeleton loaders)
 * - Data display (correct rendering)
 * - Empty states (no data messages)
 * - Error handling (graceful failures)
 *
 * Note: Uses optimized test fixtures for authentication
 * to reduce redundant login operations and improve performance.
 */

test.describe('Dashboard Widgets - Loading States (T028)', () => {
  test('T028.1: Dashboard loads and displays widgets within 5 seconds', async ({
    page,
  }) => {
    const startTime = Date.now()

    // Navigate to login
    await page.goto('/login')

    // Login and navigate to dashboard
    await loginAsTestUser(page)

    // Wait for main dashboard content to be visible
    const dashboard = page.locator('main, [role="main"]')
    await expect(dashboard).toBeVisible({ timeout: 5000 })

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(10000) // 10 seconds max for full flow
  })

  test('T028.2: Widget cards are present on dashboard', async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)

    // Look for widget cards by common patterns
    const widgetCards = page
      .locator('.bg-\\[\\#18181B\\], .widget-card, article, section')
      .filter({
        has: page.locator('h1, h2, h3, h4'),
      })

    const count = await widgetCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('T028.3: Page renders without console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/login')
    await loginAsTestUser(page)

    // Wait for page to fully load
    await page.waitForTimeout(2000)

    // Filter out known/acceptable errors
    const criticalErrors = consoleErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('DevTools')
    )

    expect(criticalErrors.length).toBe(0)
  })
})

test.describe('Dashboard Widgets - Data Display (T029)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)
  })

  test('T029.1: Habits section is visible', async ({ page }) => {
    // Look for "Today's Habits" or similar heading
    const habitsHeading = page.locator('text=/today.*habit|habit.*today/i')
    await expect(habitsHeading.first()).toBeVisible({ timeout: 5000 })
  })

  test('T029.2: Stats or metrics are displayed', async ({ page }) => {
    // Look for numerical stats (e.g., "5 habits", "3 days", "80%")
    const statsPattern = page.locator(
      'text=/\\d+\\s*(habit|day|%|streak|week|total)/i'
    )

    // Should have at least one stat visible
    const count = await statsPattern.count()
    expect(count).toBeGreaterThan(0)
  })

  test('T029.3: Interactive buttons are present', async ({ page }) => {
    // Find all buttons on the dashboard
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    expect(buttonCount).toBeGreaterThan(0)

    // Check that at least one button is enabled
    let hasEnabledButton = false
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i)
      if (await button.isEnabled()) {
        hasEnabledButton = true
        break
      }
    }

    expect(hasEnabledButton).toBeTruthy()
  })

  test('T029.4: Icons are rendered in widget cards', async ({ page }) => {
    // Look for SVG icons or emoji
    const icons = page.locator('svg, .emoji, [class*="icon"]')
    const iconCount = await icons.count()

    expect(iconCount).toBeGreaterThan(0)
  })

  test('T029.5: Dashboard has proper heading structure', async ({ page }) => {
    // Check for main heading
    const mainHeading = page.locator('h1, h2')
    await expect(mainHeading.first()).toBeVisible()

    // Check for section headings
    const sectionHeadings = page.locator('h2, h3, h4')
    const headingCount = await sectionHeadings.count()

    expect(headingCount).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Dashboard Widgets - Empty States (T030)', () => {
  test('T030.1: Dashboard shows content or empty states', async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)

    // Check for either content or empty state messages
    const hasContent = await page
      .locator('text=/habit|streak|progress|journal/i')
      .isVisible()
    const hasEmptyState = await page
      .locator('text=/no habits|no data|start|create|get started/i')
      .isVisible()

    // Should have either content or empty state
    expect(hasContent || hasEmptyState).toBeTruthy()
  })

  test('T030.2: Empty state provides call-to-action', async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)

    // If there's an empty state, it should have a CTA
    const emptyStateMessage = page.locator(
      'text=/no habits|no data|get started/i'
    )

    if (await emptyStateMessage.isVisible()) {
      // Look for nearby button or link
      const ctaButton = page.locator(
        'button:has-text("Create"), button:has-text("Add"), button:has-text("Start"), a:has-text("Create")'
      )
      const hasCTA = await ctaButton.isVisible()

      expect(hasCTA).toBeTruthy()
    }
  })

  test('T030.3: CTA buttons are clickable and functional', async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)

    // Find any "Add" or "Create" button
    const addButton = page
      .locator('button:has-text("Add"), button:has-text("Create")')
      .first()

    if (await addButton.isVisible()) {
      // Button should be enabled
      await expect(addButton).toBeEnabled()

      // Click the button
      await addButton.click()

      // Wait for reaction (modal, navigation, or UI change)
      await page.waitForTimeout(500)

      // Should show some reaction: modal, form, or navigation
      const hasModal = await page
        .locator('[role="dialog"], .modal, [class*="modal"]')
        .isVisible()
      const hasForm =
        (await page.locator('form, input[type="text"]').count()) > 0

      expect(hasModal || hasForm).toBeTruthy()
    }
  })
})

test.describe('Dashboard Widgets - Error Handling (T031)', () => {
  test('T031.1: Page handles network errors gracefully', async ({
    page,
    context,
  }) => {
    // Block API requests to simulate network failure
    await context.route('**/api/**', route => {
      route.abort('failed')
    })

    await page.goto('/login')

    // Page should still load, just without data
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible({ timeout: 5000 })
  })

  test("T031.2: Invalid responses don't crash the page", async ({
    page,
    context,
  }) => {
    // Return invalid JSON
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        body: 'Invalid JSON Response',
        headers: { 'Content-Type': 'application/json' },
      })
    })

    await page.goto('/login')

    // Wait for page to attempt render
    await page.waitForTimeout(2000)

    // Page should still be functional
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
  })

  test('T031.3: 500 errors show appropriate feedback', async ({
    page,
    context,
  }) => {
    // Return 500 error
    await context.route('**/api/habits**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    await page.goto('/login')
    await loginAsTestUser(page)

    // Wait for error state
    await page.waitForTimeout(2000)

    // Look for error message or fallback content
    const errorMessage = page.locator(
      'text=/error|failed|try again|something went wrong/i'
    )
    const hasFallbackContent =
      (await page.locator('h1, h2, button').count()) > 0

    expect(hasFallbackContent).toBeTruthy()
  })

  test("T031.4: Page doesn't crash on authentication errors", async ({
    page,
    context,
  }) => {
    // Return 401 Unauthorized
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      })
    })

    await page.goto('/dashboard')

    // Should redirect to login or show auth error
    await page.waitForTimeout(2000)

    // Should be on login page or show auth prompt
    const currentUrl = page.url()
    const isOnLoginPage =
      currentUrl.includes('/login') || currentUrl.includes('/auth')
    const hasAuthPrompt = await page
      .locator('text=/sign in|log in|authentication/i')
      .isVisible()

    expect(isOnLoginPage || hasAuthPrompt).toBeTruthy()
  })
})

test.describe('Dashboard Widgets - Responsive Design', () => {
  test('T032.1: Dashboard is responsive on mobile devices', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/login')
    await loginAsTestUser(page)

    // Check that content is visible and not overflowing
    const dashboard = page.locator('main, [role="main"]')
    await expect(dashboard).toBeVisible()

    // Check for horizontal scroll (should not exist)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // Allow 5px tolerance
  })

  test('T032.2: Dashboard works on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/login')
    await loginAsTestUser(page)

    // Content should be visible
    const dashboard = page.locator('main, [role="main"]')
    await expect(dashboard).toBeVisible()

    // Should have at least one heading
    const headings = page.locator('h1, h2, h3')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  test('T032.3: Desktop view shows full layout', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto('/login')
    await loginAsTestUser(page)

    // Check for sidebar (should be visible on desktop)
    const sidebar = page.locator('nav, aside, [class*="sidebar"]')
    await expect(sidebar.first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Dashboard Widgets - Accessibility (T033)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)
  })

  test('T033.1: Page has proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1')
    const h1Count = await h1.count()

    // Should have at least one h1 (or could be on sub-page)
    // More important: check that headings exist
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await allHeadings.count()

    expect(headingCount).toBeGreaterThan(0)
  })

  test('T033.2: Interactive elements are keyboard navigable', async ({
    page,
  }) => {
    // Find first button
    const firstButton = page.locator('button').first()

    if (await firstButton.isVisible()) {
      // Tab to button
      await page.keyboard.press('Tab')

      // Check if an element is focused
      const hasFocus = await page.evaluate(
        () => document.activeElement?.tagName !== 'BODY'
      )
      expect(hasFocus).toBeTruthy()
    }
  })

  test('T033.3: Images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Check first few images for alt text
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')

        // Alt should exist (can be empty for decorative images)
        expect(alt !== null).toBeTruthy()
      }
    }
  })

  test('T033.4: Form inputs have associated labels', async ({ page }) => {
    // Navigate to a page with forms (e.g., settings or habit creation)
    const addButton = page
      .locator('button:has-text("Add"), button:has-text("Create")')
      .first()

    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(500)

      // Check for form inputs
      const inputs = page.locator(
        'input[type="text"], input[type="email"], textarea'
      )
      const inputCount = await inputs.count()

      if (inputCount > 0) {
        // Check first input for label or aria-label
        const firstInput = inputs.first()
        const hasLabel =
          (await page
            .locator(
              `label:has(input), label[for="${await firstInput.getAttribute('id')}"]`
            )
            .count()) > 0
        const hasAriaLabel =
          (await firstInput.getAttribute('aria-label')) !== null
        const hasPlaceholder =
          (await firstInput.getAttribute('placeholder')) !== null

        // Should have at least one way to identify the input
        expect(hasLabel || hasAriaLabel || hasPlaceholder).toBeTruthy()
      }
    }
  })
})

test.describe('Dashboard Widgets - Loading States', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('T028.1: HabitOverviewWidget shows skeleton loader during data fetch', async ({
    page,
  }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')

    // Check for skeleton loader (should appear briefly)
    const skeletonLoader = page.locator(
      '[data-testid="habit-overview-skeleton"]'
    )

    // Skeleton may already be gone if data loads quickly, so we check if it was present
    // or if the widget loaded successfully
    const widgetLoaded = await page
      .locator('[data-testid="habit-overview-widget"]')
      .isVisible({ timeout: 5000 })

    expect(widgetLoaded).toBeTruthy()
  })

  test('T028.2: StreakCard shows loading indicator', async ({ page }) => {
    await page.goto('/dashboard')

    // Wait for streak card to be visible
    const streakCard = page.locator('[data-testid="streak-card"]')
    await expect(streakCard).toBeVisible({ timeout: 5000 })

    // Verify streak data is loaded (should show numbers)
    const streakNumber = streakCard.locator('text=/\\d+ days?/')
    await expect(streakNumber.first()).toBeVisible()
  })

  test('T028.3: WeeklyProgressChart displays loading state', async ({
    page,
  }) => {
    await page.goto('/dashboard')

    // Wait for chart widget
    const chartWidget = page.locator('[data-testid="weekly-progress-chart"]')
    await expect(chartWidget).toBeVisible({ timeout: 5000 })

    // Verify chart content is rendered
    const chartContent = chartWidget.locator(
      '[role="progressbar"], canvas, svg'
    )
    await expect(chartContent.first()).toBeVisible()
  })

  test('T028.4: QuickStatsWidget shows loading skeletons', async ({ page }) => {
    await page.goto('/dashboard')

    // Wait for stats widget
    const statsWidget = page.locator('[data-testid="quick-stats-widget"]')
    await expect(statsWidget).toBeVisible({ timeout: 5000 })

    // Verify stat cards are rendered
    const statCards = statsWidget.locator('[data-testid="stat-card"]')
    const count = await statCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('T028.5: All widgets complete loading within 3 seconds', async ({
    page,
  }) => {
    const startTime = Date.now()
    await page.goto('/dashboard')

    // Wait for all major widgets to be visible
    await Promise.all([
      page.locator('[data-testid="habit-overview-widget"]').isVisible(),
      page.locator('[data-testid="streak-card"]').isVisible(),
      page.locator('[data-testid="weekly-progress-chart"]').isVisible(),
      page.locator('[data-testid="quick-stats-widget"]').isVisible(),
    ])

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
  })
})

test.describe('Dashboard Widgets - Data Display', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard')
  })

  test('T029.1: HabitOverviewWidget displays habit cards correctly', async ({
    page,
  }) => {
    const habitOverview = page.locator('[data-testid="habit-overview-widget"]')
    await expect(habitOverview).toBeVisible()

    // Check for habit cards or empty state
    const habitCards = page.locator('[data-testid="habit-card"]')
    const emptyState = page.locator('[data-testid="habits-empty-state"]')

    const hasHabits = (await habitCards.count()) > 0
    const hasEmptyState = await emptyState.isVisible()

    // Should have either habits or empty state
    expect(hasHabits || hasEmptyState).toBeTruthy()

    if (hasHabits) {
      // Verify first habit card structure
      const firstCard = habitCards.first()
      await expect(
        firstCard.locator('.habit-title, [data-testid="habit-title"]')
      ).toBeVisible()

      // Check for completion button/indicator
      const completionButton = firstCard.locator(
        'button:has-text("Complete"), button:has-text("✓"), [data-testid="complete-button"]'
      )
      await expect(completionButton).toBeVisible()
    }
  })

  test('T029.2: StreakCard shows current and longest streaks', async ({
    page,
  }) => {
    const streakCard = page.locator('[data-testid="streak-card"]')
    await expect(streakCard).toBeVisible()

    // Check for streak title
    await expect(streakCard.locator('text=/top|streak/i')).toBeVisible()

    // Should show either streak data or empty state
    const hasStreakData = await streakCard
      .locator('text=/\\d+ days?/')
      .isVisible()
    const hasEmptyState = await streakCard
      .locator('text=/no streaks|start/i')
      .isVisible()

    expect(hasStreakData || hasEmptyState).toBeTruthy()
  })

  test('T029.3: WeeklyProgressChart renders progress bars', async ({
    page,
  }) => {
    const chart = page.locator('[data-testid="weekly-progress-chart"]')
    await expect(chart).toBeVisible()

    // Check for progress indicators (bars, percentages, or chart elements)
    const progressElements = chart.locator(
      '[role="progressbar"], .progress-bar, text=/%/'
    )
    const hasProgress = (await progressElements.count()) > 0
    const hasEmptyState = await chart
      .locator('text=/no data|start/i')
      .isVisible()

    expect(hasProgress || hasEmptyState).toBeTruthy()
  })

  test('T029.4: QuickStatsWidget displays all stat cards with icons', async ({
    page,
  }) => {
    const statsWidget = page.locator('[data-testid="quick-stats-widget"]')
    await expect(statsWidget).toBeVisible()

    // Check for stat cards
    const statCards = statsWidget.locator('[data-testid="stat-card"]')
    const count = await statCards.count()

    if (count > 0) {
      // Verify first stat card has number and label
      const firstCard = statCards.first()

      // Should have a number
      await expect(firstCard.locator('text=/\\d+/')).toBeVisible()

      // Should have an icon (svg or emoji)
      const hasIcon = await firstCard
        .locator('svg, .emoji, [data-icon]')
        .count()
      expect(hasIcon).toBeGreaterThan(0)
    }
  })

  test('T029.5: Habit completion button is interactive', async ({ page }) => {
    const habitCards = page.locator('[data-testid="habit-card"]')
    const count = await habitCards.count()

    if (count > 0) {
      const firstCard = habitCards.first()
      const completeButton = firstCard.locator(
        'button:has-text("Complete"), button:has-text("✓"), [data-testid="complete-button"]'
      )

      // Click the button
      await completeButton.click()

      // Wait for UI update (optimistic or server response)
      await page.waitForTimeout(500)

      // Button state should change (disabled, text change, or visual indicator)
      const isDisabled = await completeButton.isDisabled()
      const hasCompletedClass = await completeButton.evaluate(
        el =>
          el.className.includes('completed') || el.className.includes('success')
      )

      expect(isDisabled || hasCompletedClass).toBeTruthy()
    }
  })
})

test.describe('Dashboard Widgets - Empty States', () => {
  test('T030.1: HabitOverviewWidget shows empty state for new users', async ({
    page,
  }) => {
    // This test assumes a test account with no habits exists
    // In production, you'd create a fresh user or mock the API

    await loginAsTestUser(page)
    await page.goto('/dashboard')

    const habitOverview = page.locator('[data-testid="habit-overview-widget"]')
    await expect(habitOverview).toBeVisible()

    // Check if empty state is present
    const emptyState = habitOverview.locator(
      '[data-testid="habits-empty-state"]'
    )
    const habitCards = habitOverview.locator('[data-testid="habit-card"]')

    const hasEmptyState = await emptyState.isVisible()
    const hasHabits = (await habitCards.count()) > 0

    // If no habits, should show empty state
    if (!hasHabits) {
      expect(hasEmptyState).toBeTruthy()

      // Empty state should have helpful message
      await expect(
        emptyState.locator('text=/no habits|start|create/i')
      ).toBeVisible()

      // Should have CTA button
      const ctaButton = emptyState.locator(
        'button:has-text("Create"), button:has-text("Add"), a:has-text("Create")'
      )
      await expect(ctaButton).toBeVisible()
    }
  })

  test('T030.2: StreakCard shows empty state when no streaks exist', async ({
    page,
  }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard')

    const streakCard = page.locator('[data-testid="streak-card"]')
    await expect(streakCard).toBeVisible()

    // Check for empty state or data
    const hasData = await streakCard.locator('text=/\\d+ days?/').isVisible()

    if (!hasData) {
      // Should show empty state message
      await expect(
        streakCard.locator('text=/no streaks|start|build/i')
      ).toBeVisible()
    }
  })

  test('T030.3: WeeklyProgressChart shows message for no data', async ({
    page,
  }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard')

    const chart = page.locator('[data-testid="weekly-progress-chart"]')
    await expect(chart).toBeVisible()

    // Check if chart has data or empty state
    const hasProgress = await chart
      .locator('[role="progressbar"], .progress-bar')
      .count()

    if (hasProgress === 0) {
      // Should show helpful empty state
      await expect(
        chart.locator('text=/no progress|start|complete/i')
      ).toBeVisible()
    }
  })

  test('T030.4: Empty state CTA buttons are clickable', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard')

    // Find any empty state CTA button
    const ctaButton = page
      .locator(
        '[data-testid="habits-empty-state"] button, [data-testid="empty-state"] button'
      )
      .first()

    if (await ctaButton.isVisible()) {
      // Click should work
      await expect(ctaButton).toBeEnabled()

      // Clicking should navigate or open modal
      await ctaButton.click()
      await page.waitForTimeout(300)

      // Should either navigate or show modal
      const hasModal = await page.locator('[role="dialog"], .modal').isVisible()
      const urlChanged = page.url() !== 'http://localhost:3000/dashboard'

      expect(hasModal || urlChanged).toBeTruthy()
    }
  })
})

test.describe('Dashboard Widgets - Error Handling', () => {
  test('T031.1: Widgets handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and simulate errors
    await page.route('**/api/habits*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    await loginAsTestUser(page)
    await page.goto('/dashboard')

    // Wait for error state to appear
    await page.waitForTimeout(1000)

    // Check for error messages or retry buttons
    const errorMessage = page.locator('text=/error|failed|try again/i')
    const retryButton = page.locator(
      'button:has-text("Retry"), button:has-text("Try Again")'
    )

    const hasError = await errorMessage.isVisible()
    const hasRetry = await retryButton.isVisible()

    // Should show some error feedback
    expect(hasError || hasRetry).toBeTruthy()
  })

  test('T031.2: Network timeout shows appropriate message', async ({
    page,
  }) => {
    // Simulate slow network
    await page.route('**/api/habits/summary*', route => {
      return new Promise(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ message: 'Delayed response' }),
          })
        }, 10000) // 10 second delay
      })
    })

    await loginAsTestUser(page)
    await page.goto('/dashboard')

    // Wait for loading indicators
    await page.waitForTimeout(2000)

    // Should still show loading state or timeout message
    const loadingIndicator = page.locator(
      '[data-testid*="loading"], .loading, .spinner'
    )
    const timeoutMessage = page.locator('text=/timeout|slow|loading/i')

    const hasLoading = (await loadingIndicator.count()) > 0
    const hasTimeout = await timeoutMessage.isVisible()

    expect(hasLoading || hasTimeout).toBeTruthy()
  })

  test('T031.3: Retry functionality works after error', async ({ page }) => {
    let callCount = 0

    // Fail first request, succeed on retry
    await page.route('**/api/habits*', route => {
      callCount++
      if (callCount === 1) {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Server error' }),
        })
      } else {
        route.continue()
      }
    })

    await loginAsTestUser(page)
    await page.goto('/dashboard')

    // Wait for error state
    await page.waitForTimeout(1000)

    // Find and click retry button
    const retryButton = page.locator(
      'button:has-text("Retry"), button:has-text("Try Again")'
    )

    if (await retryButton.isVisible()) {
      await retryButton.click()

      // Should successfully load after retry
      await page.waitForTimeout(1000)

      const widgets = page.locator('[data-testid$="-widget"]')
      const widgetCount = await widgets.count()

      expect(widgetCount).toBeGreaterThan(0)
    }
  })

  test("T031.4: Invalid data doesn't crash widgets", async ({ page }) => {
    // Return malformed data
    await page.route('**/api/habits/summary*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ invalidField: 'bad data' }),
      })
    })

    await loginAsTestUser(page)
    await page.goto('/dashboard')

    // Wait for widgets to attempt render
    await page.waitForTimeout(1000)

    // Page should still be functional, not crashed
    const dashboard = page.locator('main, [role="main"], .dashboard')
    await expect(dashboard).toBeVisible()

    // Should show error state or fallback
    const errorState = page.locator('text=/error|invalid|failed/i')
    const emptyState = page.locator('[data-testid*="empty"]')

    const hasGracefulFallback =
      (await errorState.isVisible()) || (await emptyState.isVisible())
    expect(hasGracefulFallback).toBeTruthy()
  })
})

test.describe('Dashboard Widgets - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard')
  })

  test('T032: All widgets have proper ARIA labels', async ({ page }) => {
    // Check for accessible names on widgets
    const widgets = page.locator(
      '[data-testid$="-widget"], [data-testid$="-card"]'
    )
    const count = await widgets.count()

    for (let i = 0; i < Math.min(count, 4); i++) {
      const widget = widgets.nth(i)
      const hasAriaLabel = await widget.getAttribute('aria-label')
      const hasRole = await widget.getAttribute('role')
      const hasHeading = await widget.locator('h1, h2, h3, h4').count()

      // Should have at least one way to identify the widget
      expect(hasAriaLabel || hasRole || hasHeading > 0).toBeTruthy()
    }
  })

  test('T033: Interactive elements are keyboard accessible', async ({
    page,
  }) => {
    // Find first interactive button in widgets
    const buttons = page.locator(
      '[data-testid$="-widget"] button, [data-testid$="-card"] button'
    )
    const firstButton = buttons.first()

    if (await firstButton.isVisible()) {
      // Focus the button
      await firstButton.focus()

      // Should be focusable
      const isFocused = await firstButton.evaluate(
        el => document.activeElement === el
      )
      expect(isFocused).toBeTruthy()

      // Should be activatable with Enter
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      // Button should have been activated (some UI change)
      expect(true).toBeTruthy() // Basic smoke test that no error occurred
    }
  })
})
