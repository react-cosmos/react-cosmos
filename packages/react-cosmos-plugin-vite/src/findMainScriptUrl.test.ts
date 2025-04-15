// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole } from 'react-cosmos/vitest.js';

import { CosmosConfig, createCosmosConfig } from 'react-cosmos';
import { findMainScriptUrl } from './findMainScriptUrl.js';

describe('main script detection', () => {
  const scriptUrls = [
    ...scriptUrlVariations('src/main'),
    ...scriptUrlVariations('src/index'),
    ...scriptUrlVariations('main'),
    ...scriptUrlVariations('index'),
  ];
  scriptUrls.forEach(scriptUrl => {
    it(`finds "${scriptUrl}" script`, async () => {
      const config = createCosmosConfig('/my/root/path', {});
      const indexHtml = mockIndexHtml(['/src/polyfills.ts', scriptUrl]);

      expect(await findUrlMocked(config, indexHtml)).toBe(scriptUrl);
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

  // TODO: Auto fix this
  it(`throws when index.html doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {});
    const indexHtml = mockIndexHtml([]);

    await expect(findUrlMocked(config, indexHtml)).rejects.toThrow(
      `You need at least one script tag in your index.html file. ` +
        `Example: <script type="module" src="/src/main.tsx"></script>`
    );
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
      `Main script path /src/custom-main.tsx not found in index.html. ` +
        `Please create it or change vite.indexPath in your Cosmos config.`
    );
  });

  // TODO: Auto fix this
  it(`throws when index.html doesn't contain any script`, async () => {
    const config = createCosmosConfig('/my/root/path', {
      vite: { indexPath: '/src/custom-main.tsx' },
    });
    const indexHtml = mockIndexHtml([]);

    await expect(findUrlMocked(config, indexHtml)).rejects.toThrow(
      `You need at least one script tag in your index.html file. ` +
        `Example: <script type="module" src="/src/main.tsx"></script>`
    );
  });
});

function scriptUrlVariations(scriptPath: string) {
  const exts = (p: string) => [`${p}.js`, `${p}.jsx`, `${p}.ts`, `${p}.tsx`];
  return [
    ...exts(scriptPath),
    ...exts(`./${scriptPath}`),
    ...exts(`/${scriptPath}`),
  ];
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
