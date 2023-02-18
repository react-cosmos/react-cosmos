import path from 'path';
import {
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos/server.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export const userDepsVirtualModuleId = 'virtual:cosmos-userdeps';
export const userDepsResolvedModuleId = '\0' + userDepsVirtualModuleId;

export function reactCosmosViteRollupPlugin(cosmosConfig) {
  const defaultIndexPattern = createDefaultIndexPattern(cosmosConfig.rootDir);

  return {
    name: 'react-cosmos-renderer-vite',

    resolveId(id) {
      if (id === userDepsVirtualModuleId) {
        return userDepsResolvedModuleId;
      }
    },

    load(id) {
      if (id === userDepsResolvedModuleId) {
        return generateUserDepsModule({
          cosmosConfig,
          rendererConfig: {
            playgroundUrl: getPlaygroundUrl(cosmosConfig),
            containerQuerySelector: null,
          },
          relativeToDir: null,
        });
      }
    },

    transform(src, id) {
      // TODO: Allow indexFile customization via cosmosConfig.vite.indexFile
      if (id.match(defaultIndexPattern)) {
        return {
          code: createViteRendererIndex(userDepsVirtualModuleId),
          map: null,
        };
      }
    },
  };
}

function createDefaultIndexPattern(rootDir) {
  return new RegExp(`${path.join(rootDir, 'index')}\\.(js|ts)x?`);
}
