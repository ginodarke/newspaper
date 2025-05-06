import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page has the correct title
    const title = await page.title();
    expect(title).toContain('Newspaper.AI');
    
    // Check if the app logo/title is visible
    const appTitle = await page.getByText('Newspaper.AI');
    await expect(appTitle).toBeVisible();
  });
  
  test('should navigate to auth page when login button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find and click the login button
    const loginButton = await page.getByRole('link', { name: /sign in/i });
    await loginButton.click();
    
    // Check if we navigated to the auth page
    await expect(page).toHaveURL(/.*\/auth/);
  });

  test('should have dark mode toggle', async ({ page }) => {
    await page.goto('/');
    
    // Find the dark mode toggle
    const darkModeToggle = await page.getByLabel(/toggle dark mode/i);
    
    // Check if it's visible
    await expect(darkModeToggle).toBeVisible();
    
    // Click the toggle and verify the theme changes
    await darkModeToggle.click();
    
    // Check if the html element has the dark class
    const html = await page.$('html');
    const hasClass = await html?.evaluate(el => el.classList.contains('dark'));
    expect(hasClass).toBeTruthy();
  });
  
  test('should allow search input', async ({ page }) => {
    await page.goto('/');
    
    // Find the search input
    const searchInput = await page.getByPlaceholder(/search/i);
    
    // Enter a search query
    await searchInput.fill('climate change');
    
    // Submit the search form
    await searchInput.press('Enter');
    
    // Verify we navigated to the search results page with the query
    await expect(page).toHaveURL(/.*\/search\?q=climate\+change/);
  });
});

test.describe('Navigation', () => {
  test('should have functioning navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links
    const links = await page.getByRole('link');
    expect(await links.count()).toBeGreaterThan(0);
  });
}); 