import { APIRequestContext, Page, expect, test } from '@playwright/test';
import { CosmosFixtureJson, CosmosFixturesJson } from 'react-cosmos';
import { FixtureId, createRendererUrl } from 'react-cosmos-core';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5000';

test.describe('DOM dev', () => {
  webTests(url);

  // TODO: Put in webTests to include in export tests
  test.describe('cosmos.fixture.json', () => {
    test('contains renderer URL', async ({ request }) => {
      const { rendererUrl } = await getFixturesJson(request);
      expect(rendererUrl).toBe('http://localhost:5050');
    });

    test('contains fixture data', async ({ request }) => {
      const { fixtures } = await getFixturesJson(request);
      expect(fixtures).toContainEqual({
        filePath: 'src/WelcomeMessage/WelcomeMessage.fixture.tsx',
        cleanPath: ['src', 'WelcomeMessage', 'WelcomeMessage'],
        rendererUrl:
          'http://localhost:5050/?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%7D&locked=true',
      });
    });

    test('contains fixture renderer URL', async ({ request, page }) => {
      const { fixtures } = await getFixturesJson(request);
      const fixture = await expectFixture(fixtures, 'HelloWorld.mdx');
      await page.goto(fixture.rendererUrl);
      await expect(page.getByText('Hello World!')).toBeVisible();
    });

    test('reads renderer responses', async ({ request, page }) => {
      const { rendererUrl, fixtures } = await getFixturesJson(request);
      const fixture = await expectFixture(fixtures, 'Counter.fixture.tsx');

      if (!rendererUrl) {
        throw new Error('Renderer URL not found');
      }

      let _fixtureItem: any;
      page.exposeFunction('fixtureLoaded', (fixtureItem: any) => {
        _fixtureItem = fixtureItem;
      });

      await page.goto(fixture.rendererUrl);

      // TODO: How to get fixture IDs instead of fixture names?
      await expect.poll(() => _fixtureItem).not.toBe(undefined);

      const fixtureNames = _fixtureItem.fixtureNames as string[];

      expect(fixtureNames).toEqual(['default', 'small number', 'large number']);

      if (fixtureNames) {
        console.log({ fixtureNames });
        for (const fixtureName of fixtureNames) {
          await takeFixtureSnapshot(
            page,
            rendererUrl,
            { path: fixture.filePath, name: fixtureName },
            [...fixture.cleanPath, fixtureName]
          );
        }
      } else {
        await takeFixtureSnapshot(
          page,
          rendererUrl,
          { path: fixture.filePath },
          fixture.cleanPath
        );
      }
    });
  });
});

async function getFixturesJson(request: APIRequestContext) {
  const response = await request.get(url + '/cosmos.fixtures.json');
  return (await response.json()) as CosmosFixturesJson;
}

async function expectFixture(fixtures: CosmosFixtureJson[], fileName: string) {
  const fixture = fixtures.find(f => f.filePath.endsWith(fileName));
  expect(fixture).toBeTruthy();
  return fixture!;
}

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
