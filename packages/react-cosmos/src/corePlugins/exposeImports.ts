import fs from 'node:fs/promises';
import path from 'node:path';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
import { startFixtureWatcher } from '../userModules/fixtureWatcher.js';
import { generateUserImports } from '../userModules/generateUserImports.js';
import { moduleExists } from '../utils/fs.js';

export const exposeImportsServerPlugin: CosmosServerPlugin = {
  name: 'exposeImports',

  async devServer({ cosmosConfig, platform }) {
    if (!shouldExposeImports(platform, cosmosConfig)) return;

    await generateImportsFile(cosmosConfig);
    const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
      generateImportsFile(cosmosConfig);
    });

    return () => {
      watcher.close();
    };
  },
};

function shouldExposeImports(
  platform: CosmosPlatform,
  cosmosConfig: CosmosConfig
) {
  return platform === 'native' || Boolean(cosmosConfig.exposeImports);
}

async function generateImportsFile(cosmosConfig: CosmosConfig) {
  const { exposeImports } = cosmosConfig;

  const filePath =
    typeof exposeImports === 'string'
      ? exposeImports
      : getDefaultFilePath(cosmosConfig.rootDir);

  const typeScript = /\.tsx?$/.test(filePath);

  const rendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
  };
  const fileSource = generateUserImports({
    cosmosConfig,
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
  return path.resolve(rootDir, `cosmos.imports.${ext}`);
}
