// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole } from 'react-cosmos/vitest.js';

import path from 'node:path';
import { CosmosConfig, createCosmosConfig } from 'react-cosmos';
import { resolveViteIndexPath } from './resoveViteIndexPath.js';

describe('default index paths', () => {
  const indexPaths = [
    ...scriptPathVariations(`src${path.sep}main`),
    ...scriptPathVariations(`src${path.sep}index`),
    ...scriptPathVariations('main'),
    ...scriptPathVariations('index'),
  ];
  indexPaths.forEach(indexPath => {
    it(`resolves "${indexPath}" script path`, async () => {
      const config = createCosmosConfig('/my/root/path', {});
      const indexHtml = mockIndexHtml(['/src/polyfills.ts', indexPath]);

      expect(await resolveIndexPathMocked(config, indexHtml)).toBe(
        path.join(config.rootDir, indexPath)
      );
    });
  });

  it(`resolves any single script path`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml(['/src/custom-main.tsx']);

    expect(await resolveIndexPathMocked(config, indexHtml)).toBe(
      '/my/root/path/src/custom-main.tsx'
    );
  });

  it(`throws when index path couldn't be established from multiple local paths`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml([
      '/src/custom-main-a.tsx',
      '/src/custom-main-b.tsx',
    ]);

    await expect(resolveIndexPathMocked(config, indexHtml)).rejects.toThrow(
      `Multiple script paths found in index.html. ` +
        `Please set vite.indexPath in your Cosmos config: ` +
        `https://reactcosmos.org/docs/getting-started/vite#configuration`
    );
  });

  // TODO: Auto fix this
  it(`throws when index doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml([]);

    await expect(resolveIndexPathMocked(config, indexHtml)).rejects.toThrow(
      `You need at least one script tag in your index.html file. ` +
        `Example: <script type="module" src="/src/main.tsx"></script>`
    );
  });
});

describe('custom index path', () => {
  it('resolves custom index path when matching script exists', async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: '/src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml([
      '/src/polyfills.ts',
      '/src/custom-main.tsx',
    ]);

    expect(await resolveIndexPathMocked(config, indexHtml)).toBe(
      '/my/root/path/src/custom-main.tsx'
    );
  });

  it(`throws when custom index path doesn't match any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: '/src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml(['/src/custom-main-a.tsx']);

    await expect(resolveIndexPathMocked(config, indexHtml)).rejects.toThrow(
      `Custom index path /src/custom-main.tsx not found in index.html. ` +
        `Please add it or change vite.indexPath in your Cosmos config.`
    );
  });

  // TODO: Auto fix this
  it(`throws when index doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: '/src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml([]);

    await expect(resolveIndexPathMocked(config, indexHtml)).rejects.toThrow(
      `You need at least one script tag in your index.html file. ` +
        `Example: <script type="module" src="/src/main.tsx"></script>`
    );
  });
});

function scriptPathVariations(scriptPath: string) {
  const exts = (p: string) => [`${p}.js`, `${p}.jsx`, `${p}.ts`, `${p}.tsx`];
  return [
    ...exts(scriptPath),
    ...exts(`.${path.sep}${scriptPath}`),
    ...exts(`${path.sep}${scriptPath}`),
  ];
}

async function resolveIndexPathMocked(config: CosmosConfig, indexHtml: string) {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] No vite config found, using default settings');
    return resolveViteIndexPath(config, indexHtml);
  });
}

function mockIndexHtml(scripts: string[]) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
${scripts
  .map(script => `    <script type="module" src="${script}"></script>`)
  .join('\n')}
  </body>
</html>
`;
}
