import path from 'path';
import {
  CosmosConfig,
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos/server.js';
import { Plugin } from 'rollup';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userDepsVirtualModuleId = 'virtual:cosmos-userdeps';
export const userDepsResolvedModuleId = '\0' + userDepsVirtualModuleId;

export function reactCosmosViteRollupPlugin(
  cosmosConfig: CosmosConfig
): Plugin {
  const defaultIndexPattern = createDefaultIndexPattern(cosmosConfig.rootDir);

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
            // TODO: Allow passing dom.containerQuerySelector
          },
          relativeToDir: null,
        });
      } else {
        return null;
      }
    },

    transform(src, id) {
      // TODO: Allow indexFile customization via cosmosConfig.vite.indexFile
      if (id.match(defaultIndexPattern)) {
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

function createDefaultIndexPattern(rootDir: string) {
  return new RegExp(`${path.join(rootDir, 'index')}\\.(js|ts)x?`);
}
