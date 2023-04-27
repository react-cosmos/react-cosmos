import fs from 'fs/promises';
import path from 'path';
import { RendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosServerPlugin, PlatformType } from '../cosmosPlugin/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
import { startFixtureWatcher } from '../userModules/fixtureWatcher.js';
import { generateUserImports } from '../userModules/generateUserImports.js';
import { moduleExists } from '../utils/fs.js';

export const exposeModulesServerPlugin: CosmosServerPlugin = {
  name: 'exposeModules',

  async devServer(args) {
    const { cosmosConfig } = args;

    if (!shouldExposeModules(args.platformType, cosmosConfig)) {
      return;
    }

    await generateModulesFile(cosmosConfig);
    const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
      generateModulesFile(cosmosConfig);
    });

    return () => {
      watcher.close();
    };
  },
};

function shouldExposeModules(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  return platformType === 'native' || Boolean(cosmosConfig.exposeModules);
}

async function generateModulesFile(cosmosConfig: CosmosConfig) {
  const { exposeModules } = cosmosConfig;

  const modulesPath =
    typeof exposeModules === 'string'
      ? exposeModules
      : getDefaultModulesPath(cosmosConfig.rootDir);

  const typeScript = modulesPath.endsWith('.ts');

  const rendererConfig: RendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
  };
  const modulesSource = generateUserImports({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(modulesPath),
    typeScript,
  });
  await fs.writeFile(modulesPath, modulesSource, 'utf8');

  const relModulesPath = path.relative(process.cwd(), modulesPath);
  console.log(`[Cosmos] Generated ${relModulesPath}`);

  if (typeof exposeModules === 'boolean') {
    console.log(
      '[Cosmos] Use the exposeModules config option to specify a custom path (including .js/.ts extension)'
    );
  }
}

function getDefaultModulesPath(rootDir: string) {
  const ext = moduleExists('typescript') ? 'ts' : 'js';
  return path.resolve(rootDir, `cosmos.modules.${ext}`);
}
