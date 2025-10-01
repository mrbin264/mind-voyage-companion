import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check that the main title is present
  await expect(page.getByRole('heading', { name: /Build Better Habits Through Mindful Reflection/i })).toBeVisible()
  
  // Check that the description is present
  await expect(page.getByText(/A privacy-first platform combining habit tracking with philosophical reflection/i)).toBeVisible()
})

test('page has correct metadata', async ({ page }) => {
  await page.goto('/')
  
  // Check page title
  await expect(page).toHaveTitle(/Mind Voyage Companion/)
  
  // Check that the brand name appears in header
  await expect(page.getByRole('heading', { name: /Mind Voyage Companion/i })).toBeVisible()
})
