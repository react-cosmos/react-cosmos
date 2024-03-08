import { expect, test } from '@playwright/test';
import { createRendererUrl } from 'react-cosmos-core';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5000';

test.describe('DOM dev', () => {
  webTests(url);

  // TODO: Put in webTests to include in export tests
  test.describe('cosmos.fixture.json', () => {
    test('contains fixture item', async ({ request }) => {
      const response = await request.get(url + '/cosmos.fixtures.json');
      expect(await response.json()).toContainEqual({
        filePath: 'src/WelcomeMessage/WelcomeMessage.fixture.tsx',
        fileName: 'WelcomeMessage',
        parents: [],
        rendererUrl:
          'http://localhost:5050/?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%7D&locked=true',
      });
    });

    test('renders fixture by renderer URL', async ({ request, page }) => {
      const response = await request.get(url + '/cosmos.fixtures.json');
      const fixtures = await response.json();
      // TODO: Import Cosmos type instead of any
      const fixture = fixtures.find((f: any) =>
        f.filePath.endsWith('HelloWorld.mdx')
      );
      await page.goto(fixture.rendererUrl);
      await expect(page.getByText('Hello World!')).toBeVisible();
    });

    test('reads renderer responses', async ({ request, page }) => {
      const response = await request.get(url + '/cosmos.fixtures.json');
      const fixtures = await response.json();
      // TODO: Import Cosmos type instead of any
      const fixture = fixtures.find((f: any) =>
        f.filePath.endsWith('Counter.fixture.tsx')
      );

      let fixtureNames: null | string[] = null;
      page.exposeFunction('fixtureLoaded', (fixtureItem: any) => {
        fixtureNames = fixtureItem.fixtureNames;
      });

      await page.goto(fixture.rendererUrl);

      // TODO: How to get fixture IDs instead of fixture names?
      await expect.poll(() => fixtureNames).not.toBe(null);
      expect(fixtureNames).toEqual(['default', 'small number', 'large number']);

      // TODO: How to get the renderer URL?
      const rendererUrl = 'localhost:5050';
      const fixtureId1 = { path: fixture.filePath, name: 'default' };
      const fixtureUrl1 = createRendererUrl(rendererUrl, fixtureId1, true);
      await page.goto(fixtureUrl1);
      await expect(page.getByText('0 times')).toBeVisible();

      const fixtureId2 = { path: fixture.filePath, name: 'small number' };
      const fixtureUrl2 = createRendererUrl(rendererUrl, fixtureId2, true);
      await page.goto(fixtureUrl2);
      await expect(page.getByText('5 times')).toBeVisible();

      const fixtureId3 = { path: fixture.filePath, name: 'large number' };
      const fixtureUrl3 = createRendererUrl(rendererUrl, fixtureId3, true);
      await page.goto(fixtureUrl3);
      await expect(page.getByText('555555555 times')).toBeVisible();

      // await expect(page).toHaveScreenshot();
    });
  });
});
