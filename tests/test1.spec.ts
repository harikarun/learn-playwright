import { test, expect } from '@playwright/test';

test('google search', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    await page.getByRole ('button', { name: 'Reject All' }).click();
    await page.getByRole ('combobox', { name: 'Search' }).fill ('this is my first playwright script. Am I good?');
    await page.getByRole ('button', { name: 'Google Search' }).click();
});

  