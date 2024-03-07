import { expect, test } from '@playwright/test';
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
  });
});
