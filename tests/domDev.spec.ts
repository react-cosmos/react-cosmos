import { Page, expect, test } from '@playwright/test';
import { FixtureId, createRendererUrl } from 'react-cosmos-core';
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

      // TODO: Import Cosmos type instead of any
      let _fixtureItem: any;
      page.exposeFunction('fixtureLoaded', (fixtureItem: any) => {
        _fixtureItem = fixtureItem;
      });

      await page.goto(fixture.rendererUrl);

      // TODO: How to get fixture IDs instead of fixture names?
      await expect.poll(() => _fixtureItem).not.toBe(undefined);

      const fixtureNames = _fixtureItem.fixtureNames as string[];
      const breadcrumbs = [...fixture.parents, fixture.fileName];

      expect(fixtureNames).toEqual(['default', 'small number', 'large number']);

      // TODO: How to get the renderer URL?
      const rendererUrl = 'localhost:5050';

      if (fixtureNames) {
        for (const fixtureName of fixtureNames) {
          const fixtureId: FixtureId = {
            path: fixture.filePath,
            name: fixtureName,
          };
          const cleanPath = [...breadcrumbs, fixtureName];
          await takeFixtureSnapshot(page, rendererUrl, fixtureId, cleanPath);
        }
      } else {
        const fixtureId: FixtureId = { path: fixture.filePath };
        await takeFixtureSnapshot(page, rendererUrl, fixtureId, breadcrumbs);
      }
    });
  });
});

async function takeFixtureSnapshot(
  page: Page,
  rendererUrl: string,
  fixtureId: FixtureId,
  cleanPath: string[]
) {
  const fixtureUrl = createRendererUrl(rendererUrl, fixtureId, true);
  await page.goto(fixtureUrl);
  await expect(page).toHaveScreenshot(`${cleanPath.join('-')}.png`);
}
