import { test, expect } from '@playwright/test';
//import { TIMEOUT } from 'node:dns';

test('google search', async ({ page }) => {
    await page.goto('https://www.google.com/', { timeout: 10000 });
    
//    await page.getByRole ('button', { name: 'Reject All' }).click();
    await page.getByRole ('combobox', { name: 'Search' }).fill ('this is my first playwright script. Am I good?');
    await page.getByRole ('combobox', { name: 'Search' }).press('Enter');
    await.page.getByRole ('link', { name: 'Playwright: Fast and reliable end-to-end testing for modern web apps123' }).click();
});

