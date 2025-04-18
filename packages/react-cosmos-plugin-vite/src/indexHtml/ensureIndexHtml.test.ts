import fs from 'node:fs';
import path from 'node:path';
import { mockConsole } from 'react-cosmos/vitest.js';
import { Mock } from 'vitest';
import { ensureIndexHtml } from './ensureIndexHtml.js';

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it('creates default index.html when none exists and returns it', async () => {
  const rootDir = path.resolve('my', 'root', 'path');
  const indexPath = path.join(rootDir, 'index.html');

  const defaultHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Cosmos Vite Renderer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>\n`;

  (fs.existsSync as Mock).mockReturnValue(false);

  await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Vite index.html not found, creating a default one...');
    expect(ensureIndexHtml(rootDir)).toEqual(defaultHtml);
  });
  expect(fs.writeFileSync).toHaveBeenCalledWith(indexPath, defaultHtml);
});

it('returns existing index.html when none exists', async () => {
  const rootDir = path.resolve('my', 'root', 'path');
  const indexPath = path.join(rootDir, 'index.html');

  const customHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>\n`;

  (fs.existsSync as Mock).mockReturnValue((p: string) => p === indexPath);
  (fs.readFileSync as Mock).mockReturnValue(customHtml);

  expect(ensureIndexHtml(rootDir)).toEqual(customHtml);
});
