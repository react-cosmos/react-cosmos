import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';
import { getHtmlScriptUrls } from './getHtmlScriptUrls.js';

const mainUrlPattern = new RegExp(`/(src/)?(index|main)\\.(js|ts)x?$`);

export function findMainScriptUrl(
  html: string,
  mainScriptUrl: string | null = null
) {
  const scripts = getHtmlScriptUrls(html).map(normalizeUrl);

  if (mainScriptUrl !== null) {
    const mainUrl = scripts.find(url => url === normalizeUrl(mainScriptUrl));
    if (mainUrl) return mainUrl;

    throw new Error(
      `Script URL "${mainScriptUrl}" not found in index.html. ` +
        `Add it or change vite.mainScriptUrl in your Cosmos config.`
    );
  }

  // NOTE: This assumes the html will also be transformed to include a script
  // tag with the default main script URL.
  if (scripts.length === 0) return defaultMainScriptUrl();

  if (scripts.length === 1) return scripts[0];

  const mainUrl = guessMainScriptUrl(scripts);
  if (mainUrl) return mainUrl;

  throw new Error(
    `Multiple script paths found in index.html. ` +
      `Please set vite.mainScriptUrl in your Cosmos config: ` +
      `https://reactcosmos.org/docs/getting-started/vite#configuration`
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

function guessMainScriptUrl(urls: string[]) {
  // Find main script URL from multiple script tags based on common patterns
  // and pick the longest match when multiple matches are found.
  // Eg. Between "/src/main.tsx" and "/foo/main.tsx", pick "/src/index.tsx"
  let bestUrl = null;
  let bestUrlLength = 0;

  for (const url of urls) {
    const match = url.match(mainUrlPattern);
    if (match && match[0].length > bestUrlLength) {
      bestUrl = url;
      bestUrlLength = match[0].length;
    }
  }

  return bestUrl;
}
