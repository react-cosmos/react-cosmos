import path from 'node:path';
import { CosmosConfig, slash } from 'react-cosmos';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { getHtmlScriptSrcs } from './utils/htmlScriptSrcs.js';

const mainSrcPattern = new RegExp(`^(\\.?/)?(src/)?(index|main)\\.(js|ts)x?$`);

export function findMainScriptUrl(config: CosmosConfig, indexHtml: string) {
  const { rootDir } = config;
  const scripts = getHtmlScriptSrcs(indexHtml);
  // TODO: Auto fix this, for both default and custom index paths
  if (scripts.length === 0)
    throw new Error(
      `You need at least one script tag in your index.html file. ` +
        `Example: <script type="module" src="/src/main.tsx"></script>`
    );

  const { indexPath } = createCosmosViteConfig(config);
  if (indexPath === null) {
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
