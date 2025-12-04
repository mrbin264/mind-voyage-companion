import { test, expect, loginAsTestUser } from './fixtures'

test.describe('Journal Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await loginAsTestUser(page)
    await page.goto('/dashboard/journal')
  })

  test('should filter entries by search query', async ({ page }) => {
    // 1. Create first unique entry
    const uniqueId1 = `search_test_${Date.now()}_1`
    await page
      .getByRole('button', { name: /new entry/i })
      .first()
      .click()
    await page
      .locator('textarea')
      .fill(`This is the first unique entry with code ${uniqueId1}`)
    await page.getByRole('button', { name: /save/i }).click()
    await expect(
      page.getByText('Journal entry created successfully')
    ).toBeVisible()

    // Wait for list to refresh
    await page.waitForTimeout(1000)

    // 2. Create second unique entry
    const uniqueId2 = `search_test_${Date.now()}_2`
    await page
      .getByRole('button', { name: /new entry/i })
      .first()
      .click()
    await page
      .locator('textarea')
      .fill(`This is the second unique entry with code ${uniqueId2}`)
    await page.getByRole('button', { name: /save/i }).click()
    await expect(
      page.getByText('Journal entry created successfully')
    ).toBeVisible()

    // Wait for list to refresh
    await page.waitForTimeout(1000)

    // 3. Search for first entry
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill(uniqueId1)

    // Wait for debounce and API call
    await page.waitForResponse(
      resp =>
        resp.url().includes('/api/journal') && resp.url().includes(uniqueId1)
    )
    await page.waitForTimeout(500) // UI update

    // 4. Verify results
    await expect(page.getByText(uniqueId1)).toBeVisible()
    await expect(page.getByText(uniqueId2)).not.toBeVisible()

    // 5. Clear search
    await searchInput.fill('')

    // Wait for debounce and API call
    await page.waitForResponse(
      resp =>
        resp.url().includes('/api/journal') && !resp.url().includes('query=')
    )
    await page.waitForTimeout(500) // UI update

    // 6. Verify all entries visible
    await expect(page.getByText(uniqueId1)).toBeVisible()
    await expect(page.getByText(uniqueId2)).toBeVisible()
  })
})
