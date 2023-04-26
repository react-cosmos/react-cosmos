import fs from 'fs/promises';
import path from 'path';
import { RendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosServerPlugin, PlatformType } from '../cosmosPlugin/types.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
import { startFixtureWatcher } from '../userDeps/fixtureWatcher.js';
import { generateUserDepsModule } from '../userDeps/generateUserDepsModule.js';
import { getCliArgs } from '../utils/cli.js';

export const userDepsFileServerPlugin: CosmosServerPlugin = {
  name: 'userDepsFile',

  async devServer(args) {
    if (!shouldGenerateUserDepsFile(args.platformType)) return;

    const { cosmosConfig } = args;
    await generateUserDepsFile(cosmosConfig);
    const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
      generateUserDepsFile(cosmosConfig);
    });

    return () => {
      watcher.close();
    };
  },
};

function shouldGenerateUserDepsFile(platformType: PlatformType): boolean {
  return (
    platformType === 'native' ||
    // CLI support for --external-userdeps flag (useful with react-native-web)
    Boolean(getCliArgs().externalUserdeps)
  );
}

async function generateUserDepsFile(cosmosConfig: CosmosConfig) {
  const { userDepsFilePath, typeScript } = cosmosConfig;

  if (typeScript) {
    console.log(
      '[Cosmos] TypeScript detected, set "typeScript": false in cosmos.config.json to disable'
    );
  }

  const rendererConfig: RendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
  };
  const userDepsModule = generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(userDepsFilePath),
    typeScript,
  });
  await fs.writeFile(userDepsFilePath, userDepsModule, 'utf8');

  const relUserDepsFilePath = path.relative(process.cwd(), userDepsFilePath);
  console.log(`[Cosmos] Generated ${relUserDepsFilePath}`);
}
