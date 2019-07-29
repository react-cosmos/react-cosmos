import path from 'path';
import { writeFile } from 'fs';
import promisify from 'util.promisify';
import { watch, FSWatcher } from 'chokidar';
import { debounce } from 'lodash';
import { CosmosConfig } from '../config';
import { DevServerPluginArgs } from '../shared/devServer';
import {
  getFixturePatterns,
  getDecoratorPatterns,
  getIgnorePatterns,
  generateUserDepsModule
} from '../shared/userDeps';
import { NativeRendererConfig } from '../shared/rendererConfig';

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

async function generateUserDepsFile(cosmosConfig: CosmosConfig) {
  const { userDepsFilePath, port } = cosmosConfig;

  const rendererConfig: NativeRendererConfig = { port };
  const userDepsModule = await generateUserDepsModule(
    cosmosConfig,
    rendererConfig
  );
  await writeFileAsync(userDepsFilePath, userDepsModule, 'utf8');

  const relUserDepsFilePath = path.relative(process.cwd(), userDepsFilePath);
  console.log(`[Cosmos] Generated ${relUserDepsFilePath}`);
}
