import fs from 'node:fs';
import path from 'node:path';
import {
  CosmosConfig,
  findUserModulePaths,
  generateUserImports,
  getWebSocketUrl,
} from 'react-cosmos';
import { CosmosMode } from 'react-cosmos-core';
import { DomRendererConfig } from 'react-cosmos-dom';
import { PluginOption, ResolvedConfig } from 'vite';
import { createViteRendererIndex } from './createViteRendererIndex.js';
import { findMainScriptUrl } from './findMainScriptUrl.js';
import { generateViteIndexHtml } from './generateViteIndexHtml.js';

export const rendererResolvedModuleId = '\0' + 'virtual:cosmos-renderer';
export const userImportsVirtualModuleId = 'virtual:cosmos-imports';
export const userImportsResolvedModuleId = '\0' + userImportsVirtualModuleId;

export function reactCosmosViteRollupPlugin(
  config: CosmosConfig,
  mode: CosmosMode
): PluginOption {
  let mainScriptUrl: string;

  return {
    name: 'react-cosmos-vite-renderer',
    enforce: 'pre',

    configResolved(viteConfig: ResolvedConfig) {
      let html = '';

      const htmlPath = path.resolve(viteConfig.root, 'index.html');
      if (!fs.existsSync(htmlPath)) {
        console.log(
          `[Cosmos] Vite index.html not found, creating a default one...`
        );
        html = generateViteIndexHtml();
        fs.writeFileSync(htmlPath, html);
      } else {
        // TODO: Add a default script if the user doesn't have one
        html = fs.readFileSync(htmlPath, 'utf-8');
      }

      mainScriptUrl = findMainScriptUrl(config, html);
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
          console.log(`[Cosmos] Loading cosmos renderer at ${mainScriptUrl}`);
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
