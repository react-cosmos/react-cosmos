import fs from 'node:fs/promises';
import path from 'node:path';
import { CosmosMode, RendererConfig, pickRendererUrl } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { updateFixtureListCache } from '../shared/serverFixtureList.js';
import { getWebSocketUrl } from '../shared/webSocketUrl.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { startFixtureWatcher } from '../userModules/fixtureWatcher.js';
import { generateUserImports } from '../userModules/generateUserImports.js';
import { UserModulePaths } from '../userModules/shared.js';
import { moduleExists } from '../utils/fs.js';

export const fixtureWatcherPlugin: CosmosServerPlugin = {
  name: 'fixtureWatcher',

  async devServer({ config, platform }) {
    const exposeImports = shouldExposeImports(platform, config);

    if (exposeImports) {
      const modulePaths = await findUserModulePaths(config);
      await generateImportsFile(platform, config, 'dev', modulePaths);
    }

    const watcher = await startFixtureWatcher(config, 'all', async () => {
      const modulePaths = await findUserModulePaths(config);

      updateFixtureListCache(config.rootDir, modulePaths.fixturePaths);

      if (exposeImports) {
        generateImportsFile(platform, config, 'dev', modulePaths);
      }
    });

    return async () => {
      await watcher.close();
    };
  },

  async export({ config }) {
    if (shouldExposeImports('web', config)) {
      const modulePaths = await findUserModulePaths(config);
      await generateImportsFile('web', config, 'export', modulePaths);
    }
  },
};

function shouldExposeImports(platform: CosmosPlatform, config: CosmosConfig) {
  return platform === 'native' || Boolean(config.exposeImports);
}

async function generateImportsFile(
  platform: CosmosPlatform,
  config: CosmosConfig,
  mode: CosmosMode,
  modulePaths: UserModulePaths
) {
  const { exposeImports } = config;

  const filePath =
    typeof exposeImports === 'string'
      ? exposeImports
      : getDefaultFilePath(config.rootDir);

  const typeScript = /\.tsx?$/.test(filePath);

  const rendererConfig = {
    webSocketUrl: mode === 'dev' ? getWebSocketUrl(config) : null,
    rendererUrl:
      platform === 'web' ? pickRendererUrl(config.rendererUrl, mode) : null,
  };
  const fileSource = generateUserImports<RendererConfig>({
    config,
    modulePaths,
    rendererConfig,
    relativeToDir: path.dirname(filePath),
    typeScript,
  });
  await fs.writeFile(filePath, fileSource, 'utf8');

  const relModulesPath = path.relative(process.cwd(), filePath);
  console.log(`[Cosmos] Generated ${relModulesPath}`);
}

function getDefaultFilePath(rootDir: string) {
  const ext = moduleExists('typescript') ? 'ts' : 'js';
  return path.join(rootDir, `cosmos.imports.${ext}`);
}
