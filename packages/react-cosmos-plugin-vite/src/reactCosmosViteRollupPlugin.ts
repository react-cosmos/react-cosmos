import {
  CosmosConfig,
  findUserModulePaths,
  generateUserImports,
  getWebSocketUrl,
} from 'react-cosmos';
import { CosmosMode } from 'react-cosmos-core';
import { DomRendererConfig } from 'react-cosmos-dom';
import { PluginOption, ResolvedConfig } from 'vite';
import { CosmosViteConfig } from './createCosmosViteConfig.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';
import { ensureIndexHtml } from './indexHtml/ensureIndexHtml.js';
import { ensureMainScriptUrl } from './indexHtml/ensureMainScriptUrl.js';
import { findMainScriptUrl } from './indexHtml/findMainScriptUrl.js';

export const rendererResolvedModuleId = '\0' + 'virtual:cosmos-renderer';
export const userImportsVirtualModuleId = 'virtual:cosmos-imports';
export const userImportsResolvedModuleId = '\0' + userImportsVirtualModuleId;

export function reactCosmosViteRollupPlugin(
  config: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig,
  mode: CosmosMode
): PluginOption {
  let mainScriptUrl: string;

  return {
    name: 'react-cosmos-vite-renderer',
    enforce: 'pre',

    configResolved(viteConfig: ResolvedConfig) {
      const html = ensureIndexHtml(viteConfig.root);
      mainScriptUrl = findMainScriptUrl(
        html,
        config.rootDir,
        cosmosViteConfig.indexPath
      );
    },

    transformIndexHtml(html) {
      // Redetect the main script URL when index.html changes
      mainScriptUrl = findMainScriptUrl(
        html,
        config.rootDir,
        cosmosViteConfig.indexPath
      );
      return ensureMainScriptUrl(html);
    },

    resolveId(id) {
      switch (id) {
        case mainScriptUrl:
          return rendererResolvedModuleId;
        case userImportsVirtualModuleId:
          return userImportsResolvedModuleId;
        default:
          return null;
      }
    },

    async load(id: string) {
      switch (id) {
        case rendererResolvedModuleId: {
          console.log(`[Cosmos] Loading Cosmos renderer at ${mainScriptUrl}`);
          return createViteRendererIndex(userImportsVirtualModuleId);
        }
        case userImportsResolvedModuleId: {
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
        }
        default:
          return null;
      }
    },
  };
}
