import path from 'node:path';
import { findMainScriptUrl } from './findMainScriptUrl.js';

const rootDir = '/my/root/path';

describe('main script detection', () => {
  const scriptUrls = [
    ...urlExtVariations('src/main'),
    ...urlExtVariations('src/index'),
    ...urlExtVariations('main'),
    ...urlExtVariations('index'),
    ...urlExtVariations('vite/main'),
  ];
  scriptUrls.forEach(scriptUrl => {
    it(scriptUrl, () => {
      const findVariation = (url: string) =>
        findMainScriptUrl(mockIndexHtml(['/src/polyfills.ts', url]), rootDir);

      expect(findVariation(scriptUrl)).toBe(`/${scriptUrl}`);
      expect(findVariation(`./${scriptUrl}`)).toBe(`/${scriptUrl}`);
      expect(findVariation(`/${scriptUrl}`)).toBe(`/${scriptUrl}`);
    });
  });

  it(`finds any single script URL`, () => {
    const html = mockIndexHtml(['/src/custom-main.tsx']);

    expect(findMainScriptUrl(html, rootDir)).toBe('/src/custom-main.tsx');
  });

  it(`finds best script URL match`, () => {
    const html = mockIndexHtml(['/foo/main.tsx', '/src/main.tsx']);

    expect(findMainScriptUrl(html, rootDir)).toBe('/src/main.tsx');
  });

  it(`throws when main script can't be established from multiple scripts`, () => {
    const html = mockIndexHtml([
      '/src/custom-main-a.tsx',
      '/src/custom-main-b.tsx',
    ]);

    expect(() => findMainScriptUrl(html, rootDir)).toThrow(
      `Multiple script paths found in index.html. ` +
        `Please set vite.mainScriptPath in your Cosmos config: ` +
        `https://reactcosmos.org/docs/getting-started/vite#configuration`
    );
  });

  it(`returns default main script URL when index.html doesn't contain any script`, () => {
    const html = mockIndexHtml([]);
    expect(findMainScriptUrl(html, rootDir)).toBe('/src/main.tsx');
  });
});

describe('custom main script path', () => {
  it('finds existing custom script', () => {
    const html = mockIndexHtml(['/src/polyfills.ts', '/src/custom-main.tsx']);
    const mainScriptPath = path.join(rootDir, 'src/custom-main.tsx');

    expect(findMainScriptUrl(html, rootDir, mainScriptPath)).toBe(
      '/src/custom-main.tsx'
    );
  });

  it(`throws when custom script doesn't exist`, () => {
    const html = mockIndexHtml(['/src/custom-main-a.tsx']);
    const mainScriptPath = path.join(rootDir, 'src/custom-main.tsx');

    expect(() => findMainScriptUrl(html, rootDir, mainScriptPath)).toThrow(
      `Script URL /src/custom-main.tsx not found in index.html. ` +
        `Add it or change vite.mainScriptPath in your Cosmos config.`
    );
  });

  it(`throws when index.html doesn't contain any script`, () => {
    const html = mockIndexHtml([]);
    const mainScriptPath = path.join(rootDir, 'src/custom-main.tsx');

    expect(() => findMainScriptUrl(html, rootDir, mainScriptPath)).toThrow(
      `Script URL /src/custom-main.tsx not found in index.html. ` +
        `Add it or change vite.mainScriptPath in your Cosmos config.`
    );
  });
});

function urlExtVariations(url: string) {
  return [`${url}.jsx`, `${url}.tsx`];
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
