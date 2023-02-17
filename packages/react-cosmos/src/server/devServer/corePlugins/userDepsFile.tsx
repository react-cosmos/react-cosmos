import fs from 'fs/promises';
import path from 'path';
import { RemoteRendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../../cosmosConfig/types.js';
import { DevServerPluginArgs, PlatformType } from '../../cosmosPlugin/types.js';
import { startFixtureWatcher } from '../../shared/fixtureWatcher.js';
import { getPlaygroundUrl } from '../../shared/playgroundUrl.js';
import { generateUserDepsModule } from '../../userDeps/generateUserDepsModule.js';
import { getCliArgs } from '../../utils/cli.js';

export async function userDepsFileDevServerPlugin(args: DevServerPluginArgs) {
  if (!shouldGenerateUserDepsFile(args.platformType)) return;

  const { cosmosConfig } = args;
  await generateUserDepsFile(cosmosConfig);
  const watcher = await startFixtureWatcher(cosmosConfig, 'all', () => {
    generateUserDepsFile(cosmosConfig);
  });

  return () => {
    watcher.close();
  };
}

function shouldGenerateUserDepsFile(platformType: PlatformType): boolean {
  return (
    platformType === 'native' ||
    cosmosConfig.rendererUrl !== null ||
    // CLI support for --external-userdeps flag (useful with react-native-web)
    Boolean(getCliArgs().externalUserdeps)
  );
}

async function generateUserDepsFile(cosmosConfig: CosmosConfig) {
  const { userDepsFilePath } = cosmosConfig;

  const rendererConfig: RemoteRendererConfig = {
    playgroundUrl: getPlaygroundUrl(cosmosConfig),
  };
  const userDepsModule = generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(userDepsFilePath),
  });
  await fs.writeFile(userDepsFilePath, userDepsModule, 'utf8');

  const relUserDepsFilePath = path.relative(process.cwd(), userDepsFilePath);
  console.log(`[Cosmos] Generated ${relUserDepsFilePath}`);
}
