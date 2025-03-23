import { expect, test } from '@playwright/test';
import fs from 'fs/promises';
import { exampleName, lazy } from './helpers/envVars.js';
import { checkHomeLink } from './helpers/homeLink.js';

const url = 'http://localhost:5002';

test.describe('Native', () => {
  test.describe('homepage', () => {
    test('has document title', async ({ page }) => {
      await page.goto(url);
      await expect(page).toHaveTitle(`example-${exampleName()}`);
    });

    test('displays home links', async ({ page }) => {
      await page.goto(url);
      await checkHomeLink(page, {
        title: 'Releases',
        href: 'https://github.com/react-cosmos/react-cosmos/releases',
      });
      await checkHomeLink(page, {
        title: 'Documentation',
        href: 'https://reactcosmos.org/docs/user-interface',
      });
      await checkHomeLink(page, {
        title: 'Discord',
        href: 'https://discord.gg/3X95VgfnW5',
      });
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
  });

  test.describe('select fixture', () => {
    test('renders selected fixtures', async ({ page }) => {
      await page.goto(url);
      await page.click('text=HelloWorld');
      await expect(page.getByText('Waiting for renderer')).toBeVisible();
    });
  });

  test.describe('imports file', () => {
    test('has server address', async () => {
      expect(await readImportsFile()).toContain(
        `"webSocketUrl": "ws://localhost:5002"`
      );
    });

    test('has fixture paths', async () => {
      await containsImport('src/__fixtures__/HelloWorld.mdx');
      await containsImport('src/Counter.fixture');
      await containsImport('src/WelcomeMessage/WelcomeMessage.fixture');
    });

    test('has decorator paths', async () => {
      await containsImport('src/WelcomeMessage/cosmos.decorator');
    });
  });
});

async function readImportsFile() {
  return fs.readFile(`examples/${exampleName()}/cosmos.imports.ts`, 'utf-8');
}

async function containsImport(importPath: string) {
  const imports = await readImportsFile();
  if (lazy()) {
    expect(imports).toMatch(new RegExp(`import\\('./${importPath}'\\)`));
  } else {
    expect(imports).toMatch(
      new RegExp(`import \\* as [a-z0-9]+ from './${importPath}'`)
    );
  }
}
