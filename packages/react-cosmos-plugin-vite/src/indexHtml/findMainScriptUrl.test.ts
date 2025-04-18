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
    it(scriptUrl, () => {
      const findVariation = (url: string) =>
        findMainScriptUrl(mockHtml(['/src/polyfills.ts', url]));

      expect(findVariation(scriptUrl)).toBe(`/${scriptUrl}`);
      expect(findVariation(`./${scriptUrl}`)).toBe(`/${scriptUrl}`);
      expect(findVariation(`/${scriptUrl}`)).toBe(`/${scriptUrl}`);
    });
  });

  it(`finds any single script URL`, () => {
    const html = mockHtml(['/src/custom-main.tsx']);
    expect(findMainScriptUrl(html)).toBe('/src/custom-main.tsx');
  });

  it(`finds best script URL match`, () => {
    const html = mockHtml(['/foo/main.tsx', '/src/main.tsx']);
    expect(findMainScriptUrl(html)).toBe('/src/main.tsx');
  });

  it(`throws when main script can't be established from multiple scripts`, () => {
    const html = mockHtml(['/src/custom-main-a.tsx', '/src/custom-main-b.tsx']);
    expect(() => findMainScriptUrl(html)).toThrow(
      `Multiple script paths found in index.html. ` +
        `Please set vite.mainScriptUrl in your Cosmos config: ` +
        `https://reactcosmos.org/docs/getting-started/vite#configuration`
    );
  });

  it(`returns default main script URL when index.html doesn't contain any script`, () => {
    const html = mockHtml([]);
    expect(findMainScriptUrl(html)).toBe('/src/main.tsx');
  });
});

describe('custom main script path', () => {
  it('finds existing custom script', () => {
    const html = mockHtml(['/src/polyfills.ts', '/src/custom-main.tsx']);
    const findVariation = (mainScriptUrl: string) =>
      findMainScriptUrl(html, mainScriptUrl);

    expect(findVariation('src/custom-main.tsx')).toBe('/src/custom-main.tsx');
    expect(findVariation('./src/custom-main.tsx')).toBe('/src/custom-main.tsx');
    expect(findVariation('/src/custom-main.tsx')).toBe('/src/custom-main.tsx');
  });

  it(`throws when custom script doesn't exist`, () => {
    const html = mockHtml(['/src/custom-main-a.tsx']);
    const mainScriptUrl = '/src/custom-main.tsx';
    expect(() => findMainScriptUrl(html, mainScriptUrl)).toThrow(
      `Script URL "/src/custom-main.tsx" not found in index.html. ` +
        `Add it or change vite.mainScriptUrl in your Cosmos config.`
    );
  });

  it(`throws when index.html doesn't contain any script`, () => {
    const html = mockHtml([]);
    const mainScriptUrl = '/src/custom-main.tsx';
    expect(() => findMainScriptUrl(html, mainScriptUrl)).toThrow(
      `Script URL "/src/custom-main.tsx" not found in index.html. ` +
        `Add it or change vite.mainScriptUrl in your Cosmos config.`
    );
  });
});

function urlExtVariations(url: string) {
  return [`${url}.jsx`, `${url}.tsx`, `${url}.js`, `${url}.ts`];
}

function mockHtml(scripts: string[]) {
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
