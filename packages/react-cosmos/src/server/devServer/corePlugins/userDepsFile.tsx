import { FSWatcher, watch } from 'chokidar';
import { writeFile } from 'fs';
import { debounce } from 'lodash';
import path from 'path';
import { NativeRendererConfig } from 'react-cosmos-core/renderer';
import promisify from 'util.promisify';
import { CosmosConfig } from '../../cosmosConfig/types';
import { DevServerPluginArgs } from '../../cosmosPlugin/types';
import { generateUserDepsModule } from '../../userDeps/generateUserDepsModule';
import {
  getDecoratorPatterns,
  getFixturePatterns,
  getIgnorePatterns,
} from '../../userDeps/shared';
import { getCliArgs } from '../../utils/cli';

const writeFileAsync = promisify(writeFile);

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
    cosmosConfig.experimentalRendererUrl !== null ||
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

  const rendererConfig: NativeRendererConfig = { port };
  const userDepsModule = generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: path.dirname(userDepsFilePath),
  });
  await writeFileAsync(userDepsFilePath, userDepsModule, 'utf8');

  const relUserDepsFilePath = path.relative(process.cwd(), userDepsFilePath);
  console.log(`[Cosmos] Generated ${relUserDepsFilePath}`);
}
