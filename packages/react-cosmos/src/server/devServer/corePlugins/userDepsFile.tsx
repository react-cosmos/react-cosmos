import { FSWatcher, watch } from 'chokidar';
import fs from 'fs/promises';
import { debounce } from 'lodash-es';
import path from 'path';
import { RemoteRendererConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../../cosmosConfig/types.js';
import { DevServerPluginArgs } from '../../cosmosPlugin/types.js';
import { generateUserDepsModule } from '../../userDeps/generateUserDepsModule.js';
import {
  getDecoratorPatterns,
  getFixturePatterns,
  getIgnorePatterns,
} from '../../userDeps/shared.js';
import { getCliArgs } from '../../utils/cli.js';

export async function userDepsFileDevServerPlugin(args: DevServerPluginArgs) {
  if (!shouldGenerateUserDepsFile(args)) return;

  const { cosmosConfig } = args;
  await generateUserDepsFile(cosmosConfig);
  const watcher = await startFixtureFileWatcher(cosmosConfig);
  return () => {
    watcher.close();
  };
}

function shouldGenerateUserDepsFile({
  cosmosConfig,
  platformType,
}: DevServerPluginArgs): boolean {
  return (
    platformType === 'native' ||
    cosmosConfig.rendererUrl !== null ||
    // CLI support for --external-userdeps flag (useful with react-native-web)
    Boolean(getCliArgs().externalUserdeps)
  );
}

const DEBOUNCE_INTERVAL = 50;

async function startFixtureFileWatcher(
  cosmosConfig: CosmosConfig
): Promise<FSWatcher> {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const FILE_PATTERNS = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns(),
  ];
  return new Promise(resolve => {
    const watcher: FSWatcher = watch(FILE_PATTERNS, {
      ignored: getIgnorePatterns(),
      ignoreInitial: true,
      cwd: cosmosConfig.rootDir,
    })
      .on('ready', () => resolve(watcher))
      .on(
        'all',
        debounce(() => generateUserDepsFile(cosmosConfig), DEBOUNCE_INTERVAL)
      );
  });
}

async function generateUserDepsFile(cosmosConfig: CosmosConfig) {
  const { userDepsFilePath, port } = cosmosConfig;

  const rendererConfig: RemoteRendererConfig = { port };
  const userDepsModule = generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(userDepsFilePath),
  });
  await fs.writeFile(userDepsFilePath, userDepsModule, 'utf8');

  const relUserDepsFilePath = path.relative(process.cwd(), userDepsFilePath);
  console.log(`[Cosmos] Generated ${relUserDepsFilePath}`);
}
