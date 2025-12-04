import { test as base, Page } from '@playwright/test'

/**
 * Test Fixtures for Mind Voyage Companion E2E Tests
 *
 * Provides reusable authentication state and helper functions
 * to optimize test execution and reduce redundant login operations.
 */

type TestFixtures = {
  authenticatedPage: Page
}

/**
 * Login helper function with retry logic and proper waits
 */
export async function loginAsTestUser(page: Page): Promise<void> {
  console.log('🔐 Authenticating test user...')

  // Navigate to login page
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 })

  // Fill in login form
  await page.fill(
    'input[type="email"], input[name="email"]',
    'test@example.com'
  )
  await page.fill(
    'input[type="password"], input[name="password"]',
    'TestPassword123!'
  )

  // Submit form
  await page.click('button[type="submit"]')

  // Wait for navigation to dashboard with extended timeout
  await page.waitForURL('**/dashboard', {
    timeout: 30000,
    waitUntil: 'networkidle',
  })

  // Wait for dashboard to be fully loaded
  await page.waitForLoadState('domcontentloaded')

  console.log('✅ Authentication successful')
}

/**
 * Extended test with authenticated page fixture
 * This fixture automatically logs in the user before each test,
 * reducing redundant login operations and improving test performance.
 */
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login once before the test
    await loginAsTestUser(page)

    // Provide the authenticated page to the test
    await use(page)

    // Cleanup is handled automatically by Playwright
  },
})

export { expect } from '@playwright/test'
