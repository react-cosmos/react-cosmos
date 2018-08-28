// @flow

import { join } from 'path';
import { default as _slash } from 'slash';

// Convert Windows backslash paths to slash paths
export function slash(...paths: string[]) {
  return paths.length > 1 ? _slash(join(...paths)) : _slash(paths[0]);
}
