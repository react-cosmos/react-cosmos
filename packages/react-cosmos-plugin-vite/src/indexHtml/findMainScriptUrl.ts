import path from 'node:path';
import { CosmosConfig, slash } from 'react-cosmos';
import { createCosmosViteConfig } from '../createCosmosViteConfig.js';
import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';
import { getHtmlScriptUrls } from './getHtmlScriptUrls.js';

const mainUrlPattern = new RegExp(`(\\.?/)?(src/)?(index|main)\\.(js|ts)x?$`);

export function findMainScriptUrl(config: CosmosConfig, html: string) {
  const { rootDir } = config;
  const scripts = getHtmlScriptUrls(html).map(normalizeUrl);

  const { indexPath } = createCosmosViteConfig(config);
  if (indexPath === null) {
    // NOTE: This assumes the html will also be transformed to include a script
    // tag with default main script URL.
    if (scripts.length === 0) return defaultMainScriptUrl();

    if (scripts.length > 1) {
      const mainUrl = scripts.find(url => mainUrlPattern.test(url));
      if (mainUrl) return mainUrl;

      throw new Error(
        `Multiple script paths found in index.html. ` +
          `Please set vite.indexPath in your Cosmos config: ` +
          `https://reactcosmos.org/docs/getting-started/vite#configuration`
      );
    }

    return scripts[0];
  }

  const mainUrl = scripts.find(url => path.join(rootDir, url) === indexPath);
  if (mainUrl) return mainUrl;

  const relPath = slash(path.relative(rootDir, indexPath));
  throw new Error(
    `Script URL /${relPath} not found in index.html. ` +
      `Add it or change vite.indexPath in your Cosmos config.`
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
