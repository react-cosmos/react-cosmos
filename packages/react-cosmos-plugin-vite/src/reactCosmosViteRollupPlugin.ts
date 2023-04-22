import path from 'path';
import {
  CosmosConfig,
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos';
import { Plugin } from 'rollup';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userDepsVirtualModuleId = 'virtual:cosmos-userdeps';
export const userDepsResolvedModuleId = '\0' + userDepsVirtualModuleId;

const defaultIndexPattern = /^(src\/)?(index|main)\.(js|ts)x?$/;

export function reactCosmosViteRollupPlugin(
  cosmosConfig: CosmosConfig
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
      if (path.relative(cosmosConfig.rootDir, id).match(defaultIndexPattern)) {
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
