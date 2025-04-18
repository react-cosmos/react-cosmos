import fs from 'node:fs';
import { mockConsole } from 'react-cosmos/vitest.js';
import { createIndexHtml } from './createIndexHtml.js';

vi.mock('node:fs', () => ({
  default: {
    writeFileSync: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it('creates default index.html returns it', async () => {
  // NOTE: This works on Windows because fs.writeFileSync is mocked
  const htmlPath = '/my/root/path/index.html';

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

  await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Vite index.html not found, creating a default one...');
    expect(createIndexHtml(htmlPath)).toEqual(defaultHtml);
  });
  expect(fs.writeFileSync).toHaveBeenCalledWith(htmlPath, defaultHtml);
});
