import { test, expect } from '@playwright/test'

/**
 * Example E2E Test
 *
 * This is a placeholder test. Replace with your own tests.
 */

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')

  // Verify page loads
  await expect(page).toHaveTitle(/.*/)
})

test('can navigate to auth pages', async ({ page }) => {
  await page.goto('/auth/login')

  // Verify login page loads
  await expect(page.locator('form')).toBeVisible()
})
