// @flow

import { join } from 'path';
import { default as _slash } from 'slash';

// Convert Windows backslash paths to slash paths.
// Context: Node uses appropriate path separators based on the platform it runs
// on. Forward slash on Unix and backward slash on Windows.
// So why normalize slashes if Node takes care of this abstraction?
// Because we use globs often. And some implementations only work with forward
// slashes: https://github.com/isaacs/node-glob#windows
// Initial encounter: https://github.com/react-cosmos/react-cosmos/issues/288
// For further study: https://github.com/micromatch/micromatch#backslashes
// Node supports either on Windows, anyway.
// https://nodejs.org/api/path.html#path_path_win32
export function slash(...paths: string[]) {
  return paths.length > 1 ? _slash(join(...paths)) : _slash(paths[0]);
}
