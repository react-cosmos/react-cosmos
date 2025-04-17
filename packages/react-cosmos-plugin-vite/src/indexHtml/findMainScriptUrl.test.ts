// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole } from 'react-cosmos/vitest.js';

import { CosmosConfig, createCosmosConfig } from 'react-cosmos';
import { findMainScriptUrl } from './findMainScriptUrl.js';

describe('main script detection', () => {
  const scriptUrls = [
    ...urlExtVariations('src/main'),
    ...urlExtVariations('src/index'),
    ...urlExtVariations('main'),
    ...urlExtVariations('index'),
    ...urlExtVariations('vite/main'),
  ];
  scriptUrls.forEach(scriptUrl => {
    it(scriptUrl, async () => {
      const config = createCosmosConfig('/my/root/path', {});

      const findVariation = (url: string) =>
        findUrlMocked(config, mockIndexHtml(['/src/polyfills.ts', url]));

      expect(await findVariation(scriptUrl)).toBe(`/${scriptUrl}`);
      expect(await findVariation(`./${scriptUrl}`)).toBe(`/${scriptUrl}`);
      expect(await findVariation(`/${scriptUrl}`)).toBe(`/${scriptUrl}`);
    });
  });

  it(`finds any single script URL`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml(['/src/custom-main.tsx']);

    expect(await findUrlMocked(config, indexHtml)).toBe('/src/custom-main.tsx');
  });

  it(`throws when main script can't be established from multiple scripts`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml([
      '/src/custom-main-a.tsx',
      '/src/custom-main-b.tsx',
    ]);

    await expect(findUrlMocked(config, indexHtml)).rejects.toThrow(
      `Multiple script paths found in index.html. ` +
        `Please set vite.indexPath in your Cosmos config: ` +
        `https://reactcosmos.org/docs/getting-started/vite#configuration`
    );
  });

  it(`returns default main script URL when index.html doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml([]);
    expect(await findUrlMocked(config, indexHtml)).toBe('/src/main.tsx');
  });
});

describe('custom main script path', () => {
  it('finds existing custom script', async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: 'src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml([
      '/src/polyfills.ts',
      '/src/custom-main.tsx',
    ]);

    expect(await findUrlMocked(config, indexHtml)).toBe('/src/custom-main.tsx');
  });

  it(`throws when custom script doesn't exist`, async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: 'src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml(['/src/custom-main-a.tsx']);

    await expect(findUrlMocked(config, indexHtml)).rejects.toThrow(
      `Script URL /src/custom-main.tsx not found in index.html. ` +
        `Add it or change vite.indexPath in your Cosmos config.`
    );
  });

  it(`throws when index.html doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: '/src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml([]);

    await expect(findUrlMocked(config, indexHtml)).rejects.toThrow(
      `Script URL /src/custom-main.tsx not found in index.html. ` +
        `Add it or change vite.indexPath in your Cosmos config.`
    );
  });
});

function urlExtVariations(url: string) {
  return [`${url}.jsx`, `${url}.tsx`];
}

async function findUrlMocked(config: CosmosConfig, indexHtml: string) {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] No vite config found, using default settings');
    return findMainScriptUrl(config, indexHtml);
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
