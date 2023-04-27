import path from 'node:path';
import {
  CosmosConfig,
  generateUserImports,
  getPlaygroundUrl,
} from 'react-cosmos';
import { Plugin } from 'rollup';
import { CosmosViteConfig } from './createCosmosViteConfig.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userImportsVirtualModuleId = 'virtual:cosmos-imports';
export const userImportsResolvedModuleId = '\0' + userImportsVirtualModuleId;

const defaultIndexPattern = new RegExp(
  `^(src\\${path.sep})?(index|main)\.(js|ts)x?$`
);

export function reactCosmosViteRollupPlugin(
  cosmosConfig: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig
): Plugin {
  return {
    name: 'react-cosmos-vite-renderer',

    resolveId(id) {
      if (id === userImportsVirtualModuleId) {
        return userImportsResolvedModuleId;
      } else {
        return null;
      }
    },

    load(id: string) {
      if (id == userImportsResolvedModuleId) {
        return generateUserImports({
          cosmosConfig,
          rendererConfig: {
            playgroundUrl: getPlaygroundUrl(cosmosConfig),
            containerQuerySelector: cosmosConfig.dom.containerQuerySelector,
          },
          relativeToDir: null,
          typeScript: false,
        });
      } else {
        return null;
      }
    },

    transform(src, id) {
      const isRendererIndex = cosmosViteConfig.indexPath
        ? cosmosViteConfig.indexPath === id
        : path.relative(cosmosConfig.rootDir, id).match(defaultIndexPattern);

      if (isRendererIndex) {
        const relPath = path.relative(process.cwd(), id);
        console.log(`[Cosmos] Replacing vite index module at ${relPath}`);

        return {
          code: createViteRendererIndex(userImportsVirtualModuleId),
          map: null,
        };
      } else {
        return null;
      }
    },
  };
}
