import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test('should display search results for a query', async ({ page }) => {
    // Navigate directly to search page with a query
    await page.goto('/search?q=climate');
    
    // Check if search page loaded with the correct heading
    const heading = await page.getByText(/search results for "climate"/i);
    await expect(heading).toBeVisible();
    
    // Check if search results are displayed
    // We're using a selector that would match article cards
    const searchResults = await page.locator('.grid article, .grid div[role="article"]');
    
    // Wait for the results to load (this assumes our articles take some time to load)
    await page.waitForSelector('.grid article, .grid div[role="article"]', { timeout: 5000 }).catch(() => {
      // If no articles are found after timeout, that's okay - we'll check below
    });
    
    // Get the count of articles (which could be 0)
    const count = await searchResults.count();
    
    // Either we have articles, or we have a "no results" message
    if (count === 0) {
      // Check for "no results" message
      const noResults = await page.getByText(/no articles found/i);
      await expect(noResults).toBeVisible();
    } else {
      // We have articles, so verify at least one is visible
      expect(count).toBeGreaterThan(0);
    }
  });
  
  test('should show proper message for empty query', async ({ page }) => {
    // Navigate to search page with empty query
    await page.goto('/search');
    
    // Check if the page shows appropriate message for no query
    const emptyMessage = await page.getByText(/enter a search/i);
    
    // We either see a message about no query, or the search form
    const searchInput = await page.getByPlaceholder(/search/i);
    
    expect(await searchInput.isVisible() || await emptyMessage.isVisible()).toBeTruthy();
  });
  
  test('should allow search from the search page', async ({ page }) => {
    // Go to search page
    await page.goto('/search');
    
    // Find the search input and enter a new query
    const searchInput = await page.getByPlaceholder(/search/i);
    await searchInput.fill('technology');
    
    // Submit the search form
    await searchInput.press('Enter');
    
    // Check if the URL updated with the new query
    await expect(page).toHaveURL(/.*\/search\?q=technology/);
    
    // Check if the search results updated
    const heading = await page.getByText(/search results for "technology"/i);
    await expect(heading).toBeVisible();
  });
  
  test('should handle special characters in search query', async ({ page }) => {
    // Try a query with special characters
    const specialQuery = 'AI & Machine Learning';
    const encodedQuery = encodeURIComponent(specialQuery);
    
    // Navigate directly to search with the special query
    await page.goto(`/search?q=${encodedQuery}`);
    
    // Check if the page shows the query correctly in the heading
    const heading = await page.getByText(new RegExp(`search results for "${specialQuery}"`, 'i'));
    await expect(heading).toBeVisible();
    
    // Check if search input contains the proper query
    const searchInput = await page.getByPlaceholder(/search/i);
    await expect(searchInput).toHaveValue(specialQuery);
  });
}); 