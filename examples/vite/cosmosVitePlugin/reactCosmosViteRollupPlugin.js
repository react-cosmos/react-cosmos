import path from 'path';
import {
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos/server.js';

const virtualModuleId = 'virtual:cosmos-userdeps';

export const resolvedReactCosmosUserDepsModuleId = '\0' + virtualModuleId;

export function reactCosmosViteRollupPlugin(options) {
  const { cosmosConfig } = options;

  const defaultIndex = new RegExp(
    `${path.join(cosmosConfig.rootDir, 'index')}\\.(js|ts)x?`
  );

  return {
    name: 'react-cosmos-renderer-vite',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedReactCosmosUserDepsModuleId;
      }
    },

    load(id) {
      if (id === resolvedReactCosmosUserDepsModuleId) {
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
        : id.match(defaultIndex);

      if (isIndexFile) {
        return {
          code: getRendererIndex(virtualModuleId),
          map: null,
        };
      }
    },
  };
}

function getRendererIndex(userDepsModuleId) {
  return `
import { mountDomRenderer } from 'react-cosmos-dom';

mount();

async function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  const args = await import('${userDepsModuleId}');
  mountDomRenderer(args);
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    mount();
  });
}\n`;
}
