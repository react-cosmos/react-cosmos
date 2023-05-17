import path from 'node:path';
import {
  CosmosCommand,
  CosmosConfig,
  generateUserImports,
  getPlaygroundUrl,
  pickRendererUrl,
} from 'react-cosmos';
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
  cosmosConfig: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig,
  command: CosmosCommand
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
        return generateUserImports<DomRendererConfig>({
          cosmosConfig,
          rendererConfig: {
            playgroundUrl: getPlaygroundUrl(cosmosConfig),
            rendererUrl: pickRendererUrl(cosmosConfig.rendererUrl, command),
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
