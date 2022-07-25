import { test, expect } from '@playwright/test';

// test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);

//   // create a locator
//   const getStarted = page.locator('text=Get Started');

//   // Expect an attribute "to be strictly equal" to the value.
//   await expect(getStarted).toHaveAttribute('href', '/docs/intro');

//   // Click the get started link.
//   await getStarted.click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });


test("Upload Functionality Test", async ({page}) => {
  await page.goto("http://localhost:3000/")

  // Expect the button will be disabled because at first no file is uploaded
  const button = page.locator('button')
  await expect(button).toHaveAttribute('disabled', '')

  // set input file to the file field
  await page.setInputFiles('input[type="file"]', './public/employee-1.png')

  // Expect the button will be enabled now, therefore no 'disabled' attribute
  const disable = await page.locator('button').first().getAttribute('disabled');
  await expect(disable).toBeNull()
})