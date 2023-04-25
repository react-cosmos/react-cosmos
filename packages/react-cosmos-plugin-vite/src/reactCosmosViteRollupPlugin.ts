import path from 'path';
import {
  CosmosConfig,
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos';
import { Plugin } from 'rollup';
import { ViteCosmosConfig } from './createViteCosmosConfig.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userDepsVirtualModuleId = 'virtual:cosmos-userdeps';
export const userDepsResolvedModuleId = '\0' + userDepsVirtualModuleId;

const defaultIndexPattern = /^(src\/)?(index|main)\.(js|ts)x?$/;

export function reactCosmosViteRollupPlugin(
  cosmosConfig: CosmosConfig,
  cosmosViteConfig: ViteCosmosConfig
): Plugin {
  return {
    name: 'react-cosmos-vite-renderer',

    resolveId(id) {
      if (id === userDepsVirtualModuleId) {
        return userDepsResolvedModuleId;
      } else {
        return null;
      }
    },

    load(id: string) {
      if (id == userDepsResolvedModuleId) {
        return generateUserDepsModule({
          cosmosConfig,
          rendererConfig: {
            playgroundUrl: getPlaygroundUrl(cosmosConfig),
            containerQuerySelector: cosmosConfig.dom.containerQuerySelector,
          },
          relativeToDir: null,
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
          code: createViteRendererIndex(userDepsVirtualModuleId),
          map: null,
        };
      } else {
        return null;
      }
    },
  };
}
