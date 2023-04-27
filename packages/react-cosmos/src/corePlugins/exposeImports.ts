import fs from 'fs/promises';
import path from 'path';
import { RendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosServerPlugin, PlatformType } from '../cosmosPlugin/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
import { startFixtureWatcher } from '../userModules/fixtureWatcher.js';
import { generateUserImports } from '../userModules/generateUserImports.js';
import { moduleExists } from '../utils/fs.js';

export const exposeImportsServerPlugin: CosmosServerPlugin = {
  name: 'exposeImports',

  async devServer({ cosmosConfig, platformType }) {
    if (!shouldExposeImports(platformType, cosmosConfig)) return;

    const { exposeImports } = cosmosConfig;

    const filePath =
      typeof exposeImports === 'string'
        ? exposeImports
        : getDefaultFilePath(cosmosConfig.rootDir);

    if (typeof exposeImports === 'boolean') {
      console.log(
        '[Cosmos] Use the exposeImports config option to specify a custom path (including .js/.ts extension)'
      );
    }

    await generateImportsFile(cosmosConfig, filePath);

    const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
      generateImportsFile(cosmosConfig, filePath);
    });

    return () => {
      watcher.close();
    };
  },
};

function shouldExposeImports(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  return platformType === 'native' || Boolean(cosmosConfig.exposeImports);
}

async function generateImportsFile(
  cosmosConfig: CosmosConfig,
  filePath: string
) {
  const rendererConfig: RendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
  };
  const fileSource = generateUserImports({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(filePath),
    typeScript: filePath.endsWith('.ts'),
  });
  await fs.writeFile(filePath, fileSource, 'utf8');

  const relModulesPath = path.relative(process.cwd(), filePath);
  console.log(`[Cosmos] Generated ${relModulesPath}`);
}

function getDefaultFilePath(rootDir: string) {
  const ext = moduleExists('typescript') ? 'ts' : 'js';
  return path.resolve(rootDir, `cosmos.imports.${ext}`);
}
