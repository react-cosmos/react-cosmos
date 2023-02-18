import path from 'path';
import {
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos/server.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';

export function reactCosmosViteRollupPlugin(options) {
  const { cosmosConfig } = options;
  const defaultIndexPattern = createDefaultIndexPattern(cosmosConfig.rootDir);

  return {
    name: 'react-cosmos-renderer-vite',

    resolveId(id) {
      if (id === options.userDepsVirtualModuleId) {
        return options.userDepsResolvedModuleId;
      }
    },

    load(id) {
      if (id === options.userDepsResolvedModuleId) {
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
      const isIndexFile = options.indexFile
        ? id === path.join(cosmosConfig.rootDir, options.indexFile)
        : id.match(defaultIndexPattern);

      if (isIndexFile) {
        return {
          code: createViteRendererIndex(options.userDepsVirtualModuleId),
          map: null,
        };
      }
    },
  };
}

function createDefaultIndexPattern(rootDir) {
  return new RegExp(`${path.join(rootDir, 'index')}\\.(js|ts)x?`);
}
