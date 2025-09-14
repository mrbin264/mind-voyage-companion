import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check that the main title is present
  await expect(page.getByRole('heading', { name: /Welcome to Mind Voyage Companion/i })).toBeVisible()
  
  // Check that the description is present
  await expect(page.getByText(/Your privacy-first habit tracking and journaling companion/i)).toBeVisible()
})

test('page has correct metadata', async ({ page }) => {
  await page.goto('/')
  
  // Check page title
  await expect(page).toHaveTitle(/Mind Voyage Companion/)
  
  // Check meta description
  const metaDescription = page.locator('meta[name="description"]')
  await expect(metaDescription).toHaveAttribute('content', /A privacy-first habit tracking and journaling application/)
})
