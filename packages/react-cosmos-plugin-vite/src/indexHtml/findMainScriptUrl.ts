import path from 'node:path';
import { slash } from 'react-cosmos';
import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';
import { getHtmlScriptUrls } from './getHtmlScriptUrls.js';

const mainUrlPattern = new RegExp(`/(src/)?(index|main)\\.(js|ts)x?$`);

export function findMainScriptUrl(
  html: string,
  rootDir: string,
  mainScriptPath: string | null = null
) {
  const scripts = getHtmlScriptUrls(html).map(normalizeUrl);

  if (mainScriptPath === null) {
    // NOTE: This assumes the html will also be transformed to include a script
    // tag with default main script URL.
    if (scripts.length === 0) return defaultMainScriptUrl();

    if (scripts.length > 1) {
      // Pick the best match
      // Eg. Between "/src/main.tsx" and "/foo/main.tsx", pick "/src/index.tsx"
      let bestUrl;
      let bestUrlLength = 0;
      for (const url of scripts) {
        const match = url.match(mainUrlPattern);
        if (match && match[0].length > bestUrlLength) {
          bestUrl = url;
          bestUrlLength = match[0].length;
        }
      }
      if (bestUrl) {
        return bestUrl;
      }

      throw new Error(
        `Multiple script paths found in index.html. ` +
          `Please set vite.mainScriptPath in your Cosmos config: ` +
          `https://reactcosmos.org/docs/getting-started/vite#configuration`
      );
    }

    return scripts[0];
  }

  const mainUrl = scripts.find(
    url => path.join(rootDir, url) === mainScriptPath
  );
  if (mainUrl) return mainUrl;

  const relPath = slash(path.relative(rootDir, mainScriptPath));
  throw new Error(
    `Script URL /${relPath} not found in index.html. ` +
      `Add it or change vite.mainScriptPath in your Cosmos config.`
  );
}

function normalizeUrl(url: string) {
  // "src/main.tsx" => "/src/main.tsx"
  // "./src/main.tsx" => "/src/main.tsx"
  // "../src/main.tsx" => "/src/main.tsx"
  return `/${url
    .split('/')
    .filter(p => !['', '.', '..'].includes(p))
    .join('/')}`;
}
