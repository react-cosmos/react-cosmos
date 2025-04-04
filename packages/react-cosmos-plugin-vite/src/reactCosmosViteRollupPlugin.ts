import path from 'node:path';
import {
  CosmosConfig,
  findUserModulePaths,
  generateUserImports,
  getWebSocketUrl,
  slash,
} from 'react-cosmos';
import { CosmosMode } from 'react-cosmos-core';
import { DomRendererConfig } from 'react-cosmos-dom';
import { Plugin } from 'rollup';
import { CosmosViteConfig } from './createCosmosViteConfig.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userImportsVirtualModuleId = 'virtual:cosmos-imports';
export const userImportsResolvedModuleId = '\0' + userImportsVirtualModuleId;

const defaultIndexPattern = new RegExp(
  `^(src\\${path.sep})?(index|main)\.(js|ts)x?$`
);

export function reactCosmosViteRollupPlugin(
  config: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig,
  mode: CosmosMode
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

    async load(id: string) {
      if (id == userImportsResolvedModuleId) {
        const modulePaths = await findUserModulePaths(config);
        return generateUserImports<DomRendererConfig>({
          config,
          modulePaths,
          rendererConfig: {
            webSocketUrl: mode === 'dev' ? getWebSocketUrl(config) : null,
            rendererUrl: null,
            containerQuerySelector: config.dom.containerQuerySelector,
          },
          relativeToDir: null,
          typeScript: false,
        });
      } else {
        return null;
      }
    },

    transform(src, id) {
      const absPath =
        cosmosViteConfig.indexPath &&
        absoluteIndexPath(cosmosViteConfig.indexPath, config.rootDir);

      const isRendererIndex = absPath
        ? absPath === id
        : path.relative(config.rootDir, id).match(defaultIndexPattern);

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

function absoluteIndexPath(indexPath: string, rootDir: string) {
  return indexPath.startsWith(rootDir)
    ? indexPath
    : slash(path.join(rootDir, indexPath));
}
