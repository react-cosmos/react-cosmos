import { FSWatcher, watch } from 'chokidar';
import { debounce } from 'lodash-es';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getDecoratorPatterns, getFixturePatterns } from './shared.js';

const DEBOUNCE_INTERVAL = 50;

export async function startFixtureWatcher(
  cosmosConfig: CosmosConfig,
  event: 'all' | 'add',
  callback: () => unknown
): Promise<FSWatcher> {
  const { fixturesDir, fixtureFileSuffix, ignore } = cosmosConfig;
  const FILE_PATTERNS = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns(),
  ];
  return new Promise(resolve => {
    const watcher: FSWatcher = watch(FILE_PATTERNS, {
      ignored: ignore,
      ignoreInitial: true,
      cwd: cosmosConfig.rootDir,
    })
      .on('ready', () => resolve(watcher))
      .on(
        event,
        debounce(() => callback(), DEBOUNCE_INTERVAL)
      );
  });
}
