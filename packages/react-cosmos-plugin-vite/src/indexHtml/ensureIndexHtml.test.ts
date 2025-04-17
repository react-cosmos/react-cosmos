import fs from 'node:fs';
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

const customHtml = defaultHtml.replace('React Cosmos Vite Renderer', 'My App');

it('creates and returns default index.html when none exists', async () => {
  (fs.existsSync as Mock).mockReturnValue(false);

  await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Vite index.html not found, creating a default one...');
    expect(ensureIndexHtml('/my/root/path')).toEqual(defaultHtml);
  });
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    '/my/root/path/index.html',
    defaultHtml
  );
});

it('returns existing index.html when none exists', async () => {
  (fs.existsSync as Mock).mockReturnValue(
    (path: string) => path === '/my/root/path/index.html'
  );
  (fs.readFileSync as Mock).mockReturnValue(customHtml);

  expect(ensureIndexHtml('/my/root/path')).toEqual(customHtml);
});
