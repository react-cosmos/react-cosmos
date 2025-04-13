import path from 'node:path';
import { CosmosConfig } from 'react-cosmos';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { getHtmlScriptSrcs } from './utils/htmlScriptSrcs.js';

// TODO: Do we need to normalize slashes for Windows in some places?

const defaultIndexPattern = new RegExp(
  `^(\\.?\\${path.sep})?(src\\${path.sep})?(index|main)\\.(js|ts)x?$`
);

export function resolveViteIndexPath(config: CosmosConfig, indexHtml: string) {
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
      const indexSrc = scripts.find(src => defaultIndexPattern.test(src));
      if (indexSrc) return path.join(rootDir, indexSrc);

      throw new Error(
        `Multiple script paths found in index.html. ` +
          `Please set vite.indexPath in your Cosmos config: ` +
          `https://reactcosmos.org/docs/getting-started/vite#configuration`
      );
    }

    return path.join(rootDir, scripts[0]);
  }

  const indexSrc = scripts.find(src => path.join(rootDir, src) === indexPath);
  if (indexSrc) return path.join(rootDir, indexSrc);

  const relPath = path.relative(rootDir, indexPath);
  throw new Error(
    `Custom index path /${relPath} not found in index.html. ` +
      `Please add it or change vite.indexPath in your Cosmos config.`
  );
}
