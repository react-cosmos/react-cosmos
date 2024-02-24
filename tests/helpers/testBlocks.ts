import { Page, expect, test } from '@playwright/test';
import { exampleName } from './envVars.js';

export function webTests(url: string) {
  test.describe('homepage', () => {
    test('has document title', async ({ page }) => {
      await page.goto(url);
      await expect(page).toHaveTitle(`example-${exampleName()}`);
    });

    test('displays welcome message', async ({ page }) => {
      await page.goto(url);
      await expect(page.getByText('Welcome to React Cosmos')).toBeVisible();
    });

    test('shows renderer connected notification', async ({ page }) => {
      await page.goto(url);
      await expect(page.getByText('Renderer connected')).toBeVisible();
    });
  });

  test.describe('nav', () => {
    test('renders tree view root items', async ({ page }) => {
      await page.goto(url);
      await expect(page.getByText('Counter', { exact: true })).toBeVisible();
      await expect(page.getByText('CounterButton')).toBeVisible();
      await expect(page.getByText('WelcomeMessage')).toBeVisible();
      await expect(page.getByText('HelloWorld')).toBeVisible();
    });

    test('expands tree view items', async ({ page }) => {
      await page.goto(url);
      await page.click('text=Counter');
      await expect(page.getByText('default', { exact: true })).toBeVisible();
      await expect(page.getByText('small number')).toBeVisible();
      await expect(page.getByText('large number')).toBeVisible();
    });
  });

  test.describe('select fixture', () => {
    test('renders selected fixtures', async ({ page }) => {
      await page.goto(url);
      await page.click('text=HelloWorld');
      await expect(rendererRoot(page).getByText('Hello World!')).toBeVisible();
    });

    test('renders updated fixture', async ({ page }) => {
      await page.goto(url);
      await page.click('text=Counter');
      await page.click('text=large number');

      const button = rendererRoot(page).getByTitle('Click to increment');
      await expect(button).toContainText('555555555 times');

      await button.dblclick();
      await expect(button).toContainText('555555557 times');
    });

    test('renders searched fixture', async ({ page }) => {
      await page.goto(url);

      await page.getByText('Search fixtures').waitFor();
      await page.keyboard.press('Control+K');
      await page.getByPlaceholder('Fixture search').fill('Hello');
      await page.keyboard.press('Enter');

      await expect(rendererRoot(page)).toContainText('Hello World!');
    });

    test('uses search key shortcut in renderer iframe', async ({ page }) => {
      await page.goto(url);
      await page.click('text=HelloWorld');

      // Clicking on the fixture content focuses the iframe
      await rendererRoot(page).getByText('Hello World!').click();

      await page.keyboard.press('Control+K');
      await page.getByPlaceholder('Fixture search').waitFor();
    });
  });

  test.describe('static path', () => {
    test('serves static asset', async ({ request }) => {
      const response = await request.get(`${url}/cookie.txt`);
      expect(await response.text()).toContain('nom nom nom');
    });
  });
}

function rendererRoot(page: Page) {
  return page.frameLocator('iframe').locator('#root');
}
