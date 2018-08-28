// @flow

import { join, isAbsolute } from 'path';
import slash from 'slash';
import { silent as resolveSilent } from 'resolve-from';

export function resolveUserPath(rootPath: string, userPath: string) {
  // Convert Windows backslash paths to slash paths
  return slash(
    // An absolute path is already resolved
    isAbsolute(userPath)
      ? userPath
      : resolveSilent(rootPath, userPath) ||
        // Final attempt to resolve path, for when relative paths that don't
        // start with ./ and for output file paths
        join(rootPath, userPath)
  );
}
