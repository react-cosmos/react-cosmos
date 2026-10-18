import path from 'node:path';
import type { FSWatcher } from 'chokidar';
import { watch } from 'chokidar';
import micromatch from 'micromatch';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import { slash } from '../utils/slash.js';
import { getDecoratorPatterns, getFixturePatterns } from './shared.js';

const DEBOUNCE_INTERVAL = 50;

export async function startFixtureWatcher(
  config: CosmosConfig,
  event: 'all' | 'add',
  callback: () => unknown
): Promise<FSWatcher> {
  const { rootDir, fixturesDir, fixtureFileSuffix, ignore } = config;
  const FILE_PATTERNS = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns(),
  ];

  // Chokidar 4 removed glob support, so the root dir is watched and paths are
  // filtered here instead. This mirrors findUserModulePaths: dot entries and
  // ignored paths are skipped (without descending into them), and only files
  // matching the fixture and decorator patterns are watched.
  function ignored(filePath: string, stats?: { isFile(): boolean }) {
    const relPath = slash(
      path.relative(rootDir, path.resolve(rootDir, filePath))
    );
    if (relPath === '') return false;
    if (relPath.split('/').some(segment => segment.startsWith('.')))
      return true;
    if (micromatch.isMatch(relPath, ignore, { dot: true })) return true;
    return (
      stats?.isFile() === true &&
      !micromatch.isMatch(relPath, FILE_PATTERNS, { dot: true })
    );
  }

  return new Promise(resolve => {
    const watcher: FSWatcher = watch('.', {
      ignored,
      ignoreInitial: true,
      cwd: rootDir,
    })
      .on('ready', () => resolve(watcher))
      .on(
        event,
        debounce(() => callback(), DEBOUNCE_INTERVAL)
      );
  });
}

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
