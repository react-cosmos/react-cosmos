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
  // filtered here instead. Ignored dirs are skipped (chokidar checks a dir
  // before its contents, so it never descends into them), and only user
  // module files are watched.
  function ignored(filePath: string, stats?: { isFile(): boolean }) {
    return stats?.isFile()
      ? !isUserModulePath(config, filePath)
      : isIgnoredPath(config, filePath);
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
