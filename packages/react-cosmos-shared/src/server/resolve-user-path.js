import path from 'path';
import slash from 'slash';
import resolveFrom from 'resolve-from';

export function resolveUserPath(rootPath, userPath) {
  // Convert Windows backslash paths to slash paths
  return slash(
    // An absolute path is already resolved
    path.isAbsolute(userPath)
      ? userPath
      : resolveFrom.silent(rootPath, userPath) ||
        // Final attempt to resolve path, for when relative paths that don't
        // start with ./ and for output file paths
        path.join(rootPath, userPath)
  );
}
