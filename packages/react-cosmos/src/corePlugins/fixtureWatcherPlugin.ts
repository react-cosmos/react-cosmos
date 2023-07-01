import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CosmosCommand,
  RendererConfig,
  pickRendererUrl,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
import { updateFixtureListCache } from '../shared/serverFixtureList.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { startFixtureWatcher } from '../userModules/fixtureWatcher.js';
import { generateUserImports } from '../userModules/generateUserImports.js';
import { UserModulePaths } from '../userModules/shared.js';
import { moduleExists } from '../utils/fs.js';

export const fixtureWatcherPlugin: CosmosServerPlugin = {
  name: 'fixtureWatcher',

  async devServer({ cosmosConfig, platform }) {
    const exposeImports = shouldExposeImports(platform, cosmosConfig);

    if (exposeImports) {
      const modulePaths = findUserModulePaths(cosmosConfig);
      await generateImportsFile(cosmosConfig, 'dev', modulePaths);
    }

    const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
      const modulePaths = findUserModulePaths(cosmosConfig);

      updateFixtureListCache(cosmosConfig.rootDir, modulePaths.fixturePaths);

      if (exposeImports) {
        generateImportsFile(cosmosConfig, 'dev', modulePaths);
      }
    });

    return () => {
      watcher.close();
    };
  },

  async export({ cosmosConfig }) {
    if (shouldExposeImports('web', cosmosConfig)) {
      const modulePaths = findUserModulePaths(cosmosConfig);
      await generateImportsFile(cosmosConfig, 'export', modulePaths);
    }
  },
};

function shouldExposeImports(
  platform: CosmosPlatform,
  cosmosConfig: CosmosConfig
) {
  return platform === 'native' || Boolean(cosmosConfig.exposeImports);
}

async function generateImportsFile(
  cosmosConfig: CosmosConfig,
  command: CosmosCommand,
  modulePaths: UserModulePaths
) {
  const { exposeImports } = cosmosConfig;

  const filePath =
    typeof exposeImports === 'string'
      ? exposeImports
      : getDefaultFilePath(cosmosConfig.rootDir);

  const typeScript = /\.tsx?$/.test(filePath);

  const rendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
    rendererUrl: pickRendererUrl(cosmosConfig.rendererUrl, command),
  };
  const fileSource = generateUserImports<RendererConfig>({
    cosmosConfig,
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
