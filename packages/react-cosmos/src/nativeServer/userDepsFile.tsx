import path from 'path';
import { writeFile } from 'fs';
import promisify from 'util.promisify';
import { watch, FSWatcher } from 'chokidar';
import { debounce } from 'lodash';
import { CosmosConfig, DevServerPluginArgs } from '../shared';
import {
  getFixturePatterns,
  getDecoratorPatterns,
  getIgnorePatterns,
  generateUserDepsModule
} from '../shared/userDeps';

const writeFileAsync = promisify(writeFile);

export async function userDepsFile({ cosmosConfig }: DevServerPluginArgs) {
  await generateUserDepsFile(cosmosConfig);
  const watcher = await startFixtureFileWatcher(cosmosConfig);
  return () => {
    watcher.close();
  };
}

const DEBOUNCE_INTERVAL = 50;

async function startFixtureFileWatcher(
  cosmosConfig: CosmosConfig
): Promise<FSWatcher> {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const FILE_PATTERNS = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns()
  ];
  return new Promise(resolve => {
    const watcher: FSWatcher = watch(FILE_PATTERNS, {
      ignored: getIgnorePatterns(),
      ignoreInitial: true,
      cwd: cosmosConfig.rootDir
    })
      .on('ready', () => resolve(watcher))
      .on(
        'all',
        debounce(() => generateUserDepsFile(cosmosConfig), DEBOUNCE_INTERVAL)
      );
  });
}

type NativeRendererConfig = {
  port: number;
};

async function generateUserDepsFile(cosmosConfig: CosmosConfig) {
  const { userDepsPath, port } = cosmosConfig;

  const rendererConfig: NativeRendererConfig = { port };
  const userDepsModule = await generateUserDepsModule(
    cosmosConfig,
    rendererConfig
  );
  await writeFileAsync(userDepsPath, userDepsModule, 'utf8');

  const relUserDepsPath = path.relative(process.cwd(), userDepsPath);
  console.log(`[Cosmos] Generated ${relUserDepsPath}`);
}
