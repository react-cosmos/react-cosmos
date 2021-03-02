import { FSWatcher, watch } from 'chokidar';
import { writeFile } from 'fs';
import { debounce } from 'lodash';
import path from 'path';
import promisify from 'util.promisify';
import { CosmosConfig } from '../config';
import { getCliArgs } from '../shared/cli';
import { DevServerPluginArgs } from '../shared/devServer';
import { NativeRendererConfig } from '../shared/rendererConfig';
import {
  generateUserDepsModule,
  getDecoratorPatterns,
  getFixturePatterns,
  getIgnorePatterns,
} from '../shared/userDeps';

const writeFileAsync = promisify(writeFile);

export async function userDepsFile({ cosmosConfig }: DevServerPluginArgs) {
  if (!shouldGenerateUserDepsFile(cosmosConfig)) return;

  await generateUserDepsFile(cosmosConfig);
  const watcher = await startFixtureFileWatcher(cosmosConfig);
  return () => {
    watcher.close();
  };
}

function shouldGenerateUserDepsFile(cosmosConfig: CosmosConfig): boolean {
  return (
    cosmosConfig.experimentalRendererUrl !== null ||
    // CLI support for --external-userdeps flag
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
