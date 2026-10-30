import type { FSWatcher } from 'chokidar';
import { watch } from 'chokidar';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import { isIgnoredPath, isUserModulePath } from './userModulePath.js';

const DEBOUNCE_INTERVAL = 50;

export async function startFixtureWatcher(
  config: CosmosConfig,
  callback: () => unknown
): Promise<FSWatcher> {
  // Chokidar 4 removed glob support, so the root dir is watched and paths are
  // filtered here instead. Files are watched only if they're user modules.
  // Dirs can't be user modules, so they're only skipped if they're ignored, in
  // which case chokidar doesn't descend into them. Chokidar also calls this
  // before it has stats, when it can't tell files and dirs apart yet.
  function ignored(absPath: string, stats?: { isFile(): boolean }) {
    return stats?.isFile()
      ? !isUserModulePath(config, absPath)
      : isIgnoredPath(config, absPath);
  }

  // Dirs pass the filter to stay watchable, so only file events call back: a
  // dir event alone would trigger a needless rescan. Removing a dir also emits
  // `unlink` for each tracked file in it.
  const onChange = debounce(() => callback(), DEBOUNCE_INTERVAL);

  return new Promise(resolve => {
    const watcher: FSWatcher = watch('.', {
      ignored,
      ignoreInitial: true,
      cwd: config.rootDir,
    })
      .on('ready', () => resolve(watcher))
      .on('add', onChange)
      .on('change', onChange)
      .on('unlink', onChange);
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
