import fs from 'node:fs';
import path from 'node:path';
import type { CosmosConfig } from 'react-cosmos';
import {
  findUserModulePaths,
  generateUserImports,
  getWebSocketUrl,
  isUserModulePath,
} from 'react-cosmos';
import type { CosmosMode } from 'react-cosmos-core';
import type { DomRendererConfig } from 'react-cosmos-dom';
import type { Plugin, ViteDevServer } from 'vite';
import type { CosmosViteConfig } from './createCosmosViteConfig.js';
import { createViteRendererIndex } from './createViteRendererIndex.js';
import { createIndexHtml } from './indexHtml/createIndexHtml.js';
import { ensureMainScriptUrl } from './indexHtml/ensureMainScriptUrl.js';
import { findMainScriptUrl } from './indexHtml/findMainScriptUrl.js';

export const rendererResolvedModuleId = '\0' + 'virtual:cosmos-renderer';
export const userImportsVirtualModuleId = 'virtual:cosmos-imports';
export const userImportsResolvedModuleId = '\0' + userImportsVirtualModuleId;

export function reactCosmosViteRollupPlugin(
  config: CosmosConfig,
  cosmosViteConfig: CosmosViteConfig,
  mode: CosmosMode
): Plugin {
  let mainScriptUrl: string;
  let server: ViteDevServer | undefined;

  return {
    name: 'react-cosmos-vite-renderer',
    enforce: 'pre',

    async buildStart() {
      const htmlPath = path.resolve(config.rootDir, 'index.html');
      // Other plugins might intercept <root>/index.html and resolve it to
      // a different path. We need to respect that and avoid generating a new
      // index.html in the root if it already exists.
      const resolved = await this.resolve(htmlPath);
      const html = resolved
        ? fs.readFileSync(resolved.id, 'utf-8')
        : createIndexHtml(htmlPath);
      mainScriptUrl = findMainScriptUrl(html, cosmosViteConfig.mainScriptUrl);
    },

    configureServer(devServer) {
      server = devServer;
    },

    // Vite doesn't know about new fixture files until virtual:cosmos-imports
    // imports them. And when an imported fixture is deleted, Vite soft
    // invalidates virtual:cosmos-imports, which keeps the stale import. This
    // hook runs before Vite's own HMR handling, so reloading the module here
    // keeps it in sync in both cases.
    watchChange(id, { event }) {
      if (!server || event === 'update' || !isUserModulePath(config, id)) {
        return;
      }

      const module = server.moduleGraph.getModuleById(
        userImportsResolvedModuleId
      );
      if (module) {
        server.moduleGraph.invalidateModule(module);
        server.reloadModule(module);
      }
    },

    transformIndexHtml(html) {
      // Redetect the main script URL when index.html changes
      mainScriptUrl = findMainScriptUrl(html, cosmosViteConfig.mainScriptUrl);
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
