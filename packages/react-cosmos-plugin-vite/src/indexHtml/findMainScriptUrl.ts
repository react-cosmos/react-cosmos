import path from 'node:path';
import { CosmosConfig, slash } from 'react-cosmos';
import { createCosmosViteConfig } from '../createCosmosViteConfig.js';
import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';
import { getHtmlScriptUrls } from './getHtmlScriptUrls.js';

const mainSrcPattern = new RegExp(`^(\\.?/)?(src/)?(index|main)\\.(js|ts)x?$`);

export function findMainScriptUrl(config: CosmosConfig, html: string) {
  const { rootDir } = config;
  const scripts = getHtmlScriptUrls(html);

  const { indexPath } = createCosmosViteConfig(config);
  if (indexPath === null) {
    // NOTE: This assumes the html will also be transformed to include a script
    // tag with default main script URL.
    if (scripts.length === 0) return defaultMainScriptUrl();

    if (scripts.length > 1) {
      const mainSrc = scripts.find(src => mainSrcPattern.test(src));
      if (mainSrc) return mainSrc;

      throw new Error(
        `Multiple script paths found in index.html. ` +
          `Please set vite.indexPath in your Cosmos config: ` +
          `https://reactcosmos.org/docs/getting-started/vite#configuration`
      );
    }

    return scripts[0];
  }

  const mainSrc = scripts.find(src => path.join(rootDir, src) === indexPath);
  if (mainSrc) return mainSrc;

  const relPath = slash(path.relative(rootDir, indexPath));
  throw new Error(
    `Main script path /${relPath} not found in index.html. ` +
      `Please create it or change vite.indexPath in your Cosmos config.`
  );
}
