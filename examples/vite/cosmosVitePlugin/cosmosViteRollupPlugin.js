import path from 'path';
import {
  generateUserDepsModule,
  getPlaygroundUrl,
} from 'react-cosmos/server.js';

const virtualModuleId = 'virtual:cosmos-userdeps';

export const resolvedUserDepsModuleId = '\0' + virtualModuleId;

export function cosmosViteRollupPlugin(cosmosConfig) {
  const indexRegExp = new RegExp(
    `${path.join(cosmosConfig.rootDir, 'index')}\\.(js|ts)x?`
  );

  return {
    name: 'react-cosmos-renderer-vite',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedUserDepsModuleId;
      }
    },

    load(id) {
      if (id === resolvedUserDepsModuleId) {
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
      if (id.match(indexRegExp)) {
        return {
          code: getRendererIndex(virtualModuleId),
          map: null,
        };
      }
    },

    watchChange: id => {
      console.log('watchChange', id);
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
